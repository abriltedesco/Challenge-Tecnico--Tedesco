import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [deshabilitado, setDeshabilitado] = useState(true)
  const contadorRef = useRef(0)

  const habilitarContador = () => {   
    setDeshabilitado(false); 
    setTimeout(() => {
      setDeshabilitado(true);
      alert(`¡Tiempo terminado! Has hecho ${contadorRef.current} clics.`);
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
    setCount(0); 
    cambiarDialog("Preparados...");
    setTimeout(() => cambiarDialog("Listos..."), 1000);
    setTimeout(() => cambiarDialog("YA!!"), 2000);
    setTimeout(() => document.getElementById('popUpCuentaRegresiva').close(), 3000);    
    setTimeout(() => habilitarContador(), 3000);
  }

  return (
    <>
      <section id="center">
        <div>
          <h1>Presioná el botón lo máximo que puedas!</h1>
          <h2>Atención: solo tendrás 5 segundos</h2>
        </div>
        <dialog id="popUpCuentaRegresiva"><p id="cuentaRegresivaTexto"></p></dialog>
        <button className="botonInicio" onClick={() => cuentaRegresiva()} > Iniciar </button>
        <button className="botonContador" onClick={incrementar} disabled={deshabilitado}>
         Clickea {count}
        </button>
      </section>
    </>
  )
}

export default App
