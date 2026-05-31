import { Terminal } from "lucide-react";
import { CopyButton } from "./CopyButton";

type Props = {
  snippet: string;
  showSkipHint?: boolean;
};

export function InstallBlock({ snippet, showSkipHint = true }: Props) {
  return (
    <div className="rounded-xl border border-black/10 bg-neutral-50 dark:border-white/10 dark:bg-black/50 overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
          <Terminal size={14} className="text-blue-500 dark:text-blue-400" />
          <span>Run in Claude-Cowork CLI</span>
        </div>
        <CopyButton text={snippet} />
      </div>
      <pre className="p-4 text-[13px] leading-relaxed overflow-x-auto font-mono">
        <code className="text-neutral-900 dark:text-neutral-100">
          {snippet.split("\n").map((line, i) => (
            <span key={i} className="block">
              <span className="text-neutral-400 dark:text-neutral-500 select-none mr-3">
                {String(i + 1).padStart(2, " ")}
              </span>
              {line}
            </span>
          ))}
        </code>
      </pre>
      {showSkipHint && (
        <div className="px-4 py-2.5 text-[11px] text-neutral-500 border-t border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
          Already added the XBert marketplace? Skip line 1. Each <span className="font-mono text-neutral-700 dark:text-neutral-400">/plugin install</span> line runs as a separate command in Claude-Cowork CLI.
        </div>
      )}
    </div>
  );
}
