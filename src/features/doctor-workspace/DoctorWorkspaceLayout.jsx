import { Menu } from '@base-ui/react/menu'
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import {
  Bell,
  BriefcaseMedical,
  CalendarDays,
  ChevronDown,
  Clock3,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Users,
  ClipboardList,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../design-system'
import { InitialsAvatar } from '../../components/domain'
import { clearSession } from '../../lib/auth/tokenStorage'
import { DoctorWorkspaceProvider, useDoctorWorkspace } from './workspaceContext'
import './doctor-workspace.css'
import './mboka-theme.css'

const navItems = [
  {
    label: 'Tableau de bord',
    to: '/doctor',
    icon: LayoutDashboard,
    exact: true,
  },
  { label: 'Rendez-vous', to: '/doctor/appointments', icon: ClipboardList },
  { label: 'Agenda', to: '/doctor/agenda', icon: CalendarDays },
  { label: 'Patients', to: '/doctor/patients', icon: Users },
  { label: 'Disponibilités', to: '/doctor/availability', icon: Clock3 },
]

function Navigation({ onNavigate, collapsed }) {
  const { practitioner } = useDoctorWorkspace()
  const navigate = useNavigate()

  return (
    <>
      <Link className="dw-brand" onClick={onNavigate} to="/doctor">
        <span className="dw-brand__mark" aria-hidden="true">
          <BriefcaseMedical />
        </span>
        {!collapsed ? (
          <span>
            <strong>Munganga</strong>
            <small>Espace praticien</small>
          </span>
        ) : null}
      </Link>
      <nav className="kb-tabs" aria-label="Espace praticien">
        {navItems.map((item) => (
          <Link
            activeOptions={{ exact: Boolean(item.exact) }}
            activeProps={{ 'data-active': 'true' }}
            className="kb-tabs__item"
            key={item.to}
            onClick={onNavigate}
            title={item.label}
            to={item.to}
          >
            <item.icon aria-hidden="true" />
            {!collapsed ? <span>{item.label}</span> : null}
          </Link>
        ))}
      </nav>
      <div className="kb-side-user">
        <InitialsAvatar name={practitioner.title} size="sm" />
        {!collapsed ? (
          <span>
            <strong>
              {practitioner.firstName} {practitioner.lastName}
            </strong>
            <small>PRATICIEN</small>
          </span>
        ) : null}
        <button
          aria-label="Déconnexion"
          className="kb-side-logout"
          onClick={() => {
            clearSession()
            navigate({ to: '/' })
          }}
          type="button"
        >
          <LogOut aria-hidden="true" />
        </button>
      </div>
    </>
  )
}

function NotificationsBell() {
  const { notifications, markNotificationsRead } = useDoctorWorkspace()
  const unread = notifications.filter((item) => item.unread).length

  return (
    <Menu.Root onOpenChange={(open) => open && markNotificationsRead()}>
      <Menu.Trigger
        render={
          <button
            className="kb-iconbtn kb-bell"
            type="button"
            aria-label="Notifications"
          />
        }
      >
        <Bell aria-hidden="true" />
        {unread ? (
          <span className="dw-dot">{unread > 9 ? '9+' : unread}</span>
        ) : null}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          align="end"
          className="ds-menu__positioner"
          sideOffset={8}
        >
          <Menu.Popup className="ds-menu__popup dw-popover">
            <strong>Notifications</strong>
            {notifications.map((item) => (
              <div className="dw-notification" key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
                <small>{item.time}</small>
              </div>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

function PasswordDialog({ open, onClose }) {
  const { showToast } = useDoctorWorkspace()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  if (!open) return null

  return (
    <div className="kb-modal" role="dialog" aria-modal="true">
      <button
        aria-label="Fermer"
        className="kb-modal__backdrop"
        onClick={onClose}
        type="button"
      />
      <div className="kb-modal__panel">
        <header className="kb-modal__head">
          <div>
            <h2>Modifier le mot de passe</h2>
            <p>
              Choisissez un nouveau mot de passe pour votre compte praticien.
            </p>
          </div>
          <button
            aria-label="Fermer"
            className="kb-iconbtn"
            onClick={onClose}
            type="button"
          >
            <X />
          </button>
        </header>
        <form
          className="kb-password"
          onSubmit={(event) => {
            event.preventDefault()
            if (next.length < 8) {
              showToast('Le mot de passe doit contenir au moins 8 caractères.')
              return
            }
            if (next !== confirm) {
              showToast('La confirmation ne correspond pas.')
              return
            }
            showToast('Mot de passe mis à jour (démonstration).')
            setCurrent('')
            setNext('')
            setConfirm('')
            onClose()
          }}
        >
          <label>
            Mot de passe actuel
            <input
              autoComplete="current-password"
              onChange={(event) => setCurrent(event.target.value)}
              required
              type="password"
              value={current}
            />
          </label>
          <label>
            Nouveau mot de passe
            <input
              autoComplete="new-password"
              onChange={(event) => setNext(event.target.value)}
              required
              type="password"
              value={next}
            />
          </label>
          <label>
            Confirmer
            <input
              autoComplete="new-password"
              onChange={(event) => setConfirm(event.target.value)}
              required
              type="password"
              value={confirm}
            />
          </label>
          <div className="kb-modal__actions">
            <Button onClick={onClose} type="button" variant="secondary">
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function UserMenu({ onPassword }) {
  const { practitioner } = useDoctorWorkspace()
  const navigate = useNavigate()

  return (
    <Menu.Root>
      <Menu.Trigger render={<button className="kb-user" type="button" />}>
        <InitialsAvatar name={practitioner.title} size="sm" />
        <strong>
          {practitioner.firstName} {practitioner.lastName}
        </strong>
        <ChevronDown aria-hidden="true" size={16} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          align="end"
          className="ds-menu__positioner"
          sideOffset={8}
        >
          <Menu.Popup className="ds-menu__popup kb-user-menu">
            <div className="kb-user-menu__head">
              <strong>
                {practitioner.firstName} {practitioner.lastName}
              </strong>
              <small>{practitioner.email}</small>
            </div>
            <Menu.Item className="ds-menu__item" onClick={() => onPassword()}>
              <KeyRound aria-hidden="true" />
              Modifier le mot de passe
            </Menu.Item>
            <Menu.Item
              className="ds-menu__item ds-menu__item--danger"
              onClick={() => {
                clearSession()
                navigate({ to: '/' })
              }}
            >
              <LogOut aria-hidden="true" />
              Déconnexion
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

function WorkspaceFrame() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [passwordOpen, setPasswordOpen] = useState(false)
  const { toast } = useDoctorWorkspace()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <div className={`dw-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <aside className="dw-sidebar">
        <Navigation collapsed={collapsed} />
      </aside>
      <div className="dw-main">
        <header className="kb-topbar">
          <button
            aria-label="Ouvrir le menu"
            className="kb-iconbtn kb-menu-btn"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <MenuIcon aria-hidden="true" />
          </button>
          <button
            aria-label={
              collapsed
                ? 'Agrandir la barre latérale'
                : 'Réduire la barre latérale'
            }
            className="kb-iconbtn kb-collapse-btn"
            onClick={() => setCollapsed((value) => !value)}
            type="button"
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden="true" />
            ) : (
              <PanelLeftClose aria-hidden="true" />
            )}
          </button>
          <label className="kb-search">
            <Search aria-hidden="true" />
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un patient, un rendez-vous..."
              type="search"
              value={query}
            />
          </label>
          <div className="kb-topbar__right">
            <Link className="kb-ghost-btn" to="/doctor/agenda">
              <Monitor aria-hidden="true" size={14} />
              Voir l’agenda
            </Link>
            <NotificationsBell />
            <UserMenu onPassword={() => setPasswordOpen(true)} />
          </div>
        </header>
        <div className="dw-content">
          <Outlet />
        </div>
      </div>
      {menuOpen ? (
        <div className="dw-drawer">
          <button
            aria-label="Fermer le menu"
            className="dw-drawer__backdrop"
            onClick={() => setMenuOpen(false)}
            type="button"
          />
          <div className="dw-drawer__panel kb-drawer">
            <button
              aria-label="Fermer le menu"
              className="kb-iconbtn kb-drawer__close"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              <X />
            </button>
            <Navigation
              collapsed={false}
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
        </div>
      ) : null}
      <nav className="dw-bottom-nav" aria-label="Navigation rapide">
        {navItems.slice(0, 4).map((item) => (
          <Link
            activeOptions={{ exact: Boolean(item.exact) }}
            activeProps={{ 'data-active': 'true' }}
            key={item.to}
            to={item.to}
          >
            <item.icon aria-hidden="true" />
            <small>{item.label}</small>
          </Link>
        ))}
      </nav>
      <PasswordDialog
        onClose={() => setPasswordOpen(false)}
        open={passwordOpen}
      />
      {toast ? (
        <div className="dw-toast" role="status">
          {toast}
        </div>
      ) : null}
      <span className="sr-only">{pathname}</span>
    </div>
  )
}

export function DoctorWorkspaceLayout() {
  return (
    <DoctorWorkspaceProvider>
      <WorkspaceFrame />
    </DoctorWorkspaceProvider>
  )
}
