import { Link, Outlet } from '@tanstack/react-router'

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">Munganga</Link>
        <nav aria-label="Navigation principale">
          <Link to="/doctors">Médecins</Link>
          <Link to="/clinics">Cliniques</Link>
          <Link to="/login">Connexion</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
