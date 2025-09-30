# NailFinderStore Backend

Backend NestJS para la plataforma NailFinderStore. Este proyecto expone la capa de dominio que consume el frontend [`xacq/nailfinderstore`](https://github.com/xacq/nailfinderstore) y se integra con el esquema MySQL descrito en [`db/schema.sql`](https://github.com/xacq/nailfinderstore/blob/main/db/schema.sql).

## Requisitos previos

- Node.js 20 LTS (recomendado) y npm 10.
- Servidor MySQL 8.x accesible con las credenciales configuradas en las variables de entorno.
- Opcional: Docker para levantar una base de datos local rápidamente.

## Configuración de variables de entorno

El backend usa `@nestjs/config` para cargar la configuración. Crea un archivo `.env` tomando como referencia `.env.example`.

| Variable        | Descripción                                      | Ejemplo              |
| --------------- | ------------------------------------------------ | -------------------- |
| `PORT`          | Puerto HTTP donde correrá la API                 | `3000`               |
| `DB_HOST`       | Host del servidor MySQL                          | `127.0.0.1`          |
| `DB_PORT`       | Puerto del servidor MySQL                        | `3306`               |
| `DB_USER`       | Usuario con permisos de lectura/escritura        | `nailfinder`         |
| `DB_PASS`       | Contraseña del usuario                           | `supersecret`        |
| `DB_NAME`       | Base de datos donde viven las tablas del esquema | `nailfinderstore`    |

## Instalación

```bash
npm install
```

## Ejecución

```bash
# desarrollo con recarga automática
npm run start:dev

# ejecución en modo producción (requiere `npm run build` previo)
npm run start:prod
```

El endpoint raíz (`GET /`) responde "Hello World!" hasta que se conecten los módulos de dominio. Consulta [`docs/backend-overview.md`](docs/backend-overview.md) para conocer el estado actual del modelo y las prioridades de implementación.

## Migraciones y base de datos

El proyecto usa TypeORM con migraciones manuales. Los comandos CLI están disponibles a través de los scripts de npm:

```bash
# generar una nueva migración (usa --name=NombreMigracion)
npm run typeorm:migration:generate --name=InitScheduling

# ejecutar migraciones pendientes
npm run typeorm:migration:run

# revertir la última migración aplicada
npm run typeorm:migration:revert
```

Antes de generar migraciones, verifica que las entidades reflejen fielmente el esquema oficial del proyecto. Las entidades existentes se encuentran en `src/core` (núcleo de usuarios/negocios) y `src/modules/scheduling` (catálogo de servicios, técnicos y citas).

## Calidad y pruebas

```bash
# compilar el proyecto
npm run build

# ejecutar la suite de pruebas unitarias
npm test

# ejecutar ESLint con autofix
npm run lint
```

## Estructura relevante

```
src/
├── core/                     # Entidades compartidas (negocios, usuarios, RBAC)
├── modules/
│   └── scheduling/           # Lógica de catálogo, técnicos y citas
├── app.module.ts             # Bootstrap principal (TypeORM + ConfigModule)
└── main.ts                   # Punto de entrada de NestJS
```

La documentación adicional y análisis de cobertura del esquema se mantiene en `docs/backend-overview.md`.
