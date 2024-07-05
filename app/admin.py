from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from functools import wraps
from . import db
from .models import Category, Product

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_admin:
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function


@admin_bp.route('/dashboard')
@login_required
@admin_required
def dashboard():
    categories = Category.query.all()
    products = Product.query.all()
    return render_template('admin/dashboard.html', categories=categories, products=products)

# CRUD para Categorías


@admin_bp.route('/category/create', methods=['GET', 'POST'])
@login_required
@admin_required
def create_category():
    if request.method == 'POST':
        name = request.form['name']
        category = Category(name=name)
        db.session.add(category)
        db.session.commit()
        flash('Categoría creada!')
        return redirect(url_for('admin.dashboard'))
    return render_template('admin/create_category.html')


@admin_bp.route('/category/update/<int:category_id>', methods=['GET', 'POST'])
@login_required
@admin_required
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    if request.method == 'POST':
        category.name = request.form['name']
        db.session.commit()
        flash('Categoría actualizada!')
        return redirect(url_for('admin.dashboard'))
    return render_template('admin/update_category.html', category=category)


@admin_bp.route('/category/delete/<int:category_id>', methods=['POST'])
@login_required
@admin_required
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    flash('Categoría eliminada!')
    return redirect(url_for('admin.dashboard'))

# CRUD para Productos


@admin_bp.route('/product/create', methods=['GET', 'POST'])
@login_required
@admin_required
def create_product():
    categories = Category.query.all()
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        price = request.form['price']
        category_id = request.form['category_id']
        product = Product(name=name, description=description,
                          price=price, category_id=category_id)
        db.session.add(product)
        db.session.commit()
        flash('Producto creado!')
        return redirect(url_for('admin.dashboard'))
    return render_template('admin/create_product.html', categories=categories)


@admin_bp.route('/product/update/<int:product_id>', methods=['GET', 'POST'])
@login_required
@admin_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    categories = Category.query.all()
    if request.method == 'POST':
        product.name = request.form['name']
        product.description = request.form['description']
        product.price = request.form['price']
        product.category_id = request.form['category_id']
        db.session.commit()
        flash('Producto actualizado!')
        return redirect(url_for('admin.dashboard'))
    return render_template('admin/update_product.html', product=product, categories=categories)


@admin_bp.route('/product/delete/<int:product_id>', methods=['POST'])
@login_required
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    flash('Producto eliminado!')
    return redirect(url_for('admin.dashboard'))
