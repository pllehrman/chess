// pages/signup.js
import SignupForm from '../../components/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <SignupForm />
      </div>
    </div>
  );
}
