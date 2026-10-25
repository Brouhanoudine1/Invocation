/**
 * En-tête sticky : marque, bascule de langue et bascule de thème.
 */
function Header({ langueAffichage, onChangerLangue, theme, onBasculerTheme, horsLigne }) {
  const langues = [
    { id: 'ar', libelle: 'AR', aria: 'Afficher uniquement le texte arabe' },
    { id: 'fr', libelle: 'FR', aria: 'Afficher uniquement la traduction française' },
    { id: 'both', libelle: 'AR+FR', aria: 'Afficher le texte arabe et la traduction' },
  ]

  const estSombre = theme === 'sombre'

  return (
    <header className="entete">
      <div className="entete__cadre">
        <div className="entete__marque">
          <span className="entete__icone" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <path
                fill="currentColor"
                d="M18.2 4.2a12 12 0 1 0 9.4 17.4 10.2 10.2 0 0 1-9.4-17.4z"
              />
              <circle cx="24.4" cy="8.2" r="1.5" fill="currentColor" />
            </svg>
          </span>
          <div className="entete__textes">
            <h1 className="entete__titre">Adhkār</h1>
            <p className="entete__sous-titre">Invocations du matin et du soir</p>
          </div>
        </div>

        <div className="entete__actions">
          {horsLigne ? (
            <span className="badge-hors-ligne" role="status">
              Hors ligne
            </span>
          ) : null}

          <div className="segmented" role="group" aria-label="Langue d'affichage du texte">
            {langues.map((langue) => (
              <button
                key={langue.id}
                type="button"
                className={`segmented__btn ${langueAffichage === langue.id ? 'is-active' : ''}`}
                aria-pressed={langueAffichage === langue.id}
                aria-label={langue.aria}
                onClick={() => onChangerLangue(langue.id)}
              >
                {langue.libelle}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-icone"
            onClick={onBasculerTheme}
            aria-label={estSombre ? 'Activer le mode clair' : 'Activer le mode sombre'}
            title={estSombre ? 'Mode clair' : 'Mode sombre'}
          >
            {estSombre ? (
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zm0-16a1 1 0 0 1-1-1V4a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zm10 7h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2zM4 13H3a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2zm14.95 6.36-.7-.7a1 1 0 0 1 1.41-1.42l.7.71a1 1 0 0 1-1.41 1.41zM5.34 6.76l-.7-.71A1 1 0 0 1 6.05 4.64l.7.7A1 1 0 1 1 5.34 6.76zm13.61-2.12-.7.7a1 1 0 0 1-1.41-1.41l.7-.71a1 1 0 1 1 1.41 1.42zM5.34 17.24a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41l.7-.71a1 1 0 1 1 1.42 1.41l-.71.71z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21 14.3A9 9 0 0 1 9.7 3 7.2 7.2 0 1 0 21 14.3z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
