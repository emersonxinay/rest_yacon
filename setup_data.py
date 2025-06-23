#!/usr/bin/env python3
"""
Script para configurar datos iniciales del restaurante Yacon
Crea usuario administrador y datos de ejemplo
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User, Category, Product
from werkzeug.security import generate_password_hash

def create_admin_user():
    """Crear usuario administrador inicial"""
    with app.app_context():
        # Verificar si ya existe un admin
        existing_admin = User.query.filter_by(is_admin=True).first()
        if existing_admin:
            print(f"✅ Ya existe un usuario administrador: {existing_admin.username}")
            return existing_admin
        
        # Crear usuario administrador
        admin = User(
            username='admin',
            is_admin=True
        )
        admin.set_password('admin123')  # Cambiar en producción
        
        db.session.add(admin)
        db.session.commit()
        
        print("✅ Usuario administrador creado:")
        print("   - Usuario: admin")
        print("   - Contraseña: admin123")
        print("   - ⚠️  CAMBIAR LA CONTRASEÑA EN PRODUCCIÓN")
        
        return admin

def create_sample_categories():
    """Crear categorías de ejemplo"""
    with app.app_context():
        categories_data = [
            'Sushi Rolls',
            'Sashimi',
            'Tempuras',
            'Entradas',
            'Bebidas',
            'Postres',
            'Promociones'
        ]
        
        created_categories = []
        
        for cat_name in categories_data:
            existing_cat = Category.query.filter_by(name=cat_name).first()
            if not existing_cat:
                category = Category(name=cat_name)
                db.session.add(category)
                created_categories.append(cat_name)
        
        db.session.commit()
        
        if created_categories:
            print(f"✅ Categorías creadas: {', '.join(created_categories)}")
        else:
            print("✅ Todas las categorías ya existen")
        
        return Category.query.all()

def create_sample_products():
    """Crear productos de ejemplo"""
    with app.app_context():
        # Obtener categorías
        sushi_cat = Category.query.filter_by(name='Sushi Rolls').first()
        sashimi_cat = Category.query.filter_by(name='Sashimi').first()
        tempura_cat = Category.query.filter_by(name='Tempuras').first()
        entradas_cat = Category.query.filter_by(name='Entradas').first()
        bebidas_cat = Category.query.filter_by(name='Bebidas').first()
        promociones_cat = Category.query.filter_by(name='Promociones').first()
        
        products_data = [
            # Sushi Rolls
            {'name': 'California Roll', 'description': 'Cangrejo, palta, pepino, masago', 'price': 8500, 'category': sushi_cat},
            {'name': 'Philadelphia Roll', 'description': 'Salmón, queso Philadelphia, palta', 'price': 9200, 'category': sushi_cat},
            {'name': 'Spicy Tuna Roll', 'description': 'Atún picante, palta, sriracha', 'price': 9800, 'category': sushi_cat},
            {'name': 'Dragon Roll', 'description': 'Tempura de camarón, palta, anguila', 'price': 12500, 'category': sushi_cat},
            
            # Sashimi
            {'name': 'Sashimi de Salmón', 'description': 'Cortes frescos de salmón (6 piezas)', 'price': 8900, 'category': sashimi_cat},
            {'name': 'Sashimi de Atún', 'description': 'Cortes frescos de atún (6 piezas)', 'price': 9500, 'category': sashimi_cat},
            {'name': 'Sashimi Mixto', 'description': 'Variedad de pescados frescos (12 piezas)', 'price': 15800, 'category': sashimi_cat},
            
            # Tempuras
            {'name': 'Tempura de Camarón', 'description': 'Camarones empanizados y fritos (6 piezas)', 'price': 7800, 'category': tempura_cat},
            {'name': 'Tempura de Vegetales', 'description': 'Verduras mixtas empanizadas', 'price': 6500, 'category': tempura_cat},
            {'name': 'Tempura Mixta', 'description': 'Camarones y vegetales empanizados', 'price': 8900, 'category': tempura_cat},
            
            # Entradas
            {'name': 'Edamame', 'description': 'Porotos de soya al vapor con sal marina', 'price': 3500, 'category': entradas_cat},
            {'name': 'Gyoza', 'description': 'Empanaditas japonesas rellenas de cerdo (6 piezas)', 'price': 5800, 'category': entradas_cat},
            {'name': 'Agedashi Tofu', 'description': 'Tofu frito en caldo dashi', 'price': 4900, 'category': entradas_cat},
            
            # Bebidas
            {'name': 'Té Verde', 'description': 'Té verde tradicional japonés', 'price': 2500, 'category': bebidas_cat},
            {'name': 'Sake Caliente', 'description': 'Sake tradicional servido caliente', 'price': 4800, 'category': bebidas_cat},
            {'name': 'Ramune', 'description': 'Gaseosa japonesa sabor original', 'price': 3200, 'category': bebidas_cat},
            
            # Promociones
            {'name': 'Combo Familiar', 'description': '40 piezas mixtas + 2 bebidas + entrada', 'price': 25900, 'category': promociones_cat},
            {'name': 'Almuerzo Ejecutivo', 'description': 'Sushi roll + sopa + ensalada + té', 'price': 8900, 'category': promociones_cat},
        ]
        
        created_products = []
        
        for product_data in products_data:
            if product_data['category']:  # Solo crear si la categoría existe
                existing_product = Product.query.filter_by(
                    name=product_data['name'], 
                    category_id=product_data['category'].id
                ).first()
                
                if not existing_product:
                    product = Product(
                        name=product_data['name'],
                        description=product_data['description'],
                        price=product_data['price'],
                        category_id=product_data['category'].id
                    )
                    db.session.add(product)
                    created_products.append(product_data['name'])
        
        db.session.commit()
        
        if created_products:
            print(f"✅ Productos creados: {len(created_products)} productos")
            for product in created_products[:5]:  # Mostrar solo los primeros 5
                print(f"   - {product}")
            if len(created_products) > 5:
                print(f"   - ... y {len(created_products) - 5} más")
        else:
            print("✅ Todos los productos ya existen")

def main():
    """Función principal para configurar todos los datos"""
    print("🚀 Configurando datos iniciales para Yacon Restaurant...")
    print("=" * 50)
    
    # Crear tablas si no existen
    with app.app_context():
        db.create_all()
        print("✅ Base de datos inicializada")
    
    # Crear usuario administrador
    print("\n📝 Creando usuario administrador...")
    create_admin_user()
    
    # Crear categorías
    print("\n📂 Creando categorías...")
    create_sample_categories()
    
    # Crear productos
    print("\n🍱 Creando productos de ejemplo...")
    create_sample_products()
    
    print("\n" + "=" * 50)
    print("🎉 ¡Configuración completada exitosamente!")
    print("\n📋 Próximos pasos:")
    print("1. Ejecutar la aplicación: python app.py")
    print("2. Visitar: http://127.0.0.1:5000")
    print("3. Iniciar sesión como administrador:")
    print("   - Usuario: admin")
    print("   - Contraseña: admin123")
    print("4. ⚠️  CAMBIAR CONTRASEÑA EN PRODUCCIÓN")
    print("\n🌐 Para ver el menú público, visita: http://127.0.0.1:5000/carta")

if __name__ == '__main__':
    main()