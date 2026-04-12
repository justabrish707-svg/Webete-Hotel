import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

const BASE_URL = 'https://wubetehotel.com';
const DEFAULT_IMAGE = `${BASE_URL}/images/gallery/herobackground1774779471815.webp`;

export default function SEO({ title, description, path = '', image = DEFAULT_IMAGE }: SEOProps) {
  const fullUrl = `${BASE_URL}${path}`;
  const fullTitle = `${title} | Arba Minch Wubeté Hotel`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
