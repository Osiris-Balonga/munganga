import { Menu } from '@base-ui/react/menu'
import { Link } from '@tanstack/react-router'

const navigationByMode = {
  visitor: [
    { label: 'Accueil', shortLabel: 'Accueil', to: '/', symbol: '⌂' },
    { label: 'Médecins', shortLabel: 'Médecins', to: '/doctors', symbol: '✚' },
    {
      label: 'Cliniques',
      shortLabel: 'Cliniques',
      to: '/clinics',
      symbol: '+',
    },
  ],
  patient: [
    { label: 'Accueil', shortLabel: 'Accueil', to: '/', symbol: '⌂' },
    { label: 'Médecins', shortLabel: 'Médecins', to: '/doctors', symbol: '✚' },
    {
      label: 'Mes rendez-vous',
      shortLabel: 'Rendez-vous',
      to: '/patient/appointments',
      symbol: '◷',
    },
  ],
  doctor: [
    {
      label: 'Agenda',
      shortLabel: 'Agenda',
      to: '/doctor/agenda',
      symbol: '▦',
    },
    {
      label: 'Demandes',
      shortLabel: 'Demandes',
      to: '/doctor/appointments',
      symbol: '◷',
    },
    {
      label: 'Disponibilités',
      shortLabel: 'Disponibilités',
      to: '/doctor/availability',
      symbol: '⊕',
    },
  ],
}

function Brand() {
  return (
    <Link className="app-brand" to="/">
      <span className="app-brand__mark" aria-hidden="true">
        +
      </span>
      <span>Munganga</span>
    </Link>
  )
}

export function AccountMenu({
  mode = 'visitor',
  user,
  onRoleSwitch,
  onLogout,
}) {
  if (mode === 'visitor') {
    return (
      <div className="visitor-actions">
        <Link className="nav-login" to="/login">
          Connexion
        </Link>
        <Link className="nav-register" to="/register">
          Créer un compte
        </Link>
      </div>
    )
  }

  const otherMode = mode === 'doctor' ? 'patient' : 'doctor'
  const otherModeLabel =
    mode === 'doctor' ? 'Passer en mode patient' : 'Passer en mode médecin'

  return (
    <Menu.Root>
      <Menu.Trigger className="account-trigger">
        <span className="account-trigger__avatar" aria-hidden="true">
          {user?.name?.[0] ?? 'M'}
        </span>
        <span className="account-trigger__copy">
          <strong>{user?.name ?? 'Mon compte'}</strong>
          <small>{mode === 'doctor' ? 'Mode médecin' : 'Mode patient'}</small>
        </span>
        <span aria-hidden="true">⌄</span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          className="ds-menu__positioner"
          align="end"
          sideOffset={8}
        >
          <Menu.Popup className="ds-menu__popup account-menu">
            <Menu.Group>
              <Menu.GroupLabel className="account-menu__label">
                Compte
              </Menu.GroupLabel>
              <Menu.Item
                className="ds-menu__item"
                onClick={() => onRoleSwitch?.(otherMode)}
              >
                {otherModeLabel}
              </Menu.Item>
            </Menu.Group>
            <Menu.Separator className="account-menu__separator" />
            <Menu.Item
              className="ds-menu__item ds-menu__item--danger"
              onClick={onLogout}
            >
              Se déconnecter
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export function DesktopHeader({
  mode = 'visitor',
  user,
  onRoleSwitch,
  onLogout,
}) {
  const items = navigationByMode[mode]

  return (
    <header className="desktop-header">
      <div className="desktop-header__inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navigation principale">
          {items.map((item) => (
            <Link
              activeOptions={{ exact: item.to === '/' }}
              activeProps={{ 'data-active': 'true' }}
              className="desktop-nav__link"
              key={item.to}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <AccountMenu
          mode={mode}
          onLogout={onLogout}
          onRoleSwitch={onRoleSwitch}
          user={user}
        />
      </div>
    </header>
  )
}

export function MobileTopBar({
  title,
  mode = 'visitor',
  user,
  onRoleSwitch,
  onLogout,
}) {
  return (
    <header className="mobile-topbar">
      {title ? <strong>{title}</strong> : <Brand />}
      {mode === 'visitor' ? (
        <Link
          className="mobile-account-link"
          to="/login"
          aria-label="Connexion"
        >
          <span aria-hidden="true">○</span>
        </Link>
      ) : (
        <AccountMenu
          mode={mode}
          onLogout={onLogout}
          onRoleSwitch={onRoleSwitch}
          user={user}
        />
      )}
    </header>
  )
}

export function MobileBottomNav({ mode = 'visitor' }) {
  const items = navigationByMode[mode]
  const accountItem =
    mode === 'visitor'
      ? { label: 'Connexion', shortLabel: 'Compte', to: '/login', symbol: '○' }
      : null
  const mobileItems = accountItem ? [...items, accountItem] : items

  return (
    <nav className="mobile-bottom-nav" aria-label="Navigation mobile">
      {mobileItems.map((item) => (
        <Link
          activeOptions={{ exact: item.to === '/' }}
          activeProps={{ 'data-active': 'true' }}
          className="mobile-bottom-nav__link"
          key={item.to}
          to={item.to}
        >
          <span aria-hidden="true">{item.symbol}</span>
          <small>{item.shortLabel}</small>
        </Link>
      ))}
    </nav>
  )
}
