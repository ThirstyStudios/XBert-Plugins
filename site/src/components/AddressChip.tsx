import { CopyButton } from "./CopyButton";

/** The one true MCP address — import this rather than retyping the URL. */
export const MCP_ADDRESS = "https://mcp-gateway.xbert.io/mcp";

export interface AddressChipProps {
  /** Text to display and copy. Defaults to the MCP address. */
  value?: string;
  /** Optional label rendered above the value, e.g. "XBert MCP address". */
  label?: string;
  className?: string;
}

/**
 * Monospace address/snippet chip with the standard Copy → Copied affordance.
 * Used for the MCP address in the Home CTA band, the Get started endpoint
 * box and the footer endpoint line.
 *
 *   <AddressChip label="XBert MCP address" />
 */
export function AddressChip({ value = MCP_ADDRESS, label, className = "" }: AddressChipProps) {
  return (
    <div
      className={`inline-flex flex-col gap-1 rounded-xl border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04] px-4 py-3 ${className}`}
    >
      {label && (
        <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 text-left">
          {label}
        </span>
      )}
      <span className="flex flex-wrap items-center gap-3">
        {/* break-words, not break-all: the address moves whole to the next line
            rather than being split mid-token. */}
        <code className="font-mono text-sm text-neutral-900 dark:text-neutral-100 break-words">
          {value}
        </code>
        <CopyButton text={value} />
      </span>
    </div>
  );
}
