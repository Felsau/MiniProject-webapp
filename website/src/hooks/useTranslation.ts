"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback, useEffect, useRef, useState } from "react";

interface TranslationMap {
  [key: string]: string;
}

export function useTranslation() {
  const { language } = useLanguage();
  const [translationMap, setTranslationMap] = useState<TranslationMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queueRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const translateText = useCallback(
    async (text: string): Promise<string> => {
      if (!text || !text.trim()) return text;
      if (language === "TH") return text;

      if (translationMap[text]) {
        return translationMap[text];
      }

      if (queueRef.current.has(text)) {
        return text;
      }

      queueRef.current.add(text);
      setIsLoading(true);

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Translate failed");

        if (!mountedRef.current) return text;

        setTranslationMap((prev) => ({
          ...prev,
          [text]: data.translation,
        }));

        return data.translation;
      } catch (err) {
        console.error("Translation error:", err);
        setError("Translation service unavailable");
        return text;
      } finally {
        queueRef.current.delete(text);
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [language, translationMap]
  );

  return {
    translateText,
    translationMap,
    isLoading,
    error,
  };
}
