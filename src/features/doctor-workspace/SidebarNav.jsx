import { Link, useNavigate } from '@tanstack/react-router'
import { BriefcaseMedical, LogOut } from 'lucide-react'
import { InitialsAvatar } from '../../components/domain'
import { clearSession } from '../../lib/auth/tokenStorage'
import { sidebarNavItems } from './navItems'
import { useDoctorWorkspace } from './workspaceContext'

function NavLink({ item, onNavigate, collapsed }) {
  return (
    <Link
      activeOptions={{ exact: Boolean(item.exact) }}
      activeProps={{ 'data-active': 'true' }}
      className="kb-tabs__item"
      onClick={onNavigate}
      title={item.label}
      to={item.to}
    >
      <item.icon aria-hidden="true" />
      {!collapsed ? <span>{item.label}</span> : null}
    </Link>
  )
}

export function SidebarNav({ onNavigate, collapsed = false }) {
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
        {sidebarNavItems.map((item) => (
          <NavLink
            collapsed={collapsed}
            item={item}
            key={item.to}
            onNavigate={onNavigate}
          />
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
