import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ShieldAlert, KeyRound, ShieldCheck, Check } from 'lucide-react';
import { StorageService, AUTHORIZED_ADMIN_EMAIL, hashAdminPassword } from '../services/storage';
import { AdminUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (admin: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState<string>(AUTHORIZED_ADMIN_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [hasPasswordSetup, setHasPasswordSetup] = useState<boolean>(false);
  const [isResetMode, setIsResetMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setEmail(AUTHORIZED_ADMIN_EMAIL);
      setPassword('');
      setConfirmPassword('');
      setError(null);
      const existingHash = StorageService.getAdminPasswordHash();
      setHasPasswordSetup(!!existingHash);
      setIsResetMode(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Strict Whitelist Check
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setError(`Access Restricted: Only ${AUTHORIZED_ADMIN_EMAIL} is authorized to access the CITDEVHUB Administration Portal.`);
      setLoading(false);
      return;
    }

    try {
      // 2. Case A: Setting up password for the first time or in Reset Mode
      if (!hasPasswordSetup || isResetMode) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter carefully.');
          setLoading(false);
          return;
        }

        // Cryptographically hash the private password
        const passwordHash = await hashAdminPassword(password);
        StorageService.setAdminPasswordHash(passwordHash);

        const admin: AdminUser = {
          email: AUTHORIZED_ADMIN_EMAIL,
          name: 'Pradhan V (Club Lead)',
          role: 'superadmin',
        };

        StorageService.setAdminSession(admin);
        onSuccess(admin);
        onClose();
        return;
      }

      // 3. Case B: Verifying existing password
      const storedHash = StorageService.getAdminPasswordHash();
      const enteredHash = await hashAdminPassword(password);

      if (enteredHash === storedHash) {
        const admin: AdminUser = {
          email: AUTHORIZED_ADMIN_EMAIL,
          name: 'Pradhan V (Club Lead)',
          role: 'superadmin',
        };

        StorageService.setAdminSession(admin);
        onSuccess(admin);
        onClose();
      } else {
        setError('Incorrect password. Please try again or use the reset option below.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSetupMode = !hasPasswordSetup || isResetMode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#0A66C2]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Executive Admin Portal</h3>
              <p className="text-[11px] text-slate-500">Restricted to Club Lead only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Security Banner */}
          <div className="mb-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#0A66C2] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Authorized Account:</strong>
              <span className="font-mono text-[11px] text-blue-800">{AUTHORIZED_ADMIN_EMAIL}</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isSetupMode ? (
            <div className="mb-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Welcome, <strong>Pradhan V</strong>. Set your private master password for the admin portal below.
                Your password is cryptographically protected via client-side SHA-256 and only you can unlock this portal.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Enter your private master password to access the workshop manager, templates, and registries.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email (Locked to Authorized Owner)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2] text-slate-900 bg-slate-50 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isSetupMode ? 'Create Master Password' : 'Enter Master Password'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSetupMode ? 'Create your private password (min 6 chars)' : '••••••••••••'}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2] text-slate-900 bg-white"
                />
              </div>
            </div>

            {isSetupMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Master Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2] text-slate-900 bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0A66C2] hover:bg-[#084e96] text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : isSetupMode ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Password &amp; Open Portal</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Reset password toggle for Pradhan */}
          {!isSetupMode && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setError(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-[11px] text-slate-500 hover:text-[#0A66C2] underline transition-colors"
              >
                Change or reset master password
              </button>
            </div>
          )}

          {isResetMode && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setError(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel and return to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
