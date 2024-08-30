import { CurrencyExchange } from './exchange';

describe('CurrencyExchange', () => {
  describe('constructor', () => {
    it('Creates class', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        price: { keys: 0, metal: 0 },
        keyPrice: 50,
      });

      expect(exchange).toBeDefined();
    });
  });

  describe('trade', () => {
    it('Has enough of each currency', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 2,
          rec: 1,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        price: { keys: 0, metal: 2.33 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeTruthy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 2,
        rec: 1,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(0);
    });

    it('Needs to only use scrap', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 50,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        price: { keys: 0, metal: 2.33 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeTruthy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 21,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(0);
    });

    it('Uses keys', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 10,
          ref: 20,
          rec: 2,
          scrap: 23,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        price: { keys: 1, metal: 14 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeTruthy();
      expect(result.buyer).toEqual({
        keys: 1,
        ref: 14,
        rec: 0,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(0);
    });

    it('Tries to change with rec', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 3,
          rec: 4,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 5,
        },
        price: { keys: 0, metal: 2.44 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeTruthy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 2,
        rec: 2,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 2,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(0);
    });

    it('Tries to change with ref', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 3,
          rec: 1,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 1,
          scrap: 5,
        },
        price: { keys: 0, metal: 2.44 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeTruthy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 3,
        rec: 0,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 1,
        scrap: 2,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(0);
    });

    it('Tries to change with keys', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 1,
          ref: 3,
          rec: 1,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 28,
          rec: 3,
          scrap: 9,
        },
        price: { keys: 0, metal: 20 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeTruthy();
      expect(result.buyer).toEqual({
        keys: 1,
        ref: 0,
        rec: 0,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 28,
        rec: 3,
        scrap: 9,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(0);
    });

    it('Missing because no change currency', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 3,
          rec: 1,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 28,
          rec: 3,
          scrap: 9,
        },
        price: { keys: 0, metal: 20 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeFalsy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 3,
        rec: 1,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(150);
      expect(result.missingChange).toEqual(0);
    });

    it('Missing with rec change', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 2,
          rec: 2,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 1,
        },
        price: { keys: 0, metal: 2.44 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeFalsy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 2,
        rec: 1,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 1,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(1);
      expect(result.missingChange).toEqual(1);
    });

    it('Missing with ref change', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 3,
          rec: 0,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 1,
          scrap: 1,
        },
        price: { keys: 0, metal: 2.44 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeFalsy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 2,
        rec: 0,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 1,
        scrap: 1,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(4);
      expect(result.missingChange).toEqual(1);
    });

    it('Missing with keys change', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 1,
          ref: 3,
          rec: 0,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 25,
          rec: 1,
          scrap: 0,
        },
        price: { keys: 0, metal: 20 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeFalsy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 25,
        rec: 1,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(153);
      expect(result.missingChange).toEqual(42);
    });

    it('Gets same result after calling trade twice', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 2,
          rec: 1,
          scrap: 0,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        price: { keys: 0, metal: 2.33 },
        keyPrice: 50,
      });

      const result1 = exchange.trade();
      const result2 = exchange.trade();

      expect(result1.buyer).toEqual(result2.buyer);
      expect(result1.seller).toEqual(result2.seller);
      expect(result1.missing).toEqual(result2.missing);
      expect(result1.missingChange).toEqual(result2.missingChange);
    });

    describe('convertByIntent', () => {
      it('Converts by intent', () => {
        const exchange = new CurrencyExchange({
          buyInventory: {
            keys: 0,
            ref: 2,
            rec: 1,
            scrap: 0,
          },
          sellInventory: {
            keys: 0,
            ref: 0,
            rec: 0,
            scrap: 0,
          },
          price: { keys: 0, metal: 2.33 },
          keyPrice: 50,
        });

        const result = exchange.trade();

        const convertedSellResult = result.convertByIntent('sell');
        expect(convertedSellResult.our).toEqual(result.seller);
        expect(convertedSellResult.their).toEqual(result.buyer);
        expect(convertedSellResult.missing).toEqual(result.missing);
        expect(convertedSellResult.missingChange).toEqual(result.missingChange);
        expect(convertedSellResult.isComplete()).toEqual(result.isComplete());

        const convertedBuyResult = result.convertByIntent('buy');
        expect(convertedBuyResult.our).toEqual(result.buyer);
        expect(convertedBuyResult.their).toEqual(result.seller);
        expect(convertedBuyResult.missing).toEqual(result.missing);
        expect(convertedBuyResult.missingChange).toEqual(result.missingChange);
        expect(convertedBuyResult.isComplete()).toEqual(result.isComplete());
      });
    });

    it('Does not contain same item on both sides', () => {
      const exchange = new CurrencyExchange({
        buyInventory: {
          keys: 0,
          ref: 2,
          rec: 2,
          scrap: 1,
        },
        sellInventory: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 2,
        },
        price: { keys: 0, metal: 2.55 },
        keyPrice: 50,
      });

      const result = exchange.trade();

      expect(result.isComplete()).toBeTruthy();
      expect(result.buyer).toEqual({
        keys: 0,
        ref: 2,
        rec: 2,
        scrap: 0,
        craftWeapons: 0,
      });
      expect(result.seller).toEqual({
        keys: 0,
        ref: 0,
        rec: 0,
        scrap: 1,
        craftWeapons: 0,
      });
      expect(result.missing).toEqual(0);
    });
  });
});
