import { api } from '../../api.js';
import AdminReferenceList from './AdminReferenceList.jsx';

const brandApi = {
  list: api.getBrands,
  create: api.createBrand,
  update: api.updateBrand,
  remove: api.deleteBrand
};

export default function AdminBrands() {
  return (
    <AdminReferenceList
      titleKey="admin.ref.brandsTitle"
      subtitleKey="admin.ref.brandsSubtitle"
      api={brandApi}
    />
  );
}
