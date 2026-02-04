// ============================================
// UNAUTHORIZED PAGE
// 403 Access Denied Page
// ============================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { QUOTES } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PersonaAvatar } from '@/components/shared/PersonaAvatar';
import { Button } from '@/components/ui/button';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <GlassPanel variant="default" padding="xl" className="max-w-lg w-full text-center relative z-10">
        {/* 403 */}
        <div className="text-8xl font-bold text-crisis-red/30 mb-4">403</div>

        {/* Icon */}
        <div className="text-5xl mb-6">🔒</div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-off-white mb-2">
          Access Denied
        </h1>
        <p className="text-muted mb-8">
          You don't have permission to access this area. Contact your administrator if you believe this is an error.
        </p>

        {/* Harvey Quote */}
        <div className="flex items-start gap-4 p-4 bg-crisis-red/10 border border-crisis-red/30 rounded-lg mb-8 text-left">
          <PersonaAvatar persona="harvey" size="lg" />
          <div>
            <p className="text-sm text-off-white italic mb-1">
              "You can't just walk into the senior partner's office without an appointment."
            </p>
            <p className="text-xs text-precision-teal">— Harvey Specter</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" onClick={() => navigate('/app')}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/pricing')}>
            Upgrade Plan
          </Button>
        </div>

        {/* Help Link */}
        <p className="text-xs text-muted mt-8">
          Need access? <Link to="/support" className="text-precision-teal hover:underline">Request permissions</Link>
        </p>
      </GlassPanel>
    </div>
  );
};

export default UnauthorizedPage;
