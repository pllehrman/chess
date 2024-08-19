export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-3 fixed bottom-0 left-0 w-full">
      <div className="container mx-auto w-2/5 flex justify-center items-center text-center space-x-6">
        <p className="text-gray-400 dark:text-gray-500">&copy; 2024 Peter Lehrman</p>
        <a
          href="/credits.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-600"
        >
          Credits
        </a>
        <a
          href="/terms-of-use.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-600"
        >
          Terms of Use
        </a>
        <a
          href="/privacy-policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-600"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
