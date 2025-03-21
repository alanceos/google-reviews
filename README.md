# Scraper de Reseñas Turísticas de Aguascalientes

Esta aplicación permite obtener y visualizar reseñas de Google para diferentes categorías de negocios turísticos en Aguascalientes, México.

## Características

- Búsqueda de negocios por categoría (viñedos, hoteles, restaurantes, museos, parques)
- Obtención de reseñas de Google
- Interfaz de usuario moderna y responsive
- Visualización de calificaciones, comentarios y fechas

## Requisitos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Una API key de Google Maps (opcional, pero recomendada)

## Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd google-reviews
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
- Copia el archivo `.env.example` a `.env`
- Agrega tu API key de Google Maps en el archivo `.env`

## Uso

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre tu navegador y visita `http://localhost:5173`

3. Selecciona una categoría para ver las reseñas de los negocios en esa categoría.

## Estructura del Proyecto

```
google-reviews/
├── src/
│   ├── components/     # Componentes de React
│   ├── services/      # Servicios (scraper, API calls)
│   ├── types/         # Definiciones de tipos TypeScript
│   └── utils/         # Utilidades
├── public/            # Archivos estáticos
└── package.json       # Dependencias y scripts
```

## Notas Importantes

- El scraping de Google Reviews debe realizarse de manera responsable y respetando los términos de servicio de Google.
- Se recomienda implementar límites de tasa y caché para evitar sobrecargar los servidores de Google.
- Considera obtener una API key oficial de Google Maps para un uso más confiable.

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
