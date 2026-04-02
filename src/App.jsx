import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const habilitarContador = () => {
    const botonContador = document.querySelector('.botonContador');
    botonContador.disabled = false;
    setTimeout(() => {
      botonContador.disabled = true;
      alert(`¡Tiempo terminado! Has hecho ${count} clics.`);
    }, 5000);
  }

  const cambiarDialog = (texto) => {
    document.getElementById('cuentaRegresivaTexto').textContent = texto;
    document.getElementById('popUpCuentaRegresiva').showModal();
  }

  const incrementar = () => {
    setCount(count + 1);
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
        <button className="botonContador" onClick={incrementar} disabled>
         Clickea {count}
        </button>
      </section>
    </>
  )
}

export default App
