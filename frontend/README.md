# Frontend - Sistema de Gestión de Inventario y Donaciones

Sistema de gestión de inventario y donaciones para Plaza Vea Corpac.

## Características

- Dashboard con estadísticas en tiempo real
- Gestión de Productos y Categorías
- Control de Inventario (Stock)
- Registro de Donaciones a ONGs
- Sistema de Alertas
- Gestión de Ubicaciones
- Administración de Usuarios

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript Vanilla (ES6+)
- Fetch API para comunicación con el backend

## Estructura del Proyecto

```
frontend/
├── index.html          # Archivo principal
├── css/
│   └── styles.css      # Estilos del sistema
├── js/
│   ├── api.js          # Comunicación con el backend
│   ├── utils.js        # Funciones utilitarias
│   ├── app.js          # Inicialización y navegación
│   ├── dashboard.js    # Módulo Dashboard
│   ├── products.js     # Módulo Productos
│   ├── stock.js        # Módulo Inventario
│   ├── donations.js    # Módulo Donaciones
│   ├── alerts.js       # Módulo Alertas
│   ├── categories.js   # Módulo Categorías
│   ├── locations.js    # Módulo Ubicaciones
│   ├── ongs.js         # Módulo ONGs
│   └── users.js        # Módulo Usuarios
└── README.md
```

## Instalación y Configuración

### 1. Configurar el Backend

Asegúrate de que el backend de NestJS esté ejecutándose en `http://localhost:3000`

### 2. Configurar CORS en el Backend

Agrega la configuración de CORS en tu archivo `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
```

### 3. Abrir el Frontend

Simplemente abre el archivo `index.html` en tu navegador web preferido, o utiliza un servidor local:

**Opción 1: Abrir directamente**
```bash
# Navega a la carpeta frontend y abre index.html
```

**Opción 2: Usar Live Server (recomendado)**
```bash
# Si tienes Python instalado
cd frontend
python -m http.server 8080
# Abre http://localhost:8080 en tu navegador
```

**Opción 3: Usar Node.js con http-server**
```bash
npm install -g http-server
cd frontend
http-server -p 8080
# Abre http://localhost:8080 en tu navegador
```

## Módulos del Sistema

### Dashboard
- Vista general con estadísticas
- Alertas recientes
- Stock próximo a vencer

### Productos
- CRUD completo de productos
- Búsqueda por nombre o código de barras
- Asignación de categorías

### Inventario (Stock)
- Gestión de lotes
- Control de cantidades
- Estados: OK, CRITICAL, EXPIRED, RETIRED
- Filtros por estado

### Donaciones
- Registro de donaciones a ONGs
- Seguimiento de contribuciones
- URL de recibos

### Alertas
- Visualización de alertas del sistema
- Filtros por estado

### Categorías
- Gestión de categorías de productos

### Ubicaciones
- Administración de ubicaciones de almacenamiento

### ONGs
- Registro de organizaciones beneficiarias

### Usuarios
- Gestión de usuarios del sistema
- Roles: Administrador y Supervisor

## API Endpoints

El frontend se comunica con los siguientes endpoints del backend:

- `/product` - Productos
- `/category` - Categorías
- `/stock` - Inventario
- `/donation` - Donaciones
- `/contribution` - Contribuciones
- `/alert` - Alertas
- `/location` - Ubicaciones
- `/ong` - ONGs
- `/user` - Usuarios

## Personalización

### Cambiar la URL del API

Edita el archivo `js/api.js` y modifica la constante `API_URL`:

```javascript
const API_URL = 'http://tu-servidor:puerto';
```

### Modificar Colores

Los colores principales se definen en `css/styles.css`. El color principal de Plaza Vea es:

```css
/* Rojo Plaza Vea */
#e31837
```

## Características del Diseño

- Diseño responsive
- Interfaz simple y limpia
- Colores corporativos de Plaza Vea
- Modales para formularios
- Alertas de confirmación
- Búsqueda y filtros en tiempo real

## Soporte

Para cualquier problema o pregunta sobre el frontend, contacta al equipo de desarrollo.
