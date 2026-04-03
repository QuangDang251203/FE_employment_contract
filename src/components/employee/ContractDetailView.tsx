import React, { useState, useEffect } from 'react';

interface StaffDocument {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
}

interface ContractFile {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  signedAt: string;
}

interface ContractDetail {
  decisionNumber: string;
  decisionDate: string;
  staffFullName: string;
  dateOfBirth: string;
  soCCCD: string;
  dateIssued: string;
  issuingLocation: string;
  email: string;
  address: string;
  levelOfTraining: string;
  staffDocuments: StaffDocument[];
  startDate: string;
  probationDays: number;
  endDate: string;
  createdAt: string;
  branchName: string;
  jobPosition: string;
  salaryRank: string;
  level: string;
  percentageOfSalary: number;
  probationarySalary: number;
  status: string;
  contractFiles: ContractFile[];
}

interface ContractDetailViewProps {
  contractCode: string;
  onBack: () => void;
}

const ContractDetailView: React.FC<ContractDetailViewProps> = ({ contractCode, onBack }) => {
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContractDetail = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`http://localhost:8080/api/contracts/${contractCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch contract detail');
        }

        const apiResponse = await response.json();
        if (apiResponse.code === 'SUCCESS') {
          setContract(apiResponse.data);
        } else {
          throw new Error(apiResponse.message || 'Failed to fetch contract detail');
        }
      } catch (err) {
        console.error('Error fetching contract detail:', err);
        setError(err instanceof Error ? err.message : 'Error loading contract');
      } finally {
        setLoading(false);
      }
    };

    if (contractCode) {
      fetchContractDetail();
    }
  }, [contractCode]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  if (loading) {
    return (
      <section className="panel" style={{ padding: '32px', textAlign: 'center' }}>
        <div>Đang tải chi tiết hợp đồng...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ color: '#d32f2f' }}>Lỗi: {error}</div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onBack}
          style={{ marginTop: '16px' }}
        >
          ← Quay lại
        </button>
      </section>
    );
  }

  if (!contract) {
    return (
      <section className="panel" style={{ padding: '32px', textAlign: 'center' }}>
        <div>Không tìm thấy hợp đồng</div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onBack}
          style={{ marginTop: '16px' }}
        >
          ← Quay lại
        </button>
      </section>
    );
  }

  return (
    <section className="panel contract-detail-panel" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px' }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onBack}
          style={{ marginBottom: '16px' }}
        >
          ← Quay lại
        </button>
        <h2>Chi tiết hợp đồng thử việc - {contractCode}</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Trạng thái: <strong>{contract.status}</strong>
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left column - Thông tin quyết định */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Thông tin quyết định</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Số quyết định</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.decisionNumber}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Ngày quyết định</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{formatDate(contract.decisionDate)}</div>
            </div>
          </div>
        </div>

        {/* Right column - Thông tin nhân viên */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Thông tin nhân viên</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Họ và tên</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.staffFullName}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Email</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left column - Chứng minh thư/Căn cước */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Chứng minh thư / Căn cước công dân</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Số CCCD</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.soCCCD}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Ngày cấp</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{formatDate(contract.dateIssued)}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Nơi cấp</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.issuingLocation}</div>
            </div>
          </div>
        </div>

        {/* Right column - Địa chỉ & Đào tạo */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Thông tin khác</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Địa chỉ thường trú</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.address}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Ngày sinh</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{formatDate(contract.dateOfBirth)}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Trình độ đào tạo</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.levelOfTraining}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left column - Thông tin công việc */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Thông tin công việc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Đơn vị</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.branchName}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Chức vụ</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.jobPosition}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Ngạch lương</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.salaryRank}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Mức</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.level}</div>
            </div>
          </div>
        </div>

        {/* Right column - Thông tin lương */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Thông tin lương</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>% Lương chính thức</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.percentageOfSalary}%</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Lương thử việc</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{formatCurrency(contract.probationarySalary)}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left column - Ngày làm việc */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Thời gian thử việc</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Ngày bắt đầu</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{formatDate(contract.startDate)}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Số ngày thử việc</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{contract.probationDays} ngày</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Ngày kết thúc</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{formatDate(contract.endDate)}</div>
            </div>
          </div>
        </div>

        {/* Right column - Ngày tạo */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Lịch sử</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Ngày tạo</label>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>{formatDate(contract.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents section */}
      {(contract.staffDocuments.length > 0 || contract.contractFiles.length > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Tài liệu đính kèm</h3>
          
          {contract.contractFiles.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#333' }}>Hợp đồng</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {contract.contractFiles.map((file) => (
                  <li key={file.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontSize: '13px' }}>
                      📄 {file.fileName} ({file.fileType})
                    </span>
                    {file.signedAt && (
                      <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                        - Ký ngày: {formatDate(file.signedAt)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contract.staffDocuments.length > 0 && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#333' }}>Tài liệu nhân viên</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {contract.staffDocuments.map((doc) => (
                  <li key={doc.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontSize: '13px' }}>
                      📎 {doc.fileName}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', textAlign: 'center' }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onBack}
        >
          ← Quay lại danh sách
        </button>
      </div>
    </section>
  );
};

export default ContractDetailView;

