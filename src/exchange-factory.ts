import { ICurrency } from 'tf2-currency';
import { CurrencyExchange } from './exchange';
import { ICurrencyInventory, Intent } from './types';

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
    theirKeyPrice,
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
    theirKeyPrice?: number;
  }) {
    return new CurrencyExchangeFactory({
      ourCurrencyInventory,
      keyPrice,
      theirKeyPrice,
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

  /**
   * Key price for the other party,
   * the `keyPrice` is for us, it's not named `ourKeyPrice`
   * to not break existing usage.
   */
  private theirKeyPrice: number;

  constructor({
    ourCurrencyInventory,
    keyPrice,
    theirKeyPrice,
  }: {
    ourCurrencyInventory: ICurrencyInventory;
    /**
     * Key price in metal.
     */
    keyPrice: number;
    theirKeyPrice?: number;
  }) {
    this.ourCurrencyInventory = ourCurrencyInventory;
    this.keyPrice = keyPrice;
    this.theirKeyPrice = theirKeyPrice || keyPrice;
  }

  createExchange({
    theirCurrencyInventory,
    intent,
    price,
  }: {
    // TODO: possibly add a lazy loading via promises
    theirCurrencyInventory: ICurrencyInventory;
    intent: Intent;
    price: ICurrency;
  }) {
    let buyKeyPrice = this.theirKeyPrice;
    let sellKeyPrice = this.keyPrice;
    let buyInventory = theirCurrencyInventory;
    let sellInventory = this.ourCurrencyInventory;
    if (intent === 'buy') {
      buyInventory = this.ourCurrencyInventory;
      sellInventory = theirCurrencyInventory;
      buyKeyPrice = this.keyPrice;
      sellKeyPrice = this.theirKeyPrice;
    }

    return new CurrencyExchange({
      buyInventory,
      sellInventory,
      keyPrice: buyKeyPrice,
      keyPriceForChange: sellKeyPrice,
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

  updateTheirKeyPrice(keyPrice: number) {
    this.theirKeyPrice = keyPrice;

    return this;
  }
}
