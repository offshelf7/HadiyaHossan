"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "am", name: "አማርኛ" },
  { code: "om", name: "Afaan Oromoo" },
  { code: "ti", name: "ትግርኛ" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language || "en";
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (locale: string) => {
    // Set cookie for the locale
    Cookies.set("NEXT_LOCALE", locale, { expires: 365 });

    // Change i18next language
    i18n.changeLanguage(locale);

    // Extract the path without the locale prefix
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

    // Navigate to the same page with the new locale
    router.push(`/${locale}${pathWithoutLocale}`);
  };

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLocale === language.code ? "bg-accent" : ""}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
