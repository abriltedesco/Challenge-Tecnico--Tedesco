## Documentación de Prompts Utilizados

A lo largo del desarrollo, fui iterando con las IAs mediante diferentes prompts para resolver problemas específicos, comparar sus capacidades y mejorar el producto final. A continuación, detallo cada prompt utilizado y la intención detrás del mismo.

### Fase 1: Resolución de Bugs (Sin IA generadora de código)

**Prompt 1 (Claude Opus 4.6)**
> "No logro comprender qué es lo que está afectando al contador de clicks que hace que no se muestren en pantalla la cantidad de click hechos en esos 5 segundos. Usé como base para intentar realizar este "juego de clicks" el useState que trae la App al bajarme react que contaba los clicks en el botón perfectamente. Porqué ahora que agregué la lógica de habilitar contador no funciona? Tiene que ver con el setTimeout? explicar cómo y por qué."

<details>
<summary>💡 <b>Ver explicación de por qué usé este prompt</b></summary>

**¿Por qué este prompt?**
El objetivo en esta primera etapa era aprender, no que la IA me hiciera el trabajo. Al ser mi primera semana trabajando con React y sus estados, me encontré con un bloqueo donde el contador no se actualizaba en la pantalla durante el `setTimeout`. Necesitaba entender la raíz del problema (la manipulación directa del DOM vs. el renderizado de React) y pedí explícitamente una *explicación*, reservándome la tarea de escribir el código yo misma para poder interiorizar el aprendizaje.
</details>

---

### Fase 2: Comparativa de Modelos (Opus vs. GPT)

**Prompt 2 (Enviado idéntico a Claude Opus y a ChatGPT)**
> "Se nos ha pedido crear una App web en React llamada “JuegoContador” que muestre en todo momento:
> • Dos botones: uno para iniciar el juego y otro para clickear durante el mismo
> • Un indicador de puntaje máximo iniciado en 0
> Al presionar el botón de inicio, dicho botón debe deshabilitarse y el componente debe mostrar una cuenta regresiva visual con los mensajes "Preparados","Listos" y "Ya" en intervalos de 1 segundo.
> Al mostrarse el "Ya", el botón para clickear debe habilitarse durante 5 segundos, permitiendo al usuario clickear tantas veces como desee.
> El usuario debe poder ver durante el juego el tiempo restante disponible para clickear el botón y el contador actual.
> Concluido el tiempo, el botón para clickear debe deshabilitarse, el botón para iniciar debe habilitarse nuevamente y, en caso de que se haya superado el puntaje máximo, el valor mostrado debe cambiar por el actual.
> En base a la app que encontrarás como "JuegoContador", modificar lo que sea necesario para que cumpla con los siguientes requisitos pedidos:
> 2. Incluir los estados internos necesarios para cumplir con la funcionalidad detallada.
> 3. Definir una distribución de elementos en la pantalla simple y funcional.
> 4. Resolver la necesidad utilizando componentes funcionales.
> 5. Mostrar la información solicitada con los elementos HTML que considere más apropiados según
> el caso.
> 6. Puedes utilizar una librería de componentes (como MUI) si lo consideras útil y simplifica la tarea.
> 7. Puedes agregar estilos o elementos visuales adicionales para hacer el juego de contador más
> atractivo.
> 8. Entregar el código en un repositorio de GitHub (o la plataforma de preferencia) público. Se
> deberá incluir un README con instrucciones precisas y claras sobre cómo correr la solución en
> un entorno local.
> 9. Se evaluará la prolijidad del código, su mantenibilidad y el uso de buenas prácticas de
> programación.
> 10. El enunciado es suficientemente explicativo para avanzar, y no se responderán preguntas. 
> En caso de algún supuesto o consideración que consideres relevante para la solución, por favor incluirlo en una sección aparte dentro del mismo README"

<details>
<summary>💡 <b>Ver explicación de por qué usé este prompt</b></summary>

**¿Por qué este prompt?**
Una vez solucionada la lógica base por mi cuenta, quería poner a prueba a ambos modelos pasándoles exactamente la misma consigna original que nos dieron. El objetivo era evaluar cómo cada IA interpretaba los requisitos (especialmente los puntos sobre mantenibilidad, prolijidad y UI/UX) partiendo desde la misma base de código "sin IA". Esto me permitió notar que GPT ignoró el aspecto lúdico del requerimiento y omitió los comentarios en el código, mientras que Opus entregó algo más funcional y amigable visualmente desde el principio.
</details>

---

### Fase 3: Iteración de "Game Feel" y Correcciones

**Prompt 3 (Enviado a ambos modelos para mejorar la experiencia)**
> "El código actual funciona perfecto pero no parece un juego.
> Por favor, modificá los estilos y componentes para incluir lo siguiente: cada
> vez que el usuario haga clic en el botón principal, aparezca un pequeño número
> flotante (+1) en la posición del clic que se desvanezca hacia arriba. el botón
> principal tenga un efecto de 'presión' física muy marcado al hacer clic como la
> de un botón de jueguito, q cuando queden 2 segundos o menos en el temporizador el
> texto del tiempo parpadee en rojo como para mantener la tensión del jugador haciendo
> clicks. Mantené la misma lógica pero hacelo sentir más como un juego. 
> También estaría bueno que la cuenta regresiva sea más “dramática”
> porque es bastante aburrida y procurá q no se cuente ni un milisegundo hasta
> que no termine esta cuenta regresiva es decir NO puede habilitarse el botón de
> clickear hasta q no termine totalmente."

**Agregado específico solo para GPT:**
> "estaría bueno que agregues comentarios explicativos, no hace falta en todas y cada una de las funcione spero si las más importantes también por que sirve como “”división visual”” "

<details>
<summary>💡 <b>Ver explicación de por qué usé este prompt</b></summary>

**¿Por qué este prompt?**
Al ver los primeros resultados noté que si bien las IAs resolvieron la lógica, ambas habían fallado en hacer que el producto final se sintiera como un *juego*.
Además, fui muy específica con el control del temporizador para evaluar cómo manejaban la sincronización estricta de estados en React. Finalmente, la adición específica para GPT fue para corregir su mala práctica de la iteración anterior, exigiéndole que documente su propio código para mejorar la legibilidad.
</details>