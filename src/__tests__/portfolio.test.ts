import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/gameStore';

describe('Trading & Portfolio Engine Unit Tests', () => {
  beforeEach(async () => {
    await useGameStore.getState().initializeGame();
  });

  it('should initialize player with ₹1,00,000 virtual starter cash', () => {
    const state = useGameStore.getState();
    expect(state.cash).toBe(100000);
    expect(state.holdings).toHaveLength(0);
  });

  it('should reject buy order with insufficient virtual cash', () => {
    const result = useGameStore.getState().placeOrder({
      assetId: 'oil',
      type: 'BUY',
      quantity: 100000, // Cost exceeds ₹1,00,000 cash
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Insufficient virtual cash');
  });

  it('should reject order with negative or zero quantity', () => {
    const result = useGameStore.getState().placeOrder({
      assetId: 'oil',
      type: 'BUY',
      quantity: -5,
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Quantity must be greater than zero');
  });

  it('should execute buy order and deduct virtual cash correctly', () => {
    const initialCash = useGameStore.getState().cash;
    const asset = useGameStore.getState().assets.find((a) => a.id === 'oil')!;

    const result = useGameStore.getState().placeOrder({
      assetId: 'oil',
      type: 'BUY',
      quantity: 10,
    });

    expect(result.success).toBe(true);
    const state = useGameStore.getState();
    const expectedCost = asset.price * 10;
    expect(state.cash).toBe(initialCash - expectedCost);
    expect(state.holdings).toHaveLength(1);
    expect(state.holdings[0].quantity).toBe(10);
  });

  it('should calculate risk metrics accurately', () => {
    const metrics = useGameStore.getState().getRiskMetrics();
    expect(metrics.totalValue).toBeGreaterThan(0);
    expect(metrics.cashBalance).toBe(100000);
  });
});
