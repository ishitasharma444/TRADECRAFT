import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PieChart, TrendingUp, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { holdings, assets, tradeHistory, getRiskMetrics } = useGameStore();
  const riskMetrics = getRiskMetrics();
  const assetsMap = new Map(assets.map((a) => [a.id, a]));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Portfolio & Risk Analytics</h1>
          <p className="text-xs text-slate-400">Track holdings, realized/unrealized P&L, and educational drawdown risk metrics.</p>
        </div>
        <Badge variant={riskMetrics.riskRating === 'HIGH_RISK' ? 'rose' : 'emerald'} size="md">
          Risk Rating: {riskMetrics.riskRating}
        </Badge>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="border" className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Total Portfolio Value</span>
          <div className="text-2xl font-bold text-white font-mono">₹{riskMetrics.totalValue.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400">Cash: ₹{riskMetrics.cashBalance.toLocaleString()}</span>
        </Card>

        <Card variant="border" className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Unrealized P&L</span>
          <div className={`text-2xl font-bold font-mono ${riskMetrics.totalUnrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {riskMetrics.totalUnrealizedPnL >= 0 ? '+' : ''}₹{riskMetrics.totalUnrealizedPnL.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Open Positions</span>
        </Card>

        <Card variant="border" className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Realized P&L</span>
          <div className={`text-2xl font-bold font-mono ${riskMetrics.totalRealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {riskMetrics.totalRealizedPnL >= 0 ? '+' : ''}₹{riskMetrics.totalRealizedPnL.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Closed Trades</span>
        </Card>

        <Card variant="border" className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Max Drawdown</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{riskMetrics.drawdownPercent}%</div>
          <span className="text-[11px] text-slate-400">Diversification Score: {riskMetrics.diversificationScore}/100</span>
        </Card>
      </div>

      {/* Holdings Breakdown */}
      <Card variant="glow" className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">Current Portfolio Holdings</h3>
        {holdings.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No active positions. Visit the Market Desk to execute your first simulated trade.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                  <th className="py-2.5 px-3">Asset</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Avg Entry Price</th>
                  <th className="py-2.5 px-3 text-right">Current Price</th>
                  <th className="py-2.5 px-3 text-right">Position Value</th>
                  <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {holdings.map((h) => {
                  const asset = assetsMap.get(h.assetId);
                  const currentPrice = asset?.price || h.averagePrice;
                  const posValue = currentPrice * h.quantity;
                  const pnl = (currentPrice - h.averagePrice) * h.quantity;
                  const isPositive = pnl >= 0;

                  return (
                    <tr key={h.assetId} className="hover:bg-slate-900/60">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{asset?.name || h.assetId}</div>
                        <div className="text-[10px] font-mono text-emerald-400">{asset?.symbol}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-200">{h.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">₹{h.averagePrice}</td>
                      <td className="py-3 px-3 text-right font-mono text-white">₹{currentPrice}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                        ₹{posValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span className={`inline-flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {isPositive ? '+' : ''}₹{pnl.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Trade History Log */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">Recent Execution Log</h3>
        {tradeHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">No executed trades logged in current session.</div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {tradeHistory.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <Badge variant={t.type === 'BUY' ? 'emerald' : 'rose'}>{t.type}</Badge>
                  <div>
                    <span className="font-bold text-white">{t.assetSymbol}</span>
                    <span className="text-slate-400 ml-2">{t.quantity} shares @ ₹{t.price}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-white font-bold">₹{t.total.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">{new Date(t.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
