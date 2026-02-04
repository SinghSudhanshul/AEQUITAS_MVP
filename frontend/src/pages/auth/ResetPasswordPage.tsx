// ============================================
// RESET PASSWORD PAGE (Stub)
// ============================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';

const ResetPasswordPage: React.FC = () => {
  const { resetPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSent(true);
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
      <GlassPanel variant="default" padding="xl" className="max-w-md w-full text-center">
        {sent ? (
          <>
            <span className="text-5xl mb-4 block">📧</span>
            <h2 className="text-2xl font-bold text-off-white mb-2">Check Your Email</h2>
            <p className="text-muted mb-6">We've sent a password reset link to {email}</p>
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-off-white mb-2">Reset Password</h2>
            <p className="text-muted mb-6">Enter your email to receive a reset link</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-off-white">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" loading={isLoading}>
                Send Reset Link
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted">
              <Link to="/login" className="text-precision-teal hover:underline">Back to Login</Link>
            </p>
          </>
        )}
      </GlassPanel>
    </div>
  );
};

export default ResetPasswordPage;
