import EditProductView from '@/components/admin/edit/EditProductView';

export default async function EditProductPage({ params }) {
    const p= await params;
  const id = p.id;

  return <EditProductView productId={id} />;
}
