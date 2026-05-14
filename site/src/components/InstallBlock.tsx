import { Terminal } from "lucide-react";
import { CopyButton } from "./CopyButton";

type Props = {
  snippet: string;
  showSkipHint?: boolean;
};

export function InstallBlock({ snippet, showSkipHint = true }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/50 overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
          <Terminal size={14} className="text-blue-400" />
          <span>Run in Claude Code</span>
        </div>
        <CopyButton text={snippet} />
      </div>
      <pre className="p-4 text-[13px] leading-relaxed overflow-x-auto font-mono">
        <code className="text-neutral-100">
          {snippet.split("\n").map((line, i) => (
            <span key={i} className="block">
              <span className="text-neutral-500 select-none mr-3">
                {String(i + 1).padStart(2, " ")}
              </span>
              {line}
            </span>
          ))}
        </code>
      </pre>
      {showSkipHint && (
        <div className="px-4 py-2.5 text-[11px] text-neutral-500 border-t border-white/10 bg-white/[0.02]">
          Already added the marketplace? Skip line 1. Each <span className="font-mono text-neutral-400">/plugin install</span> line runs as a separate command in Claude Code.
        </div>
      )}
    </div>
  );
}
