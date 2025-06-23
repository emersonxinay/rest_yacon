# Guía de Despliegue - Yacon Restaurant

Esta guía te ayudará a desplegar la aplicación Yacon Restaurant en Vercel paso a paso.

## 📋 Requisitos Previos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [GitHub](https://github.com) (opcional pero recomendado)
- ✅ Proyecto configurado localmente

## 🚀 Despliegue en Vercel

### Método 1: Usando GitHub (Recomendado)

#### 1. Subir código a GitHub

```bash
# Inicializar repositorio Git (si no existe)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Yacon Restaurant web app"

# Agregar repositorio remoto
git remote add origin https://github.com/TU_USUARIO/yacon-restaurant.git

# Subir código
git push -u origin main
```

#### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"New Project"**
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Selecciona el repositorio `yacon-restaurant`
5. Vercel detectará automáticamente que es un proyecto Python

#### 3. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

```env
SECRET_KEY=tu-clave-secreta-super-segura-para-produccion
DATABASE_URL=sqlite:///site.db
SECURITY_PASSWORD_SALT=tu-salt-super-seguro-para-produccion
FLASK_ENV=production
DEBUG=False
```

⚠️ **IMPORTANTE**: Usa valores únicos y seguros para producción, no uses los valores de desarrollo.

#### 4. Configurar Build Settings

Vercel debería detectar automáticamente la configuración desde `vercel.json`, pero puedes verificar:

- **Framework Preset**: Other
- **Build Command**: (vacío)
- **Output Directory**: (vacío)
- **Install Command**: `pip install -r requirements.txt`

### Método 2: Usando Vercel CLI

#### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

#### 2. Desplegar desde terminal

```bash
cd /path/to/yaconweb_flask
vercel login
vercel --prod
```

#### 3. Configurar variables durante el despliegue

El CLI te preguntará por las variables de entorno durante el proceso.

## 🔒 Configuración de Base de Datos para Producción

### Opción 1: SQLite (Simple)
- Mantén `DATABASE_URL=sqlite:///site.db`
- Los datos se almacenarán en el sistema de archivos de Vercel
- ⚠️ Los datos pueden perderse en redeployments

### Opción 2: PostgreSQL (Recomendado para producción)

1. Crear base de datos en [Railway](https://railway.app) o [Supabase](https://supabase.com)
2. Obtener URL de conexión
3. Actualizar variable de entorno:
   ```env
   DATABASE_URL=postgresql://usuario:password@host:puerto/database
   ```
4. Instalar dependencia adicional:
   ```bash
   pip install psycopg2-binary
   ```

## 🛠️ Post-Despliegue

### 1. Verificar el despliegue

1. Ve a la URL proporcionada por Vercel
2. Verifica que la página carga correctamente
3. Prueba la navegación entre páginas

### 2. Configurar administrador inicial

La primera vez que visites el sitio:

1. Ve a `https://tu-app.vercel.app/create-admin`
2. Crea tu usuario administrador
3. ⚠️ **IMPORTANTE**: Cambia la contraseña inmediatamente

### 3. Configurar datos iniciales

Si quieres cargar datos de ejemplo, puedes:

1. Clonar el repositorio localmente
2. Configurar variables de entorno de producción
3. Ejecutar: `python setup_data.py`

## 🔄 Actualizaciones

### Despliegue automático (GitHub)

Una vez configurado, cada push a la rama `main` desplegará automáticamente:

```bash
git add .
git commit -m "Actualización: nueva funcionalidad"
git push origin main
```

### Despliegue manual (CLI)

```bash
vercel --prod
```

## 🧪 Dominios Personalizados

### 1. En Vercel Dashboard

1. Ve a **Settings > Domains**
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

### 2. Configuración DNS

Agrega los siguientes registros en tu proveedor de DNS:

```
Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com

Tipo: A
Nombre: @
Valor: 76.76.19.61
```

## 📊 Monitoreo y Analytics

### 1. Habilitar Analytics

En Vercel Dashboard:
1. Ve a **Analytics**
2. Habilita Vercel Analytics
3. Ve métricas de rendimiento y usuarios

### 2. Logs y Debugging

- Ve a **Functions** para ver logs en tiempo real
- Usa `vercel logs` desde CLI para debugging

## 🔒 Seguridad en Producción

### 1. Variables de Entorno Seguras

```bash
# Generar clave secreta segura
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generar salt seguro
python -c "import secrets; print(secrets.token_urlsafe(16))"
```

### 2. Configuraciones adicionales

- Habilita HTTPS (automático en Vercel)
- Configura headers de seguridad
- Considera usar un WAF si es necesario

## 🐛 Troubleshooting

### Error: "No module named 'app'"

**Solución**: Verifica que `vercel.json` apunte al archivo correcto:
```json
{
  "builds": [{ "src": "app.py", "use": "@vercel/python" }]
}
```

### Error: "Database locked"

**Solución**: Cambia a PostgreSQL para producción o reinicia el deployment.

### Error: Variables de entorno no encontradas

**Solución**: 
1. Verifica que las variables estén configuradas en Vercel
2. Reinicia el deployment
3. Revisa los logs con `vercel logs`

### Error 500: Internal Server Error

**Solución**:
1. Revisa los logs: `vercel logs`
2. Verifica las variables de entorno
3. Asegúrate de que todas las dependencias estén en `requirements.txt`

## 📞 Soporte

Si tienes problemas:

1. Revisa los [docs de Vercel](https://vercel.com/docs)
2. Consulta los logs de la aplicación
3. Verifica la configuración de variables de entorno
4. Asegúrate de que el código funciona localmente primero

## 🎉 ¡Éxito!

Tu aplicación Yacon Restaurant ahora está desplegada y lista para recibir visitantes. 

**URLs importantes:**
- Sitio público: `https://tu-app.vercel.app`
- Admin: `https://tu-app.vercel.app/create-admin` (primera vez)
- Login: `https://tu-app.vercel.app/login`

¡Disfruta tu restaurante en línea! 🍱