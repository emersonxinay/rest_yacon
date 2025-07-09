import datetime
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import qrcode
from io import BytesIO
import base64

# Configuración de la aplicación Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de SQLAlchemy y LoginManager
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Definición de modelos


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    products = db.relationship('Product', backref='category', lazy=True)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(
        'category.id'), nullable=False)


class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    people = db.Column(db.Integer, nullable=False)
    details = db.Column(db.String(255), nullable=True)
    qr_code = db.Column(db.Text, nullable=True)

    def is_valid_date(self):
        current_date = datetime.date.today()
        max_date = current_date + datetime.timedelta(days=60)  # 2 meses
        return current_date <= self.date <= max_date

    def is_valid_time(self):
        valid_times = [
            (datetime.time(13, 0), datetime.time(17, 0)),  # 1pm a 5pm
            (datetime.time(18, 0), datetime.time(21, 30))  # 6pm a 9:30pm
        ]
        for start, end in valid_times:
            if start <= self.time <= end:
                return True
        return False

    def is_available(self):
        existing_reservation = Reservation.query.filter_by(
            date=self.date, time=self.time).first()
        return not existing_reservation

    def generate_qr_code(self):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(
            f'Reservación para {self.name} en {self.date} a las {self.time}')
        qr.make(fit=True)

        img = qr.make_image(fill='black', back_color='white')
        buf = BytesIO()
        img.save(buf)
        qr_code_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        self.qr_code = f'data:image/png;base64,{qr_code_base64}'


# Decorador user_loader para cargar usuarios
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Definición de rutas y vistas
@app.route('/')
def home():
    categories = Category.query.all()
    products_by_category = {
        category.name: category.products for category in categories}
    print("Products by Category:", products_by_category)  # Debugging line
    return render_template('home.html', products_by_category=products_by_category)

# ruta nosotros, carta, promociones


@app.route('/nosotros')
def nosotros():
    return render_template('menu/nosotros.html')


@app.route('/carta')
def carta():
    categories = Category.query.all()
    products_by_category = {
        category.name: category.products for category in categories}
    print("Products by Category:", products_by_category)  # Debugging line
    return render_template('menu/carta.html', products_by_category=products_by_category)


# Ruta para promociones
@app.route('/promociones')
def promociones():
    # Obtener la categoría de promociones (suponiendo que su nombre es 'Promociones')
    categoria_promociones = Category.query.filter_by(
        name='Promociones').first()

    if not categoria_promociones:
        return "Categoría de promociones no encontrada", 404

    return render_template('menu/promociones.html', category=categoria_promociones)


@app.context_processor
def inject_now():
    return {'now': datetime.datetime.now(), 'timedelta': datetime.timedelta}


@app.route('/reserve', methods=['GET', 'POST'])
@login_required
def reserve():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        date = datetime.datetime.strptime(
            request.form['date'], '%Y-%m-%d').date()
        time = datetime.datetime.strptime(request.form['time'], '%H:%M').time()
        people = int(request.form['people'])
        details = request.form.get('details', '')

        # Validaciones
        reservation = Reservation(
            name=name, email=email, date=date, time=time, people=people, details=details)

        if not reservation.is_valid_date():
            flash('La fecha debe estar entre hoy y dentro de los próximos 2 meses.')
            return redirect(url_for('reserve'))

        if not reservation.is_valid_time():
            flash('El horario debe estar entre las 1pm a 5pm y 6pm a 9:30pm.')
            return redirect(url_for('reserve'))

        if not reservation.is_available():
            flash('Ya hay una reserva para esa fecha y hora.')
            return redirect(url_for('reserve'))

        # Generar el código QR
        reservation.generate_qr_code()

        # Crear una nueva reserva en la base de datos
        db.session.add(reservation)
        db.session.commit()

        # Mostrar la página de confirmación de reserva
        return redirect(url_for('confirm_reservation', reservation_id=reservation.id))

    return render_template('reserve.html')


@app.route('/confirm-reservation/<int:reservation_id>')
@login_required
def confirm_reservation(reservation_id):
    reservation = Reservation.query.get_or_404(reservation_id)
    return render_template('confirm_reservation.html', reservation=reservation)


@app.route('/reservations')
@login_required
def reservations():
    reservations = Reservation.query.all()
    today = datetime.date.today()
    return render_template('reservations.html', reservations=reservations, today=today)


@app.route('/order', methods=['GET', 'POST'])
@login_required
def order():
    if request.method == 'POST':
        # Procesar el pedido (simulado)
        flash('Pedido recibido!')
        return redirect(url_for('home'))
    return render_template('order.html')


@app.route('/order_summary', methods=['POST'])
def order_summary():
    # Obtener los IDs de productos seleccionados desde el formulario
    selected_product_ids = request.form.getlist('products[]')

    # Obtener las cantidades de productos seleccionados desde el formulario
    quantities = request.form.getlist('quantities[]')

    # Consultar los productos seleccionados desde la base de datos
    selected_products = {}
    total_price = 0

    # Iterar sobre los IDs y cantidades y consultar cada producto
    for idx, product_id in enumerate(selected_product_ids):
        quantity = int(quantities[idx])  # Convertir la cantidad a entero

        product = Product.query.get(product_id)
        if product:
            # Agregar el producto con la cantidad
            selected_products[product] = quantity

    # Calcular el precio total del pedido y generar el texto del resumen
    summary_text = "Resumen del Pedido:\n"
    for product, quantity in selected_products.items():
        total_price += product.price * quantity
        summary_text += f"{product.name} x {quantity} - ${product.price * quantity}\n"
    summary_text += f"\nTotal: ${total_price}"

    return render_template('order_summary.html', selected_products=selected_products, total_price=total_price, summary_text=summary_text)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            flash('Sesión iniciada correctamente!')
            return redirect(url_for('home'))
        else:
            flash('Nombre de usuario o contraseña incorrectos.')
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        flash('Registro exitoso! Ahora puedes iniciar sesión.')
        return redirect(url_for('login'))
    return render_template('register.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Sesión cerrada correctamente.')
    return redirect(url_for('home'))


@app.route('/categories', methods=['GET', 'POST'])
@login_required
def manage_categories():
    if not current_user.is_admin:
        flash('No tienes permiso para acceder a esta página.')
        return redirect(url_for('home'))

    if request.method == 'POST':
        category_name = request.form['name']
        category = Category(name=category_name)
        db.session.add(category)
        db.session.commit()
        flash('Categoría agregada!')
        # Redirige después de la acción POST
        return redirect(url_for('manage_categories'))

    if request.method == 'GET':
        categories = Category.query.all()
        return render_template('categories.html', categories=categories)

    # En caso de que no haya ninguna acción definida
    return render_template('categories.html')


@app.route('/categories/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_category(id):
    if not current_user.is_admin:
        flash('No tienes permiso para acceder a esta página.')
        return redirect(url_for('home'))

    category = Category.query.get_or_404(id)

    if request.method == 'POST':
        category.name = request.form['name']
        db.session.commit()
        flash('Categoría actualizada!')
        return redirect(url_for('manage_categories'))

    return render_template('edit_category.html', category=category)


@app.route('/categories/delete/<int:id>', methods=['POST'])
@login_required
def delete_category(id):
    if not current_user.is_admin:
        flash('No tienes permiso para acceder a esta página.')
        return redirect(url_for('home'))

    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    flash('Categoría eliminada!')
    return redirect(url_for('manage_categories'))


@app.route('/products', methods=['GET', 'POST'])
@login_required
def manage_products():
    if not current_user.is_admin:
        flash('No tienes permiso para acceder a esta página.')
        return redirect(url_for('home'))

    if request.method == 'POST':
        product_name = request.form['name']
        product_description = request.form['description']
        product_price = request.form['price']
        product_category_id = request.form['category_id']
        product = Product(name=product_name, description=product_description,
                          price=product_price, category_id=product_category_id)
        db.session.add(product)
        db.session.commit()
        flash('Producto agregado!')
    categories = Category.query.all()
    products = Product.query.all()
    return render_template('products.html', categories=categories, products=products)


@app.route('/products/delete/<int:id>', methods=['POST'])
@login_required
def delete_product(id):
    if not current_user.is_admin:
        flash('No tienes permiso para acceder a esta página.')
        return redirect(url_for('home'))

    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    flash('Producto eliminado!')
    return redirect(url_for('manage_products'))

# Ruta para editar un producto


@app.route('/products/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_product(id):
    if not current_user.is_admin:
        flash('No tienes permiso para acceder a esta página.')
        return redirect(url_for('home'))

    product = Product.query.get_or_404(id)
    categories = Category.query.all()

    if request.method == 'POST':
        product.name = request.form['name']
        product.description = request.form['description']
        product.price = request.form['price']
        product.category_id = request.form['category_id']

        try:
            db.session.commit()
            flash('Producto actualizado correctamente!')
            return redirect(url_for('manage_products'))
        except Exception as e:
            db.session.rollback()
            flash('Error al actualizar el producto. Inténtalo de nuevo.', 'error')

    return render_template('edit_product.html', product=product, categories=categories)


@app.route('/create-admin', methods=['GET', 'POST'])
def create_admin():
    if User.query.filter_by(is_admin=True).first():
        flash('Ya existe un administrador.')
        return redirect(url_for('login'))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        admin = User(username=username, is_admin=True)
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        flash('Administrador creado exitosamente! Ahora puedes iniciar sesión.')
        return redirect(url_for('login'))
    return render_template('create_admin.html')

# Nuevas rutas para admin
@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin:
        flash('No tienes permiso para acceder a esta página.')
        return redirect(url_for('home'))
    
    categories = Category.query.all()
    products = Product.query.all()
    reservations = Reservation.query.all()
    users = User.query.all()
    
    return render_template('admin/dashboard.html', 
                         categories=categories, 
                         products=products, 
                         reservations=reservations,
                         users=users)

@app.route('/admin/create-product', methods=['GET', 'POST'])
@login_required
def admin_create_product():
    if not current_user.is_admin:
        flash('No tienes permiso para acceder a esta página.')
        return redirect(url_for('home'))
    
    categories = Category.query.all()
    return render_template('admin/create_product.html', categories=categories)

@app.route('/admin/create-category', methods=['GET', 'POST'])
@login_required
def admin_create_category():
    if not current_user.is_admin:
        flash('No tienes permiso para acceder a esta página.')
        return redirect(url_for('home'))
    
    return render_template('admin/create_category.html')

# error de pagina
# Definir el manejador de errores 404


@app.errorhandler(404)
def page_not_found(e):
    return render_template('notpage/404.html'), 404


# Crear tablas si no existen
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
