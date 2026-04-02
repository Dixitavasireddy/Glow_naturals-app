import { useState } from 'react';
import { api } from '../utils/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const data = await api.subscribe(email, '', 'footer');
      setStatus('success');
      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <section className="bg-primary-dark py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Join the Glow Community
        </h2>
        <p className="text-white/70 mb-6">
          Subscribe for exclusive offers, skincare tips, and 15% off your first order.
        </p>
        {status === 'success' ? (
          <div className="bg-white/10 text-white rounded-lg p-4 text-sm">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && <p className="text-red-300 text-xs mt-2">{message}</p>}
      </div>
    </section>
  );
}
