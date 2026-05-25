export function Footer() {
  return (
    <footer className="mt-32 border-t border-black/[0.08] dark:border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <img
            src="/xbert-wordmark.svg"
            alt="XBert"
            className="h-6 w-auto dark:brightness-0 dark:invert"
          />
          <div className="text-sm text-neutral-500">
            © {new Date().getFullYear()} XBert Intelligence. Plugins are MIT-licensed.
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
          <a
            href="/connect"
            className="hover:text-neutral-900 dark:hover:text-white transition"
          >
            Connect
          </a>
          <a
            href="/inside-xbert"
            className="hover:text-neutral-900 dark:hover:text-white transition"
          >
            Inside XBert
          </a>
          <a
            href="https://github.com/ThirstyStudios/XBert-Plugins"
            className="hover:text-neutral-900 dark:hover:text-white transition"
          >
            GitHub
          </a>
          <a
            href="https://xbert.io"
            className="hover:text-neutral-900 dark:hover:text-white transition"
          >
            xbert.io
          </a>
        </div>
      </div>
    </footer>
  );
}
