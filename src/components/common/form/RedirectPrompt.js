import Link from 'next/link';

const RedirectPrompt = ({ message, linkText, href }) => (
  <p className="mt-4 text-center text-sm">
    {message}{' '}
    <Link href={href} className="text-blue-600 hover:underline">
      {linkText}
    </Link>
  </p>
);

export default RedirectPrompt;
