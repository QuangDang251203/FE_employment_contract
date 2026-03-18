import React, { useState } from 'react';
import AddProbationContractForm from '../components/employee/AddProbationContractForm';
import ContractTable from '../components/employee/ContractTable';
import UnitListPanel from '../components/employee/UnitListPanel';
import AppLayout from '../components/layout/AppLayout';

function EmployeeManagementPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <AppLayout>
      {isCreating ? (
        <AddProbationContractForm onBack={() => setIsCreating(false)} />
      ) : (
        <div className="employee-dashboard-grid">
          <UnitListPanel />
          <ContractTable onAddNew={() => setIsCreating(true)} />
        </div>
      )}
    </AppLayout>
  );
}

export default EmployeeManagementPage;
