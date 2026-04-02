import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function EmailPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const dismissed = sessionStorage.getItem('gn_popup_dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const data = await api.subscribe(email, '', 'popup');
      setStatus('success');
      setMessage(data.message);
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('gn_popup_dismissed', 'true');
      }, 2500);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  };

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('gn_popup_dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <button onClick={handleClose} className="absolute top-3 right-3 text-text-light hover:text-text-dark text-xl">&times;</button>
        
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Get 15% Off
        </h3>
        <p className="text-text-medium text-sm mb-6">
          Join our newsletter and get 15% off your first order, plus exclusive access to new launches and skincare tips.
        </p>

        {status === 'success' ? (
          <div className="bg-green-50 text-green-700 rounded-lg p-4 text-sm">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm"
            >
              {status === 'loading' ? 'Subscribing...' : 'Get My 15% Off'}
            </button>
            {status === 'error' && <p className="text-error text-xs">{message}</p>}
          </form>
        )}

        <p className="text-text-light text-xs mt-4">No spam, unsubscribe anytime.</p>
      </div>
    </div>
  );
}
