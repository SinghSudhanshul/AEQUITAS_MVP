'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, User, Building2, Upload, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useGamificationStore } from '@/stores/gamification';
import type { KYCStep } from '@/types/wings/lobby';

interface ProgressiveKYCProps {
  onComplete?: () => void;
  className?: string;
}

const kycSteps: KYCStep[] = [
  { id: 'personal', order: 1, title: 'Personal Info', description: 'Identity', status: 'pending', required: true, component: 'PersonalInfoStep' },
  { id: 'organization', order: 2, title: 'Organization', description: 'Company details', status: 'pending', required: true, component: 'OrganizationStep' },
  { id: 'documents', order: 3, title: 'Documents', description: 'Upload docs', status: 'pending', required: true, component: 'DocumentsStep' },
  { id: 'verification', order: 4, title: 'Verify', description: 'Final step', status: 'pending', required: true, component: 'VerificationStep' },
];

const stepIcons = { personal: User, organization: Building2, documents: Upload, verification: Shield };

export const ProgressiveKYC = React.memo(function ProgressiveKYC({ onComplete, className }: ProgressiveKYCProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [steps, setSteps] = React.useState(kycSteps);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { addXP } = useGamificationStore();

  const progress = ((currentStep) / steps.length) * 100;
  const current = steps[currentStep];

  const handleNext = async () => {
    if (currentStep >= steps.length - 1) {
      setIsSubmitting(true);
      await new Promise(r => setTimeout(r, 1500));
      addXP(200, 'KYC completed');
      onComplete?.();
      return;
    }
    const updated = [...steps];
    updated[currentStep] = { ...updated[currentStep], status: 'completed' };
    setSteps(updated);
    setCurrentStep(prev => prev + 1);
    addXP(25, 'KYC step completed');
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Account Verification</h2>
          <p className="text-sm text-slate-400">Complete all steps to unlock access</p>
        </div>
        <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
      </div>

      <Progress value={progress} variant="xp" size="md" />

      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const Icon = stepIcons[step.id as keyof typeof stepIcons];
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2',
                  step.status === 'completed' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' :
                    idx === currentStep ? 'border-amber-500 bg-amber-500/20 text-amber-400' :
                      'border-white/20 bg-white/5 text-slate-400'
                )}>
                  {step.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={cn('text-xs font-medium', idx === currentStep ? 'text-white' : 'text-slate-400')}>{step.title}</span>
              </div>
              {idx < steps.length - 1 && <div className={cn('flex-1 h-0.5 mx-2', idx < currentStep ? 'bg-emerald-500' : 'bg-white/10')} />}
            </React.Fragment>
          );
        })}
      </div>

      <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{current.title}</h3>
        {current.id === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
            </div>
            <Input type="email" placeholder="Email" />
          </div>
        )}
        {current.id === 'organization' && (
          <div className="space-y-4">
            <Input placeholder="Company Name" />
            <Input placeholder="Role / Title" />
          </div>
        )}
        {current.id === 'documents' && (
          <div className="rounded-lg border-2 border-dashed border-white/20 p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-sm text-slate-400">Upload your documents</p>
            <Button variant="outline" className="mt-4">Browse Files</Button>
          </div>
        )}
        {current.id === 'verification' && (
          <div className="text-center">
            <Shield className="mx-auto h-16 w-16 text-amber-400" />
            <p className="mt-4 text-slate-400">Ready for verification</p>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(p => Math.max(0, p - 1))} disabled={currentStep === 0}>Back</Button>
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : currentStep === steps.length - 1 ? 'Complete' : <>Continue<ChevronRight className="ml-2 h-4 w-4" /></>}
        </Button>
      </div>
    </div>
  );
});

export default ProgressiveKYC;
