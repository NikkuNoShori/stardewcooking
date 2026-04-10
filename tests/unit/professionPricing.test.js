import { parsePriceValue, formatPrice } from '../../src/utils/professionPricing.js';

describe('professionPricing', () => {
  describe('parsePriceValue', () => {
    it('parses numeric values', () => {
      expect(parsePriceValue(120)).toBe(120);
    });

    it('extracts digits from strings', () => {
      expect(parsePriceValue('240g')).toBe(240);
      expect(parsePriceValue('Sell: 75')).toBe(75);
    });

    it('returns 0 for invalid input', () => {
      expect(parsePriceValue(null)).toBe(0);
      expect(parsePriceValue('')).toBe(0);
    });
  });

  describe('formatPrice', () => {
    it('formats finite numbers with g suffix', () => {
      expect(formatPrice(100)).toBe('100g');
    });

    it('returns em dash for invalid numbers', () => {
      expect(formatPrice(NaN)).toBe('—');
    });
  });
});
