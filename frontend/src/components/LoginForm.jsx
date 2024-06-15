'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error message

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/check-password`, { email, password });
      
      // Passwords match
      if (response.data.isMatch) {
        router.push('/');
      } else {
        // Incorrect password
        setErrorMessage('Incorrect email or password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred while logging in. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2"
          required
        />
      </div>
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
      <div className="mb-6">
        <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Log In
        </button>
      </div>
    </form>
  );
}
