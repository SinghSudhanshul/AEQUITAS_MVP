// ============================================
// AEQUITAS SIGNUP FORM COMPONENT
// "Join the Firm" Registration Flow
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess?.();
      navigate('/app');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="elevated" className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl text-center bg-gradient-to-r from-achievement-gold to-precision-teal bg-clip-text text-transparent">
          Join the Firm
        </CardTitle>
        <CardDescription className="text-center">
          "I don't have dreams, I have goals."
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">First Name</label>
              <Input
                name="firstName"
                placeholder="Harvey"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Last Name</label>
              <Input
                name="lastName"
                placeholder="Specter"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Work Email</label>
            <Input
              name="email"
              type="email"
              placeholder="you@institution.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Organization</label>
            <Input
              name="organization"
              placeholder="Your Trading Firm"
              value={formData.organization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Password</label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Confirm Password</label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-sm text-muted">
            <input type="checkbox" className="rounded border-glass-border mt-1" required />
            <span>
              I agree to the{' '}
              <a href="#" className="text-precision-teal hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-precision-teal hover:underline">Privacy Policy</a>
            </span>
          </label>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            variant="closeDeal"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Make Partner'}
          </Button>

          <p className="text-sm text-muted text-center">
            Already a partner?{' '}
            <a href="/login" className="text-precision-teal hover:underline">
              Sign In
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignupForm;
