// ============================================
// MAINTENANCE PAGE
// System Maintenance Page
// ============================================

import React, { useState, useEffect } from 'react';
// import { QUOTES } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PersonaAvatar } from '@/components/shared/PersonaAvatar';
import { Button } from '@/components/ui/button';

const MaintenancePage: React.FC = () => {
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 30, seconds: 0 });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;

        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 0;
          minutes = 0;
          seconds = 0;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <GlassPanel variant="default" padding="xl" className="max-w-lg w-full text-center relative z-10">
        {/* Icon */}
        <div className="text-5xl mb-6">🛠️</div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-off-white mb-2">
          System Maintenance
        </h1>
        <p className="text-muted mb-8">
          We're upgrading our systems to serve you better. This won't take long.
        </p>

        {/* Countdown */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { label: 'Hours', value: countdown.hours },
            { label: 'Minutes', value: countdown.minutes },
            { label: 'Seconds', value: countdown.seconds },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="w-16 h-16 bg-glass-white rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl font-bold font-mono text-achievement-gold">
                  {formatNumber(item.value)}
                </span>
              </div>
              <span className="text-xs text-muted">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Donna Quote */}
        <div className="flex items-start gap-4 p-4 bg-achievement-gold/10 border border-achievement-gold/30 rounded-lg mb-8 text-left">
          <PersonaAvatar persona="donna" size="lg" />
          <div>
            <p className="text-sm text-off-white italic mb-1">
              "I anticipated this and already rescheduled your meetings. You're welcome."
            </p>
            <p className="text-xs text-precision-teal">— Donna Paulsen</p>
          </div>
        </div>

        {/* Status Updates */}
        <div className="space-y-2 mb-8">
          <p className="text-xs text-muted">Status Updates:</p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-spring-green rounded-full animate-pulse" />
            <span className="text-sm text-off-white">Database migration in progress</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" onClick={() => window.location.reload()}>
            Check Status
          </Button>
          <Button variant="outline" onClick={() => window.location.href = 'https://status.aequitas.io'}>
            Status Page
          </Button>
        </div>

        {/* Contact */}
        <p className="text-xs text-muted mt-8">
          Questions? Email us at <a href="mailto:support@aequitas.io" className="text-precision-teal hover:underline">support@aequitas.io</a>
        </p>
      </GlassPanel>
    </div>
  );
};

export default MaintenancePage;
