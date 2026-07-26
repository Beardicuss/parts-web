import { Routes, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import PartDetail from './pages/PartDetail.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminHome from './pages/admin/AdminHome.jsx';
import AdminParts from './pages/admin/AdminParts.jsx';
import AdminPartForm from './pages/admin/AdminPartForm.jsx';
import AdminBrands from './pages/admin/AdminBrands.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import ProtectedRoute from './pages/admin/ProtectedRoute.jsx';

function PublicLayout({ children }) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/catalog" element={<PublicLayout><Catalog /></PublicLayout>} />
      <Route path="/parts/:id" element={<PublicLayout><PartDetail /></PublicLayout>} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Protected><AdminHome /></Protected>} />
      <Route path="/admin/parts" element={<Protected><AdminParts /></Protected>} />
      <Route path="/admin/parts/new" element={<Protected><AdminPartForm /></Protected>} />
      <Route path="/admin/parts/:id" element={<Protected><AdminPartForm /></Protected>} />
      <Route path="/admin/brands" element={<Protected><AdminBrands /></Protected>} />
      <Route path="/admin/categories" element={<Protected><AdminCategories /></Protected>} />
    </Routes>
  );
}
