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
            alt="Michael J. Saylor"
          />
        </div>

        <h1 className="title">The Bitcoin Standard</h1>

        <p className="description">
        Analyzing #bitcoin at the highest level through cycle analysis, market dynamics, data-driven insights, and probabilistic forecasts. Focused on understanding the market and making money.
        </p>

        <p className="byline">
          By KillaXBT · Over 17,000 subscribers
        </p>

        <div className="contact">
          <h2 className="contact-heading">Got a question? Let’s talk.</h2>
          <p>
            Whether it’s something from one of our videos, a question about
            trading or the markets, or you’re simply not sure where to start,
            feel free to reach out.
          </p>
          <a
            className="contact-btn"
            href="https://t.me/killaaXBT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Send us a DM
          </a>
          <p className="contact-note">We’d love to hear from you.</p>
        </div>

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

        <button type="button" className="no-thanks">
          No thanks <span aria-hidden="true">›</span>
        </button>
      </div>
    </main>
  );
}
