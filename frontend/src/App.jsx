import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useLang } from './i18n/LangContext.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import FloatingWidgets from './components/FloatingWidgets.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProtectedRoute from './pages/admin/ProtectedRoute.jsx';
import NotFound from './pages/NotFound.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';

const PartDetail = lazy(() => import('./pages/PartDetail.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminMfa = lazy(() => import('./pages/admin/AdminMfa.jsx'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome.jsx'));
const AdminParts = lazy(() => import('./pages/admin/AdminParts.jsx'));
const AdminPartForm = lazy(() => import('./pages/admin/AdminPartForm.jsx'));
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands.jsx'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories.jsx'));

function PublicLayout({ children }) {
  const { t } = useLang();
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {t('a11y.skipToContent')}
      </a>
      <SiteHeader />
      <main id="main-content" className="main-content" tabIndex="-1">
        {children}
      </main>
      <SiteFooter />
      <FloatingWidgets />
    </div>
  );
}

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function Deferred({ children }) {
  return <Suspense fallback={<LoadingSkeleton count={4} />}>{children}</Suspense>;
}

function DocumentMetadata() {
  const { pathname } = useLocation();
  const { t } = useLang();

  useEffect(() => {
    const key = pathname.startsWith('/admin')
      ? 'meta.admin'
      : pathname === '/'
        ? 'meta.home'
        : pathname.startsWith('/catalog')
          ? 'meta.catalog'
          : pathname.startsWith('/parts/')
            ? 'meta.part'
            : pathname.startsWith('/services')
              ? 'meta.services'
              : 'meta.notFound';
    document.title = `${t(key)} | SEBATECH`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t(`${key}Description`));
  }, [pathname, t]);

  return null;
}

export default function App() {
  return (
    <>
      <DocumentMetadata />
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/catalog"
          element={
            <PublicLayout>
              <Catalog />
            </PublicLayout>
          }
        />
        <Route
          path="/parts/:id"
          element={
            <PublicLayout>
              <Deferred>
                <PartDetail />
              </Deferred>
            </PublicLayout>
          }
        />
        <Route
          path="/services"
          element={
            <PublicLayout>
              <Deferred>
                <Services />
              </Deferred>
            </PublicLayout>
          }
        />

        <Route
          path="/admin/login"
          element={
            <Deferred>
              <AdminLogin />
            </Deferred>
          }
        />
        <Route
          path="/admin/mfa"
          element={
            <Deferred>
              <AdminMfa />
            </Deferred>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected>
              <Deferred>
                <AdminHome />
              </Deferred>
            </Protected>
          }
        />
        <Route
          path="/admin/parts"
          element={
            <Protected>
              <Deferred>
                <AdminParts />
              </Deferred>
            </Protected>
          }
        />
        <Route
          path="/admin/parts/new"
          element={
            <Protected>
              <Deferred>
                <AdminPartForm />
              </Deferred>
            </Protected>
          }
        />
        <Route
          path="/admin/parts/:id"
          element={
            <Protected>
              <Deferred>
                <AdminPartForm />
              </Deferred>
            </Protected>
          }
        />
        <Route
          path="/admin/brands"
          element={
            <Protected>
              <Deferred>
                <AdminBrands />
              </Deferred>
            </Protected>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <Protected>
              <Deferred>
                <AdminCategories />
              </Deferred>
            </Protected>
          }
        />
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
      </Routes>
    </>
  );
}
