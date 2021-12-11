import { CurrencyExchangeFactory } from './exchange-factory';
import { CurrencyExchange } from './exchange';

describe('CurrencyExchangeFactory', () => {
  describe('CurrencyExchangeFactory.trade', () => {
    it('Completes trade', () => {
      const result = CurrencyExchangeFactory.trade({
        ourCurrencyInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        theirCurrencyInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        price: { keys: 0, metal: 0 },
        keyPrice: 0,
        intent: 'sell',
      });

      expect(result.isComplete()).toBeTruthy();
    });
  });

  describe('CurrencyExchangeFactory.preview', () => {
    it('Creates a preview', () => {
      const result = CurrencyExchangeFactory.preview({
        price: { keys: 0, metal: 0.22 },
        keyPrice: 450,
      });

      expect(result.isComplete()).toBeTruthy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 2,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 0,
      });
      expect(result.missing).toBe(0);
      expect(result.missingChange).toBe(0);
    });
  });

  describe('constructor', () => {
    it('Creates a class', () => {
      expect(
        new CurrencyExchangeFactory({
          ourCurrencyInventory: {
            keys: 0,
            ref: 0,
            rec: 0,
            scrap: 0,
          },
          keyPrice: 0,
        }),
      ).toBeDefined();
    });
  });

  describe('createExchange', () => {
    it('Creates exchange with sell intent', () => {
      const factory = new CurrencyExchangeFactory({
        ourCurrencyInventory: {
          keys: 2,
          ref: 25,
          rec: 3,
          scrap: 1,
        },
        keyPrice: 50,
      });

      const exchange = factory.createExchange({
        theirCurrencyInventory: {
          keys: 3,
          ref: 23,
          rec: 4,
          scrap: 3,
        },
        intent: 'sell',
        price: { keys: 2, metal: 4 },
      });

      expect(exchange).toBeInstanceOf(CurrencyExchange);
      expect(exchange['buyer']['inventory']).toEqual({
        keys: 3,
        ref: 23,
        rec: 4,
        scrap: 3,
      });
      expect(exchange['seller']['inventory']).toEqual({
        keys: 2,
        ref: 25,
        rec: 3,
        scrap: 1,
      });
    });

    it('Creates exchange with buy intent', () => {
      const factory = new CurrencyExchangeFactory({
        ourCurrencyInventory: {
          keys: 2,
          ref: 25,
          rec: 3,
          scrap: 1,
        },
        keyPrice: 50,
      });

      const exchange = factory.createExchange({
        theirCurrencyInventory: {
          keys: 3,
          ref: 23,
          rec: 4,
          scrap: 3,
        },
        intent: 'buy',
        price: { keys: 2, metal: 4 },
      });

      expect(exchange).toBeInstanceOf(CurrencyExchange);
      expect(exchange['seller']['inventory']).toEqual({
        keys: 3,
        ref: 23,
        rec: 4,
        scrap: 3,
      });
      expect(exchange['buyer']['inventory']).toEqual({
        keys: 2,
        ref: 25,
        rec: 3,
        scrap: 1,
      });
    });
  });

  describe('createExchangeAndComplete', () => {
    const factory = new CurrencyExchangeFactory({
      ourCurrencyInventory: {
        keys: 2,
        ref: 25,
        rec: 3,
        scrap: 1,
      },
      keyPrice: 50,
    });

    const result = factory.createExchangeAndComplete({
      theirCurrencyInventory: {
        keys: 2,
        ref: 25,
        rec: 3,
        scrap: 1,
      },
      intent: 'sell',
      price: { keys: 2, metal: 4 },
    });

    expect(result).toHaveProperty('our');
    expect(result).toHaveProperty('their');
  });

  describe('updateInventory', () => {
    it('updates inventory', () => {
      const factory = new CurrencyExchangeFactory({
        ourCurrencyInventory: {
          keys: 2,
          ref: 25,
          rec: 3,
          scrap: 1,
        },
        keyPrice: 50,
      });

      expect(factory['ourCurrencyInventory']).toEqual({
        keys: 2,
        ref: 25,
        rec: 3,
        scrap: 1,
      });

      factory.updateInventory({
        keys: 25,
        ref: 13,
        rec: 342,
        scrap: 3,
      });

      expect(factory['ourCurrencyInventory']).toEqual({
        keys: 25,
        ref: 13,
        rec: 342,
        scrap: 3,
      });
    });
  });

  describe('updateKeyPrice', () => {
    it('updates key price', () => {
      const factory = new CurrencyExchangeFactory({
        ourCurrencyInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        keyPrice: 50,
      });

      expect(factory['keyPrice']).toEqual(50);

      factory.updateKeyPrice(51);

      expect(factory['keyPrice']).toEqual(51);
    });
  });
});
