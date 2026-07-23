import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

export interface FaqItemProps {
  /** Question, verbatim from the FAQ BLOCK. */
  question: string;
  /** Answer, verbatim (plain text). */
  answer: string;
  defaultOpen?: boolean;
}

/**
 * Accessible FAQ disclosure — button with aria-expanded/aria-controls and an
 * animated panel (instant under prefers-reduced-motion).
 *
 *   <FaqItem question="What is the XBert MCP?" answer="MCP stands for…" />
 */
export function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion();
  const panelId = useId();

  return (
    <div className="border-b border-black/10 dark:border-white/10">
      {/* The question is a real heading so the FAQ can be navigated by heading
          and parsed as a question node, not a button label. */}
      <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        >
          <span>{question}</span>
          <ChevronDown
            size={16}
            aria-hidden
            className={`flex-shrink-0 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      {/* Always mounted: the answer text must stay in the DOM to back the
          FAQPage JSON-LD and to keep aria-controls pointing at a real node. */}
      <motion.div
        id={panelId}
        role="region"
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed max-w-2xl">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

/**
 * Emits FAQPage JSON-LD into <head> for the given Q&As (AEO). Render ONCE on
 * the page that hosts the FAQ block (Home), alongside the FaqItem list:
 *
 *   <FaqJsonLd items={FAQS} />
 *   {FAQS.map((f) => <FaqItem key={f.question} {...f} />)}
 */
export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  // Rendered as real JSX, not injected in an effect: renderToString emits it
  // into the prerendered HTML, so answer engines and crawlers that never run
  // JS still get the FAQPage markup.
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://intelligence.xbert.io/#faq",
    url: "https://intelligence.xbert.io/",
    name: "Questions people actually ask",
    inLanguage: "en-AU",
    isPartOf: { "@id": "https://intelligence.xbert.io/#website" },
    about: { "@id": "https://intelligence.xbert.io/#xbert-mcp" },
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  });
  return (
    <script
      type="application/ld+json"
      // The payload is our own static copy; JSON.stringify escapes it.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
