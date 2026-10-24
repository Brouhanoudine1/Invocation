import AudioButton from './AudioButton'
import Counter from './Counter'
import ShareButton from './ShareButton'

/**
 * Carte d'une invocation : textes, compteur, audio, partage et favori.
 * L'affichage AR / FR / AR+FR est piloté par langueAffichage.
 */
function InvocationCard({
  invocation,
  index,
  langueAffichage,
  estFavori,
  onBasculerFavori,
  compteur,
  onIncrementer,
  onReinitialiser,
  estEnLecture,
  syntheseDisponible,
  onDemarrerLecture,
  onTerminerLecture,
  onToast,
}) {
  const afficherArabe = langueAffichage === 'ar' || langueAffichage === 'both'
  const afficherFrancais = langueAffichage === 'fr' || langueAffichage === 'both'
  const libelleMoments = invocation.moments
    .map((moment) => (moment === 'matin' ? 'Matin' : 'Soir'))
    .join(' · ')

  return (
    <article
      className="carte"
      style={{ '--index': index }}
      aria-labelledby={`titre-${invocation.id}`}
    >
      <header className="carte__entete">
        <div>
          <h2 id={`titre-${invocation.id}`} className="carte__titre">
            {invocation.titre}
          </h2>
          <p className="carte__moments">{libelleMoments}</p>
        </div>

        <button
          type="button"
          className={`btn-coeur ${estFavori ? 'is-active' : ''}`}
          onClick={onBasculerFavori}
          aria-label={
            estFavori
              ? `Retirer « ${invocation.titre} » des favoris`
              : `Ajouter « ${invocation.titre} » aux favoris`
          }
          aria-pressed={estFavori}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              fill={estFavori ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
            />
          </svg>
        </button>
      </header>

      {afficherArabe && (
        <p className="carte__arabe" lang="ar" dir="rtl">
          {invocation.arabe}
        </p>
      )}

      {afficherArabe && invocation.translitteration && (
        <p className="carte__translit">{invocation.translitteration}</p>
      )}

      {afficherFrancais && (
        <p className="carte__traduction">{invocation.traduction_fr}</p>
      )}

      <p className="carte__source">
        <span className="carte__source-label">Source</span>
        {invocation.source}
      </p>

      <footer className="carte__actions">
        <Counter
          valeur={compteur}
          repetitions={invocation.repetitions}
          onIncrementer={onIncrementer}
          onReinitialiser={onReinitialiser}
          titre={invocation.titre}
        />
        <div className="carte__boutons">
          <AudioButton
            idInvocation={invocation.id}
            texteArabe={invocation.arabe}
            translitteration={invocation.translitteration}
            estEnLecture={estEnLecture}
            syntheseDisponible={syntheseDisponible}
            onDemarrer={onDemarrerLecture}
            onTerminer={onTerminerLecture}
            onToast={onToast}
          />
          <ShareButton invocation={invocation} onToast={onToast} />
        </div>
      </footer>
    </article>
  )
}

export default InvocationCard
