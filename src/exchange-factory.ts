import { ICurrency } from 'tf2-currency';
import { CurrencyExchange } from './exchange';
import { ICurrencyInventory, ICurrencyStore, Intent } from './types';

export class CurrencyExchangeFactory {
  /**
   * Exchange currencies without need of classes.
   */
  static trade({
    ourCurrencyInventory,
    theirCurrencyInventory,
    intent,
    price,
    keyPrice,
  }: {
    ourCurrencyInventory: ICurrencyInventory;
    theirCurrencyInventory: ICurrencyInventory;
    intent: Intent;
    /**
     * Price in keys and metal.
     */
    price: ICurrency;
    /**
     * Key price in metal
     */
    keyPrice: number;
  }) {
    return new CurrencyExchangeFactory({
      ourCurrencyInventory,
      keyPrice,
    }).createExchangeAndComplete({
      theirCurrencyInventory,
      intent,
      price,
    });
  }

  /**
   * This methods gives out result of exchange when all currencies are stocked.
   */
  static preview({ price, keyPrice }: { keyPrice: number; price: ICurrency }) {
    return new CurrencyExchange({
      buyInventory: {
        keys: Infinity,
        ref: Infinity,
        rec: Infinity,
        scrap: Infinity,
        craftWeapons: Infinity,
      },
      sellInventory: {
        keys: Infinity,
        ref: Infinity,
        rec: Infinity,
        scrap: Infinity,
        craftWeapons: Infinity,
      },
      keyPrice,
      price,
    }).trade();
  }

  private ourCurrencyInventory: ICurrencyInventory;
  private keyPrice: number;

  // TODO: probably change to assetIds and pick them aswell
  constructor({
    ourCurrencyInventory,
    keyPrice,
  }: {
    ourCurrencyInventory: ICurrencyInventory;
    /**
     * Key price in metal.
     */
    keyPrice: number;
  }) {
    this.ourCurrencyInventory = ourCurrencyInventory;
    this.keyPrice = keyPrice;
  }

  createExchange({
    theirCurrencyInventory,
    intent,
    price,
  }: {
    // TODO: possibly add a lazy loading via promises
    // TODO: add keys only option
    theirCurrencyInventory: ICurrencyInventory;
    intent: Intent;
    price: ICurrency;
  }) {
    let buyInventory = theirCurrencyInventory;
    let sellInventory = this.ourCurrencyInventory;
    if (intent === 'buy') {
      buyInventory = this.ourCurrencyInventory;
      sellInventory = theirCurrencyInventory;
    }

    return new CurrencyExchange({
      buyInventory,
      sellInventory,
      keyPrice: this.keyPrice,
      price,
    });
  }

  createExchangeAndComplete({
    theirCurrencyInventory,
    intent,
    price,
  }: {
    theirCurrencyInventory: ICurrencyInventory;
    intent: Intent;
    price: ICurrency;
  }) {
    return this.createExchange({
      theirCurrencyInventory,
      intent,
      price,
    })
      .trade()
      .convertByIntent(intent);
  }

  updateInventory(inventory: ICurrencyInventory) {
    Object.assign(this.ourCurrencyInventory, inventory);

    return this;
  }

  /**
   * Updates key price on factory.
   * @param keyPrice in metal
   */
  updateKeyPrice(keyPrice: number) {
    this.keyPrice = keyPrice;

    return this;
  }
}
