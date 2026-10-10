import { useState } from 'react';
import GTranslate from './components/GTranslate.jsx';
import './App.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OWNER_NAME = 'Крипто Илья';

export default function App() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setStatus('');
  };

  const handleSubscribe = async () => {
    const trimmed = email.trim();

    if (!trimmed) {
      setError('Email is required');
      return;
    }

    if (!EMAIL_RE.test(trimmed.toLowerCase())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setStatus('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, owner: OWNER_NAME }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setEmail('');
      setStatus("You're subscribed — thanks!");
    } catch (err) {
      console.error('Subscribe error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
<main className="page">
  <GTranslate />
  <div className="content">
    <div className="avatar-wrap">
      <img
        className="avatar"
        src="/images/michael.png"
        alt={OWNER_NAME}
      />
    </div>

    <h1 className="title">{OWNER_NAME}</h1>

    <p className="description">
    Будьте в курсе последних новостей о криптовалютах и мировой экономике. Получайте глубокий анализ рынков, выводы на основе данных и вероятностные прогнозы. Изучайте динамику рынка, выявляйте новые тенденции и находите потенциальные возможности, лучше понимая факторы, которые движут рынками.
    </p>

    <p className="byline">
      Автор: {OWNER_NAME} · Более 28 000 подписчиков
    </p>

    <section className="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="section-heading">
        Есть вопросы? Напишите мне.
      </h2>
      <p>
        Есть вопросы по одному из моих видео, трейдингу или рынкам?
        Или просто не знаете, с чего начать? Напишите мне.
      </p>
      <a
        className="contact-btn"
        href="https://t.me/cryptoillia_tg"
        target="_blank"
        rel="noopener noreferrer"
      >
        Написать мне
      </a>
    </section>

    <section className="newsletter" aria-labelledby="newsletter-heading">
      <h2 id="newsletter-heading" className="section-heading">
        Будьте в курсе событий.
      </h2>
      <p className="newsletter-copy">
        Получайте мои последние обзоры рынка, видео и новости
        прямо на свою электронную почту.
      </p>

      <div className="form-row">
        <div className="field">
          <input
            type="email"
            className={`input${error ? ' input-error' : ''}`}
            placeholder="Введите свой email..."
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            autoComplete="email"
            aria-invalid={!!error}
            aria-describedby={error ? 'email-error' : undefined}
          />
          {error ? (
            <p id="email-error" className="message error">
              {error}
            </p>
          ) : null}
          {status ? <p className="message success">{status}</p> : null}
        </div>

        <button
          type="button"
          className="subscribe"
          onClick={handleSubscribe}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Подписка…' : 'Подписаться'}
        </button>
      </div>

      <p className="terms">
        Подписываясь, я соглашаюсь с Условиями использования и подтверждаю,
        что ознакомился с Уведомлением о сборе информации и Политикой конфиденциальности.
      </p>
    </section>
  </div>
</main>
  );
}
