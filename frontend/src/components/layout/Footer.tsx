// ============================================
// FOOTER COMPONENT
// Site Footer
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'API Docs', href: '/docs' },
      { label: 'Changelog', href: '/changelog' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'Compliance', href: '/compliance' },
    ],
  };

  return (
    <footer className="bg-rich-black border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-institutional-blue to-precision-teal flex items-center justify-center">
                <span className="text-xl font-bold text-off-white">Æ</span>
              </div>
              <span className="text-xl font-bold text-off-white">Aequitas</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Crisis-resilient liquidity forecasting for institutional trading firms.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted hover:text-off-white transition-colors">
                <span className="sr-only">Twitter</span>
                𝕏
              </a>
              <a href="#" className="text-muted hover:text-off-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                in
              </a>
              <a href="#" className="text-muted hover:text-off-white transition-colors">
                <span className="sr-only">GitHub</span>
                ⌘
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-off-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-muted hover:text-off-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">
            © {currentYear} Aequitas Technologies, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-steady-green animate-pulse" />
              All systems operational
            </span>
            <span className="text-xs text-muted">
              SOC 2 Type II Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
