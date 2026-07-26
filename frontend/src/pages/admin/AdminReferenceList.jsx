import { useEffect, useState } from 'react';
import { useLang } from '../../i18n/LangContext.jsx';
import { useToast } from '../../components/ToastContext.jsx';
import AdminNav from './AdminNav.jsx';

/**
 * Generic "simple list" manager for reference data (brands, categories).
 * Each item has name_en / name_ka. Kept intentionally simple: inline edit,
 * explicit Save button per row, single add form at the top.
 */
export default function AdminReferenceList({ titleKey, subtitleKey, api: entityApi }) {
  const { t } = useLang();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEn, setNewEn] = useState('');
  const [newKa, setNewKa] = useState('');
  const [drafts, setDrafts] = useState({});
  const [adding, setAdding] = useState(false);

  const load = () => {
    setLoading(true);
    entityApi
      .list()
      .then((data) => {
        setItems(data);
        setDrafts(Object.fromEntries(data.map((i) => [i.id, { name_en: i.name_en, name_ka: i.name_ka }])));
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEn.trim() || !newKa.trim()) return;
    setAdding(true);
    try {
      await entityApi.create({ name_en: newEn.trim(), name_ka: newKa.trim() });
      setNewEn('');
      setNewKa('');
      showToast(t('toast.added'));
      load();
    } catch {
      showToast(t('toast.error'), 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleSaveRow = async (id) => {
    try {
      await entityApi.update(id, drafts[id]);
      showToast(t('toast.saved'));
      load();
    } catch {
      showToast(t('toast.error'), 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    try {
      await entityApi.remove(id);
      showToast(t('toast.deleted'));
      load();
    } catch {
      showToast(t('toast.error'), 'error');
    }
  };

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="container" style={{ paddingTop: 32, maxWidth: 760 }}>
        <h1 className="page-title">{t(titleKey)}</h1>
        <p className="page-subtitle">{t(subtitleKey)}</p>

        <form className="ref-add-form" onSubmit={handleAdd}>
          <input
            className="input"
            placeholder={t('admin.ref.nameEn')}
            value={newEn}
            onChange={(e) => setNewEn(e.target.value)}
          />
          <input
            className="input"
            placeholder={t('admin.ref.nameKa')}
            value={newKa}
            onChange={(e) => setNewKa(e.target.value)}
          />
          <button className="btn btn-primary btn-lg" type="submit" disabled={adding}>
            {t('admin.ref.addButton')}
          </button>
        </form>

        {!loading && items.length === 0 && <div className="empty-state">{t('admin.ref.empty')}</div>}

        <div className="ref-list">
          {items.map((item) => (
            <div className="ref-row" key={item.id}>
              <input
                className="input"
                value={drafts[item.id]?.name_en ?? ''}
                onChange={(e) =>
                  setDrafts({ ...drafts, [item.id]: { ...drafts[item.id], name_en: e.target.value } })
                }
              />
              <input
                className="input"
                value={drafts[item.id]?.name_ka ?? ''}
                onChange={(e) =>
                  setDrafts({ ...drafts, [item.id]: { ...drafts[item.id], name_ka: e.target.value } })
                }
              />
              <button className="btn btn-outline" onClick={() => handleSaveRow(item.id)}>
                {t('admin.form.save')}
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                {t('admin.delete')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
