import { CurrencyExchange } from './exchange';
import { ICurrencyStore, CurrencyName, ICurrencyInventory } from './types';

export class CurrencyExchangeSide {
  public value: number;
  public store: ICurrencyStore;
  public inventory: ICurrencyInventory;
  public missingBeforeClean = 0;
  private exchange: CurrencyExchange;

  constructor({
    value = 0,
    store = {
      keys: 0,
      ref: 0,
      rec: 0,
      scrap: 0,
      craftWeapons: 0,
    },
    inventory,
    exchange,
  }: {
    value?: number;
    store?: ICurrencyStore;
    inventory: ICurrencyInventory;
    exchange: CurrencyExchange;
  }) {
    this.value = value;
    this.store = store;
    this.inventory = inventory;
    this.exchange = exchange;
  }

  isComplete() {
    return this.value === 0;
  }

  fillCurrencySide() {
    const currencies = ['keys', 'ref', 'rec', 'scrap', 'craftWeapons'] as const;

    currencies.forEach((currency) => {
      const amount = this.getAmountToFill(currency);

      this.store[currency] += amount;
      this.value -= amount * this.exchange.getCurrencyValue(currency);
    });

    return this;
  }

  selectChange() {
    const currencies = ['scrap', 'rec', 'ref', 'keys'] as const;

    return currencies.find((currency) => {
      const currencyValue = this.exchange.getCurrencyValue(currency);

      if (this.value >= currencyValue) {
        return false;
      }

      return this.inventory[currency] - this.store[currency] > 0;
    });
  }

  clean(changeCurrency: CurrencyName) {
    this.missingBeforeClean = this.value;

    const curreniesToClean = this.getCurrenciesToClean(changeCurrency);

    curreniesToClean.forEach((currency) => {
      const amount = this.store[currency] || 0;
      const value = amount * this.exchange.getCurrencyValue(currency);
      this.store[currency] = 0;
      this.value += value;
    });

    return this;
  }

  getCurrenciesToClean(changeCurrency: CurrencyName) {
    const changeValue = this.exchange.getCurrencyValue(changeCurrency);
    const currencies: CurrencyName[] = [
      'keys',
      'ref',
      'rec',
      'scrap',
      'craftWeapons',
    ];

    const thresholdIndex = currencies.findIndex((currency) => {
      return this.exchange.getCurrencyValue(currency) < changeValue;
    });

    return currencies.slice(thresholdIndex);
  }

  private getAmountToFill(currency: CurrencyName): number {
    const currencyValue = this.exchange.getCurrencyValue(currency);
    if (currencyValue > this.value) {
      return 0;
    }

    const howManyCanFit = Math.trunc(this.value / currencyValue);
    const amount = this.inventory[currency] || 0;

    return amount > howManyCanFit ? howManyCanFit : amount;
  }
}
