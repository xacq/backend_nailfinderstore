# NailFinderStore Backend Overview

Este documento resume el estado actual del backend (NestJS + TypeORM) incluido en este repositorio y cómo se relaciona con el esquema MySQL publicado en [`xacq/nailfinderstore`](https://github.com/xacq/nailfinderstore/blob/main/db/schema.sql). Su objetivo es ayudar a sincronizar el trabajo del frontend con las capacidades reales del backend.

## Stack y configuración general

- **Framework**: NestJS con TypeScript.
- **ORM**: TypeORM configurado para MySQL. Las entidades se cargan dinámicamente desde `src/**/*.entity.ts` y se ejecutan migraciones manuales; `synchronize` está deshabilitado. La configuración espera variables de entorno `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS` y `DB_NAME`.【F:src/data-source.ts†L1-L21】
- **Entidades base**: Se hereda de `TimestampedEntity` (UUID + columnas `created_at` / `updated_at`) y opcionalmente de `SoftDeletableEntity` (añade `deleted_at`).【F:src/modules/scheduling/base/timestamped.entity.ts†L1-L12】【F:src/core/base/soft-deletable.entity.ts†L1-L8】

> ⚠️ Actualmente no existen módulos, controladores ni resolvers expuestos; el backend solo define entidades y algunos servicios de dominio. Para que el frontend pueda consumir datos será necesario crear controladores/rest endpoints o GraphQL resolvers que utilicen estas entidades y servicios.

## Cobertura del esquema

### Núcleo de negocio y usuarios

| Tabla (schema.sql) | Estado en el backend |
| --- | --- |
| `businesses` | Implementada como entidad `Business` (incluye relaciones con ubicaciones, usuarios y rbac).【F:src/core/business/business.entity.ts†L1-L52】 |
| `business_locations` | Implementada como `BusinessLocation`, con soporte para soft-delete y banderas `is_default`/`is_active`.【F:src/core/business/business-location.entity.ts†L1-L48】 |
| `roles` | Implementada como `Role`.【F:src/core/rbac/role.entity.ts†L1-L18】 |
| `users` | Implementada como `User`, enlazando con `Business`, `UserProfile`, direcciones y RBAC.【F:src/core/user/user.entity.ts†L1-L52】 |
| `user_profiles` | Implementada como `UserProfile` (incluye enums de género y preferencias).【F:src/core/user/user-profile.entity.ts†L1-L37】 |
| `user_roles` | Implementada como `UserRole` con `business_id` obligatorio.【F:src/core/rbac/user-role.entity.ts†L1-L29】 |
| `business_users` | Implementada como `BusinessUser` con estado `invited/active/inactive`.【F:src/core/rbac/business-user.entity.ts†L1-L34】 |
| `user_addresses` | Implementada como `UserAddress`.【F:src/core/user/user-address.entity.ts†L1-L41】 |

### Servicios y agenda

| Tabla | Estado |
| --- | --- |
| `service_categories` | Entidad `ServiceCategory` (relación con negocio, `position`, `is_active`).【F:src/modules/scheduling/catalog/entities/service-category.entity.ts†L1-L18】 |
| `services` | Entidad `Service` con campos de duración, precio y tiempos de preparación/buffer. Soft delete soportado.【F:src/modules/scheduling/catalog/entities/service.entity.ts†L1-L27】 |
| `technicians` | Entidad `Technician` con `display_name`, bio y rating promedio. Relación opcional a `users`.【F:src/modules/scheduling/technicians/entities/technician.entity.ts†L1-L24】 |
| `technician_services` | Entidad `TechnicianService` con clave primaria compuesta (sin timestamps).【F:src/modules/scheduling/technicians/entities/technician-service.entity.ts†L1-L19】 |
| `business_hours` | Entidad `BusinessHour` manejada por `BusinessHoursService.upsertDay`.【F:src/modules/scheduling/technicians/entities/business-hour.entity.ts†L1-L23】【F:src/modules/scheduling/technicians/services/business-hours.service.ts†L1-L17】 |
| `technician_availability` | Entidad `TechnicianAvailability`.【F:src/modules/scheduling/technicians/entities/technician-availability.entity.ts†L1-L16】 |
| `appointments` | Entidad `Appointment` con estados y campos de cancelación. Falta implementar servicios/controladores para CRUD y lógica de disponibilidad.【F:src/modules/scheduling/appointments/entities/appointment.entity.ts†L1-L38】 |
| `appointment_status_history` | Entidad `AppointmentStatusHistory`.【F:src/modules/scheduling/appointments/entities/appointment-status-history.entity.ts†L1-L23】 |
| `service_reviews` | Entidad `ServiceReview`.【F:src/modules/scheduling/appointments/entities/service-review.entity.ts†L1-L21】 |

El servicio `TechniciansService` permite crear técnicos y asignar servicios (sobrescribiendo la relación N:M).【F:src/modules/scheduling/technicians/services/technicians.service.ts†L1-L22】

### Elementos aún no modelados

El esquema MySQL contiene secciones adicionales (portafolio, ecommerce, carritos, órdenes, pagos, etc.) que **no** tienen entidades dentro del backend actual. En el frontend hay vistas relacionadas con productos y tienda (`nailfinderstore`), por lo que, si son necesarias, habrá que añadir módulos equivalentes para:

- Portafolio (`nail_designs`, `nail_design_images`).
- Comercio electrónico (`product_categories`, `products`, `product_images`, `inventory_items`, `carts`, `cart_items`, `orders`, etc.).
- Programas de fidelidad, promociones, pagos, etc. (ver secciones posteriores de `schema.sql`).

## Recomendaciones para integrar con el frontend

1. **Definir módulos y controladores HTTP**: crear módulos Nest (por ejemplo `CatalogModule`, `TechniciansModule`, `AppointmentsModule`, `EcommerceModule`) con controladores/servicios que expongan endpoints REST/GraphQL compatibles con las necesidades del frontend.
2. **DTOs y validación**: aprovechar `class-validator` para definir DTOs coherentes con las entidades (ya se usan decoradores en varias entidades base).
3. **Casos de uso críticos**:
   - Listar catálogo de servicios y técnicos activos por negocio/ubicación.
   - Crear y actualizar citas con validación de disponibilidad y registro en `appointment_status_history`.
   - Publicar reseñas (`service_reviews`) ligadas a citas finalizadas.
   - Sincronizar la selección de servicios del frontend con asignaciones `technician_services`.
4. **Sincronización con el esquema**: antes de añadir nuevas entidades, revisar las secciones relevantes de `schema.sql` para mantener la paridad de campos y restricciones.
5. **Migraciones**: generar migraciones TypeORM para cualquier cambio; actualmente solo existen entidades y no hay migraciones en `src/modules/scheduling/migrations`.

## Próximos pasos sugeridos

- Documentar los endpoints esperados por el frontend para priorizar qué módulos implementar primero.
- Conectar el backend a la base de datos MySQL real para validar que las entidades coinciden con el esquema y ajustar tipos/longitudes si es necesario.
- Añadir pruebas de integración que cubran los flujos principales (creación de citas, asignación de servicios, reseñas, etc.).

Esta visión debería facilitar la planificación del trabajo necesario para “empatar” el frontend de `nailfinderstore` con la API backend.
