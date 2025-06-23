# Guía de Testing - Yacon Restaurant

Esta guía te ayuda a probar todas las funcionalidades de la aplicación antes del despliegue.

## 🧪 Lista de Verificación de Funcionalidades

### ✅ Funcionalidades Públicas

#### Navegación General
- [ ] Página de inicio carga correctamente
- [ ] Navegación entre páginas funciona
- [ ] Footer se muestra correctamente
- [ ] Responsive design funciona en móvil
- [ ] Logo e imágenes cargan correctamente

#### Página Principal (/)
- [ ] Muestra categorías y productos
- [ ] CSS y estilos se aplican correctamente
- [ ] JavaScript interactivo funciona

#### Página Nosotros (/nosotros)
- [ ] Información del restaurante se muestra
- [ ] Enlaces de contacto funcionan

#### Página Carta (/carta)
- [ ] Productos se muestran por categorías
- [ ] Precios se muestran correctamente
- [ ] Link al PDF del menú funciona

#### Página Promociones (/promociones)
- [ ] Promociones se cargan correctamente
- [ ] Categoría "Promociones" existe en BD

### ✅ Sistema de Autenticación

#### Registro de Usuario (/register)
- [ ] Formulario de registro funciona
- [ ] Validación de campos requeridos
- [ ] Usuario se crea en base de datos
- [ ] Redirección después del registro

#### Login (/login)
- [ ] Formulario de login funciona
- [ ] Validación de credenciales
- [ ] Sesión se mantiene después del login
- [ ] Redirección correcta después del login

#### Logout (/logout)
- [ ] Logout funciona correctamente
- [ ] Sesión se cierra completamente
- [ ] Redirección a página de inicio

### ✅ Funcionalidades de Usuario Autenticado

#### Sistema de Reservas (/reserve)
- [ ] Solo usuarios autenticados pueden acceder
- [ ] Formulario de reserva funciona
- [ ] Validación de fecha (2 meses máximo)
- [ ] Validación de horario (1-5pm, 6-9:30pm)
- [ ] No permite reservas duplicadas
- [ ] Genera código QR correctamente

#### Confirmación de Reserva (/confirm-reservation)
- [ ] Muestra detalles de la reserva
- [ ] Código QR se muestra correctamente
- [ ] Solo el usuario de la reserva puede verla

#### Lista de Reservas (/reservations)
- [ ] Muestra todas las reservas (admin)
- [ ] Fechas se muestran correctamente
- [ ] Estado de reservas actualizadas

### ✅ Funcionalidades de Administrador

#### Acceso de Administrador
- [ ] Solo usuarios admin pueden acceder
- [ ] Menús de administración aparecen en navbar
- [ ] Redirección si no es admin

#### Gestión de Categorías (/categories)
- [ ] Crear nueva categoría funciona
- [ ] Editar categoría existente
- [ ] Eliminar categoría funciona
- [ ] Lista todas las categorías

#### Gestión de Productos (/products)
- [ ] Crear nuevo producto funciona
- [ ] Asignar producto a categoría
- [ ] Editar producto existente
- [ ] Eliminar producto funciona
- [ ] Lista todos los productos

### ✅ Funcionalidades de JavaScript

#### Validación de Formularios
- [ ] Campos requeridos se validan
- [ ] Mensajes de error se muestran
- [ ] Estilos de error se aplican

#### Sistema de Notificaciones
- [ ] Notificaciones aparecen y desaparecen
- [ ] Diferentes tipos (success, error, warning)
- [ ] Posicionamiento correcto

#### Interactividad
- [ ] Smooth scrolling funciona
- [ ] Tooltips se muestran
- [ ] Navegación móvil funciona

## 🔧 Testing Manual

### 1. Preparar Ambiente de Testing

```bash
# Ejecutar aplicación
cd yaconweb_flask
python app.py
```

### 2. Testing de Base de Datos

```bash
# Verificar que la BD se creó
ls -la instance/
file instance/site.db

# Verificar datos de ejemplo
python -c "
from app import app, db, User, Category, Product
with app.app_context():
    print(f'Usuarios: {User.query.count()}')
    print(f'Categorías: {Category.query.count()}')
    print(f'Productos: {Product.query.count()}')
"
```

### 3. Testing de Endpoints

```bash
# Probar página principal
curl -I http://127.0.0.1:5000/

# Probar carta
curl -I http://127.0.0.1:5000/carta

# Probar página que requiere login
curl -I http://127.0.0.1:5000/reserve
```

### 4. Testing de Admin

1. **Crear usuario admin**:
   - Ve a `/create-admin` 
   - Usuario: `admin`
   - Contraseña: `admin123`

2. **Probar funcionalidades admin**:
   - Crear categoría de prueba
   - Crear producto de prueba
   - Editar producto existente
   - Eliminar producto de prueba

### 5. Testing de Reservas

1. **Crear usuario normal**:
   - Registrarse con nuevo usuario
   - Iniciar sesión

2. **Hacer reserva**:
   - Fecha: Mañana
   - Hora: 19:00 (válida)
   - Verificar que genera QR

3. **Probar validaciones**:
   - Fecha pasada (debe fallar)
   - Hora inválida: 16:00 (debe fallar)
   - Reserva duplicada (debe fallar)

## 🐛 Casos de Error Comunes

### Error: "No se encontró la categoría Promociones"
**Solución**: Ejecutar `python setup_data.py`

### Error: "Database is locked"
**Solución**: 
```bash
pkill -f "python app.py"
rm instance/site.db
python setup_data.py
```

### Error: JavaScript no funciona
**Verificación**:
- Revisar consola del navegador (F12)
- Verificar que `main.js` se carga
- Comprobar errores de sintaxis

### Error: CSS no se aplica
**Verificación**:
- Verificar que `styles.css` existe
- Comprobar rutas en `base.html`
- Verificar sintaxis CSS

## 📋 Checklist de Despliegue

Antes de desplegar a producción, verifica:

### Configuración
- [ ] Variables de entorno configuradas
- [ ] SECRET_KEY es única y segura
- [ ] DEBUG=False en producción
- [ ] Base de datos configurada

### Seguridad
- [ ] Contraseñas de admin cambiadas
- [ ] No hay datos de prueba sensibles
- [ ] Logs no muestran información sensible

### Funcionalidad
- [ ] Todas las páginas cargan
- [ ] Formularios funcionan
- [ ] Autenticación funciona
- [ ] Admin panel accesible

### Rendimiento
- [ ] Imágenes optimizadas
- [ ] CSS/JS se cargan correctamente
- [ ] Tiempos de respuesta aceptables

## 🚀 Testing de Producción

Una vez desplegado en Vercel:

### 1. Smoke Test
```bash
# Verificar que el sitio está online
curl -I https://tu-app.vercel.app/

# Verificar páginas principales
curl -I https://tu-app.vercel.app/carta
curl -I https://tu-app.vercel.app/nosotros
```

### 2. Funcionalidad Completa
- [ ] Registrar nuevo usuario
- [ ] Hacer reserva de prueba
- [ ] Login como admin
- [ ] Crear producto de prueba
- [ ] Verificar logs en Vercel

### 3. Testing de Carga
- Usar herramientas como [GTmetrix](https://gtmetrix.com)
- Verificar tiempo de carga < 3 segundos
- Comprobar optimización móvil

## 📊 Métricas de Éxito

El testing es exitoso cuando:

- ✅ Todas las funcionalidades básicas trabajan
- ✅ No hay errores 500 en logs
- ✅ Tiempo de carga < 3 segundos
- ✅ Responsive design funciona
- ✅ Seguridad básica implementada

¡Una vez que passes todos estos tests, tu aplicación está lista para producción! 🎉