import { useState, useRef, useCallback, useEffect } from 'react'
import './JuegoContadorV2.css'

const GAME_DURATION = 5
const COUNTDOWN_STEPS = ['Preparados...', 'Listos...', '¡Ya!']

/* ------------------------------------------------
   Sub-componentes funcionales
   ------------------------------------------------ */

function CountdownOverlay({ message }) {
  return (
    <div className="juego-v2__countdown" role="alert" aria-live="assertive">
      <p className="juego-v2__countdown-text" key={message}>
        {message}
      </p>
    </div>
  )
}

function GameStats({ count, timeRemaining, maxScore, isPlaying }) {
  return (
    <>
      <div className="juego-v2__stats">
        <div className="juego-v2__stat">
          <span className="juego-v2__stat-label">Contador</span>
          <span className="juego-v2__stat-value">{count}</span>
        </div>

        <div className="juego-v2__stat">
          <span className="juego-v2__stat-label">Tiempo</span>
          <span className="juego-v2__stat-value">
            {isPlaying ? timeRemaining : GAME_DURATION}s
          </span>
        </div>

        <div className="juego-v2__stat juego-v2__stat--highlight">
          <span className="juego-v2__stat-label">Puntaje máximo</span>
          <span className="juego-v2__stat-value">{maxScore}</span>
        </div>
      </div>

      {isPlaying && (
        <div
          className="juego-v2__timebar"
          role="progressbar"
          aria-valuenow={timeRemaining}
          aria-valuemin={0}
          aria-valuemax={GAME_DURATION}
        >
          <div
            className="juego-v2__timebar-fill"
            style={{ width: `${(timeRemaining / GAME_DURATION) * 100}%` }}
          />
        </div>
      )}
    </>
  )
}

function ResultMessage({ result, isNewRecord }) {
  return (
    <div className="juego-v2__result" role="status">
      <p>
        ¡Tiempo terminado! Hiciste <strong>{result}</strong> clics.
      </p>
      {isNewRecord && <p className="juego-v2__new-record">🏆 ¡Nuevo récord!</p>}
    </div>
  )
}

/* ------------------------------------------------
   Componente principal
   ------------------------------------------------ */

function JuegoContadorV2() {
  const [gamePhase, setGamePhase] = useState('idle') // 'idle' | 'countdown' | 'playing'
  const [count, setCount] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [countdownMessage, setCountdownMessage] = useState('')
  const [lastResult, setLastResult] = useState(null)
  const [isNewRecord, setIsNewRecord] = useState(false)

  const countRef = useRef(0)
  const maxScoreRef = useRef(0)
  const timeoutIds = useRef([])
  const intervalId = useRef(null)

  const clearAllTimers = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout)
    if (intervalId.current !== null) {
      clearInterval(intervalId.current)
    }
    timeoutIds.current = []
    intervalId.current = null
  }, [])

  useEffect(() => {
    return clearAllTimers
  }, [clearAllTimers])

  const startGame = useCallback(() => {
    clearAllTimers()

    setCount(0)
    setLastResult(null)
    setIsNewRecord(false)
    countRef.current = 0
    setGamePhase('countdown')

    // Cuenta regresiva visual: "Preparados..." → "Listos..." → "¡Ya!"
    COUNTDOWN_STEPS.forEach((msg, i) => {
      const id = setTimeout(() => setCountdownMessage(msg), i * 1000)
      timeoutIds.current.push(id)
    })

    // Al terminar la cuenta regresiva, inicia la fase de juego
    const startPlayingId = setTimeout(() => {
      setGamePhase('playing')
      setTimeRemaining(GAME_DURATION)

      intervalId.current = setInterval(() => {
        setTimeRemaining((prev) => (prev <= 1 ? 0 : prev - 1))
      }, 1000)

      // Fin del juego tras GAME_DURATION segundos
      const endId = setTimeout(() => {
        if (intervalId.current !== null) {
          clearInterval(intervalId.current)
          intervalId.current = null
        }

        const finalCount = countRef.current
        const newRecord = finalCount > maxScoreRef.current

        if (newRecord) {
          maxScoreRef.current = finalCount
          setMaxScore(finalCount)
        }

        setLastResult(finalCount)
        setIsNewRecord(newRecord)
        setGamePhase('idle')
      }, GAME_DURATION * 1000)

      timeoutIds.current.push(endId)
    }, COUNTDOWN_STEPS.length * 1000)

    timeoutIds.current.push(startPlayingId)
  }, [clearAllTimers])

  const handleClick = useCallback(() => {
    setCount((prev) => prev + 1)
    countRef.current += 1
  }, [])

  const isIdle = gamePhase === 'idle'
  const isCountdown = gamePhase === 'countdown'
  const isPlaying = gamePhase === 'playing'

  return (
    <section className="juego-v2">
      <header className="juego-v2__header">
        <h1>¡Presioná el botón lo máximo que puedas!</h1>
        <h2>Atención: solo tendrás {GAME_DURATION} segundos</h2>
      </header>

      {isCountdown && <CountdownOverlay message={countdownMessage} />}

      <div className="juego-v2__controls">
        <button
          className="juego-v2__btn juego-v2__btn--inicio"
          onClick={startGame}
          disabled={!isIdle}
        >
          Iniciar
        </button>

        <button
          className="juego-v2__btn juego-v2__btn--click"
          onClick={handleClick}
          disabled={!isPlaying}
        >
          ¡CLICKEÁ AQUÍ!
        </button>
      </div>

      <GameStats
        count={count}
        timeRemaining={timeRemaining}
        maxScore={maxScore}
        isPlaying={isPlaying}
      />

      {lastResult !== null && isIdle && (
        <ResultMessage result={lastResult} isNewRecord={isNewRecord} />
      )}
    </section>
  )
}

export default JuegoContadorV2
