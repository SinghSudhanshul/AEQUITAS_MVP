// ============================================
// BROKER CONNECTIONS COMPONENT
// Premium: Manage Broker API Integrations
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface BrokerConnection {
  id: string;
  name: string;
  type: 'goldman_sachs' | 'morgan_stanley' | 'jp_morgan' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  configuredAt?: string;
}

interface BrokerConnectionsProps {
  connections?: BrokerConnection[];
  isPremium?: boolean;
}

const mockConnections: BrokerConnection[] = [
  { id: '1', name: 'Goldman Sachs Prime', type: 'goldman_sachs', status: 'connected', lastSync: '5 minutes ago', configuredAt: '2025-12-01' },
  { id: '2', name: 'Morgan Stanley PB', type: 'morgan_stanley', status: 'connected', lastSync: '15 minutes ago', configuredAt: '2025-11-15' },
  { id: '3', name: 'JP Morgan Execute', type: 'jp_morgan', status: 'disconnected' },
];

export const BrokerConnections: React.FC<BrokerConnectionsProps> = ({
  connections = mockConnections,
  isPremium = true,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);

  const brokerConfig = {
    goldman_sachs: { name: 'Goldman Sachs', icon: '🏦', color: 'text-achievement-gold' },
    morgan_stanley: { name: 'Morgan Stanley', icon: '🏛️', color: 'text-precision-teal' },
    jp_morgan: { name: 'JP Morgan', icon: '🔷', color: 'text-institutional-blue' },
    custom: { name: 'Custom API', icon: '⚙️', color: 'text-muted' },
  };

  const getStatusBadge = (status: BrokerConnection['status']) => {
    const styles = {
      connected: 'bg-steady-green/10 text-steady-green border-steady-green/30',
      disconnected: 'bg-muted/10 text-muted border-muted/30',
      error: 'bg-crisis-red/10 text-crisis-red border-crisis-red/30',
    };
    const labels = {
      connected: '● Connected',
      disconnected: '○ Disconnected',
      error: '⚠ Error',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (!isPremium) {
    return (
      <Card variant="glass" className="text-center py-12">
        <CardContent>
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-off-white mb-2">Premium Feature</h3>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Automatic broker API integration is available on Premium and Enterprise plans.
            Connect to Goldman Sachs, Morgan Stanley, and JP Morgan for real-time data sync.
          </p>
          <Button variant="closeDeal">Upgrade to Premium</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <span>🔗</span> Broker Connections
            </CardTitle>
            <CardDescription>Connect to your prime broker APIs for automatic data sync</CardDescription>
          </div>
          <Button variant="default" onClick={() => setShowAddForm(!showAddForm)}>
            + Add Connection
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Connection Form */}
        {showAddForm && (
          <Card variant="elevated" className="p-4 border-precision-teal/30">
            <div className="space-y-4">
              <h4 className="font-semibold text-off-white">New Broker Connection</h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(brokerConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedBroker(key)}
                    className={`
                      p-4 rounded-lg border text-center transition-all duration-200
                      ${selectedBroker === key
                        ? 'bg-institutional-blue/20 border-institutional-blue'
                        : 'bg-glass-white border-glass-border hover:border-glass-border/60'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">{config.icon}</div>
                    <div className="text-sm font-medium text-off-white">{config.name}</div>
                  </button>
                ))}
              </div>

              {selectedBroker && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-glass-border">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted">API Key</label>
                    <Input type="password" placeholder="Enter API key" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted">API Secret</label>
                    <Input type="password" placeholder="Enter API secret" />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="default" disabled={!selectedBroker}>
                  Connect
                </Button>
                <Button variant="ghost" onClick={() => { setShowAddForm(false); setSelectedBroker(null); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Security Notice */}
        <Alert variant="info">
          <AlertTitle>🔐 Security</AlertTitle>
          <AlertDescription>
            All API credentials are encrypted at rest using AES-256. We never store credentials in plain text.
          </AlertDescription>
        </Alert>

        {/* Connection List */}
        <div className="space-y-3">
          {connections.map((connection) => {
            const config = brokerConfig[connection.type];

            return (
              <div
                key={connection.id}
                className="p-4 rounded-lg border border-glass-border bg-glass-white hover:border-glass-border/60 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{config.icon}</span>
                    <div>
                      <div className="font-semibold text-off-white">{connection.name}</div>
                      <div className="text-sm text-muted">
                        {connection.lastSync ? `Last sync: ${connection.lastSync}` : 'Not configured'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(connection.status)}
                    <div className="flex gap-2">
                      {connection.status === 'connected' && (
                        <Button variant="ghost" size="sm">Sync Now</Button>
                      )}
                      <Button variant="ghost" size="sm">Configure</Button>
                      <Button variant="ghost" size="sm" className="text-crisis-red">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrokerConnections;
