import { useTranslations } from "next-intl";
import { SiteShell } from "@/components/sections/SiteShell";
import { StatusPage } from "@/components/sections/StatusPage";
import { Button } from "@/components/ui/Button";

export default function LocaleNotFound() {
  const t = useTranslations("NotFound");
  const tCommon = useTranslations("Common");
  return (
    <SiteShell>
      <title>{t("title")}</title>
      <meta name="robots" content="noindex" />
      <StatusPage
        code={t("code")}
        title={t("title")}
        text={t("text")}
        actions={
          <Button href="/" iconEnd="arrowRight">
            {tCommon("backToHome")}
          </Button>
        }
      />
    </SiteShell>
  );
}
