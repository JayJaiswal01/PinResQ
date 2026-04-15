import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Home',    id: 'nav-home'    },
  { to: '/map',       icon: '🗺️',  label: 'Map',     id: 'nav-map'     },
  { to: '/rewards',   icon: '🎁',  label: 'Rewards', id: 'nav-rewards' },
  { to: '/profile',   icon: '👤',  label: 'Profile', id: 'nav-profile' },
];

export default function Navbar() {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map(({ to, icon, label, id }) => (
        <NavLink
          key={to}
          to={to}
          id={id}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item--active' : ''}`
          }
        >
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
