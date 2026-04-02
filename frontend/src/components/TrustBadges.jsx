export default function TrustBadges({ compact = false }) {
  const badges = [
    { icon: '🌿', title: '100% Natural', desc: '95%+ natural ingredients' },
    { icon: '🐰', title: 'Cruelty-Free', desc: 'Leaping Bunny certified' },
    { icon: '♻️', title: 'Sustainable', desc: 'Recyclable packaging' },
    { icon: '🔬', title: 'Science-Backed', desc: 'Clinically tested formulas' },
    { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: '↩️', title: '30-Day Returns', desc: 'Satisfaction guarantee' },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap justify-center gap-4 py-4">
        {badges.slice(0, 4).map(badge => (
          <div key={badge.title} className="flex items-center gap-1.5 text-xs text-text-medium">
            <span className="text-base">{badge.icon}</span>
            <span className="font-medium">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="bg-secondary py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map(badge => (
            <div key={badge.title} className="text-center">
              <span className="text-3xl mb-2 block">{badge.icon}</span>
              <h4 className="font-semibold text-sm text-text-dark mb-0.5">{badge.title}</h4>
              <p className="text-xs text-text-medium">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
