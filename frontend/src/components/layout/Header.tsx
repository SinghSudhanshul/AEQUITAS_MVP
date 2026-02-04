// ============================================
// HEADER COMPONENT
// Top Navigation Bar
// ============================================

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  onLogin,
  onLogout,
}) => {
  const location = useLocation();
  const isLanding = location.pathname === '/' || location.pathname === '/home';

  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/docs', label: 'Docs' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-glass-bg backdrop-blur-xl border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-institutional-blue to-precision-teal flex items-center justify-center">
              <span className="text-xl font-bold text-off-white">Æ</span>
            </div>
            <span className="text-xl font-bold text-off-white hidden sm:block">
              Aequitas
            </span>
          </Link>

          {/* Navigation - Landing Page */}
          {isLanding && !isAuthenticated && (
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted hover:text-off-white transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/app">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={onLogin}>
                  Log In
                </Button>
                <Link to="/signup">
                  <Button variant="default" size="sm">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
