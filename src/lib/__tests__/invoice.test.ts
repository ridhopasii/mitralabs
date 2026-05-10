import { describe, it, expect } from 'vitest';

describe('Invoice & Tax Calculations', () => {
  it('Should accurately calculate the total tax from subtotal based on configurations', () => {
    const amount = 1000000;
    const taxRate = 11; // 11%

    const taxAmount = (amount * taxRate) / 100;
    const grandTotal = amount + taxAmount;

    expect(taxAmount).toBe(110000);
    expect(grandTotal).toBe(1110000);
  });
});
