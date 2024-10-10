import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      // Registration successful, redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create an account. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;