import { Accordion } from "@/components/ui/Accordion";
import type { FaqEntry } from "@/content/faq";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";

/** FAQ entries in an Accordion; links in an answer (contact form, phone, email) follow it. */
export function FaqList({
  entries,
  locale,
  className,
}: {
  entries: readonly FaqEntry[];
  locale: Locale;
  className?: string;
}) {
  return (
    <Accordion
      className={className}
      items={entries.map((entry) => ({
        id: entry.id,
        title: entry.question[locale],
        content: (
          <>
            <p>{entry.answer[locale]}</p>
            {entry.links && (
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                {entry.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className={faqLink}>
                        {link.label[locale]}
                      </Link>
                    ) : (
                      <a href={link.href} className={faqLink}>
                        {link.label[locale]}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        ),
      }))}
    />
  );
}

const faqLink =
  "inline-flex min-h-11 items-center font-medium text-link underline decoration-1 underline-offset-[0.3em] hover:decoration-2";
