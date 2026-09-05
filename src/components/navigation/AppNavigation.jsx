import { Menu } from '@base-ui/react/menu'
import { Link } from '@tanstack/react-router'
import {
  BriefcaseMedical,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Clock3,
  House,
  Stethoscope,
  UserRound,
} from 'lucide-react'

const navigationByMode = {
  visitor: [
    { label: 'Accueil', shortLabel: 'Accueil', to: '/', icon: House },
    {
      label: 'Médecins',
      shortLabel: 'Médecins',
      to: '/doctors',
      icon: Stethoscope,
    },
    {
      label: 'Cliniques',
      shortLabel: 'Cliniques',
      to: '/clinics',
      icon: Building2,
    },
  ],
  patient: [
    { label: 'Accueil', shortLabel: 'Accueil', to: '/', icon: House },
    {
      label: 'Médecins',
      shortLabel: 'Médecins',
      to: '/doctors',
      icon: Stethoscope,
    },
    {
      label: 'Mes rendez-vous',
      shortLabel: 'Rendez-vous',
      to: '/patient/appointments',
      icon: CalendarDays,
    },
  ],
  doctor: [
    {
      label: 'Tableau de bord',
      shortLabel: 'Accueil',
      to: '/doctor',
      icon: House,
    },
    {
      label: 'Agenda',
      shortLabel: 'Agenda',
      to: '/doctor/agenda',
      icon: CalendarDays,
    },
    {
      label: 'Demandes',
      shortLabel: 'Demandes',
      to: '/doctor/appointments',
      icon: ClipboardList,
    },
    {
      label: 'Disponibilités',
      shortLabel: 'Disponibilités',
      to: '/doctor/availability',
      icon: Clock3,
    },
  ],
}

function Brand() {
  return (
    <Link className="app-brand" to="/">
      <span className="app-brand__mark" aria-hidden="true">
        <BriefcaseMedical />
      </span>
      <span>Munganga</span>
    </Link>
  )
}

export function AccountMenu({
  mode = 'visitor',
  user,
  canSwitchWorkspace = false,
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
        <ChevronDown className="account-trigger__chevron" aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          className="ds-menu__positioner"
          align="end"
          sideOffset={8}
        >
          <Menu.Popup className="ds-menu__popup account-menu">
            {canSwitchWorkspace ? (
              <>
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
              </>
            ) : null}
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
  canSwitchWorkspace = false,
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
          canSwitchWorkspace={canSwitchWorkspace}
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
  canSwitchWorkspace = false,
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
          <UserRound aria-hidden="true" />
        </Link>
      ) : (
        <AccountMenu
          canSwitchWorkspace={canSwitchWorkspace}
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
      ? {
          label: 'Connexion',
          shortLabel: 'Compte',
          to: '/login',
          icon: UserRound,
        }
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
          <item.icon className="mobile-bottom-nav__icon" aria-hidden="true" />
          <small>{item.shortLabel}</small>
        </Link>
      ))}
    </nav>
  )
}
