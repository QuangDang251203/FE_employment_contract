const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export interface Branch {
  id: number;
  branchName: string;
}

export const branchService = {
  async getAllBranches(): Promise<Branch[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/branches/getAllBranches`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const branches: Branch[] = await response.json();
      return branches;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },
};

