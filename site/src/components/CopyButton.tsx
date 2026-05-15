import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Props = { text: string; label?: string };

export function CopyButton({ text, label = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
      type="button"
      className="relative inline-flex items-center gap-2 rounded-md bg-black/[0.05] hover:bg-black/[0.10] border-black/10 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/10 px-3 py-1.5 text-xs font-medium tracking-wide transition border"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <Check size={14} className="text-emerald-400" />
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2"
          >
            <Copy size={14} />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
