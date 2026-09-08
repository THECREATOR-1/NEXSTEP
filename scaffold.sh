#!/bin/bash
mkdir -p src/pages/school src/pages/college src/pages/auth src/pages/onboarding src/pages/common

touch src/pages/school/SchoolRoadmapPage.tsx
touch src/pages/school/SchoolAssessments.tsx
touch src/pages/school/SchoolLearning.tsx
touch src/pages/school/CollegeDetail.tsx
touch src/pages/school/CollegeCompare.tsx

touch src/pages/college/CollegeLearning.tsx
touch src/pages/college/InterviewReportPage.tsx
touch src/pages/college/CommunicationCoach.tsx
touch src/pages/college/CollegeProgress.tsx

touch src/pages/auth/SignupPage.tsx
touch src/pages/auth/ForgotPassword.tsx
touch src/pages/auth/AccountTypeSelection.tsx

touch src/pages/onboarding/SchoolOnboarding.tsx
touch src/pages/onboarding/CollegeOnboarding.tsx

touch src/pages/common/Profile.tsx
touch src/pages/common/Settings.tsx

for file in src/pages/school/SchoolRoadmapPage.tsx src/pages/school/SchoolAssessments.tsx src/pages/school/SchoolLearning.tsx src/pages/school/CollegeDetail.tsx src/pages/school/CollegeCompare.tsx src/pages/college/CollegeLearning.tsx src/pages/college/InterviewReportPage.tsx src/pages/college/CommunicationCoach.tsx src/pages/college/CollegeProgress.tsx src/pages/auth/SignupPage.tsx src/pages/auth/ForgotPassword.tsx src/pages/auth/AccountTypeSelection.tsx src/pages/onboarding/SchoolOnboarding.tsx src/pages/onboarding/CollegeOnboarding.tsx src/pages/common/Profile.tsx src/pages/common/Settings.tsx; do
  component_name=$(basename "$file" .tsx)
  cat << INNER_EOF > "$file"
import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function $component_name() {
  return (
    <DashboardLayout type="college">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">$component_name</h1>
        <p className="text-text-muted">This feature requires configuration.</p>
      </div>
    </DashboardLayout>
  );
}
INNER_EOF
done

# Fix layouts for non-dashboard pages
for file in src/pages/auth/SignupPage.tsx src/pages/auth/ForgotPassword.tsx src/pages/auth/AccountTypeSelection.tsx src/pages/onboarding/SchoolOnboarding.tsx src/pages/onboarding/CollegeOnboarding.tsx; do
  component_name=$(basename "$file" .tsx)
  cat << INNER_EOF > "$file"
import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';

export default function $component_name() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">$component_name</h1>
        <p className="text-text-muted">This feature requires configuration.</p>
      </div>
    </div>
  );
}
INNER_EOF
done

