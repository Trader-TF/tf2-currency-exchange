import { CurrencyExchange as CCurrencyExchange } from './exchange';
import { CurrencyExchangeFactory as CCurrencyExchangeFactory } from './exchange-factory';
import { CurrencyExchangeSide as CCurrencyExchangeSide } from './exchange-side';

describe('index', () => {
  describe('exports', () => {
    it('Test exports', async () => {
      const {
        CurrencyExchange,
        CurrencyExchangeFactory,
        CurrencyExchangeSide,
      } = await import('./index');

      expect(CurrencyExchange).toBe(CCurrencyExchange);
      expect(CurrencyExchangeFactory).toBe(CCurrencyExchangeFactory);
      expect(CurrencyExchangeSide).toBe(CCurrencyExchangeSide);
    });
  });
});
