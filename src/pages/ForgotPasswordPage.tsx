import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Mail, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card variant="glow" className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your registered email to receive password reset instructions.</p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-3">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-slate-200">
              If an account associated with <span className="font-bold text-white">{email}</span> exists, password reset instructions have been dispatched.
            </p>
            <Link to="/login">
              <Button variant="outline" size="sm" className="w-full mt-2">Return to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="trader@tradecraft.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full font-bold">
              <Mail className="w-4 h-4 mr-1" /> Send Reset Link
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
