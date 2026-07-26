import { api } from '../../api.js';
import AdminReferenceList from './AdminReferenceList.jsx';

const categoryApi = {
  list: api.getCategories,
  create: api.createCategory,
  update: api.updateCategory,
  remove: api.deleteCategory
};

export default function AdminCategories() {
  return (
    <AdminReferenceList
      titleKey="admin.ref.categoriesTitle"
      subtitleKey="admin.ref.categoriesSubtitle"
      api={categoryApi}
    />
  );
}
