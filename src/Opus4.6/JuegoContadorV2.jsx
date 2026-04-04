import { useState, useRef, useCallback, useEffect } from 'react'
import './JuegoContadorV2.css'

const GAME_DURATION = 5
const COUNTDOWN_STEPS = ['Preparados...', 'Listos...', '¡YA!']

/* ------------------------------------------------
   Sub-componentes funcionales
   ------------------------------------------------ */

function CountdownOverlay({ message, step }) {
  if (!message) return null

  return (
    <div className="jv2-overlay" role="alert" aria-live="assertive">
      <div className="jv2-overlay__ring" />
      <p className={`jv2-overlay__text jv2-overlay__text--step${step}`} key={message}>
        {message}
      </p>
    </div>
  )
}

function FloatingPoint({ x, y, id }) {
  return (
    <span
      className="jv2-float-point"
      key={id}
      style={{ left: x, top: y }}
    >
      +1
    </span>
  )
}

function GameStats({ count, timeRemaining, maxScore, isPlaying, isUrgent }) {
  const timeClass = [
    'jv2-stat__value',
    isUrgent ? 'jv2-stat__value--urgent' : '',
  ].join(' ')

  return (
    <div className="jv2-stats">
      <div className="jv2-stat">
        <span className="jv2-stat__label">Clicks</span>
        <span className="jv2-stat__value">{count}</span>
      </div>

      <div className="jv2-stat jv2-stat--time">
        <span className="jv2-stat__label">Tiempo</span>
        <span className={timeClass}>
          {isPlaying ? timeRemaining : GAME_DURATION}s
        </span>
      </div>

      <div className="jv2-stat jv2-stat--highlight">
        <span className="jv2-stat__label">Récord</span>
        <span className="jv2-stat__value">{maxScore}</span>
      </div>
    </div>
  )
}

function TimeBar({ timeRemaining, isUrgent }) {
  const pct = (timeRemaining / GAME_DURATION) * 100

  return (
    <div className="jv2-timebar" role="progressbar" aria-valuenow={timeRemaining} aria-valuemin={0} aria-valuemax={GAME_DURATION}>
      <div
        className={`jv2-timebar__fill${isUrgent ? ' jv2-timebar__fill--urgent' : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function ResultMessage({ result, isNewRecord }) {
  if (result === null) return null

  return (
    <div className="jv2-result" role="status">
      <p className="jv2-result__score">
        ¡Tiempo terminado! Hiciste <strong>{result}</strong> clics.
      </p>
      {isNewRecord && <p className="jv2-result__record">🏆 ¡Nuevo récord!</p>}
    </div>
  )
}

/* ------------------------------------------------
   Componente principal
   ------------------------------------------------ */

function JuegoContadorV2() {
  const [gamePhase, setGamePhase] = useState('idle')
  const [count, setCount] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [countdownMessage, setCountdownMessage] = useState('')
  const [countdownStep, setCountdownStep] = useState(0)
  const [lastResult, setLastResult] = useState(null)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [floatingPoints, setFloatingPoints] = useState([])

  const countRef = useRef(0)
  const maxScoreRef = useRef(0)
  const timeoutIds = useRef([])
  const intervalId = useRef(null)
  const floatId = useRef(0)
  const btnAreaRef = useRef(null)

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

  // Limpieza automática de +1 flotantes tras su animación (600ms)
  useEffect(() => {
    if (floatingPoints.length === 0) return

    const cleanupId = setTimeout(() => {
      setFloatingPoints((prev) => prev.slice(1))
    }, 600)

    return () => clearTimeout(cleanupId)
  }, [floatingPoints])

  const startGame = useCallback(() => {
    clearAllTimers()

    setCount(0)
    setLastResult(null)
    setIsNewRecord(false)
    setFloatingPoints([])
    countRef.current = 0
    setGamePhase('countdown')

    // Cuenta regresiva dramática: cada paso con índice para estilo diferente
    COUNTDOWN_STEPS.forEach((msg, i) => {
      const id = setTimeout(() => {
        setCountdownMessage(msg)
        setCountdownStep(i)
      }, i * 1200)
      timeoutIds.current.push(id)
    })

    // Al terminar toda la cuenta regresiva (3 pasos × 1200ms = 3600ms), inicia el juego
    const totalCountdownMs = COUNTDOWN_STEPS.length * 1200
    const startPlayingId = setTimeout(() => {
      setCountdownMessage('')
      setGamePhase('playing')
      setTimeRemaining(GAME_DURATION)

      intervalId.current = setInterval(() => {
        setTimeRemaining((prev) => (prev <= 1 ? 0 : prev - 1))
      }, 1000)

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
    }, totalCountdownMs)

    timeoutIds.current.push(startPlayingId)
  }, [clearAllTimers])

  const handleClick = useCallback((e) => {
    countRef.current += 1
    setCount((prev) => prev + 1)

    // Posición del +1 relativa al contenedor del botón
    const rect = btnAreaRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      floatId.current += 1
      setFloatingPoints((prev) => [...prev, { id: floatId.current, x, y }])
    }
  }, [])

  const isIdle = gamePhase === 'idle'
  const isCountdown = gamePhase === 'countdown'
  const isPlaying = gamePhase === 'playing'
  const isUrgent = isPlaying && timeRemaining <= 2

  return (
    <section className="jv2">
      <header className="jv2__header">
        <h1>¡Presioná el botón lo máximo que puedas!</h1>
        <h2>Tenés {GAME_DURATION} segundos. ¿Cuántos clics podés hacer?</h2>
      </header>

      <CountdownOverlay message={countdownMessage} step={countdownStep} />

      <div className="jv2__controls">
        <button
          className="jv2__btn jv2__btn--start"
          onClick={startGame}
          disabled={!isIdle}
        >
          {lastResult !== null ? '↻ Reintentar' : '▶ Iniciar'}
        </button>

        <div className="jv2__click-area" ref={btnAreaRef}>
          {floatingPoints.map((fp) => (
            <FloatingPoint key={fp.id} id={fp.id} x={fp.x} y={fp.y} />
          ))}

          <button
            className={`jv2__btn jv2__btn--click${isPlaying ? ' jv2__btn--active' : ''}`}
            onClick={handleClick}
            disabled={!isPlaying}
          >
            {isPlaying ? '¡CLICK!' : isCountdown ? '...' : '¡CLICK!'}
          </button>
        </div>
      </div>

      <GameStats
        count={count}
        timeRemaining={timeRemaining}
        maxScore={maxScore}
        isPlaying={isPlaying}
        isUrgent={isUrgent}
      />

      {isPlaying && <TimeBar timeRemaining={timeRemaining} isUrgent={isUrgent} />}

      {lastResult !== null && isIdle && (
        <ResultMessage result={lastResult} isNewRecord={isNewRecord} />
      )}
    </section>
  )
}

export default JuegoContadorV2
