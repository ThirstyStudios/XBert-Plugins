import { Link } from "react-router";
import { CopyButton } from "./CopyButton";
import { MCP_ADDRESS } from "./AddressChip";

const SETUP_GUIDE_URL =
  "https://support.xbert.io/en/articles/14492922-how-to-add-xbert-as-a-custom-mcp-connector-in-claude";

const columnHeadingClass =
  "text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3";

const footerLinkClass =
  "text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition";

export function Footer() {
  return (
    <footer className="mt-20 md:mt-32 border-t border-black/[0.08] dark:border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            {/* /xbert-wordmark.svg is byte-identical to the 994×370 landscape
                lockup, so it renders illegibly small here — and brightness-0/invert
                destroys the official indigo mark. Use the same mark + wordmark
                lockup the header uses. */}
            <div className="flex items-center gap-2">
              <img src="/xbert-mark.svg" alt="XBert" width={28} height={28} className="size-7" />
              <span className="font-display text-lg font-semibold tracking-tight">XBert</span>
            </div>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
              AI Work Intelligence for Bookkeepers + Accountants. The intelligence layer you can
              trust and rely on in the agentic era.
            </p>
          </div>

          <nav aria-label="Product">
            <div className={columnHeadingClass}>Product</div>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={footerLinkClass}>
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/get-started" className={footerLinkClass}>
                  Get started
                </Link>
              </li>
              <li>
                <Link to="/features" className={footerLinkClass}>
                  Features
                </Link>
              </li>
              <li>
                <Link to="/inside-xbert" className={footerLinkClass}>
                  Inside XBert
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Support">
            <div className={columnHeadingClass}>Support</div>
            <ul className="space-y-2">
              <li>
                <a
                  href={SETUP_GUIDE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  Setup guide
                </a>
              </li>
              <li>
                <a
                  href="https://support.xbert.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  Help centre
                </a>
              </li>
              <li>
                <Link to="/get-started#manage-access" className={footerLinkClass}>
                  Managing access
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="XBert">
            <div className={columnHeadingClass}>XBert</div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://xbert.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  xbert.io
                </a>
              </li>
              <li>
                <a
                  href="https://www.xbert.io/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="https://www.xbert.io/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  Privacy
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-black/[0.06] dark:border-white/[0.06] mt-10 pt-6 space-y-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            XBert connects to Xero, QuickBooks, MYOB and FreeAgent — plus Xero Practice Manager, if
            your practice runs it, for jobs, WIP and capacity.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>MCP endpoint:</span>
            <code className="font-mono text-neutral-700 dark:text-neutral-300">{MCP_ADDRESS}</code>
            <CopyButton text={MCP_ADDRESS} />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Your assistant inherits your XBert permissions. Write actions are marked for your
            assistant to confirm, and every action is written to the XBert audit log.
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            © XBert Pty Ltd 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
