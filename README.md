# Proyecto-modulo-2

# Developers:

Alberto Correia-Laura Ramirez

# Link to App:

- https://app-mymenu.herokuapp.com/

## Description:

Plataforma donde los locales que no dispongan de páginas web, puedan introducir y mostrar su menú de forma digital a sus clientes.



## User Stories:

- **Página Principal**
- **Registrarse**
- **Iniciar sesión**
- **Cerrar sesión**
- **Crear Menú**
- **Mostrar Menú**

## Backlog:

-**Categorías**
-**Código QR**
-**Acceso con redes rededs sociales**
-**Mail de bienvenida**
-**Carga de logo**
-**QR descargable**

## User profile:

- **Ver perfil restaurante**
- **Añadir imagenes al template del menú**

## ROUTES:

- **/index => render página de inicio**
- **/signup => render página de registro**
- **/login => render página de login**
- **/restaurante/ID => ver menú de restaurante concreto**
- **/restaurante/ID/introducir menú => Formulario introducción elementos menú**

## Models:
Usuario:
- **Nombre: String**
- **Email: String**
- **ContraseñaHash**
-**GoogleID**
-**FacebookID**
```
```

Restaurante:
- **Nombre: String**
- **Dirección: String**
- **Horario:**
- **Menu:[Menus]:**
- **Logo:**
- **UserID**
```
```
Menú:
- **Tipo del menu**
- **Nombre del menu: String**
- **idRestaurante: String**,
- **Menu:[ArrayDeElementosDeMenu]:**
```
```

Elemento del Menú:
- **idMenu: String**,
- **Nombre: String**,
- **Precio: String**,
- **Imagen:**,
```
```

## Wireframes
Restaurante
![restaurante1](https://github.com/CorreiaAlberto/Proyecto-modulo-2/blob/master/wiframes/restaurante1.png)


![Wiframe2](https://github.com/CorreiaAlberto/Proyecto-modulo-2/blob/master/wiframes/Wiframe2.png)



## Links

KANBAN : https://trello.com/b/52ZhFMBf/proyecto


### Git

The url to your repository and to your deployed project

https://github.com/CorreiaAlberto/Proyecto-modulo-2

https://app-mymenu.herokuapp.com/

### Slides

The url to your presentation slides

https://docs.google.com/presentation/d/1eLXfhvO2l882Xik5QH5kcm-srDxpxMWzoRsluhUzxhA/edit?ts=5efcf0d0#slide=id.g8b92443d12_2_533
