import { useEffect, useRef, useState } from 'react'
import './JuegoContadorV3.css'

const GAME_SECONDS = 5
const COUNTDOWN_MESSAGES = ['Preparados', 'Listos', 'Ya']

function CountdownOverlay({ message, phaseClass }) {
  if (!message) {
    return null
  }

  return (
    <div className={`juego-v3__countdown juego-v3__countdown--${phaseClass}`} aria-live="assertive" role="status">
      <div className="juego-v3__countdown-backdrop" />
      <div className="juego-v3__countdown-ring" />
      <div className="juego-v3__countdown-content">
        <p className="juego-v3__countdown-text">{message}</p>
        <span className="juego-v3__countdown-subtext">Preparando la partida...</span>
      </div>
    </div>
  )
}

function FloatingScore({ id, x, y }) {
  return (
    <span className="juego-v3__floating-score" key={id} style={{ left: x, top: y }}>
      +1
    </span>
  )
}

function StatCard({ label, value, accent = false, urgent = false }) {
  return (
    <article className={`juego-v3__stat-card${accent ? ' juego-v3__stat-card--accent' : ''}${urgent ? ' juego-v3__stat-card--urgent' : ''}`}>
      <span className="juego-v3__stat-label">{label}</span>
      <strong className={`juego-v3__stat-value${urgent ? ' juego-v3__stat-value--urgent' : ''}`}>{value}</strong>
    </article>
  )
}

function ResultPanel({ score, isRecord }) {
  if (score === null) {
    return null
  }

  return (
    <section className="juego-v3__result" aria-live="polite">
      <p>Tiempo terminado. Hiciste {score} clics.</p>
      <p className="juego-v3__result-detail">
        {isRecord ? 'Nuevo puntaje maximo alcanzado.' : 'Intentalo otra vez para superar tu mejor marca.'}
      </p>
    </section>
  )
}

function JuegoContadorV3() {
  const [phase, setPhase] = useState('idle')
  const [count, setCount] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(GAME_SECONDS)
  const [countdownMessage, setCountdownMessage] = useState('')
  const [countdownPhase, setCountdownPhase] = useState('ready')
  const [lastScore, setLastScore] = useState(null)
  const [hasNewRecord, setHasNewRecord] = useState(false)
  const [floatingScores, setFloatingScores] = useState([])

  const countRef = useRef(0)
  const highScoreRef = useRef(0)
  const intervalRef = useRef(null)
  const timeoutIdsRef = useRef([])
  const floatingIdRef = useRef(0)

  const clearTimers = () => {
    timeoutIdsRef.current.forEach(clearTimeout)
    timeoutIdsRef.current = []

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => clearTimers, [])

  // Crea y elimina el +1 flotante asociado a cada click sin tocar la logica del puntaje.
  const spawnFloatingScore = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const nextId = floatingIdRef.current + 1
    const nextFloatingScore = {
      id: nextId,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    }

    floatingIdRef.current = nextId
    setFloatingScores((currentScores) => [...currentScores, nextFloatingScore])

    const removeFloatingScoreId = setTimeout(() => {
      setFloatingScores((currentScores) => currentScores.filter((score) => score.id !== nextId))
    }, 700)

    timeoutIdsRef.current.push(removeFloatingScoreId)
  }

  const finishGame = () => {
    clearTimers()

    const finalScore = countRef.current
    const isRecord = finalScore > highScoreRef.current

    if (isRecord) {
      highScoreRef.current = finalScore
      setHighScore(finalScore)
    }

    setPhase('idle')
    setCountdownMessage('')
    setCountdownPhase('ready')
    setTimeRemaining(GAME_SECONDS)
    setLastScore(finalScore)
    setHasNewRecord(isRecord)
  }

  // La partida recien empieza cuando la cuenta regresiva termina por completo.
  const startGame = () => {
    clearTimers()

    setPhase('countdown')
    setCount(0)
    setTimeRemaining(GAME_SECONDS)
    setCountdownMessage(COUNTDOWN_MESSAGES[0])
    setCountdownPhase('ready')
    setLastScore(null)
    setHasNewRecord(false)
    setFloatingScores([])
    countRef.current = 0

    COUNTDOWN_MESSAGES.slice(1).forEach((message, index) => {
      const timeoutId = setTimeout(() => {
        setCountdownMessage(message)
        setCountdownPhase(index === 0 ? 'set' : 'go')
      }, (index + 1) * 1000)

      timeoutIdsRef.current.push(timeoutId)
    })

    const startPlayingId = setTimeout(() => {
      setCountdownMessage('')
      setPhase('playing')

      intervalRef.current = setInterval(() => {
        setTimeRemaining((currentTime) => {
          if (currentTime <= 1) {
            return 0
          }

          return currentTime - 1
        })
      }, 1000)

      const finishGameId = setTimeout(() => {
        finishGame()
      }, GAME_SECONDS * 1000)

      timeoutIdsRef.current.push(finishGameId)
    }, COUNTDOWN_MESSAGES.length * 1000)

    timeoutIdsRef.current.push(startPlayingId)
  }

  // El click solo suma durante la fase de juego y genera feedback inmediato en el punto exacto del click.
  const handleCounterClick = (event) => {
    if (phase !== 'playing') {
      return
    }

    spawnFloatingScore(event)
    countRef.current += 1
    setCount((currentCount) => currentCount + 1)
  }

  const isIdle = phase === 'idle'
  const isPlaying = phase === 'playing'
  const isUrgent = isPlaying && timeRemaining <= 2
  const progress = (timeRemaining / GAME_SECONDS) * 100

  return (
    <main className="juego-v3">
      <CountdownOverlay message={countdownMessage} phaseClass={countdownPhase} />

      <header className="juego-v3__hero">
        <h1>Hace la mayor cantidad de clics en cinco segundos</h1>
        <p>
          Iniciá la partida, esperá la cuenta regresiva y aprovechá la ventana exacta de juego para
          romper tu puntaje máximo.
        </p>
      </header>

      <section className="juego-v3__board" aria-label="Panel del juego">
        <div className="juego-v3__controls">
          <button
            className="juego-v3__button juego-v3__button--start"
            disabled={!isIdle}
            onClick={startGame}
            type="button"
          >
            Iniciar juego
          </button>

          <div className="juego-v3__click-zone">
            {floatingScores.map((score) => (
              <FloatingScore id={score.id} key={score.id} x={score.x} y={score.y} />
            ))}

            <button
              className={`juego-v3__button juego-v3__button--click${isPlaying ? ' juego-v3__button--click-live' : ''}`}
              disabled={!isPlaying}
              onClick={handleCounterClick}
              type="button"
            >
              Clickear
            </button>
          </div>
        </div>

        <div className="juego-v3__stats" aria-label="Estadisticas de la partida">
          <StatCard label="Contador actual" value={count} />
          <StatCard label="Tiempo restante" urgent={isUrgent} value={`${timeRemaining}s`} />
          <StatCard accent label="Puntaje maximo" value={highScore} />
        </div>

        <div className="juego-v3__timeline" aria-hidden="true">
          <div className={`juego-v3__timeline-fill${isUrgent ? ' juego-v3__timeline-fill--urgent' : ''}`} style={{ width: `${progress}%` }} />
        </div>
      </section>

      <ResultPanel isRecord={hasNewRecord} score={lastScore} />
    </main>
  )
}

export default JuegoContadorV3