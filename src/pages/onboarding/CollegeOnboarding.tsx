import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';

export default function CollegeOnboarding() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">CollegeOnboarding</h1>
        <p className="text-text-muted">This feature requires configuration.</p>
      </div>
    </div>
  );
}
