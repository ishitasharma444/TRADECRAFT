import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Asset } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { TrendingUp, TrendingDown, RefreshCw, ShoppingCart, ShieldAlert } from 'lucide-react';

export const MarketPage: React.FC = () => {
  const { assets, cash, holdings, placeOrder, updateMarketPrices, marketEvents } = useGameStore();

  const [selectedAsset, setSelectedAsset] = useState<Asset>(assets[0] || null);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(10);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Auto update price loop every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      updateMarketPrices();
    }, 5000);
    return () => clearInterval(interval);
  }, [updateMarketPrices]);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderFeedback(null);

    const result = placeOrder({
      assetId: selectedAsset.id,
      type: orderType,
      quantity: Number(quantity),
    });

    setOrderFeedback(result);
    if (result.success) {
      setTimeout(() => {
        setIsOrderModalOpen(false);
        setOrderFeedback(null);
      }, 1500);
    }
  };

  const userHolding = holdings.find((h) => h.assetId === selectedAsset?.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-wide">Simulated Market Desk</h1>
            <Badge variant="amber">SIMULATION MODE</Badge>
          </div>
          <p className="text-xs text-slate-400">Trade simulated assets with virtual cash (₹{cash.toLocaleString()}).</p>
        </div>
        <Button variant="outline" size="sm" onClick={updateMarketPrices}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh Market Prices
        </Button>
      </div>

      {/* Latest Market Event Banner */}
      {marketEvents.length > 0 && (
        <Card variant="border" className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/30 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400 uppercase font-mono">MARKET HEADLINE</span>
                <span className="text-[10px] text-slate-400">{new Date(marketEvents[0].timestamp).toLocaleTimeString()}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{marketEvents[0].title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{marketEvents[0].description}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Trading Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist Table */}
        <Card className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">Simulated Assets Watchlist</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                  <th className="py-2.5 px-3">Asset / Symbol</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Trend</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {assets.map((asset) => {
                  const isSelected = selectedAsset.id === asset.id;
                  const priceDiff = asset.price - asset.basePrice;
                  const isPositive = priceDiff >= 0;

                  return (
                    <tr 
                      key={asset.id} 
                      onClick={() => setSelectedAsset(asset)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-500/10' : 'hover:bg-slate-900/80'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{asset.name}</div>
                        <div className="text-[10px] font-mono text-emerald-400">{asset.symbol}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{asset.sector}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        ₹{asset.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span className={`inline-flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {isPositive ? '+' : ''}{((priceDiff / asset.basePrice) * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(asset);
                            setIsOrderModalOpen(true);
                          }}
                        >
                          Trade
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Selected Asset Details & Quick Order Form */}
        <Card variant="glow" className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Selected Asset</span>
            <h3 className="text-xl font-bold text-white">{selectedAsset.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="emerald">{selectedAsset.symbol}</Badge>
              <Badge variant="slate">{selectedAsset.sector}</Badge>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{selectedAsset.description}</p>

          <div className="bg-slate-950 p-3 rounded-lg space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Market Price:</span>
              <span className="font-mono font-bold text-emerald-400">₹{selectedAsset.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Your Current Position:</span>
              <span className="font-mono text-slate-200">{userHolding?.quantity || 0} shares</span>
            </div>
          </div>

          <Button 
            variant="primary" 
            className="w-full font-bold"
            onClick={() => setIsOrderModalOpen(true)}
          >
            <ShoppingCart className="w-4 h-4 mr-1" /> Open Order Entry Desk
          </Button>
        </Card>
      </div>

      {/* Order Entry Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title={`Place Order - ${selectedAsset.symbol}`}
      >
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          {orderFeedback && (
            <div className={`p-3 rounded-lg text-xs font-semibold ${
              orderFeedback.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
            }`}>
              {orderFeedback.message}
            </div>
          )}

          {/* BUY / SELL Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setOrderType('BUY')}
              className={`py-2 rounded-md text-xs font-bold transition-all ${
                orderType === 'BUY' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setOrderType('SELL')}
              className={`py-2 rounded-md text-xs font-bold transition-all ${
                orderType === 'SELL' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              SELL
            </button>
          </div>

          <Input
            label="Order Quantity (Shares)"
            type="number"
            min="1"
            max="10000"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
            required
          />

          <div className="bg-slate-950 p-3 rounded-lg space-y-1.5 border border-slate-800 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Price per share:</span>
              <span className="font-mono text-white">₹{selectedAsset.price}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-bold border-t border-slate-800 pt-1.5">
              <span>Total Estimated Order Cost:</span>
              <span className="font-mono text-emerald-400 text-sm">₹{(selectedAsset.price * quantity).toLocaleString()}</span>
            </div>
          </div>

          <Button type="submit" variant={orderType === 'BUY' ? 'primary' : 'danger'} className="w-full font-bold">
            Execute {orderType} Order
          </Button>
        </form>
      </Modal>
    </div>
  );
};
