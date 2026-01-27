"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

export function useTranslateContent(content: string) {
  const { language } = useLanguage();
  const { translateText, translationMap } = useTranslationContext();

  const [displayContent, setDisplayContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!content) return;

    if (language === "TH") {
      setDisplayContent(content);
      return;
    }

    if (translationMap[content]) {
      setDisplayContent(translationMap[content]);
      return;
    }

    const run = async () => {
      setIsLoading(true);
      try {
        const translated = await translateText(content);
        if (mountedRef.current) {
          setDisplayContent(translated);
        }
      } catch {
        setError("Translation failed");
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    };

    run();
  }, [content, language]);

  return { displayContent, isLoading, error };
}
