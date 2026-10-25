/**
 * Pied de page : marque et mention de droits.
 */
function Footer() {
  const annee = new Date().getFullYear()

  return (
    <footer className="pied">
      <div className="pied__cadre">
        <div className="pied__ornement" aria-hidden="true">
          <span />
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M13.6 3.2a9 9 0 1 0 7.1 13.1A7.6 7.6 0 0 1 13.6 3.2z"
            />
          </svg>
          <span />
        </div>
        <p className="pied__marque">Brouhane-Adhkar</p>
        <p className="pied__droits">© {annee}. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer
