
import React, { useState } from 'react';

interface SignUpProps {
  onSignUp: (name: string, email: string, pass: string) => Promise<void>;
  onNavigate: (page: 'login') => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onSignUp(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16 sm:py-24 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Create Account</h1>
        <p className="mt-4 text-lg text-gray-300">Join the UrbanEdge community.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-md">{error}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full bg-gray-800 border-gray-700 text-white p-3 focus:ring-white focus:border-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full bg-gray-800 border-gray-700 text-white p-3 focus:ring-white focus:border-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full bg-gray-800 border-gray-700 text-white p-3 focus:ring-white focus:border-white"
          />
        </div>
        <div>
          <button type="submit" className="w-full px-8 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300">
            Sign Up
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="font-medium text-white hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;