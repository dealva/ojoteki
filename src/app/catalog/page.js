
import CatalogView from '@/components/catalog/CatalogView';
import { metadataConfig } from '@/lib/metadata';

export const metadata = metadataConfig.catalog;

export default async function CatalogPage({ searchParams }) {
  // Dummy Google login handler (replace with real OAuth logic)

  return (
      <CatalogView searchParams={searchParams}  />
  );
}
