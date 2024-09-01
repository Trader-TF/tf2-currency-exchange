import { ICurrencyStore, CurrencyName, ICurrencyInventory } from './types';

export class CurrencyExchangeSide {
  public value: number;
  public store: ICurrencyStore;
  public inventory: ICurrencyInventory;
  public missingBeforeClean = 0;
  public keyPrice: number;

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
    keyPrice,
  }: {
    value?: number;
    store?: ICurrencyStore;
    inventory: ICurrencyInventory;
    keyPrice: number;
  }) {
    this.value = value;
    this.store = store;
    this.inventory = inventory;
    this.keyPrice = keyPrice;
  }

  getCurrencyValue(currency: CurrencyName) {
    switch (currency) {
      case 'keys':
        return this.keyPrice;
      case 'ref':
        return 9;
      case 'rec':
        return 3;
      case 'scrap':
        return 1;
      case 'craftWeapons':
        return 0.5;
    }
  }

  isComplete() {
    return this.value === 0;
  }

  fillCurrencySide() {
    const currencies = ['keys', 'ref', 'rec', 'scrap', 'craftWeapons'] as const;

    currencies.forEach((currency) => {
      const amount = this.getAmountToFill(currency);

      this.store[currency] += amount;
      this.value -= amount * this.getCurrencyValue(currency);
    });

    return this;
  }

  selectChange() {
    const currencies = ['scrap', 'rec', 'ref', 'keys'] as const;

    return currencies.find((currency) => {
      const currencyValue = this.getCurrencyValue(currency);

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
      const value = amount * this.getCurrencyValue(currency);
      this.store[currency] = 0;
      this.value += value;
    });

    return this;
  }

  getCurrenciesToClean(changeCurrency: CurrencyName) {
    const changeValue = this.getCurrencyValue(changeCurrency);
    const currencies: CurrencyName[] = [
      'keys',
      'ref',
      'rec',
      'scrap',
      'craftWeapons',
    ];

    const thresholdIndex = currencies.findIndex((currency) => {
      return this.getCurrencyValue(currency) < changeValue;
    });

    return currencies.slice(thresholdIndex);
  }

  private getAmountToFill(currency: CurrencyName): number {
    const currencyValue = this.getCurrencyValue(currency);
    if (currencyValue > this.value) {
      return 0;
    }

    const howManyCanFit = Math.trunc(this.value / currencyValue);
    const amount = this.inventory[currency] || 0;

    return amount > howManyCanFit ? howManyCanFit : amount;
  }
}
