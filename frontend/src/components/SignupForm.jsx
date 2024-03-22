'use client'

import Link from 'next/link';

export default function SignupForm() {
  return (
    <form>
      <div className="mb-4">
        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
        <input type="text" id="firstname" name="firstname" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2" required />
      </div>
      <div className="mb-4">
        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
        <input type="text" id="lastname" name="lastname" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2" required />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2" required />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" id="password" name="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2" required />
      </div>
      <div className="mb-6">
        <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Sign Up</button>
      </div>
      <div className="text-center">
        <p className="text-sm">Already have an account? <Link href="/login" className="text-indigo-600 hover:text-indigo-700">Log in</Link></p>
      </div>
    </form>
  );
}
