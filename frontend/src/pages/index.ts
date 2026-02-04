// Stub pages - These are placeholders that should be implemented fully

// Marketing Pages
export { default as HomePage } from './marketing/HomePage';

// Re-export stubs for other marketing pages
export const PricingPage = () => import('./marketing/PricingPage');
export const FeaturesPage = () => import('./marketing/FeaturesPage');
export const CaseStudiesPage = () => import('./marketing/CaseStudiesPage');
