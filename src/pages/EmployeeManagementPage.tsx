import React, { useState } from 'react';
import AddProbationContractForm from '../components/employee/AddProbationContractForm';
import ContractTable from '../components/employee/ContractTable';
import ViewContractDetail from '../components/employee/ViewContractDetail';
import UnitListPanel from '../components/employee/UnitListPanel';
import AppLayout from '../components/layout/AppLayout';

interface Props {
  onLogout?: () => void;
}

const EmployeeManagementPage: React.FC<Props> = ({ onLogout }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [viewingContractCode, setViewingContractCode] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | number>('all');

  const handleNavigation = (menuId: string, subMenuId?: string) => {
    // Handle navigation based on menu and submenu IDs
    if (menuId === 'hr' && subMenuId === 'probation') {
      // When clicking "Hợp đồng thử việc", show the contract list, not the form
      setIsCreating(false);
      setViewingContractCode(null);
    } else if (menuId === 'hr' && subMenuId === 'labor') {
      // Handle labor contract view
      setIsCreating(false);
      setViewingContractCode(null);
    }
  };

  return (
    <AppLayout onLogout={onLogout} onNavigate={handleNavigation}>
      {isCreating ? (
        <AddProbationContractForm onBack={() => setIsCreating(false)} />
      ) : viewingContractCode ? (
        <ViewContractDetail contractCode={viewingContractCode} onBack={() => setViewingContractCode(null)} />
      ) : (
        <div className="employee-dashboard-grid">
          <UnitListPanel onBranchSelect={setSelectedBranchId} />
          <ContractTable 
            onAddNew={() => setIsCreating(true)} 
            onViewContract={(contractCode) => setViewingContractCode(contractCode)}
            selectedBranchId={selectedBranchId} 
          />
        </div>
      )}
    </AppLayout>
  );
};

export default EmployeeManagementPage;
