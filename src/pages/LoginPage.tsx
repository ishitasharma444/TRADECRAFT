import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthService } from '../services/auth';
import { useGameStore } from '../store/gameStore';
import { LoginSchema } from '../validation/schemas';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, isAuthenticated } = useGameStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // If already authenticated, redirect directly to /app
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGoogleError(null);

    const validation = LoginSchema.safeParse({ email, password, rememberMe });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const result = await AuthService.signIn(email, password);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.user) {
      setUser(result.user);
      navigate('/app');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleError(null);
    const result = await AuthService.signInWithGoogle();
    if (result.error) {
      setGoogleError(result.error);
    }
  };

  const handleDemoMode = () => {
    const demoUser = AuthService.loginAsDemoUser();
    setUser(demoUser);
    navigate('/app');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Card variant="glow" className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 bg-emerald-500 rounded-xl items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20 mb-2">
            T
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">ENTER MARKETVERSE</h2>
          <p className="text-xs text-slate-400">Your financial learning adventure starts here.</p>
        </div>

        {/* Security / Educational Disclaimer Badge */}
        <div className="flex items-center justify-center gap-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SIMULATION • EDUCATIONAL • NO REAL MONEY</span>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        {googleError && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
            {googleError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="trader@tradecraft.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 text-emerald-500 focus:ring-emerald-500 bg-slate-950"
              />
              Remember session
            </label>
            <Link to="/forgot-password" className="text-emerald-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full font-bold" isLoading={isLoading}>
            <LogIn className="w-4 h-4 mr-1" /> CONTINUE
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-mono text-slate-500 uppercase">OR</span>
        </div>

        {/* Continue with Google */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 py-2.5 rounded-lg text-xs font-semibold transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        {/* Instant Demo Account Shortcut */}
        <div className="pt-2 text-center">
          <button
            onClick={handleDemoMode}
            type="button"
            className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            ⚡ Instant Evaluation Demo Mode <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-emerald-400 font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </Card>
    </div>
  );
};
