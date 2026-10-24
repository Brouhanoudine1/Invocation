import { useState } from 'react'

const RAYON = 20
const CIRCONFERENCE = 2 * Math.PI * RAYON

/**
 * Compteur de récitations avec anneau de progression SVG.
 * Un clic incrémente ; le bouton reset ramène à zéro.
 */
function Counter({ valeur, repetitions, onIncrementer, onReinitialiser, titre }) {
  const [pulse, setPulse] = useState(false)
  const progression = Math.min(valeur / Math.max(repetitions, 1), 1)
  const offset = CIRCONFERENCE * (1 - progression)
  const termine = valeur >= repetitions

  const gererClic = () => {
    if (termine) return
    setPulse(true)
    onIncrementer()
  }

  return (
    <div className="compteur">
      <button
        type="button"
        className={`compteur__anneau ${pulse ? 'is-pulse' : ''} ${termine ? 'is-done' : ''}`}
        onClick={gererClic}
        onAnimationEnd={() => setPulse(false)}
        aria-label={`Réciter « ${titre} » : ${valeur} sur ${repetitions}`}
        disabled={termine}
      >
        <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
          <circle className="compteur__piste" cx="24" cy="24" r={RAYON} />
          <circle
            className="compteur__remplissage"
            cx="24"
            cy="24"
            r={RAYON}
            strokeDasharray={CIRCONFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="compteur__valeur">
          {valeur}
          <small>/{repetitions}</small>
        </span>
      </button>

      <button
        type="button"
        className="btn-reset"
        onClick={onReinitialiser}
        disabled={valeur === 0}
        aria-label={`Remettre le compteur de « ${titre} » à zéro`}
      >
        Reset
      </button>
    </div>
  )
}

export default Counter
