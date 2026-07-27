import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../../supabaseClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mfaStatus, setMfaStatus] = useState('signed-out');
  const [sessionExpired, setSessionExpired] = useState(false);
  const hadSession = useRef(false);

  const refreshAuthorization = async (activeSession) => {
    if (!supabase) {
      setSession(null);
      setIsAdmin(false);
      setMfaStatus('signed-out');
      setLoading(false);
      return { isAdmin: false, mfaStatus: 'signed-out' };
    }
    const currentSession = activeSession ?? (await supabase.auth.getSession()).data.session ?? null;
    setSession(currentSession);
    hadSession.current = Boolean(currentSession);

    if (!currentSession?.user) {
      setIsAdmin(false);
      setMfaStatus('signed-out');
      setLoading(false);
      return { isAdmin: false, mfaStatus: 'signed-out' };
    }

    const { data: membership, error: membershipError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', currentSession.user.id)
      .maybeSingle();

    const approved = !membershipError && Boolean(membership);
    setIsAdmin(approved);

    if (!approved) {
      setMfaStatus('not-admin');
      setLoading(false);
      return { isAdmin: false, mfaStatus: 'not-admin' };
    }

    const { data: assurance, error: assuranceError } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) throw assuranceError;

    const nextStatus =
      assurance.currentLevel === 'aal2'
        ? 'verified'
        : assurance.nextLevel === 'aal2'
          ? 'challenge'
          : 'enroll';
    setMfaStatus(nextStatus);
    setLoading(false);
    return { isAdmin: true, mfaStatus: nextStatus };
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) refreshAuthorization(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!newSession && hadSession.current) setSessionExpired(true);
      if (newSession) hadSession.current = true;
      setSession(newSession);
      if (!newSession) {
        setIsAdmin(false);
        setMfaStatus('signed-out');
        setLoading(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!supabase) throw new Error('Supabase configuration is missing.');
    setSessionExpired(false);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const authorization = await refreshAuthorization(data.session);
    if (!authorization.isAdmin) {
      await supabase.auth.signOut();
      throw new Error('This account is not an approved catalog administrator.');
    }
    return authorization;
  };

  const logout = async () => {
    hadSession.current = false;
    setSessionExpired(false);
    if (supabase) await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        isAdmin,
        mfaStatus,
        loading,
        login,
        logout,
        refreshAuthorization,
        sessionExpired
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
