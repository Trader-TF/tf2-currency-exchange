import { CurrencyExchange } from './exchange';
import { CurrencyExchangeSide } from './exchange-side';

describe('CurrencyExchangeSide', () => {
  describe('constructor', () => {
    it('Creates an instance', () => {
      const side = new CurrencyExchangeSide({
        store: {
          keys: 1,
          ref: 3,
          rec: 245,
          scrap: 1,
        },
        inventory: {
          keys: 1,
          ref: 57,
          rec: 3,
          scrap: 7,
        },
        exchange: {} as CurrencyExchange,
      });

      expect(side).toBeDefined();
      expect(side.value).toEqual(0);
      expect(side.store).toEqual({
        keys: 1,
        ref: 3,
        rec: 245,
        scrap: 1,
      });
      expect(side.inventory).toEqual({
        keys: 1,
        ref: 57,
        rec: 3,
        scrap: 7,
      });
    });
  });
});
