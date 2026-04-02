import React, { useEffect, useId, useRef, useState } from 'react';

const notificationItems = [
  {
    id: 'noti-1',
    message: '[012903040] hợp đồng sẽ hết hạn sau 10 ngày nữa (10/04/2026)',
    time: '20/12/2022 • 10:12',
    unread: true,
  },
  {
    id: 'noti-2',
    message: 'Your Quote #1234 hes been approved',
    time: '20/12/2022 • 10:12',
    unread: false,
  },
  {
    id: 'noti-3',
    message: 'Your Quote #1234 hes been approved',
    time: '20/12/2022 • 10:12',
    unread: false,
    showImage: true,
  },
  {
    id: 'noti-4',
    message: 'Your Quote #1234 hes been approved',
    time: '20/12/2022 • 10:12',
    unread: false,
  },
  {
    id: 'noti-5',
    message: 'Your Quote #1234 hes been approved',
    time: '20/12/2022 • 10:12',
    unread: false,
  },
];

function TopHeader({ onLogout }: { onLogout?: () => void }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationPanelRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const notificationPanelId = useId();

  useEffect(() => {
    if (!isNotificationOpen) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        notificationPanelRef.current?.contains(target) ||
        notificationButtonRef.current?.contains(target)
      ) {
        return;
      }

      setIsNotificationOpen(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isNotificationOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (userMenuRef.current?.contains(target)) {
        return;
      }

      setIsUserMenuOpen(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
  };


  return (
    <header className="top-header">
      <div className="header-breadcrumb">
        Trang chủ / Quản lý nhân sự / <strong>Hợp đồng thử việc</strong>
      </div>
      <div className="header-actions">
        <div className="header-search">
          <span className="header-inline-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13.2 13.2L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <input type="search" placeholder="Tìm kiếm..." aria-label="Tìm kiếm" />
        </div>
        <div className="header-notification">
          <button
            ref={notificationButtonRef}
            type="button"
            className="header-icon-button"
            aria-label="Thông báo"
            aria-expanded={isNotificationOpen}
            aria-controls={notificationPanelId}
            onClick={() => setIsNotificationOpen((previousValue) => !previousValue)}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 3.2a4.2 4.2 0 00-4.2 4.2v2.5c0 .8-.3 1.6-.8 2.2l-.9 1.1h11.8l-.9-1.1a3.5 3.5 0 01-.8-2.2V7.4A4.2 4.2 0 0010 3.2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M8.4 15.2a1.8 1.8 0 003.2 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {isNotificationOpen && (
            <div
              id={notificationPanelId}
              ref={notificationPanelRef}
              className="notification-popup"
              role="dialog"
              aria-label="Danh sách thông báo"
            >
              <div className="notification-popup-header">
                <h3>Thông báo</h3>
                <button type="button" className="notification-read-all-button">
                  <span aria-hidden="true">✓✓</span> Đánh dấu tất cả đã đọc
                </button>
              </div>
              <div className="notification-popup-tabs" role="tablist" aria-label="Bộ lọc thông báo">
                <button type="button" className="notification-tab notification-tab-active" role="tab" aria-selected="true">
                  Tất cả <span className="notification-count notification-count-hot">25</span>
                </button>
                <button type="button" className="notification-tab" role="tab" aria-selected="false">
                  Chưa đọc <span className="notification-count">25</span>
                </button>
              </div>
              <div className="notification-popup-list">
                {notificationItems.map((item) => (
                  <article
                    key={item.id}
                    className={`notification-item${item.unread ? ' notification-item-unread' : ''}`}
                  >
                    <span className={`notification-dot${item.unread ? ' notification-dot-visible' : ''}`} aria-hidden="true" />
                    <span className="notification-item-icon" aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="none">
                        <rect x="4.5" y="3.8" width="11" height="12.4" rx="3" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M8 9h4M8 12.2h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div className="notification-item-content">
                      <p>{item.message}</p>
                      <span>{item.time}</span>
                      {item.showImage && <div className="notification-image-placeholder" aria-hidden="true" />}
                    </div>
                  </article>
                ))}
              </div>
              <div className="notification-popup-footer">
                <button type="button" className="notification-show-more">
                  Show more
                </button>
              </div>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className="user-chip"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            aria-label="Tài khoản"
          >
            <span className="avatar-placeholder" aria-hidden="true">
              A
            </span>
            <span>Admin</span>
          </button>
          {isUserMenuOpen && (
            <div ref={userMenuRef} className="user-menu-dropdown">
              <button 
                type="button" 
                className="user-menu-logout-btn"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopHeader;

