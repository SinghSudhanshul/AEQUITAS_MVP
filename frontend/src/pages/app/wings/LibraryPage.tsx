// ============================================
// LIBRARY PAGE
// Wing 3: Research & Analytics (Features 21-30)
// ============================================

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { WINGS } from '@/config/wings';
import { QUOTES } from '@/config/narrative';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { MetricCard } from '@/components/shared/MetricCard';
import { PersonaCard } from '@/components/shared/PersonaAvatar';
// import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Stores
import { useGamificationStore } from '@/store/gamification.store';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface ResearchArticle {
  id: string;
  title: string;
  abstract: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
  xpReward: number;
  isRead: boolean;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_ARTICLES: ResearchArticle[] = [
  {
    id: 'r1',
    title: 'Quantile Regression for Liquidity Forecasting',
    abstract: 'A deep dive into using quantile regression to provide P5/P50/P95 confidence intervals for daily liquidity predictions.',
    author: 'Dr. Sarah Chen',
    date: '2024-01-15',
    category: 'Machine Learning',
    readTime: 12,
    xpReward: 50,
    isRead: false,
  },
  {
    id: 'r2',
    title: 'Crisis Correlation Analysis',
    abstract: 'Understanding how market correlations change during crisis periods and implications for portfolio management.',
    author: 'Prof. Mark Williams',
    date: '2024-01-12',
    category: 'Risk Management',
    readTime: 8,
    xpReward: 35,
    isRead: true,
  },
  {
    id: 'r3',
    title: 'Monte Carlo Methods in Stress Testing',
    abstract: 'Best practices for implementing Monte Carlo simulations in regulatory stress testing frameworks.',
    author: 'James Patterson',
    date: '2024-01-10',
    category: 'Stress Testing',
    readTime: 15,
    xpReward: 60,
    isRead: false,
  },
  {
    id: 'r4',
    title: 'VIX Regime Detection Using Hidden Markov Models',
    abstract: 'An empirical study on detecting market regime changes using Hidden Markov Models on VIX data.',
    author: 'Dr. Lisa Park',
    date: '2024-01-08',
    category: 'Machine Learning',
    readTime: 10,
    xpReward: 45,
    isRead: false,
  },
];

const CATEGORIES = ['All', 'Machine Learning', 'Risk Management', 'Stress Testing', 'Market Data'];

// ============================================
// SEARCH BAR
// ============================================

const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search research papers..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        leftIcon="🔍"
        className="w-full"
      />
    </div>
  );
};

// ============================================
// ARTICLE CARD
// ============================================

interface ArticleCardProps {
  article: ResearchArticle;
  onRead: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onRead }) => {
  const { playSound } = useSoundEffects();

  const handleClick = () => {
    playSound('click');
    onRead();
  };

  return (
    <div
      className={cn(
        'p-4 bg-glass-white rounded-xl border border-glass-border',
        'hover:border-precision-teal/50 transition-all cursor-pointer',
        article.isRead && 'opacity-75'
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant={article.category === 'Machine Learning' ? 'default' : 'warning'}>
          {article.category}
        </Badge>
        {article.isRead ? (
          <span className="text-xs text-spring-green flex items-center gap-1">
            ✓ Read
          </span>
        ) : (
          <span className="text-xs text-achievement-gold">+{article.xpReward} XP</span>
        )}
      </div>

      <h3 className="font-semibold text-off-white mb-2">{article.title}</h3>
      <p className="text-sm text-muted line-clamp-2 mb-3">{article.abstract}</p>

      <div className="flex items-center justify-between text-xs text-muted">
        <span>{article.author}</span>
        <span>{article.readTime} min read</span>
      </div>
    </div>
  );
};

// ============================================
// CATEGORY FILTER
// ============================================

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  const { playSound } = useSoundEffects();

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            playSound('click');
            onSelect(cat);
          }}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
            selected === cat
              ? 'bg-precision-teal text-rich-black'
              : 'bg-glass-white text-off-white hover:bg-precision-teal/20'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

// ============================================
// MAIN PAGE
// ============================================

const LibraryPage: React.FC = () => {
  const wing = WINGS.library;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const { addXP } = useGamificationStore();

  useEffect(() => {
    addXP(10, 'page_view', 'Visited Library');
  }, [addXP]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReadArticle = (articleId: string) => {
    const article = articles.find((a) => a.id === articleId);
    if (article && !article.isRead) {
      addXP(article.xpReward, 'article_read', `Read: ${article.title}`);
      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? { ...a, isRead: true } : a))
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{wing.icon}</span>
            <h1 className="text-2xl lg:text-3xl font-bold text-off-white">
              {wing.name}
            </h1>
            <Badge variant="warning">PREMIUM</Badge>
          </div>
          <p className="text-muted">{wing.description}. Expand your knowledge, earn XP.</p>
        </div>
      </div>

      {/* Harvey Quote */}
      <div className="mb-8">
        <PersonaCard
          persona="harvey"
          quote={QUOTES.HARVEY.SUCCESS}
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Articles Read"
          value={articles.filter((a) => a.isRead).length.toString()}
          icon="📖"
        />
        <MetricCard
          title="XP Earned"
          value={articles.filter((a) => a.isRead).reduce((sum, a) => sum + a.xpReward, 0).toString()}
          icon="⭐"
        />
        <MetricCard
          title="Available"
          value={articles.filter((a) => !a.isRead).length.toString()}
          icon="📚"
        />
        <MetricCard
          title="Categories"
          value={(CATEGORIES.length - 1).toString()}
          icon="🏷️"
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <SearchBar onSearch={setSearchQuery} />
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onRead={() => handleReadArticle(article.id)}
            />
          ))
        ) : (
          <GlassPanel variant="default" padding="lg" className="col-span-2 text-center">
            <span className="text-4xl mb-4 block">🔍</span>
            <h3 className="text-lg font-semibold text-off-white mb-2">No articles found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
