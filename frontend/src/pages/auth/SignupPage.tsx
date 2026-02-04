// ============================================
// SIGNUP PAGE (Stub)
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate('/app');
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
      <GlassPanel variant="default" padding="xl" className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-off-white mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-off-white">First Name</label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-off-white">Last Name</label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-off-white">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-off-white">Password</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" loading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-precision-teal hover:underline">Sign in</Link>
        </p>
      </GlassPanel>
    </div>
  );
};

export default SignupPage;
