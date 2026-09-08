import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout type={user?.accountType === 'college' ? 'college' : 'school'}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="text-text-muted">This feature requires configuration.</p>
      </div>
    </DashboardLayout>
  );
}
