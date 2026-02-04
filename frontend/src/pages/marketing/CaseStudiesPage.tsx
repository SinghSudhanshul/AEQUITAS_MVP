// ============================================
// CASE STUDIES PAGE (Stub)
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CaseStudiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-rich-black">
      <nav className="border-b border-glass-border py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-precision-teal to-institutional-blue flex items-center justify-center">
              <span className="font-bold text-sm text-rich-black">A</span>
            </div>
            <span className="font-bold text-off-white">Aequitas</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <Badge variant="premium" className="mb-4">Case Studies</Badge>
        <h1 className="text-4xl font-bold text-off-white mb-4">Success Stories</h1>
        <p className="text-muted mb-8">Case studies coming soon.</p>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default CaseStudiesPage;
