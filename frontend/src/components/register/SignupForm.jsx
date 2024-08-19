'use client'

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SignupForm() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, { firstname, lastname, email, password});
      router.push('/'); // Redirect to the home page after successful signup
    } catch (error) {
      router.push('/register');
      console.error('Error signing up:', error);
    }
  };

  const checkEmail = async (newEmail) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC__API_URL}/users/check-email`, {
        params: { email: newEmail }
      });

      const isUnique = response.data.isUnique; // Check if the email is unique
      if (isUnique) {
        setEmailMessage('Email is already taken.');
      } else {
        setEmailMessage('Email is available.');
      }
    } catch (error) {
      console.error('Error in validating email', error);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    debouncedCheckEmail(newEmail);
  };

  const validatePassword = (password) => {
    // Example: Ensure password is at least 8 characters long
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validationMessage = validatePassword(newPassword);
    setPasswordError(validationMessage);
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedCheckEmail = useCallback(debounce(checkEmail, 1000), []);

  const emailMessageClass = emailMessage === 'Email is available.'
    ? 'text-green-500'
    : 'text-red-500';

  return (
        <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2"
              required
            />
            <p className={`text-sm mt-2 ${emailMessageClass}`}>{emailMessage}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2"
              required
            />
            <p className="text-red-500 text-sm mt-2">{passwordError}</p>
          </div>
          <div className="mb-6">
            <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Sign Up
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm">Already have an account? <Link href="/login" className="text-indigo-600 hover:text-indigo-700">Log in</Link></p>
          </div>
        </form>
  );
}

