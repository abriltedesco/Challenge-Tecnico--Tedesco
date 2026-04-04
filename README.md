# JuegoContador 🕹️

Desafío técnico para el puesto de Desarrollador Frontend React Junior. Juego simple en el que el usuario compite contra sí mismo intentando hacer la mayor cantidad de clics posibles en un botón durante 5 segundos.

---

## Versiones

El repositorio incluye tres versiones del mismo juego, cada una con un enfoque diferente:

| Versión | Archivo | Descripción |
| :--- | :--- | :--- |
| **V1** | `JuegoContador.jsx` | Resolución propia sin IA. Funcional y básica. |
| **V2** | `JuegoContadorV2.jsx` | Generada con **Claude Opus 4.6**. Enfoque lúdico/arcade. |
| **V3** | `JuegoContadorV3.jsx` | Generada con **GPT-5.4**. Enfoque de producto/dashboard. |

Para cambiar qué versión se muestra, modificar el import en `src/App.jsx`.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior (incluido con Node.js)

Verificar versiones instaladas:

```bash
node -v
npm -v
```

---

## Instalación y ejecución local

1. Clonar el repositorio:

```bash
git clone https://github.com/abriltedesco/Challenge-Tecnico--Tedesco
cd Challenge-Tecnico--Tedesco
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir el navegador en la URL que indica la terminal (por defecto `http://localhost:5173`).

---

## Cómo cambiar la versión activa

Editar `src/App.jsx` y modificar el import del componente:

```jsx
// Para ver la versión sin IA (V1):
import JuegoContador from './sinIA/JuegoContadorV3.jsx'

// Para ver la versión con Claude Opus 4.6 (V2):
import JuegoContadorV2 from './Opus4.6/JuegoContadorV2.jsx'

// Para ver la versión con GPT-5.4 (V3):
import JuegoContadorV3 from  './Opus4.6/JuegoContadorV2.jsx'
```

---

## Estructura del proyecto

```
src/
├── GPT-5.4/
  ├── JuegoContadorV3.jsx      # V3 — resolución con GPT-5.4
  ├── JuegoContadorV3.css      # V3 — resolución con GPT-5.4
├── Opus6.4/
  ├── JuegoContadorV2.jsx     # V2 — resolución con Claude Opus 4.6  
  ├── JuegoContadorV2.css     # V2 — resolución con Claude Opus 4.6  
├── sinIA/
  ├── JuegoContador.jsx     # V1 — resolución propia
  ├── JuegoContador.css     # V1 — resolución propia
├── App.jsx                 # Punto de entrada — cambiar import aquí
└── main.jsx
```

---

## Supuestos y consideraciones

- **Inicio del conteo:** El botón de clic se habilita únicamente cuando la cuenta regresiva finaliza por completo (después del "Ya"), no al inicio del último mensaje. Esto asegura que no se pueda clickear ni un milisegundo antes del tiempo de juego.

- **Persistencia del puntaje máximo:** El récord se guarda en memoria durante la sesión. Al recargar la página se reinicia a 0. No se utilizó `localStorage` ya que el enunciado no lo requería.

- **Sin librerías de componentes externas:** Se decidió no usar MUI u otras librerías para mantener el código liviano y demostrar el manejo directo de CSS y React sin dependencias adicionales.

- **Tres versiones en el mismo repositorio:** Se eligió esta estructura para facilitar la comparación directa entre enfoques. En un proyecto real, cada versión viviría en su propio branch o repositorio.

- **Limpieza de timers:** Todas las versiones limpian correctamente sus `setTimeout` e `setInterval` al desmontar el componente para evitar memory leaks.

---

## Proceso de desarrollo

Este proyecto fue desarrollado en tres etapas. Primero se resolvió el juego de forma manual sin asistencia de IA, lo que permitió identificar las diferencias conceptuales entre JavaScript vanilla y React — en particular, por qué la manipulación directa del DOM entra en conflicto con el ciclo de renderizado de React y cómo resolverlo correctamente con `useState`.

Con esa base, se generaron dos versiones usando Claude Opus 4.6 y GPT-5.4 con el mismo prompt de partida, para comparar cómo cada modelo interpreta los mismos requisitos técnicos y de producto. Las diferencias más notorias aparecieron en la UI/UX: Opus adoptó una estética arcade y lúdica, mientras que GPT produjo una interfaz más cercana a un dashboard de producto.

Finalmente, se iteró sobre ambas versiones con un segundo prompt enfocado en mejorar la experiencia de juego: efectos de presión física en el botón, números flotantes al hacer clic y tensión visual en los últimos segundos del temporizador.

---

## Documentación del proceso

El análisis comparativo completo, incluyendo la comparativa entre enfoques (con IA y sin IA), la comparativa entre modelos (Opus vs. GPT) y los prompts utilizados, se encuentra en:

- `AnalisisComparativo.md` — análisis técnico y de UX entre las tres versiones
- `Prompts.md` — prompts utilizados con cada modelo y la intención detrás de cada uno