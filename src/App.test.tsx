import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders employee management layout', () => {
  render(<App />);
  expect(screen.getByLabelText(/điều hướng chính/i)).toBeInTheDocument();
  expect(screen.getAllByText(/hợp đồng thử việc/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('table')).toBeInTheDocument();
});

test('opens add probation contract form when clicking thêm mới', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
  expect(screen.getByLabelText(/thêm mới hợp đồng thử việc/i)).toBeInTheDocument();
  expect(screen.getByText(/thông tin người lao động/i)).toBeInTheDocument();
});

