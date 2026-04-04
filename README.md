
<div align="center">

  # CHALLENGE TÉCNICO 🖥️
  
</div>
---

##  Prácicas Profesionalizantes - 2026
### Profesor: Lucas Saclier
### Alumna: Abril Tedesco

---

## Cómo correr la solución en un entorno local

### Requisitos previos
- [Node.js](https://nodejs.org/) (v18 o superior)
- npm (incluido con Node.js)

### Instrucciones

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Challenge-Tecnico--Tedesco
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   Se abrirá un servidor local (por defecto en `http://localhost:5173`). Abrí esa URL en tu navegador.

4. **Build de producción** (opcional)
   ```bash
   npm run build
   npm run preview
   ```

---

## Supuestos y consideraciones

- **Versión V3**: Se creó un nuevo componente `JuegoContadorV3` sin sobreescribir el original (`JuegoContador`) ni la versión previa (`JuegoContadorV2`). El archivo `main.jsx` importa la versión V3.
- **Cuenta regresiva**: Los mensajes "Preparados...", "Listos..." y "¡Ya!" se muestran como un overlay a pantalla completa con animación, mejorando la experiencia visual respecto al uso de `<dialog>` con manipulación directa del DOM.
- **Sin `alert()`**: El resultado del juego se muestra directamente en la interfaz como un mensaje estilizado, evitando interrumpir la experiencia del usuario con ventanas modales del navegador.
- **Gestión de estado con React**: Se eliminó toda manipulación directa del DOM (`document.getElementById`). Toda la lógica de UI se maneja a través de estados de React (`useState`) y una máquina de estados simple (`idle` → `countdown` → `playing` → `idle`).
- **Limpieza de timers**: Se implementó limpieza de `setTimeout`/`setInterval` al desmontar el componente para evitar memory leaks.
- **Componentización**: Se separaron sub-componentes funcionales (`CountdownOverlay`, `GameStats`, `ResultMessage`) para mejorar la legibilidad y mantenibilidad.
- **Accesibilidad**: Se incluyeron atributos `role` y `aria-*` en elementos relevantes (countdown, barra de progreso, resultado).
- **Responsive**: Los estilos se adaptan a pantallas pequeñas (< 480px).
