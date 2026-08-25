import { Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function CodeExample({
  title = 'Exemple d’utilisation',
  code,
  language = 'jsx',
}) {
  const [copyState, setCopyState] = useState('idle')
  const resetTimer = useRef()

  useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current)
    },
    [],
  )

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }

    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), 2000)
  }

  const copyLabel =
    copyState === 'copied'
      ? 'Copié'
      : copyState === 'error'
        ? 'Copie impossible'
        : 'Copier'

  return (
    <figure className="code-example">
      <figcaption className="code-example__header">
        <span>
          <strong>{title}</strong>
          <small>{language}</small>
        </span>
        <button className="code-example__copy" onClick={copyCode} type="button">
          <Copy aria-hidden="true" />
          <span>{copyLabel}</span>
        </button>
      </figcaption>
      <pre className="code-example__pre" tabIndex="0">
        <code>{code}</code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {copyState === 'copied'
          ? 'Le code a été copié dans le presse-papiers.'
          : ''}
        {copyState === 'error' ? 'Le code n’a pas pu être copié.' : ''}
      </span>
    </figure>
  )
}
