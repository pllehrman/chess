export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-2 fixed bottom-0 left-0 w-full">
      <div className="container mx-auto w-full sm:w-4/5 lg:w-2/5 flex justify-center items-center text-center space-x-2 sm:space-x-4">
        <p className="text-[0.75rem] sm:text-[0.875rem] md:text-[1rem] text-gray-400 dark:text-gray-500">
          &copy; 2024 Peter Lehrman
        </p>
        <a
          href="/credits.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.75rem] sm:text-[0.875rem] md:text-[1rem] text-blue-400 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-600"
        >
          Credits
        </a>
        <a
          href="/terms-of-use.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.75rem] sm:text-[0.875rem] md:text-[1rem] text-blue-400 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-600"
        >
          Terms of Use
        </a>
        <a
          href="/privacy-policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.75rem] sm:text-[0.875rem] md:text-[1rem] text-blue-400 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-600"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
