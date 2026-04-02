import React, { useState, useEffect } from 'react';

interface Branch {
  id: number;
  branchName: string;
}

interface UnitItem {
  id: string | number;
  name: string;
}

interface UnitListPanelProps {
  onBranchSelect?: (branchId: string | number) => void;
}

function UnitListPanel({ onBranchSelect }: UnitListPanelProps) {
  const [units, setUnits] = useState<UnitItem[]>([
    { id: 'all', name: 'Tất cả' }
  ]);
  const [activeUnit, setActiveUnit] = useState<string | number>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/branches/getAllBranches');
        if (!response.ok) {
          throw new Error('Failed to fetch branches');
        }
        const branches: Branch[] = await response.json();
        
        // Create units array with "Tất cả" as first item
        const unitItems: UnitItem[] = [
          { id: 'all', name: 'Tất cả' },
          ...branches.map(branch => ({
            id: branch.id,
            name: branch.branchName
          }))
        ];
        
        setUnits(unitItems);
        setError('');
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Không thể tải danh sách đơn vị');
        // Keep the default "Tất cả" item if API fails
        setUnits([{ id: 'all', name: 'Tất cả' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleUnitClick = (unitId: string | number) => {
    setActiveUnit(unitId);
    onBranchSelect?.(unitId);
  };

  return (
    <section className="panel unit-panel" aria-label="Danh sách đơn vị">
      <header className="panel-header">
        <h2>Danh sách đơn vị</h2>
      </header>
      <div className="panel-search">
        <input type="text" placeholder="Tìm kiếm" aria-label="Tìm kiếm đơn vị" />
      </div>
      <div className="unit-list" role="listbox" aria-label="Danh sách chi nhánh">
        {loading ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
            Đang tải...
          </div>
        ) : error ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#d32f2f' }}>
            {error}
          </div>
        ) : (
          units.map((unit) => (
            <button
              key={unit.id}
              type="button"
              className={`unit-item ${activeUnit === unit.id ? 'unit-item-active' : ''}`}
              aria-selected={activeUnit === unit.id}
              onClick={() => handleUnitClick(unit.id)}
            >
              {unit.name}
            </button>
          ))
        )}
      </div>
    </section>
  );
}

export default UnitListPanel;

