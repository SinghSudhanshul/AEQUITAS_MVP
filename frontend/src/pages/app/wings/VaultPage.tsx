// ============================================
// VAULT PAGE
// Wing 9: Secure Operations (Features 81-90)
// ============================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { WINGS } from '@/config/wings';
import { QUOTES } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { MetricCard } from '@/components/shared/MetricCard';
import { PersonaCard } from '@/components/shared/PersonaAvatar';
import { Badge } from '@/components/ui/badge';

// Stores
import { useGamificationStore } from '@/store/gamification.store';
// import { useAuthStore } from '@/store/authStore';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface SecureDocument {
  id: string;
  name: string;
  type: 'contract' | 'key' | 'backup' | 'audit';
  lastAccessed: string;
  accessLevel: 'name_partner' | 'managing_partner';
  encrypted: boolean;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_DOCUMENTS: SecureDocument[] = [
  { id: 'd1', name: 'Master API Keys', type: 'key', lastAccessed: '2024-01-15', accessLevel: 'name_partner', encrypted: true },
  { id: 'd2', name: 'Disaster Recovery Plan', type: 'backup', lastAccessed: '2024-01-10', accessLevel: 'managing_partner', encrypted: true },
  { id: 'd3', name: 'SOC 2 Audit Report', type: 'audit', lastAccessed: '2024-01-08', accessLevel: 'managing_partner', encrypted: false },
  { id: 'd4', name: 'Prime Broker Agreement', type: 'contract', lastAccessed: '2024-01-05', accessLevel: 'name_partner', encrypted: true },
];

// ============================================
// OTP VAULT INPUT
// ============================================

interface OTPVaultInputProps {
  onComplete: (code: string) => void;
  length?: number;
  disabled?: boolean;
}

const OTPVaultInput: React.FC<OTPVaultInputProps> = ({
  onComplete,
  length = 6,
  disabled = false,
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { playSound } = useSoundEffects();

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    playSound('keyboard_clack');

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newValues.every((v) => v) && newValues.length === length) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      const newValues = pastedData.split('').concat(Array(length - pastedData.length).fill(''));
      setValues(newValues);
      if (newValues.every((v) => v)) {
        onComplete(newValues.join(''));
      }
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className={cn(
            'w-12 h-14 text-center text-2xl font-mono font-bold rounded-lg',
            'border-2 transition-all',
            'bg-rich-black text-off-white',
            'focus:outline-none focus:ring-2 focus:ring-precision-teal',
            disabled
              ? 'border-glass-border opacity-50 cursor-not-allowed'
              : value
                ? 'border-precision-teal'
                : 'border-glass-border hover:border-precision-teal/50'
          )}
        />
      ))}
    </div>
  );
};

// ============================================
// VAULT LOCK ANIMATION
// ============================================

interface VaultLockProps {
  isUnlocking: boolean;
  isUnlocked: boolean;
}

const VaultLock: React.FC<VaultLockProps> = ({ isUnlocking, isUnlocked }) => (
  <div className="relative w-32 h-32 mx-auto mb-8">
    {/* Vault Door */}
    <div className={cn(
      'absolute inset-0 rounded-full border-4 border-glass-border',
      'bg-gradient-to-br from-charcoal to-rich-black',
      'flex items-center justify-center',
      'transition-all duration-700',
      isUnlocking && 'animate-pulse',
      isUnlocked && 'border-spring-green bg-spring-green/10'
    )}>
      <span className="text-5xl">
        {isUnlocked ? '🔓' : '🔐'}
      </span>
    </div>

    {/* Spinning rings when unlocking */}
    {isUnlocking && (
      <>
        <div className="absolute inset-0 border-4 border-precision-teal/30 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-2 border-4 border-institutional-blue/30 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
      </>
    )}
  </div>
);

// ============================================
// SECURE DOCUMENT LIST
// ============================================

interface SecureDocumentListProps {
  documents: SecureDocument[];
  onAccess: (doc: SecureDocument) => void;
}

const SecureDocumentList: React.FC<SecureDocumentListProps> = ({ documents, onAccess }) => {
  const { playSound } = useSoundEffects();

  const getTypeIcon = (type: SecureDocument['type']) => {
    switch (type) {
      case 'key': return '🔑';
      case 'contract': return '📄';
      case 'backup': return '💾';
      case 'audit': return '📋';
    }
  };

  return (
    <GlassPanel variant="default" padding="none">
      <div className="p-4 border-b border-glass-border flex items-center justify-between">
        <h3 className="font-semibold text-off-white">Secure Documents</h3>
        <Badge variant="premium">ENCRYPTED</Badge>
      </div>

      <div className="divide-y divide-glass-border/50">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => {
              playSound('click');
              onAccess(doc);
            }}
            className="p-4 hover:bg-glass-white/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{getTypeIcon(doc.type)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-off-white">{doc.name}</p>
                  {doc.encrypted && (
                    <span className="text-xs">🔒</span>
                  )}
                </div>
                <p className="text-xs text-muted">
                  Last accessed: {new Date(doc.lastAccessed).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={doc.accessLevel === 'name_partner' ? 'premium' : 'default'}>
                {doc.accessLevel === 'name_partner' ? 'TOP SECRET' : 'CLASSIFIED'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

// ============================================
// BIOMETRIC STATUS
// ============================================

const BiometricStatus: React.FC = () => {
  return (
    <GlassPanel variant="default" padding="lg">
      <h3 className="font-semibold text-off-white mb-4">Security Status</h3>

      <div className="space-y-4">
        {[
          { label: 'Biometric Auth', status: 'Active', icon: '👆' },
          { label: 'Hardware Key', status: 'Connected', icon: '🔑' },
          { label: 'Session', status: 'Encrypted', icon: '🔐' },
          { label: 'Audit Log', status: 'Recording', icon: '📝' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-glass-white rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-off-white">{item.label}</span>
            </div>
            <span className="text-xs text-spring-green font-medium">
              ✓ {item.status}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

// ============================================
// MAIN PAGE
// ============================================

const VaultPage: React.FC = () => {
  const wing = WINGS.vault;
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addXP } = useGamificationStore();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    addXP(10, 'page_view', 'Visited Vault');
  }, [addXP]);

  const handleOTPComplete = useCallback(async (code: string) => {
    setIsUnlocking(true);
    setError(null);
    playSound('briefcase_close');

    // Simulate verification
    await new Promise((r) => setTimeout(r, 2000));

    // Accept any 6-digit code for demo
    if (code.length === 6) {
      playSound('success_chord');
      setIsUnlocked(true);
      addXP(50, 'vault_access', 'Accessed the Vault');
    } else {
      playSound('error');
      setError('Invalid access code');
    }

    setIsUnlocking(false);
  }, [addXP, playSound]);

  const handleAccessDocument = (doc: SecureDocument) => {
    addXP(15, 'document_access', `Accessed: ${doc.name}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{wing.icon}</span>
            <h1 className="text-2xl lg:text-3xl font-bold text-off-white">
              {wing.name}
            </h1>
            <Badge variant="premium">ENTERPRISE</Badge>
          </div>
          <p className="text-muted">{wing.description}. Maximum security clearance required.</p>
        </div>
      </div>

      {/* Harvey Quote */}
      <div className="mb-8">
        <PersonaCard
          persona="harvey"
          quote={QUOTES.HARVEY.RISK_WARNING}
        />
      </div>

      {/* Vault Access */}
      {!isUnlocked ? (
        <GlassPanel variant="default" padding="xl" className="max-w-md mx-auto text-center">
          <VaultLock isUnlocking={isUnlocking} isUnlocked={isUnlocked} />

          <h2 className="text-xl font-bold text-off-white mb-2">Enter Access Code</h2>
          <p className="text-sm text-muted mb-6">
            6-digit verification code required for vault access
          </p>

          <OTPVaultInput onComplete={handleOTPComplete} disabled={isUnlocking} />

          {error && (
            <p className="text-crisis-red text-sm mt-4">{error}</p>
          )}

          <p className="text-xs text-muted mt-6">
            🔐 End-to-end encrypted • +50 XP on access
          </p>
        </GlassPanel>
      ) : (
        <>
          {/* Security Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard title="Security Level" value="Maximum" icon="🛡️" />
            <MetricCard title="Documents" value={MOCK_DOCUMENTS.length.toString()} icon="📄" />
            <MetricCard title="Encryption" value="AES-256" icon="🔐" />
            <MetricCard title="Session Time" value="14:32" icon="⏱️" />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SecureDocumentList documents={MOCK_DOCUMENTS} onAccess={handleAccessDocument} />
            </div>
            <div>
              <BiometricStatus />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VaultPage;
