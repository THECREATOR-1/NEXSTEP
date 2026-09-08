import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function CollegeProgress() {
  return (
    <DashboardLayout type="college">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">CollegeProgress</h1>
        <p className="text-text-muted">This feature requires configuration.</p>
      </div>
    </DashboardLayout>
  );
}
