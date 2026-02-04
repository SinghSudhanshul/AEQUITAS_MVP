// ============================================
// USER PROFILE COMPONENT
// Personal Profile & Preferences
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatarUrl?: string;
}

interface UserProfileProps {
  user?: UserProfileData;
  onSave?: (data: UserProfileData) => void;
}

const defaultUser: UserProfileData = {
  firstName: 'Harvey',
  lastName: 'Specter',
  email: 'harvey.specter@pearsonhardman.com',
  phone: '+1 (212) 555-0100',
  role: 'Managing Partner',
  department: 'Trading Operations',
};

export const UserProfile: React.FC<UserProfileProps> = ({
  user = defaultUser,
  onSave,
}) => {
  const [formData, setFormData] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      onSave?.(formData);
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  const initials = `${formData.firstName[0]}${formData.lastName[0]}`;

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-xl">User Profile</CardTitle>
        <CardDescription>Manage your personal information and preferences</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {saved && (
          <Alert variant="success">
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-institutional-blue to-precision-teal flex items-center justify-center text-2xl font-bold text-off-white">
            {initials}
          </div>
          <div>
            <div className="font-semibold text-off-white text-lg">
              {formData.firstName} {formData.lastName}
            </div>
            <div className="text-muted">{formData.role}</div>
            <Button variant="ghost" size="sm" className="mt-2">
              Change Photo
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">First Name</label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Last Name</label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Phone</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Role</label>
            <Input
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Department</label>
            <Input
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
            />
          </div>
        </div>

        {/* Password Change */}
        <div className="p-4 bg-glass-white rounded-lg border border-glass-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-off-white">Password</div>
              <div className="text-sm text-muted">Last changed 30 days ago</div>
            </div>
            <Button variant="ghost" size="sm">
              Change Password
            </Button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-4 bg-glass-white rounded-lg border border-glass-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-off-white flex items-center gap-2">
                Two-Factor Authentication
                <span className="text-xs bg-steady-green/20 text-steady-green px-2 py-0.5 rounded">
                  Enabled
                </span>
              </div>
              <div className="text-sm text-muted">Authenticator app configured</div>
            </div>
            <Button variant="ghost" size="sm">
              Manage
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-glass-border flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setFormData(user)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
