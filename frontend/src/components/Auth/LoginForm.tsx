// ============================================
// AEQUITAS LOGIN FORM COMPONENT
// Harvey Specter "Power Play" Authentication
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual authentication
      // Simulating login for now
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (email && password) {
        // Success - navigate to dashboard
        onSuccess?.();
        navigate('/app');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="elevated" className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl text-center bg-gradient-to-r from-institutional-blue to-precision-teal bg-clip-text text-transparent">
          Welcome Back, Closer
        </CardTitle>
        <CardDescription className="text-center">
          "Winners don't make excuses when the other side plays the game."
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-muted">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="harvey.specter@pearsonhardman.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-muted">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-glass-border" />
              <span className="text-muted">Remember me</span>
            </label>
            <a href="#" className="text-precision-teal hover:underline">
              Forgot password?
            </a>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⚡</span>
                Authenticating...
              </>
            ) : (
              'Enter the Arena'
            )}
          </Button>

          <p className="text-sm text-muted text-center">
            New to Aequitas?{' '}
            <a href="/signup" className="text-precision-teal hover:underline">
              Join the Firm
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
