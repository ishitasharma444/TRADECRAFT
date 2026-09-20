import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-slate-300 text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last updated: September 20, 2026</p>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
        <p>
          TRADECRAFT collects minimal account information (email address, username) necessary to maintain your virtual portfolio, XP progression, and mission logs. We do NOT collect credit card numbers, government IDs, or bank credentials.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">2. Educational & Simulated Nature</h2>
        <p>
          All trading data, asset pricing, holdings, and portfolio metrics within TRADECRAFT are completely simulated. No real financial transactions take place.
        </p>
      </section>
    </div>
  );
};
