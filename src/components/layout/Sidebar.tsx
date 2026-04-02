import React, { useState } from 'react';
import logo from '../../assets/images/agribank_logo.png';
import homeIcon from '../../assets/icon/home.png';
import userIcon from '../../assets/icon/user.png';
import companyIcon from '../../assets/icon/company.png';
import settingIcon from '../../assets/icon/setting.png';
import documentIcon from '../../assets/icon/document.png';
import storageIcon from '../../assets/icon/storage.png';
import dropDownIcon from '../../assets/icon/drop_down.png';
import { sidebarMenu } from '../../data/employeeDashboardData';
import { SidebarMenuItem } from '../../types/employee';

const iconByMenuId: Record<string, string> = {
  home: homeIcon,
  personal: userIcon,
  business: companyIcon,
  hr: userIcon,
  documents: documentIcon,
  templates: storageIcon,
  settings: settingIcon,
};

function SidebarIcon({ menuId }: { menuId: string }) {
  const icon = iconByMenuId[menuId] || documentIcon;
  return <img src={icon} alt="" className="menu-icon" aria-hidden="true" />;
}

function DropdownChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <span className={`sidebar-chevron ${isOpen ? 'sidebar-chevron-open' : ''}`} aria-hidden="true">
      <img src={dropDownIcon} alt="" className="dropdown-icon" />
    </span>
  );
}

interface SidebarState {
  [key: string]: boolean;
}

interface SidebarProps {
  onNavigate?: (menuId: string, subMenuId?: string) => void;
}

function Sidebar({ onNavigate }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<SidebarState>({
    hr: true, // Keep hr expanded by default
  });

  const handleMenuClick = (menuId: string, hasChildren: boolean) => {
    if (hasChildren) {
      setExpandedMenus((prev) => ({
        ...prev,
        [menuId]: !prev[menuId],
      }));
    }
    // You can add navigation logic here if needed
  };

  const handleSubItemClick = (parentId: string, subItemId: string) => {
    if (onNavigate) {
      onNavigate(parentId, subItemId);
    }
  };

  return (
    <aside className="sidebar" aria-label="Điều hướng chính">
      <div className="sidebar-brand">
        <img src={logo} alt="Agribank" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        {sidebarMenu.map((item: SidebarMenuItem) => {
          const hasChildren = (item.children?.length ?? 0) > 0;
          const isExpanded = expandedMenus[item.id] || false;

          return (
            <div key={item.id}>
              <button
                className={`sidebar-item ${item.active ? 'sidebar-item-active' : ''}`}
                type="button"
                onClick={() => handleMenuClick(item.id, hasChildren)}
              >
                <SidebarIcon menuId={item.id} />
                <span>{item.label}</span>
                {hasChildren ? <DropdownChevron isOpen={isExpanded} /> : null}
              </button>

              {isExpanded && hasChildren ? (
                <div className="sidebar-submenu">
                  {item.children?.map((subItem: SidebarMenuItem) => (
                    <button
                      key={subItem.id}
                      className={`sidebar-subitem ${subItem.active ? 'sidebar-subitem-active' : ''}`}
                      type="button"
                      onClick={() => handleSubItemClick(item.id, subItem.id)}
                    >
                      <span className="submenu-icon" aria-hidden="true" />
                      {subItem.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
