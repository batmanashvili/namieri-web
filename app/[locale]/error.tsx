"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { StatusPage } from "@/components/sections/StatusPage";
import { Button } from "@/components/ui/Button";
import { company } from "@/content/product";

/** Localized 500 page for errors inside a route. The layout (and its header) stays. */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");
  const tCommon = useTranslations("Common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main">
      <StatusPage
        code={t("code")}
        title={t("title")}
        text={t("text", { phone: company.phone })}
        actions={
          <>
            <Button onClick={reset} iconStart="arrowRight">
              {tCommon("tryAgain")}
            </Button>
            <Button href="/" variant="secondary">
              {tCommon("backToHome")}
            </Button>
          </>
        }
      />
    </main>
  );
}
