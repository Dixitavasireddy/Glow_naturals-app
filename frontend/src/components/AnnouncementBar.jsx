import { useState } from 'react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-primary text-white text-center py-2 px-4 text-sm relative">
      <p className="font-medium">
        FREE SHIPPING on orders over $50 | Use code <span className="font-bold underline">GLOW15</span> for 15% off your first order
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-lg leading-none"
        aria-label="Close announcement"
      >
        &times;
      </button>
    </div>
  );
}
