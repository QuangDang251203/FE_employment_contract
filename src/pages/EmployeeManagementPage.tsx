import React, { useState } from 'react';
import AddProbationContractForm from '../components/employee/AddProbationContractForm';
import ContractTable from '../components/employee/ContractTable';
import UnitListPanel from '../components/employee/UnitListPanel';
import AppLayout from '../components/layout/AppLayout';

interface Props {
  onLogout?: () => void;
}

const EmployeeManagementPage: React.FC<Props> = ({ onLogout }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | number>('all');

  const handleNavigation = (menuId: string, subMenuId?: string) => {
    // Handle navigation based on menu and submenu IDs
    if (menuId === 'hr' && subMenuId === 'probation') {
      // When clicking "Hợp đồng thử việc", show the contract list, not the form
      setIsCreating(false);
    } else if (menuId === 'hr' && subMenuId === 'labor') {
      // Handle labor contract view
      setIsCreating(false);
    }
  };

  return (
    <AppLayout onLogout={onLogout} onNavigate={handleNavigation}>
      {isCreating ? (
        <AddProbationContractForm onBack={() => setIsCreating(false)} />
      ) : (
        <div className="employee-dashboard-grid">
          <UnitListPanel onBranchSelect={setSelectedBranchId} />
          <ContractTable onAddNew={() => setIsCreating(true)} selectedBranchId={selectedBranchId} />
        </div>
      )}
    </AppLayout>
  );
};

export default EmployeeManagementPage;
