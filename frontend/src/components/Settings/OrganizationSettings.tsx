// ============================================
// ORGANIZATION SETTINGS COMPONENT
// Organization Configuration & Management
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OrganizationData {
  name: string;
  domain: string;
  industry: string;
  timezone: string;
  primaryContact: string;
  email: string;
}

interface OrganizationSettingsProps {
  data?: OrganizationData;
  onSave?: (data: OrganizationData) => void;
}

const defaultData: OrganizationData = {
  name: 'Pearson Hardman Capital',
  domain: 'pearsonhardman.com',
  industry: 'Hedge Fund',
  timezone: 'America/New_York',
  primaryContact: 'Harvey Specter',
  email: 'admin@pearsonhardman.com',
};

export const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({
  data = defaultData,
  onSave,
}) => {
  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof OrganizationData, value: string) => {
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

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-xl">Organization Settings</CardTitle>
        <CardDescription>Manage your organization's profile and preferences</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {saved && (
          <Alert variant="success">
            <AlertDescription>Settings saved successfully!</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Organization Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Domain</label>
            <Input
              value={formData.domain}
              onChange={(e) => handleChange('domain', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Industry</label>
            <select
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full h-11 rounded-lg border border-glass-border bg-glass-bg px-4 py-2 text-sm text-off-white"
            >
              <option value="Hedge Fund">Hedge Fund</option>
              <option value="Asset Manager">Asset Manager</option>
              <option value="Bank">Bank</option>
              <option value="Insurance">Insurance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full h-11 rounded-lg border border-glass-border bg-glass-bg px-4 py-2 text-sm text-off-white"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT/BST)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Primary Contact</label>
            <Input
              value={formData.primaryContact}
              onChange={(e) => handleChange('primaryContact', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Admin Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-glass-border flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setFormData(data)}>
            Reset
          </Button>
          <Button variant="default" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationSettings;
