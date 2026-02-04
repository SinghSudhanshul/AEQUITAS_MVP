// ============================================
// APP COMPONENT
// Root Component with 9-Wing Router
// ============================================

import React, { Suspense, lazy, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Stores
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamification.store';
import { useCrisisStore } from '@/store/crisis.store';

// Layout
import { AppShell } from '@/components/layout/AppShell';

// Loading Components
import { LoadingScreen } from '@/components/shared/LoadingScreen';

// ============================================
// LAZY LOADED PAGES
// ============================================

// Marketing Pages
const HomePage = lazy(() => import('@/pages/marketing/HomePage'));
const PricingPage = lazy(() => import('@/pages/marketing/PricingPage'));
const FeaturesPage = lazy(() => import('@/pages/marketing/FeaturesPage'));
const CaseStudiesPage = lazy(() => import('@/pages/marketing/CaseStudiesPage'));

// Auth Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// App Pages
const DashboardPage = lazy(() => import('@/pages/app/DashboardPage'));

// Wing Pages
const LobbyPage = lazy(() => import('@/pages/app/wings/LobbyPage'));
const BullpenPage = lazy(() => import('@/pages/app/wings/BullpenPage'));
const LibraryPage = lazy(() => import('@/pages/app/wings/LibraryPage'));
const TreasuryPage = lazy(() => import('@/pages/app/wings/TreasuryPage'));
const SituationRoomPage = lazy(() => import('@/pages/app/wings/SituationRoomPage'));
const WarRoomPage = lazy(() => import('@/pages/app/wings/WarRoomPage'));
const DonnasDeskPage = lazy(() => import('@/pages/app/wings/DonnasDeskPage'));
const HarveysOfficePage = lazy(() => import('@/pages/app/wings/HarveysOfficePage'));
const VaultPage = lazy(() => import('@/pages/app/wings/VaultPage'));

// Settings Pages
const ProfileSettingsPage = lazy(() => import('@/pages/app/settings/ProfileSettingsPage'));
const OrganizationSettingsPage = lazy(() => import('@/pages/app/settings/OrganizationSettingsPage'));
const BillingSettingsPage = lazy(() => import('@/pages/app/settings/BillingSettingsPage'));
const NotificationSettingsPage = lazy(() => import('@/pages/app/settings/NotificationSettingsPage'));
const AppearanceSettingsPage = lazy(() => import('@/pages/app/settings/AppearanceSettingsPage'));

// Admin Pages
const UserManagementPage = lazy(() => import('@/pages/app/admin/UserManagementPage'));
const SystemHealthPage = lazy(() => import('@/pages/app/admin/SystemHealthPage'));
const AuditLogPage = lazy(() => import('@/pages/app/admin/AuditLogPage'));

// Error Pages
const NotFoundPage = lazy(() => import('@/pages/error/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/error/UnauthorizedPage'));
const MaintenancePage = lazy(() => import('@/pages/error/MaintenancePage'));

// ============================================
// QUERY CLIENT
// ============================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ============================================
// AUTH GUARD
// ============================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredTier?: 'free' | 'premium' | 'enterprise';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredTier = 'free',
}) => {
  const { isAuthenticated, user, subscriptionTier, checkAuth } = useAuthStore();
  const location = useLocation();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (requiredRoles.length > 0 && user?.role) {
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      return <Navigate to="/app/unauthorized" replace />;
    }
  }

  // Check tier permissions
  const tierOrder = ['free', 'premium', 'enterprise'];
  const requiredTierIndex = tierOrder.indexOf(requiredTier);
  const userTierIndex = tierOrder.indexOf(subscriptionTier || 'free');

  if (userTierIndex < requiredTierIndex) {
    return <Navigate to="/pricing" state={{ requiredTier }} replace />;
  }

  return <>{children}</>;
};

// ============================================
// ROUTE SCROLL RESET
// ============================================

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// ============================================
// APP INITIALIZATION
// ============================================

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkAuth } = useAuthStore();
  const { checkLoginStreak, checkAchievements } = useGamificationStore();
  const { checkForCrisis } = useCrisisStore();

  useEffect(() => {
    // Initialize app state
    checkAuth();
    checkLoginStreak();
    checkAchievements();

    // Start crisis monitoring
    const crisisInterval = setInterval(() => {
      checkForCrisis();
    }, 60000); // Check every minute

    return () => clearInterval(crisisInterval);
  }, [checkAuth, checkLoginStreak, checkAchievements, checkForCrisis]);

  return <>{children}</>;
};

// ============================================
// MAIN APP COMPONENT
// ============================================

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInitializer>
          <ScrollToTop />

          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* ============================== */}
              {/* PUBLIC ROUTES */}
              {/* ============================== */}

              {/* Marketing */}
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* ============================== */}
              {/* PROTECTED APP ROUTES */}
              {/* ============================== */}

              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                {/* Dashboard */}
                <Route index element={<DashboardPage />} />

                {/* ============================== */}
                {/* 9 WINGS */}
                {/* ============================== */}

                <Route path="wings">
                  {/* Wing 1: Lobby (Free, Junior Associate) */}
                  <Route path="lobby" element={<LobbyPage />} />

                  {/* Wing 2: Bullpen (Free, Associate) */}
                  <Route
                    path="bullpen"
                    element={
                      <ProtectedRoute>
                        <BullpenPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Wing 3: Library (Premium, Senior Associate) */}
                  <Route
                    path="library"
                    element={
                      <ProtectedRoute requiredTier="premium">
                        <LibraryPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Wing 4: Treasury (Premium, Junior Partner) */}
                  <Route
                    path="treasury"
                    element={
                      <ProtectedRoute requiredTier="premium">
                        <TreasuryPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Wing 5: Situation Room (Premium, Partner) */}
                  <Route
                    path="situation-room"
                    element={
                      <ProtectedRoute requiredTier="premium">
                        <SituationRoomPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Wing 6: War Room (Enterprise, Senior Partner) */}
                  <Route
                    path="war-room"
                    element={
                      <ProtectedRoute requiredTier="enterprise">
                        <WarRoomPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Wing 7: Donna's Desk (Premium, Senior Partner) */}
                  <Route
                    path="donnas-desk"
                    element={
                      <ProtectedRoute requiredTier="premium">
                        <DonnasDeskPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Wing 8: Harvey's Office (Enterprise, Managing Partner) */}
                  <Route
                    path="harveys-office"
                    element={
                      <ProtectedRoute requiredTier="enterprise">
                        <HarveysOfficePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Wing 9: Vault (Enterprise, Name Partner) */}
                  <Route
                    path="vault"
                    element={
                      <ProtectedRoute requiredTier="enterprise">
                        <VaultPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* ============================== */}
                {/* SETTINGS */}
                {/* ============================== */}

                <Route path="settings">
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfileSettingsPage />} />
                  <Route path="organization" element={<OrganizationSettingsPage />} />
                  <Route path="billing" element={<BillingSettingsPage />} />
                  <Route path="notifications" element={<NotificationSettingsPage />} />
                  <Route path="appearance" element={<AppearanceSettingsPage />} />
                </Route>

                {/* ============================== */}
                {/* ADMIN */}
                {/* ============================== */}

                <Route
                  path="admin"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                      <></>
                    </ProtectedRoute>
                  }
                >
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="system-health" element={<SystemHealthPage />} />
                  <Route path="audit-log" element={<AuditLogPage />} />
                </Route>

                {/* Error Pages within App */}
                <Route path="unauthorized" element={<UnauthorizedPage />} />
              </Route>

              {/* ============================== */}
              {/* ERROR ROUTES */}
              {/* ============================== */}

              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppInitializer>
      </BrowserRouter>

      {/* React Query Devtools (removed due to missing types) */}
    </QueryClientProvider>
  );
};

export default App;
