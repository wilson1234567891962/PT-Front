# PT-Front - Frontend Angular 17

Este proyecto corresponde al frontend de una aplicación de gestión de tareas.  
La aplicación será desarrollada con Angular 17 y se conectará a un backend Java que expone una API REST para administrar tareas almacenadas en una base de datos Oracle.

## Objetivo del proyecto

Construir una interfaz web que permita consumir los servicios del backend y realizar operaciones CRUD sobre tareas.

La aplicación permitirá:

- Listar tareas.
- Crear nuevas tareas.
- Editar tareas existentes.
- Marcar tareas como completadas o pendientes.
- Eliminar tareas.
- Manejar errores en las peticiones HTTP.
- Validar campos obligatorios en formularios.
- Desplegar el frontend en GitHub Pages.

## Tecnologías utilizadas

- Angular 17
- TypeScript
- HTML5
- SCSS
- RxJS
- Angular HttpClient
- GitHub Actions
- GitHub Pages

## Backend esperado

Este frontend está pensado para conectarse a un backend desarrollado con:

- Java 8
- Servlets o JAX-RS
- JDBC
- Oracle Database
- PL/SQL
- Apache Tomcat

El backend debe exponer los siguientes endpoints REST:

```http
GET     /api/tasks
GET     /api/tasks/{id}
POST    /api/tasks
PUT     /api/tasks/{id}
DELETE  /api/tasks/{id}
```
