# Gestor de Informes Clínicos — Backend

<p align="left">
  <img src="https://img.shields.io/badge/Kotlin-2.3-7F52FF?logo=kotlin&logoColor=white" alt="Kotlin" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Liquibase-Migrations-2962FF?logo=liquibase&logoColor=white" alt="Liquibase" />
  <img src="https://img.shields.io/badge/Estado-Dise%C3%B1o%20de%20Arquitectura-yellow" alt="Estado" />
</p>

API del **Gestor de Informes Clínicos**, responsable de la gestión del ciclo de vida de los informes de microbioma, autorización RBAC por rol y persistencia del modelo clínico.

---

## ⚠️ Estado real del proyecto

**No hay código de aplicación implementado.** Lo único que existe actualmente en `backend/` es el esquema de base de datos versionado con Liquibase (changelogs `.yaml`), correspondiente al modelo de datos documentado en el `README.md` raíz.

No existen todavía: entidades JPA, repositorios, servicios, controllers, seguridad, ni tests. Esta sección se actualizará a medida que cada pieza se implemente — hasta entonces, cualquier diagrama de capas, endpoint o servicio descrito más abajo es **diseño en curso, no funcionalidad existente**.

---

## 🛠️ Stack Técnico (objetivo)

| Categoría | Tecnología |
|---|---|
| Lenguaje | Kotlin 2.3.21 |
| Framework | Spring Boot 4.1.1 (Web MVC, Validation, Jackson, JPA, DevTools) |
| Base de datos | PostgreSQL |
| Migraciones | Liquibase *(único componente implementado hasta la fecha)* |
| Seguridad | Spring Security + JWT Bearer *(pendiente)* |
| Servidor | Tomcat 11 embebido |
| Build | Gradle (Kotlin DSL) |
| Runtime | Java 17 (Temurin) |

---

## 🧭 Decisión pendiente: monolito vs. microservicios

Antes de escribir la primera clase Kotlin, este proyecto está evaluando deliberadamente si implementarse como **monolito modular** o como **microservicios**, con el objetivo secundario (y explícito) de servir como ejercicio de aprendizaje sobre descomposición de servicios. Esta sección documenta el estado de esa evaluación para que cualquier decisión futura tenga contexto — incluido para el propio autor dentro de unos meses.

### Bounded contexts identificados sobre el ERD actual

| Contexto candidato | Entidades | Responsabilidad |
|---|---|---|
| **Identity** | `users` | Autenticación, JWT, roles |
| **Care Directory** | `clinics`, `doctors`, `patients` | Altas, asignación doctor↔paciente, relación clínica↔doctor |
| **Reports** | `microbiome_reports`, `biomarkers`, `action_plans` | Ciclo de vida del informe, biomarcadores, planes de acción |

### El problema abierto a resolver antes de implementar

`microbiome_reports.patient_id` referencia a `patients`, que pertenece a un contexto distinto. En un monolito esto es un `JOIN`; en microservicios reales (bases de datos separadas) deja de serlo. Para cada relación cruzada del ERD hay que decidir explícitamente uno de estos patrones:

| Patrón | Cuándo aplicaría | Coste |
|---|---|---|
| Llamada síncrona (REST/gRPC) entre servicios | Dato que cambia poco y se necesita fresco | Acopla disponibilidad de ambos servicios |
| Caché local vía evento (denormalización) | Dato de lectura frecuente, tolerante a leve desfase (ej. `patient_name` en un informe) | Requiere message broker y gestión de consistencia eventual |
| Claim embebido en JWT | Dato de identidad/rol necesario en cada request | Sin llamada extra, pero limitado a lo que cabe en el token |

**Ninguna de estas decisiones está tomada todavía.** Se documentarán aquí (o en ADRs individuales bajo `docs/adr/`) en cuanto se resuelvan, junto con el razonamiento.

### Camino de menor riesgo considerado

Antes de saltar a servicios físicamente separados (bases de datos distintas, despliegues distintos, red entre servicios), se está considerando implementar primero un **monolito modular**: mismos límites de contexto (`identity/`, `caredirectory/`, `reports/` como paquetes Kotlin independientes que no se importan entre sí salvo por interfaces explícitas), pero en un único deployable y una única base de datos. Esto permite validar las fronteras de dominio sin pagar el coste operacional de microservicios reales, manteniendo la extracción a servicios físicos como paso posterior si el ejercicio de aprendizaje o la necesidad real del proyecto lo justifican.

---

## 🗄️ Base de Datos y Migraciones

Es la única capa con trabajo real hecho. El esquema completo (`users`, `clinics`, `doctors`, `patients`, `microbiome_reports`, `biomarkers`, `action_plans`) está versionado con Liquibase conforme al ERD del README raíz.

```bash
backend/src/main/resources/
└── db/
    └── changelog/
        └── ...  # changesets Liquibase existentes
```

- Las migraciones son la fuente de verdad del modelo de datos hasta que existan entidades JPA.
- Cualquier cambio de esquema debe seguir pasando por un changeset versionado, incluso durante la fase de exploración de arquitectura — evita reescribir migraciones a mano si el corte en servicios obliga a dividir el esquema más adelante.

---

## 📅 Próximos pasos

1. **Cerrar la decisión de arquitectura** (monolito modular vs. microservicios) documentando el razonamiento, aunque sea provisional.
2. Para cada relación cruzada del ERD, fijar el patrón de acceso a datos (síncrono / evento / JWT claim) según la tabla de la sección anterior.
3. Implementar la primera vertical completa (`Identity`: entidad `User`, repositorio, servicio de login, filtro JWT) como piloto del patrón de capas elegido, antes de replicarlo al resto de contextos.
4. Documentar endpoints REST reales a medida que se implementen — no antes.
5. Añadir tests de integración (`@DataJpaTest`, `@WebMvcTest`) desde el primer vertical, no al final.

> Este README se actualizará incrementalmente conforme cada punto se resuelva. El objetivo es que en ningún momento describa código o arquitectura que no exista todavía.