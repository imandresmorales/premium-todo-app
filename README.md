# Sereno - Tu Espacio de Tareas 🌟

¡Bienvenido a **Sereno**! Una aplicación de gestión de tareas (To-Do List) diseñada para ofrecer una experiencia estética, responsiva y altamente intuitiva. Desarrollada con Vanilla JavaScript, HTML5 y CSS3.

## 🚀 Características

- **Múltiples Diseños de Interfaz:** Cambia dinámicamente entre Diseño por Defecto (Glassmorphism), Bootstrap, Material UI, Chakra UI y Mantine UI con un solo clic.
- **Diseño Glassmorphism & Animaciones:** Disfruta de una interfaz moderna con orbes flotantes y transiciones suaves.
- **Gestión de Tareas Completa:** Añade, elimina y marca tareas como completadas.
- **Filtrado Avanzado:** Visualiza todas tus tareas, solo las activas o aquellas que ya has completado.
- **Estadísticas Dinámicas:** Lleva el registro del total de tareas y las completadas en tiempo real.
- **Persistencia de Datos:** Todas tus tareas se guardan de manera segura en el `localStorage` de tu navegador, para que no pierdas tu progreso.
- **Prevención XSS:** El código incluye sanitización de la entrada del usuario para prevenir ataques de Cross-Site Scripting.
- **IDs Únicos Seguros:** Utilización de `crypto.randomUUID()` para asegurar la unicidad inquebrantable de cada tarea.
- **100% Responsivo:** Adaptable y hermoso en dispositivos móviles, tablets y escritorios.

## 📂 Estructura del Proyecto

El proyecto ha sido cuidadosamente organizado para promover buenas prácticas de escalabilidad y mantenimiento:

```text
premium-todo-app/
│
├── index.html       # Estructura principal, accesibilidad e importaciones esenciales
├── css/
│   ├── style.css             # Tema base (Glassmorphism), estilos principales y animaciones
│   ├── bootstrap-extras.css  # Tema y ajustes específicos para diseño Bootstrap
│   ├── material-extras.css   # Tema y ajustes integrados para diseño Material UI
│   ├── chakra-extras.css     # Simulación de estilos y componentes de Chakra UI
│   └── mantine-extras.css    # Simulación de estilos y componentes de Mantine UI
├── js/
│   └── script.js    # Lógica de la app, manejo de temas, eventos locales y almacenamiento
└── README.md        # Documentación del Proyecto
```

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Marcado semántico y estructura accesible.
- **CSS3:** Variables CSS (Custom Properties), Flexbox, animaciones, diseño responsivo.
- **JavaScript (ES6):** Manipulación robusta del DOM, API Web Cryptography, LocalStorage y control de eventos.

## ⚙️ Instalación y Uso Local

Este es un proyecto estático sin la necesidad de dependencias del lado del backend. Para correrlo de forma local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/premium-todo-app.git
   ```
2. Accede a la carpeta de tu proyecto:
   ```bash
   cd premium-todo-app
   ```
3. Puedes utilizar una extensión como **Live Server** en VSCode, o correr un servidor local de Node/Python para la correcta ejecución del Javascript:
   ```bash
   npx http-server -p 8080
   # ¡Abre http://localhost:8080 en tu navegador!
   ```

## 🔐 Seguridad y Buenas Prácticas Implementadas

- **Lectura Segura:** Se utiliza `try-catch` para interactuar con `localStorage` y evitar bloqueos en la ejecución en caso de colisión de datos.
- **Inyección HTML controlada:** Las funciones sanitizan activamente mediante reemplazos (`escapeHTML`) todo lo que el usuario inserta, brindando una renderización sin riesgos.
- **Estilos Modulares:** Uso del sistema `:root` de CSS para la estandarización de colores (themes ready).

## 🤝 Contribuciones

Las contribuciones, los reportes de bugs (issues) y las solicitudes de características siempre son bienvenidas.

1. Realiza el _Fork_ del proyecto
2. Crea una rama para tu Feature (`git checkout -b feature/AmazingFeature`)
3. Haz Commit a tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

_Creado con dedicación para ofrecerte el mejor gestor de tareas._
