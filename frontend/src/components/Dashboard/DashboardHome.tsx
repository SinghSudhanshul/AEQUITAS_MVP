// ============================================
// AEQUITAS DASHBOARD HOME COMPONENT
// The Command Center - Executive Overview
// ============================================

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RegimeIndicator } from './RegimeIndicator';
import { ForecastCard } from './ForecastCard';
import { AccuracyMetrics } from './AccuracyMetrics';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';
import { RankBadge } from '@/components/gamification/RankBadge';

interface DashboardHomeProps {
  regime?: 'steady' | 'elevated' | 'crisis';
  userXP?: number;
  userRank?: string;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  regime = 'steady',
  userXP = 15750,
  userRank = 'Senior Associate',
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <RegimeIndicator regime={regime} />
          <RankBadge rank={userRank} />
        </div>
        <XPProgressBar xp={userXP} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Card - Primary Focus */}
        <div className="lg:col-span-2">
          <ForecastCard />
        </div>

        {/* Accuracy Metrics */}
        <div className="lg:col-span-1">
          <AccuracyMetrics />
        </div>
      </div>

      {/* Quick Actions */}
      <Card variant="glass" className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              icon="📊"
              title="View Forecasts"
              description="Today's predictions"
              href="/app/forecasts"
            />
            <QuickActionCard
              icon="📤"
              title="Upload Data"
              description="Add positions"
              href="/app/upload"
            />
            <QuickActionCard
              icon="📈"
              title="Analytics"
              description="Performance report"
              href="/app/analytics"
            />
            <QuickActionCard
              icon="🔗"
              title="Connect Broker"
              description="API integration"
              href="/app/settings/brokers"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ActivityItem
              icon="✅"
              title="Daily forecast generated"
              time="2 hours ago"
              status="success"
            />
            <ActivityItem
              icon="📤"
              title="Position data uploaded"
              time="5 hours ago"
              status="info"
            />
            <ActivityItem
              icon="🎯"
              title="Accuracy target achieved"
              time="1 day ago"
              status="success"
            />
            <ActivityItem
              icon="⚠️"
              title="Market regime changed to Elevated"
              time="2 days ago"
              status="warning"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Quick Action Card Sub-component
interface QuickActionCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, href }) => (
  <a
    href={href}
    className="group p-4 rounded-lg bg-glass-white border border-glass-border hover:border-institutional-blue/50 hover:bg-institutional-blue/10 transition-all duration-300"
  >
    <div className="text-2xl mb-2">{icon}</div>
    <div className="font-medium text-off-white group-hover:text-precision-teal transition-colors">
      {title}
    </div>
    <div className="text-sm text-muted">{description}</div>
  </a>
);

// Activity Item Sub-component
interface ActivityItemProps {
  icon: string;
  title: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, time, status }) => {
  const statusColors = {
    success: 'text-steady-green',
    warning: 'text-elevated-amber',
    info: 'text-precision-teal',
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-glass-white transition-colors">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className={`text-sm font-medium ${statusColors[status]}`}>{title}</div>
        <div className="text-xs text-muted">{time}</div>
      </div>
    </div>
  );
};

export default DashboardHome;
