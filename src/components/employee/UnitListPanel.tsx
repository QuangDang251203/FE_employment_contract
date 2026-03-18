import React from 'react';
import { units } from '../../data/employeeDashboardData';

function UnitListPanel() {
  return (
    <section className="panel unit-panel" aria-label="Danh sách đơn vị">
      <header className="panel-header">
        <h2>Danh sách đơn vị</h2>
      </header>
      <div className="panel-search">
        <input type="text" placeholder="Tìm kiếm" aria-label="Tìm kiếm đơn vị" />
      </div>
      <div className="unit-list" role="listbox" aria-label="Danh sách chi nhánh">
        {units.map((unit, index) => (
          <button
            key={unit.id}
            type="button"
            className={`unit-item ${index === 0 ? 'unit-item-active' : ''}`}
            aria-selected={index === 0}
          >
            {unit.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default UnitListPanel;

