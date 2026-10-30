import { useState } from 'react';
import GTranslateSync from './components/GTranslateSync.jsx';
import './App.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OWNER_NAME = 'Hannah Guarilha';
const CONTACT_URL = 'https://t.me/Hannah_guarilha';
const YOUTUBE_URL = 'https://www.youtube.com/@hannahguarilha';

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
      setError('O e-mail é obrigatório');
      return;
    }

    if (!EMAIL_RE.test(trimmed.toLowerCase())) {
      setError('Digite um e-mail válido');
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
      setStatus('Inscrição feita. Obrigada!');
    } catch (err) {
      console.error('Subscribe error:', err);
      setError('Algo deu errado. Tente novamente.');
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
      <GTranslateSync watch={`${email}|${error}|${status}|${isSubmitting}`} />
      <div className="content">
        <div className="avatar-wrap">
          <img
            className="avatar"
            src="/images/hannah.png"
            alt={OWNER_NAME}
          />
        </div>

        <h1 className="title">{OWNER_NAME}</h1>

        <p className="description">
          Mercado financeiro de forma simples e descomplicada: renda fixa,
          fundos imobiliários, ações, investimentos no exterior e Bitcoin.
          Informação clara para você aprender de verdade, investir com
          segurança e tomar suas próprias decisões. Torne-se independente.
        </p>

        <p className="byline">
          Por {OWNER_NAME} · Mais de 43.000 inscritos ·{' '}
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
        </p>

        <section className="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="section-heading">
            Tem alguma dúvida? Fala comigo.
          </h2>
          <p>
            Dúvida sobre um dos meus vídeos, sobre investimentos ou o mercado,
            ou simplesmente não sabe por onde começar? Me manda uma mensagem.
          </p>
          <a
            className="contact-btn"
            href={CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Me manda uma mensagem
          </a>
        </section>

        <section className="newsletter" aria-labelledby="newsletter-heading">
          <h2 id="newsletter-heading" className="section-heading">
            Fique por dentro.
          </h2>
          <p className="newsletter-copy">
            Receba meus conteúdos sobre o mercado, vídeos e atualizações
            direto no seu e-mail.
          </p>

          <div className="form-row">
            <div className="field">
              <input
                type="email"
                className={`input${error ? ' input-error' : ''}`}
                placeholder="Digite seu e-mail..."
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
              {isSubmitting ? 'Inscrevendo…' : 'Inscrever-se'}
            </button>
          </div>

          <p className="terms">
            Ao se inscrever, você concorda com os Termos de Uso e reconhece o
            Aviso de Coleta de Informações e a Política de Privacidade.
          </p>
        </section>
      </div>
    </main>
  );
}
