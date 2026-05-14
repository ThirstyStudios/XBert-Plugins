export function Footer() {
  return (
    <footer className="mt-32 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-sm text-neutral-500">
          © {new Date().getFullYear()} XBert Intelligence. Plugins are MIT-licensed.
        </div>
        <div className="flex items-center gap-6 text-sm text-neutral-400">
          <a href="https://github.com/ThirstyStudios/XBert-Plugins" className="hover:text-white transition">
            GitHub
          </a>
          <a href="https://docs.anthropic.com/en/docs/claude-code/setup" className="hover:text-white transition">
            Get Claude Code
          </a>
          <a href="https://xbert.io" className="hover:text-white transition">
            xbert.io
          </a>
        </div>
      </div>
    </footer>
  );
}
