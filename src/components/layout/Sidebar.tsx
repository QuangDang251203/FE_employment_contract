import React from 'react';
import logo from '../../assets/images/agribank_logo.png';
import { sidebarMenu } from '../../data/employeeDashboardData';

const iconPathByMenuId: Record<string, string> = {
  home: 'M3 8.5L8 4l5 4.5V13H3z',
  personal: 'M8 8a2.2 2.2 0 100-4.4A2.2 2.2 0 008 8zm-3.8 5.4c.6-1.6 2.1-2.7 3.8-2.7s3.2 1.1 3.8 2.7',
  business: 'M3.5 13.5V4.5h9v9M6 13.5v-2.2m4-6.1h2.5v8.3H10m-3.8-6h1.6m-1.6 2h1.6m-1.6 2h1.6',
  hr: 'M3.8 12.8V4.2h8.4v8.6M6.2 6.6h3.6M6.2 8.7h3.6M6.2 10.8h2.2',
  documents: 'M4.2 2.8h5l2.6 2.6v7.8H4.2zM9.2 2.8v2.8H12',
  templates: 'M3.5 4.4h9v8.8h-9zM5.2 6.4h5.6M5.2 8.2h3.9M5.2 10h4.8',
  settings: 'M8 3.3v1.4m0 6.6v1.4M3.3 8h1.4m6.6 0h1.4M5 5l1 1m4 4l1 1m0-6l-1 1m-4 4l-1 1'
};

function SidebarIcon({ menuId }: { menuId: string }) {
  const path = iconPathByMenuId[menuId] ?? iconPathByMenuId.documents;
  return (
    <svg className="menu-icon-svg" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const dropdownIndicatorMenuIds = new Set(['personal', 'business', 'hr', 'settings']);

function DropdownChevron() {
  return (
    <span className="sidebar-chevron" aria-hidden="true">
      <svg className="sidebar-chevron-icon" viewBox="0 0 16 16" fill="none">
        <path d="M4.5 6.5L8 10l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Điều hướng chính">
      <div className="sidebar-brand">
        <img src={logo} alt="Agribank" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        {sidebarMenu.map((item) => (
          <div key={item.id}>
            <button className={`sidebar-item ${item.active ? 'sidebar-item-active' : ''}`} type="button">
              <SidebarIcon menuId={item.id} />
              <span>{item.label}</span>
              {dropdownIndicatorMenuIds.has(item.id) ? <DropdownChevron /> : null}
            </button>

            {item.expanded && item.children ? (
              <div className="sidebar-submenu">
                {item.children.map((subItem) => (
                  <button
                    key={subItem.id}
                    className={`sidebar-subitem ${subItem.active ? 'sidebar-subitem-active' : ''}`}
                    type="button"
                  >
                    <span className="submenu-icon" aria-hidden="true" />
                    {subItem.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
