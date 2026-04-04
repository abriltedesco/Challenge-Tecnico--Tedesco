import { useEffect, useRef, useState } from 'react'
import './JuegoContadorV3.css'

const GAME_SECONDS = 5
const COUNTDOWN_MESSAGES = ['Preparados', 'Listos', 'Ya']

function CountdownOverlay({ message }) {
  if (!message) {
    return null
  }

  return (
    <div className="juego-v3__countdown" aria-live="assertive" role="status">
      <p className="juego-v3__countdown-text">{message}</p>
    </div>
  )
}

function StatCard({ label, value, accent = false }) {
  return (
    <article className={`juego-v3__stat-card${accent ? ' juego-v3__stat-card--accent' : ''}`}>
      <span className="juego-v3__stat-label">{label}</span>
      <strong className="juego-v3__stat-value">{value}</strong>
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
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [countdownMessage, setCountdownMessage] = useState('')
  const [lastScore, setLastScore] = useState(null)
  const [hasNewRecord, setHasNewRecord] = useState(false)

  const countRef = useRef(0)
  const highScoreRef = useRef(0)
  const intervalRef = useRef(null)
  const timeoutIdsRef = useRef([])

  const clearTimers = () => {
    timeoutIdsRef.current.forEach(clearTimeout)
    timeoutIdsRef.current = []

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => clearTimers, [])

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
    setTimeRemaining(0)
    setLastScore(finalScore)
    setHasNewRecord(isRecord)
  }

  const startGame = () => {
    clearTimers()

    setPhase('countdown')
    setCount(0)
    setTimeRemaining(GAME_SECONDS)
    setCountdownMessage(COUNTDOWN_MESSAGES[0])
    setLastScore(null)
    setHasNewRecord(false)
    countRef.current = 0

    COUNTDOWN_MESSAGES.slice(1).forEach((message, index) => {
      const timeoutId = setTimeout(() => {
        setCountdownMessage(message)
      }, (index + 1) * 1000)

      timeoutIdsRef.current.push(timeoutId)
    })

    const startPlayingId = setTimeout(() => {
      setPhase('playing')

      intervalRef.current = setInterval(() => {
        setTimeRemaining((currentTime) => {
          if (currentTime <= 1) {
            return 0
          }

          return currentTime - 1
        })
      }, 1000)

      const hideCountdownId = setTimeout(() => {
        setCountdownMessage('')
      }, 700)

      const finishGameId = setTimeout(() => {
        finishGame()
      }, GAME_SECONDS * 1000)

      timeoutIdsRef.current.push(hideCountdownId, finishGameId)
    }, 2000)

    timeoutIdsRef.current.push(startPlayingId)
  }

  const handleCounterClick = () => {
    if (phase !== 'playing') {
      return
    }

    countRef.current += 1
    setCount((currentCount) => currentCount + 1)
  }

  const isIdle = phase === 'idle'
  const isPlaying = phase === 'playing'
  const progress = (timeRemaining / GAME_SECONDS) * 100

  return (
    <main className="juego-v3">
      <CountdownOverlay message={countdownMessage} />

      <header className="juego-v3__hero">
        <span className="juego-v3__eyebrow">JuegoContador V3</span>
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

          <button
            className="juego-v3__button juego-v3__button--click"
            disabled={!isPlaying}
            onClick={handleCounterClick}
            type="button"
          >
            Clickear
          </button>
        </div>

        <div className="juego-v3__stats" aria-label="Estadisticas de la partida">
          <StatCard label="Contador actual" value={count} />
          <StatCard label="Tiempo restante" value={`${timeRemaining}s`} />
          <StatCard accent label="Puntaje maximo" value={highScore} />
        </div>

        <div className="juego-v3__timeline" aria-hidden="true">
          <div className="juego-v3__timeline-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="juego-v3__status">
          {phase === 'countdown' && 'Cuenta regresiva en curso.'}
          {phase === 'playing' && 'Jugando: el boton de clics esta habilitado.'}
          {phase === 'idle' && 'Listo para iniciar una nueva partida.'}
        </p>
      </section>

      <ResultPanel isRecord={hasNewRecord} score={lastScore} />
    </main>
  )
}

export default JuegoContadorV3