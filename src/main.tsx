import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ErrorBoundary from './utils/ErrorBoundary.tsx'
import App from './App.tsx'

function initTheme() {
  const root = document.documentElement
  const theme = localStorage.getItem("theme") ?? "system"

  if (theme === "dark") {
    root.classList.add("dark")
  } else if (theme === "light") {
    root.classList.remove("dark")
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    prefersDark ? root.classList.add("dark") : root.classList.remove("dark")
  }
}

initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)