"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "worksheet-v2-data";

interface WorksheetStorageData {
  phaseData: Record<string, string>[];
  previews: string[];
  industry: string;
}

const INITIAL_DATA: WorksheetStorageData = {
  phaseData: [{}, {}, {}, {}, {}],
  previews: ["", "", "", "", ""],
  industry: "",
};

export function useWorksheetStorage() {
  const [phaseData, setPhaseData] = useState<Record<string, string>[]>(
    INITIAL_DATA.phaseData
  );
  const [previews, setPreviews] = useState<string[]>(INITIAL_DATA.previews);
  const [industry, setIndustry] = useState(INITIAL_DATA.industry);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: WorksheetStorageData = JSON.parse(saved);
        if (parsed.phaseData) setPhaseData(parsed.phaseData);
        if (parsed.previews) setPreviews(parsed.previews);
        if (parsed.industry) setIndustry(parsed.industry);
      }
    } catch {
      // ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  // Debounced save to localStorage (500ms)
  useEffect(() => {
    if (!isHydrated) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ phaseData, previews, industry })
        );
      } catch {
        // ignore quota errors
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [phaseData, previews, industry, isHydrated]);

  const updateField = useCallback(
    (phase: number, key: string, value: string) => {
      setPhaseData((prev) => {
        const next = [...prev];
        next[phase] = { ...next[phase], [key]: value };
        return next;
      });
    },
    []
  );

  const updatePreview = useCallback((phase: number, value: string) => {
    setPreviews((prev) => {
      const next = [...prev];
      next[phase] = value;
      return next;
    });
  }, []);

  return {
    phaseData,
    setPhaseData,
    previews,
    setPreviews,
    industry,
    setIndustry,
    updateField,
    updatePreview,
    isHydrated,
  };
}
