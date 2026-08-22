# Gestor de Informes Clínicos — Backend

Backend del proyecto **Gestor de Informes Clínicos**, desarrollado en **Kotlin + Spring Boot**.  
Estado: Fase inicial
---
## 🛠️ Tecnologías

- **Kotlin 2.3.21**
- **Spring Boot 4.1.1**
  - Web MVC  
  - Validation  
  - Jackson  
  - JPA  
  - Liquibase  
  - DevTools  
- **Tomcat 11 embebido**
- **Gradle (Kotlin DSL)**
- **Java 17 (Temurin HotSpot)**

---

## 📂 Estructura Actual

```bash
backend/
├── build.gradle.kts
├── src/
│   └── main/
│       ├── kotlin/
│       │   └── com.guillermo.clinical/
│       │       └── ClinicalReportManagerApplicationKt
│       └── resources/
│           └── application.properties
```

---

## 🔧 Requisitos del Entorno

- **JDK 17**  
- IntelliJ configurado con:
- **Project SDK = JDK 17**
- **Gradle JVM = JDK 17**

---

## 📅 Próximos Pasos

1. Definir la base de datos (PostgreSQL o H2 temporal).
2. Crear `application.yml` con la configuración inicial.
3. Añadir entidades JPA.
4. Crear repositorios y servicios.
5. Exponer los primeros endpoints REST.
6. Integrar Liquibase para gobierno de base de datos.
