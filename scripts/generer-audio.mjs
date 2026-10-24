/**
 * Télécharge une voix arabe pour chaque invocation et l'enregistre dans public/audio/.
 * Les visiteurs du site n'ont rien à installer : le bouton Écouter lit ces fichiers.
 *
 * Usage : npm run audio
 */
import { access, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import invocations from '../src/data/invocations.json' with { type: 'json' }

const racine = join(dirname(fileURLToPath(import.meta.url)), '..')
const dossierAudio = join(racine, 'public', 'audio')
const MAX_CARACTERES = 170
const PAUSE_MS = 400
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function decouperTexte(texte, max = MAX_CARACTERES) {
  const propre = texte.replace(/\s+/g, ' ').trim()
  if (propre.length <= max) return [propre]

  const morceaux = []
  let restant = propre
  while (restant.length > max) {
    const tranche = restant.slice(0, max)
    const coupe = Math.max(
      tranche.lastIndexOf('،'),
      tranche.lastIndexOf('۝'),
      tranche.lastIndexOf('۔'),
      tranche.lastIndexOf('.'),
      tranche.lastIndexOf('؟'),
      tranche.lastIndexOf(' '),
    )
    const fin = coupe > 40 ? coupe + 1 : max
    morceaux.push(restant.slice(0, fin).trim())
    restant = restant.slice(fin).trim()
  }
  if (restant) morceaux.push(restant)
  return morceaux
}

async function telechargerMorceau(texte) {
  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=ar&q=${encodeURIComponent(texte)}`
  const reponse = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!reponse.ok) {
    throw new Error(`HTTP ${reponse.status} pour « ${texte.slice(0, 40)}… »`)
  }
  const tampon = Buffer.from(await reponse.arrayBuffer())
  if (tampon.length < 500) {
    throw new Error('Réponse audio trop courte')
  }
  return tampon
}

function attendre(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

await mkdir(dossierAudio, { recursive: true })

for (const invocation of invocations) {
  const fichier = join(dossierAudio, `${invocation.id}.mp3`)
  try {
    await access(fichier)
    console.log(`SKIP ${invocation.id}`)
    continue
  } catch {
    /* le fichier n'existe pas encore */
  }

  const morceaux = decouperTexte(invocation.arabe)
  const parties = []
  for (const [index, morceau] of morceaux.entries()) {
    parties.push(await telechargerMorceau(morceau))
    if (index < morceaux.length - 1) await attendre(PAUSE_MS)
  }
  await writeFile(fichier, Buffer.concat(parties))
  console.log(`OK  ${invocation.id} (${morceaux.length} segment${morceaux.length > 1 ? 's' : ''})`)
  await attendre(PAUSE_MS)
}

console.log(`Terminé : ${invocations.length} fichiers dans public/audio/`)
