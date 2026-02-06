import { getCategoryById } from '@/data/categories';

interface BreadcrumbsProps {
  category?: string;
  articleTitle?: string;
  onNavigate: () => void;
}

export default function Breadcrumbs({ category, articleTitle, onNavigate }: BreadcrumbsProps) {
  const categoryData = category ? getCategoryById(category) : null;

  // Generate JSON-LD for breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://trendverse.com'
      },
      ...(categoryData ? [{
        '@type': 'ListItem',
        'position': 2,
        'name': categoryData.label,
        'item': `https://trendverse.com/category/${category}`
      }] : []),
      ...(articleTitle ? [{
        '@type': 'ListItem',
        'position': categoryData ? 3 : 2,
        'name': articleTitle
      }] : [])
    ]
  };

  return (
    <>
      {/* Structured data for breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <button
              onClick={onNavigate}
              className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              itemProp="item"
            >
              <span itemProp="name">🏠 Home</span>
            </button>
            <meta itemProp="position" content="1" />
          </li>

          {categoryData && (
            <>
              <li className="text-gray-400 dark:text-gray-500">/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <button
                  onClick={onNavigate}
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{categoryData.icon} {categoryData.label}</span>
                </button>
                <meta itemProp="position" content="2" />
              </li>
            </>
          )}

          {articleTitle && (
            <>
              <li className="text-gray-400 dark:text-gray-500">/</li>
              <li 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
                className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px] sm:max-w-xs"
              >
                <span itemProp="name">{articleTitle}</span>
                <meta itemProp="position" content={categoryData ? "3" : "2"} />
              </li>
            </>
          )}
        </ol>
      </nav>
    </>
  );
}
