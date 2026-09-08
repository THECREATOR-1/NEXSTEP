import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text mb-6">
            Your career shouldn't be a guess.
          </h1>
          <p className="text-xl text-text-muted mb-10">
            NEXSTEP helps students discover the right direction, build the right skills, and prove they're ready for what's next.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/login" className="px-8 py-4 bg-accent text-background font-semibold rounded-full hover:opacity-90 transition-opacity">
              Start Your Journey
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}