import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Lock, Mail, User, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register({ name, email, password });
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#080808]">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-gold-strong relative">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] p-0.5 shadow-gold-strong flex items-center justify-center">
            <div className="w-full h-full bg-[#080808] rounded-[14px] flex items-center justify-center">
              <Crown className="w-7 h-7 text-[#FFD700]" />
            </div>
          </div>
          <h2 className="font-serif-luxury text-3xl font-bold text-white mb-1">
            VIP <span className="gold-gradient-text">Membership</span>
          </h2>
          <p className="text-gray-400 text-xs tracking-wider uppercase font-semibold">
            Join EliteRank Global Intelligence Network
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
              Full Name / Designation
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#D4AF37] absolute left-4 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lord / Lady / CEO Name"
                className="w-full pl-11 pr-4 py-3 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D4AF37] absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="executive@company.com"
                className="w-full pl-11 pr-4 py-3 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D4AF37] absolute left-4 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-11 pr-4 py-3 bg-[#121212] border border-gray-800 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold text-sm rounded-xl hover:shadow-gold-strong transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating Membership...' : 'Register VIP Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          <span>Already registered? </span>
          <Link to="/login" className="text-[#FFD700] hover:underline font-semibold">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
