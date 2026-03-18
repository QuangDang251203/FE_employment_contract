import React from 'react';

function TopHeader() {
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
        <button type="button" className="header-icon-button" aria-label="Thông báo">
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
        <button type="button" className="user-chip" aria-label="Tài khoản">
          <span className="avatar-placeholder" aria-hidden="true">
            A
          </span>
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
}

export default TopHeader;

