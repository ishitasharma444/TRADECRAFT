import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-slate-300 text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
      <p className="text-xs text-slate-400">Last updated: September 20, 2026</p>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">1. Simulated Financial Education Disclaimer</h2>
        <p>
          TRADECRAFT is an educational game platform. It does NOT provide financial advisory services, brokerage execution, or investment recommendations. All capital represented (₹1,00,000 starter balance) is purely virtual currency with zero monetary value.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">2. No Guarantee of Performance</h2>
        <p>
          Success within TRADECRAFT simulated market scenarios does not guarantee or imply success in live financial markets.
        </p>
      </section>
    </div>
  );
};
