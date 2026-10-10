import { useEffect } from 'react';

const SCRIPT_ID = 'gtranslate-widget';

export default function GTranslate() {
  useEffect(() => {
    window.gtranslateSettings = {
      default_language: 'ru',
      native_language_names: true,
      detect_browser_language: true,
      languages: ['ru', 'en', 'uk', 'de', 'es', 'fr', 'zh-CN'],
      wrapper_selector: '.gtranslate_wrapper',
      flag_style: '3d',
      alt_flags: { en: 'usa' },
    };

    if (document.getElementById(SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://cdn.gtranslate.net/widgets/latest/dropdown.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Keep script across remounts in StrictMode; only clear settings cleanup
    };
  }, []);

  return (
    <div className="gtranslate-bar" aria-label="Language">
      <div className="gtranslate_wrapper" />
    </div>
  );
}
