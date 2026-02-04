'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Scan, Shield, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useGamificationStore } from '@/stores/gamification';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import type { BiometricStatus, BiometricMethod, BiometricGatekeeperState } from '@/types/wings/lobby';

// ============================================
// BIOMETRIC GATEKEEPER COMPONENT
// Feature 5: Biometric Authentication UI
// ============================================

interface BiometricGatekeeperProps {
  onSuccess?: () => void;
  onFailure?: (attemptsRemaining: number) => void;
  methods?: BiometricMethod[];
  className?: string;
}

const methodConfig: Record<BiometricMethod, { icon: React.ReactNode; label: string; instruction: string }> = {
  fingerprint: {
    icon: <Fingerprint className="h-12 w-12" />,
    label: 'Fingerprint',
    instruction: 'Place your finger on the sensor',
  },
  face: {
    icon: <Scan className="h-12 w-12" />,
    label: 'Face ID',
    instruction: 'Look at the camera to verify',
  },
  voice: {
    icon: <Shield className="h-12 w-12" />,
    label: 'Voice',
    instruction: 'Speak the verification phrase',
  },
  none: {
    icon: <Shield className="h-12 w-12" />,
    label: 'Password',
    instruction: 'Enter your password',
  },
};

const statusMessages: Record<BiometricStatus, { message: string; color: string }> = {
  not_configured: { message: 'Biometric not configured', color: 'text-slate-400' },
  pending: { message: 'Awaiting verification...', color: 'text-amber-400' },
  verified: { message: 'Identity verified', color: 'text-emerald-400' },
  failed: { message: 'Verification failed', color: 'text-red-400' },
  expired: { message: 'Session expired', color: 'text-orange-400' },
};

export const BiometricGatekeeper = React.memo(function BiometricGatekeeper({
  onSuccess,
  onFailure,
  methods = ['fingerprint', 'face'],
  className,
}: BiometricGatekeeperProps) {
  const [state, setState] = React.useState<BiometricGatekeeperState>({
    status: 'not_configured',
    method: methods[0] || 'fingerprint',
    failedAttempts: 0,
  });
  const [isScanning, setIsScanning] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState<BiometricMethod>(methods[0] || 'fingerprint');

  const { playSound } = useSoundEffects();
  const { addXP } = useGamificationStore();

  const handleScan = React.useCallback(async () => {
    if (isScanning) return;

    setIsScanning(true);
    setState(prev => ({ ...prev, status: 'pending' }));
    playSound('keyboardClick');

    // Simulate biometric scan (replace with actual WebAuthn API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 90% success rate
    const success = Math.random() > 0.1;

    if (success) {
      setState(prev => ({
        ...prev,
        status: 'verified',
        lastVerifiedAt: new Date().toISOString(),
      }));
      playSound('success');
      addXP(50, 'Biometric verification completed');
      onSuccess?.();
    } else {
      const newAttempts = state.failedAttempts + 1;
      const maxAttempts = 3;

      setState(prev => ({
        ...prev,
        status: 'failed',
        failedAttempts: newAttempts,
        lockedUntil: newAttempts >= maxAttempts
          ? new Date(Date.now() + 5 * 60 * 1000).toISOString()
          : undefined,
      }));
      playSound('error');
      onFailure?.(maxAttempts - newAttempts);
    }

    setIsScanning(false);
  }, [isScanning, state.failedAttempts, playSound, addXP, onSuccess, onFailure]);

  const config = methodConfig[selectedMethod];
  const statusInfo = statusMessages[state.status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10',
        'bg-gradient-to-br from-navy-900/90 to-navy-800/80',
        'backdrop-blur-xl p-8',
        className
      )}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-500/5 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">Secure Access</h3>
          <p className="mt-1 text-sm text-slate-400">
            Verify your identity to continue
          </p>
        </div>

        {/* Method selector */}
        {methods.length > 1 && (
          <div className="flex gap-2">
            {methods.filter(m => m !== 'none').map((method) => (
              <Button
                key={method}
                variant={selectedMethod === method ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMethod(method)}
                disabled={isScanning}
                className="capitalize"
              >
                {method.replace('_', ' ')}
              </Button>
            ))}
          </div>
        )}

        {/* Scan area */}
        <motion.div
          className={cn(
            'relative flex h-40 w-40 items-center justify-center rounded-full',
            'border-2 transition-colors duration-300',
            state.status === 'verified' && 'border-emerald-500 bg-emerald-500/10',
            state.status === 'failed' && 'border-red-500 bg-red-500/10',
            state.status === 'pending' && 'border-amber-500 bg-amber-500/10',
            state.status === 'not_configured' && 'border-white/20 bg-white/5',
          )}
          animate={isScanning ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1, repeat: isScanning ? Infinity : 0 }}
        >
          {/* Scanning ring animation */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-amber-500"
              />
            )}
          </AnimatePresence>

          {/* Icon */}
          <motion.div
            className={cn(
              'transition-colors duration-300',
              state.status === 'verified' && 'text-emerald-400',
              state.status === 'failed' && 'text-red-400',
              state.status === 'pending' && 'text-amber-400',
              state.status === 'not_configured' && 'text-slate-400',
            )}
            animate={isScanning ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: isScanning ? Infinity : 0 }}
          >
            {state.status === 'verified' ? (
              <CheckCircle2 className="h-16 w-16" />
            ) : state.status === 'failed' ? (
              <AlertTriangle className="h-16 w-16" />
            ) : isScanning ? (
              <Loader2 className="h-16 w-16 animate-spin" />
            ) : (
              config.icon
            )}
          </motion.div>
        </motion.div>

        {/* Status message */}
        <div className="text-center">
          <p className={cn('font-medium', statusInfo.color)}>
            {statusInfo.message}
          </p>
          {state.status === 'not_configured' && (
            <p className="mt-1 text-sm text-slate-500">{config.instruction}</p>
          )}
          {state.failedAttempts > 0 && state.status === 'failed' && (
            <p className="mt-1 text-xs text-red-400">
              {3 - state.failedAttempts} attempts remaining
            </p>
          )}
        </div>

        {/* Action button */}
        {state.status !== 'verified' && (
          <Button
            onClick={handleScan}
            disabled={isScanning || !!state.lockedUntil}
            className="w-full max-w-xs"
            size="lg"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : state.lockedUntil ? (
              'Locked - Try again later'
            ) : (
              `Verify with ${config.label}`
            )}
          </Button>
        )}

        {/* Harvey quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-xs text-center text-xs italic text-slate-500"
        >
          "Winners don't make excuses when the other side plays the game."
          <span className="block mt-1 font-medium text-amber-500/60">— Harvey Specter</span>
        </motion.p>
      </div>
    </motion.div>
  );
});

export default BiometricGatekeeper;
