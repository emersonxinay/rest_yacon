# Yacon Restaurant - Web Application

Una aplicación web para el restaurante Yacon desarrollada con Flask, que incluye gestión de menú, reservas y pedidos.

## Características

- **Gestión de Menú**: Administración de categorías y productos
- **Sistema de Reservas**: Reservas con validación de fecha/hora y códigos QR
- **Autenticación**: Sistema de login con roles (admin/usuario)
- **Pedidos**: Sistema básico de pedidos
- **Responsive**: Diseño adaptable con Tailwind CSS
- **Interactivo**: JavaScript para funcionalidades dinámicas

## Requisitos

- Python 3.8+
- Flask y dependencias (ver requirements.txt)

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd yaconweb_flask
```

2. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus valores de configuración
```

5. Configurar datos iniciales:
```bash
python setup_data.py
```

6. Ejecutar la aplicación:
```bash
python app.py
# o
python run.py
```

## Configuración

### Variables de Entorno

- `SECRET_KEY`: Clave secreta para Flask (requerida)
- `DATABASE_URL`: URL de la base de datos (opcional, por defecto SQLite)
- `SECURITY_PASSWORD_SALT`: Salt para passwords (opcional)
- `DEBUG`: Modo debug (opcional, por defecto False)

### Primera Ejecución

1. La aplicación creará automáticamente las tablas de la base de datos
2. Visita `/create-admin` para crear el primer usuario administrador
3. Accede al panel de administración para gestionar categorías y productos

## Estructura del Proyecto

```
yaconweb_flask/
├── app.py              # Aplicación principal Flask
├── config.py           # Configuración
├── run.py              # Script de ejecución
├── requirements.txt    # Dependencias Python
├── vercel.json         # Configuración de despliegue
├── .env.example        # Ejemplo de variables de entorno
├── static/
│   ├── css/           # Estilos CSS
│   ├── js/            # JavaScript
│   └── img/           # Imágenes
├── templates/         # Templates HTML
│   ├── base.html      # Template base
│   ├── shared/        # Componentes compartidos
│   ├── menu/          # Templates del menú
│   └── admin/         # Templates de administración
└── instance/
    └── site.db        # Base de datos SQLite
```

## Funcionalidades

### Públicas
- Visualización de menú y carta
- Información del restaurante
- Registro de usuarios

### Autenticadas
- Realizar reservas
- Ver historial de reservas
- Realizar pedidos

### Administrador
- Gestión de categorías
- Gestión de productos
- Ver todas las reservas

## Despliegue

### Vercel
El proyecto está configurado para desplegarse en Vercel:

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en el dashboard de Vercel
3. Desplegar automáticamente

### Variables de Entorno en Producción
- `SECRET_KEY`: Clave secreta segura
- `DATABASE_URL`: URL de base de datos de producción
- `SECURITY_PASSWORD_SALT`: Salt único

## Desarrollo

### Ejecutar en modo desarrollo:
```bash
export FLASK_ENV=development
export DEBUG=True
python app.py
```

### Estructura de la Base de Datos

- **User**: Usuarios del sistema
- **Category**: Categorías de productos
- **Product**: Productos del menú
- **Reservation**: Reservas de mesas

## Licencia

[Especificar licencia]

## Contacto

- WhatsApp: +56975452897
- Facebook: [YaconSushi](https://www.facebook.com/profile.php?id=61559189617150)
- Instagram: [@yaconsushi](https://www.instagram.com/yaconsushi/) 
