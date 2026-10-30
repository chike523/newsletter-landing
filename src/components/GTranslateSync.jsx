import { useEffect } from 'react';

function readSavedLangPair() {
  try {
    const raw = localStorage.getItem('__GT_TRANSLATE_LANGS');
    if (!raw) return null;
    const { srcLang, tgtLang } = JSON.parse(raw);
    if (!srcLang || !tgtLang || srcLang === tgtLang) return null;
    return `${srcLang}|${tgtLang}`;
  } catch {
    return null;
  }
}

/**
 * Re-applies GTranslate after React renders, so SPA updates don't wipe
 * the translated DOM.
 */
export default function GTranslateSync({ watch }) {
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const apply = () => {
      if (cancelled) return;
      const pair = readSavedLangPair();
      if (!pair || typeof window.doGTranslate !== 'function') return;
      window.doGTranslate(pair);
    };

    const waitForApi = () => {
      if (cancelled) return;
      if (typeof window.doGTranslate === 'function') {
        // Let React commit the DOM first
        requestAnimationFrame(() => requestAnimationFrame(apply));
        return;
      }
      if (attempts++ < 50) {
        setTimeout(waitForApi, 100);
      }
    };

    waitForApi();
    return () => {
      cancelled = true;
    };
  }, [watch]);

  return null;
}
