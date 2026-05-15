import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <div className="text-7xl font-semibold tracking-tight text-neutral-400 dark:text-neutral-700">404</div>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">That page doesn't exist.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition"
      >
        Back to home
      </Link>
    </div>
  );
}
