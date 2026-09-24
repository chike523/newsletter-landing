import { useState } from 'react';
import './App.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        body: JSON.stringify({ email: trimmed }),
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
      <div className="content">
        <div className="avatar-wrap">
          <img
            className="avatar"
            src="/images/michael.png"
            alt="KillaXBT"
          />
        </div>

        <h1 className="title">KillaXBT</h1>

        <p className="description">
          Analyzing #bitcoin through cycle analysis, market dynamics,
          data-driven insights, and probabilistic forecasts. Focused on
          understanding the market and finding opportunities.
        </p>

        <p className="byline">
          By KillaXBT · Over 17,000 subscribers
        </p>

        <section className="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="section-heading">
            Got a question? Reach out.
          </h2>
          <p>
            Have a question about one of my videos, trading, the markets, or
            simply don’t know where to start? Send me a message.
          </p>
          <a
            className="contact-btn"
            href="https://t.me/killaaXBT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message me
          </a>
        </section>

        <section className="newsletter" aria-labelledby="newsletter-heading">
          <h2 id="newsletter-heading" className="section-heading">
            Stay in the loop.
          </h2>
          <p className="newsletter-copy">
            Get my latest market insights, videos, and updates delivered
            straight to your inbox.
          </p>

          <div className="form-row">
            <div className="field">
              <input
                type="email"
                className={`input${error ? ' input-error' : ''}`}
                placeholder="Type your email..."
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
              {isSubmitting ? 'Subscribing…' : 'Subscribe'}
            </button>
          </div>

          <p className="terms">
            By subscribing, I agree to Terms of Use and acknowledge its
            Information Collection Notice and Privacy Policy
          </p>
        </section>
      </div>
    </main>
  );
}
