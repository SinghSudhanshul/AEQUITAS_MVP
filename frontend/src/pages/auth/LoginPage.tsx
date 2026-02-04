// ============================================
// LOGIN PAGE
// Authentication with "Power Suit" aesthetic
// ============================================

import React, { useState, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
import { QUOTES } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersonaAvatar } from '@/components/shared/PersonaAvatar';

// Store
import { useAuthStore } from '@/store/authStore';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// CONSTANTS
// ============================================

const HARVEY_QUOTES = [
  QUOTES.HARVEY.WELCOME,
  QUOTES.HARVEY.MOTIVATION,
  QUOTES.HARVEY.SUCCESS,
];

// ============================================
// MAIN COMPONENT
// ============================================

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loginWithMicrosoft, isLoading, error, clearError } = useAuthStore();
  const { playSound } = useSoundEffects();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [quote] = useState(() =>
    HARVEY_QUOTES[Math.floor(Math.random() * HARVEY_QUOTES.length)]
  );

  // Get redirect path
  const from = (location.state as any)?.from?.pathname || '/app';

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      playSound('click');
      await login(email, password);
      playSound('success_chord');
      navigate(from, { replace: true });
    } catch (err) {
      playSound('error');
    }
  }, [email, password, login, navigate, from, playSound, clearError]);

  const handleSocialLogin = useCallback(async (provider: 'google' | 'microsoft') => {
    clearError();

    try {
      playSound('click');
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithMicrosoft();
      }
      playSound('success_chord');
      navigate(from, { replace: true });
    } catch (err) {
      playSound('error');
    }
  }, [loginWithGoogle, loginWithMicrosoft, navigate, from, playSound, clearError]);

  return (
    <div className="min-h-screen bg-rich-black flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rich-black via-charcoal to-rich-black" />

        {/* Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,216,180,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,216,180,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-precision-teal to-institutional-blue flex items-center justify-center mb-8">
            <span className="text-3xl font-bold text-rich-black">A</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-off-white mb-4">
            Aequitas LV-COP
          </h1>
          <p className="text-xl text-muted mb-12 max-w-md">
            Liquidity & Volatility Crisis Operations Platform
          </p>

          {/* Harvey Quote */}
          <div className="flex items-start gap-4 max-w-md">
            <PersonaAvatar persona="harvey" size="lg" />
            <div>
              <p className="text-off-white italic mb-2">"{quote}"</p>
              <p className="text-sm text-precision-teal">— Harvey Specter</p>
            </div>
          </div>

          {/* Feature List */}
          <div className="mt-16 space-y-4">
            {[
              { icon: '🏛️', text: 'Enterprise-grade liquidity forecasting' },
              { icon: '🛡️', text: 'Crisis-ready operations platform' },
              { icon: '🎯', text: 'Strategic AI-powered insights' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{feature.icon}</span>
                <span className="text-muted">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-precision-teal to-institutional-blue flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-rich-black">A</span>
            </div>
            <h1 className="text-2xl font-bold text-off-white">Aequitas</h1>
          </div>

          {/* Login Card */}
          <GlassPanel variant="default" padding="xl">
            <h2 className="text-2xl font-bold text-off-white mb-2">Sign In</h2>
            <p className="text-muted mb-8">Enter your credentials to access your account</p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-crisis-red/10 border border-crisis-red/30 rounded-lg">
                <p className="text-crisis-red text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-off-white">Email</label>
                <Input
                  type="email"
                  placeholder="harvey@aequitas.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon="📧"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-off-white">Password</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon="🔒"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted hover:text-off-white"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-glass-border bg-glass-white text-precision-teal focus:ring-precision-teal"
                  />
                  <span className="text-sm text-muted">Remember me</span>
                </label>
                <Link
                  to="/reset-password"
                  className="text-sm text-precision-teal hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                loading={isLoading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-glass-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-surface text-muted">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('microsoft')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z" />
                  <path fill="#00a4ef" d="M1 13h10v10H1z" />
                  <path fill="#7fba00" d="M13 1h10v10H13z" />
                  <path fill="#ffb900" d="M13 13h10v10H13z" />
                </svg>
                Microsoft
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center mt-8 text-sm text-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-precision-teal hover:underline">
                Create one
              </Link>
            </p>
          </GlassPanel>

          {/* Footer */}
          <p className="text-center mt-8 text-xs text-muted">
            By signing in, you agree to our{' '}
            <a href="#" className="text-precision-teal hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-precision-teal hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
