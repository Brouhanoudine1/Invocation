/**
 * Barre de filtres : moment (Matin / Soir / Tout) et favoris uniquement.
 * En mobile, elle se fixe en bas de l'écran.
 */
function FilterBar({
  filtreMoment,
  onChangerMoment,
  favorisUniquement,
  onBasculerFavoris,
  nombreVisible,
  nombreFavoris,
}) {
  const moments = [
    { id: 'matin', libelle: 'Matin' },
    { id: 'soir', libelle: 'Soir' },
    { id: 'tout', libelle: 'Tout' },
  ]

  return (
    <nav className="filtres" aria-label="Filtres des invocations">
      <div
        className="segmented segmented--large"
        role="tablist"
        aria-label="Filtrer par moment de la journée"
      >
        {moments.map((moment) => (
          <button
            key={moment.id}
            type="button"
            role="tab"
            className={`segmented__btn ${filtreMoment === moment.id ? 'is-active' : ''}`}
            aria-selected={filtreMoment === moment.id}
            aria-label={
              moment.id === 'tout'
                ? 'Afficher toutes les invocations'
                : `Afficher les invocations du ${moment.libelle.toLowerCase()}`
            }
            onClick={() => onChangerMoment(moment.id)}
          >
            {moment.libelle}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`btn-favoris-filtre ${favorisUniquement ? 'is-active' : ''}`}
        aria-pressed={favorisUniquement}
        aria-label="Afficher uniquement les invocations favorites"
        onClick={onBasculerFavoris}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill={favorisUniquement ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
          />
        </svg>
        <span>Favoris</span>
        <span className="btn-favoris-filtre__compte">{nombreFavoris}</span>
      </button>

      <p className="filtres__compte" aria-live="polite">
        {`${nombreVisible} invocation${nombreVisible > 1 ? 's' : ''}`}
      </p>
    </nav>
  )
}

export default FilterBar
