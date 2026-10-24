import { useCallback, useEffect, useMemo, useState } from 'react'
import invocations from './data/invocations.json'
import { useFavorites } from './hooks/useFavorites'
import { useHorsLigne } from './hooks/useHorsLigne'
import FilterBar from './components/FilterBar'
import Header from './components/Header'
import InvocationCard from './components/InvocationCard'
import Toast from './components/Toast'
import { enregistrerPwa } from './enregistrerPwa'
import { arreterSynthese } from './utils/syntheseVocale'

const CLE_THEME = 'adhkar-theme'

/** Détermine le thème initial : localStorage, sinon préférence système. */
function themeInitial() {
  try {
    const enregistre = window.localStorage.getItem(CLE_THEME)
    if (enregistre === 'clair' || enregistre === 'sombre') return enregistre
  } catch {
    /* stockage indisponible */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'sombre' : 'clair'
}

function App() {
  const [filtreMoment, setFiltreMoment] = useState('tout')
  const [favorisUniquement, setFavorisUniquement] = useState(false)
  const [langueAffichage, setLangueAffichage] = useState('both')
  const [theme, setTheme] = useState(themeInitial)
  const [compteurs, setCompteurs] = useState({})
  const [idEnLecture, setIdEnLecture] = useState(null)
  const syntheseDisponible = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [toast, setToast] = useState({ visible: false, message: '', duree: 2200 })

  const { favoris, estFavori, basculerFavori } = useFavorites()
  const horsLigne = useHorsLigne()

  // Applique le thème sur <html> pour colorer aussi la barre de défilement.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(CLE_THEME, theme)
  }, [theme])

  // Suit un changement de préférence système si l'utilisateur n'a pas encore choisi.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => {
      const enregistre = window.localStorage.getItem(CLE_THEME)
      if (enregistre !== 'clair' && enregistre !== 'sombre') {
        setTheme(event.matches ? 'sombre' : 'clair')
      }
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  // Précharge les voix et coupe le son si on quitte la page.
  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined
    window.speechSynthesis.getVoices()
    const onVoices = () => window.speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener('voiceschanged', onVoices)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
      arreterSynthese()
    }
  }, [])

  const invocationsFiltrees = useMemo(() => {
    return invocations.filter((invocation) => {
      const correspondMoment =
        filtreMoment === 'tout' || invocation.moments.includes(filtreMoment)
      const correspondFavori = !favorisUniquement || estFavori(invocation.id)
      return correspondMoment && correspondFavori
    })
  }, [filtreMoment, favorisUniquement, estFavori])

  const incrementer = (id) => {
    setCompteurs((actuel) => {
      const invocation = invocations.find((item) => item.id === id)
      const actuelValeur = actuel[id] ?? 0
      if (!invocation || actuelValeur >= invocation.repetitions) return actuel
      return { ...actuel, [id]: actuelValeur + 1 }
    })
  }

  const reinitialiser = (id) => {
    setCompteurs((actuel) => ({ ...actuel, [id]: 0 }))
  }

  const afficherToast = useCallback((message, duree = 2200) => {
    setToast({ visible: true, message, duree })
  }, [])

  const fermerToast = useCallback(() => {
    setToast((actuel) => ({ ...actuel, visible: false }))
  }, [])

  useEffect(() => {
    enregistrerPwa({
      onPretHorsLigne: () =>
        afficherToast('Adhkār est prêt à fonctionner hors ligne', 4000),
    })
  }, [afficherToast])

  const remonterEnHaut = () => {
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduit ? 'auto' : 'smooth' })
  }

  const changerMoment = (moment) => {
    arreterSynthese()
    setIdEnLecture(null)
    setFiltreMoment(moment)
    remonterEnHaut()
  }

  return (
    <div className="app">
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <Header
        langueAffichage={langueAffichage}
        onChangerLangue={setLangueAffichage}
        theme={theme}
        onBasculerTheme={() => setTheme((actuel) => (actuel === 'sombre' ? 'clair' : 'sombre'))}
        horsLigne={horsLigne}
      />

      <FilterBar
        filtreMoment={filtreMoment}
        onChangerMoment={changerMoment}
        favorisUniquement={favorisUniquement}
        onBasculerFavoris={() => {
          setFavorisUniquement((actuel) => !actuel)
          remonterEnHaut()
        }}
        nombreVisible={invocationsFiltrees.length}
        nombreFavoris={favoris.length}
      />

      <main id="contenu" className="contenu">
        {invocationsFiltrees.length === 0 ? (
          <p className="etat-vide">
            {favorisUniquement
              ? 'Aucun favori pour ce filtre. Touchez le cœur d’une invocation pour l’ajouter.'
              : 'Aucune invocation pour ce moment.'}
          </p>
        ) : (
          <div className="grille" key={`${filtreMoment}-${favorisUniquement}-${langueAffichage}`}>
            {invocationsFiltrees.map((invocation, index) => (
              <InvocationCard
                key={invocation.id}
                invocation={invocation}
                index={index}
                langueAffichage={langueAffichage}
                estFavori={estFavori(invocation.id)}
                onBasculerFavori={() => basculerFavori(invocation.id)}
                compteur={compteurs[invocation.id] ?? 0}
                onIncrementer={() => incrementer(invocation.id)}
                onReinitialiser={() => reinitialiser(invocation.id)}
                estEnLecture={idEnLecture === invocation.id}
                syntheseDisponible={syntheseDisponible}
                onDemarrerLecture={() => setIdEnLecture(invocation.id)}
                onTerminerLecture={() =>
                  setIdEnLecture((actuel) => (actuel === invocation.id ? null : actuel))
                }
                onToast={afficherToast}
              />
            ))}
          </div>
        )}
      </main>

      <Toast
        message={toast.message}
        visible={toast.visible}
        duree={toast.duree}
        onFermer={fermerToast}
      />
    </div>
  )
}

export default App
