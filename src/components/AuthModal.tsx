import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, Mail, Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function AuthModal({ 
  mode, 
  onClose, 
  onSuccess,
  onSwitchMode 
}: { 
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (user: any) => void;
  onSwitchMode: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Validate
        if (!formData.name || !formData.email || !formData.password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Sign up via backend API
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-51144976/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name
          })
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to create account');
        }

        const userSession = {
          id: data.user.id,
          name: formData.name,
          email: formData.email,
          plan: 'trial',
          accessToken: data.access_token
        };

        // Save session to localStorage
        localStorage.setItem('clickblock_user_session', JSON.stringify(userSession));

        onSuccess(userSession);
        
        setLoading(false);
      } else {
        // Sign in
        if (!formData.email || !formData.password) {
          setError('Please enter email and password');
          setLoading(false);
          return;
        }

        // Sign in via backend API
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-51144976/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to sign in');
        }

        const userSession = {
          id: data.user.id,
          name: data.user.user_metadata?.name || 'User',
          email: formData.email,
          plan: data.user.user_metadata?.plan || 'professional',
          accessToken: data.access_token
        };

        // Save session to localStorage
        localStorage.setItem('clickblock_user_session', JSON.stringify(userSession));

        onSuccess(userSession);
        
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-slate-900 border-white/10 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">
              {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400">
              {mode === 'signup' 
                ? 'Start your 7-day $1 trial today' 
                : 'Sign in to your ClickBlock account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500/50 text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500/50 text-white"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500/50 text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-slate-400 mt-1">Must be at least 8 characters</p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500/50 text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                mode === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center text-sm text-slate-400">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={onSwitchMode}
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={onSwitchMode}
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {mode === 'signin' && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                Forgot password?
              </a>
            </div>
          )}

          {mode === 'signup' && (
            <p className="mt-6 text-xs text-slate-500 text-center">
              By creating an account, you agree to our{' '}
              <a href="/terms-of-service" className="text-orange-400 hover:text-orange-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" className="text-orange-400 hover:text-orange-300">
                Privacy Policy
              </a>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}