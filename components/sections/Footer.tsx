import { useLocale, useTranslations } from "next-intl";
import { company, links } from "@/content/product";
import { legalNav, mainNav } from "@/content/navigation";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { MeanderDivider } from "@/components/ui/MeanderDivider";
import { LanguageSwitcher } from "./LanguageSwitcher";

const footerLink =
  "inline-flex min-h-11 items-center text-small text-fg-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-fg hover:decoration-current";

/** Deep-ink footer with company and legal data from content/product.ts. */
export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const socials = [
    { key: "instagram", href: links.instagram, icon: "instagram" },
    { key: "facebook", href: links.facebook, icon: "facebook" },
  ] as const;

  return (
    <footer data-surface="ink" aria-label={t("label")} className="bg-surface text-fg">
      <MeanderDivider className="opacity-70" />
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
        <div className="grid content-start gap-5">
          <Logo height={30} />
          <p className="max-w-xs text-small text-fg-muted">{t("tagline")}</p>
          <ul className="flex gap-2">
            {socials.map(
              (social) =>
                social.href && (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid size-11 place-items-center rounded-full border border-hairline text-fg transition-colors hover:border-accent-fill hover:text-accent"
                    >
                      <Icon name={social.icon} size={20} />
                      <span className="sr-only">
                        {t(social.key)} {tCommon("opensInNewTab")}
                      </span>
                    </a>
                  </li>
                ),
            )}
          </ul>
        </div>

        <nav aria-labelledby="footer-nav-heading">
          <h2 id="footer-nav-heading" className="eyebrow text-accent">
            {t("navHeading")}
          </h2>
          <ul className="mt-3 grid">
            {mainNav.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={footerLink}>
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-accent">{t("contactHeading")}</h2>
          <address className="mt-3 grid gap-1 not-italic">
            <a href={company.phoneHref} className={`${footerLink} gap-2 tabular`}>
              <Icon name="phone" size={18} />
              {company.phone}
            </a>
            <a href={`mailto:${company.email}`} className={`${footerLink} gap-2 break-all`}>
              <Icon name="mail" size={18} />
              {company.email}
            </a>
            <p className="flex gap-2 py-3 text-small text-fg-muted">
              <Icon name="pin" size={18} className="mt-0.5" />
              {company.address[locale]}
            </p>
          </address>
        </div>

        <div>
          <h2 className="eyebrow text-accent">{t("legalHeading")}</h2>
          <ul className="mt-3 grid gap-2 py-3 text-small text-fg-muted">
            <li className="font-medium text-fg">{company.legalName[locale]}</li>
            <li className="tabular">{t("companyId", { id: company.idCode })}</li>
            <li className="tabular">{t("recognitionCode", { code: company.recognitionCode })}</li>
            {company.haccp && <li>{t("haccp")}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="container-page flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-fg-muted">
            {t("rights", { year: String(year), company: company.legalName[locale] })}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <ul className="flex gap-6">
              {legalNav.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={footerLink}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
