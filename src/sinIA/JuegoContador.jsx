import { useState, useRef } from 'react'
import './JuegoContador.css'

function App() {
  const [count, setCount] = useState(0)
  const [deshabilitado, setDeshabilitado] = useState(true)
  const [resultadoMayor, setResultadoMayor] = useState(0)
  const [tiempoRestante, setTiempoRestante] = useState(0)
  
  const contadorRef = useRef(0)

  const guardarResultado = (resultado) => {
    if (resultado > resultadoMayor) {
      setResultadoMayor(resultado);
    }
  }

  const habilitarContador = () => {  
    setCount(0); 
    setDeshabilitado(false); 
    setTiempoRestante(5)
    
    const intervalo = setInterval(() => {
      setTiempoRestante(prev => prev - 1)
    }, 1000)

    setTimeout(() => {
      clearInterval(intervalo);
      setDeshabilitado(true);
      alert(`¡Tiempo terminado! Has hecho ${contadorRef.current} clics.`);
      guardarResultado(contadorRef.current);
      contadorRef.current = 0;
    }, 5000);
  }

  const cambiarDialog = (texto) => {
    document.getElementById('cuentaRegresivaTexto').textContent = texto;
    document.getElementById('popUpCuentaRegresiva').showModal();
  }

  const incrementar = () => {
    setCount(valorAnterior => valorAnterior + 1)
    contadorRef.current += 1;
  };

  const cuentaRegresiva = () => {
    cambiarDialog("Preparados...");
    setTimeout(() => cambiarDialog("Listos..."), 1000);
    setTimeout(() => cambiarDialog("YA!!"), 2000);
    setTimeout(() => document.getElementById('popUpCuentaRegresiva').close(), 3000);    
    setTimeout(() => habilitarContador(), 3000);
  }

  return (
    <>
      <section id="center">
        <div className ="contenedorTexto">
          <h1>Presioná el botón lo máximo que puedas!</h1>
          <h2>Atención: solo tendrás 5 segundos</h2>
        </div>

        <dialog id="popUpCuentaRegresiva"><p id="cuentaRegresivaTexto"></p></dialog>

        <button className="botonInicio" onClick={() => cuentaRegresiva()} > Iniciar </button>
        <button className="botonContador" onClick={incrementar} disabled={deshabilitado}>CLICKEA AQUÍ! </button>
        <p>Contador: {count}</p>
        <p>Puntaje máximo: {resultadoMayor}</p>
        <p>Tiempo restante: {tiempoRestante}s</p>
      </section>
    </>
  )
}

export default App
