import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}

const siteTitle = "CalsYog | India's Premium Calisthenics & Yoga Studio";
const defaultDescription = "Master your body and mind at CalsYog. Offering expert-led Calisthenics coaching, Yoga classes, and premium fitness equipment exactly tailored to your growth.";
const domain = "https://calsyog.in";

export function SEO({ title, description, canonical, noindex = false }: SEOProps) {
  const fullTitle = title ? `${title} | CalsYog` : siteTitle;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = canonical ? `${domain}${canonical}` : domain;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      {!noindex && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {!noindex && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
