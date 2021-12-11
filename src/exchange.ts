import { Currency, ICurrency, toScrap } from 'tf2-currency';
import { CurrencyExchangeBuyer } from './sides/buyer';
import { CurrencyExchangeSeller } from './sides/seller';
import {
  ICurrencyStore,
  CurrencyName,
  IExchangeSide,
  ExchangeResult,
} from './types';

export class CurrencyExchange {
  private buyInventory: ICurrencyStore;
  private sellInventory: ICurrencyStore;
  private value: number;
  private keyPrice: number;

  constructor({
    buyInventory,
    sellInventory,
    price,
    keyPrice,
  }: {
    buyInventory: ICurrencyStore;
    sellInventory: ICurrencyStore;
    /**
     * Price in keys and metal.
     */
    price: ICurrency;
    /**
     * Key price in metal.
     */
    keyPrice: number;
  }) {
    this.buyInventory = buyInventory;
    this.sellInventory = sellInventory;
    this.keyPrice = toScrap(keyPrice);
    this.value = new Currency(price).toScrap(keyPrice);
  }

  getCurrencyValue(currency: CurrencyName): number {
    switch (currency) {
      case 'keys':
        return this.keyPrice;
      case 'ref':
        return 9;
      case 'rec':
        return 3;
      case 'scrap':
        return 1;
    }
  }

  getBuyerInventory() {
    return this.buyInventory;
  }

  getSellerInventory() {
    return this.sellInventory;
  }

  /**
   * This methods attemps to complete the exchange.
   */
  trade(): ExchangeResult {
    const buyerSide = this.fillCurrencyForBuyer();

    if (buyerSide.isComplete()) {
      return {
        seller: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        buyer: buyerSide.store,
        isComplete() {
          return true;
        },
        missing: 0,
        missingChange: 0,
      };
    }

    const changeCurrency = buyerSide.selectChange();
    if (!changeCurrency) {
      return {
        seller: {
          keys: 0,
          ref: 0,
          rec: 0,
          scrap: 0,
        },
        buyer: buyerSide.store,
        isComplete() {
          return false;
        },
        missing: buyerSide.value,
        missingChange: 0,
      };
    }

    const missingBeforeClean = buyerSide.value;
    buyerSide.clean(changeCurrency);

    const sellerValue = this.getCurrencyValue(changeCurrency) - buyerSide.value;
    const sellerSide = this.fillCurrencyForSeller(sellerValue);

    if (sellerSide.isComplete()) {
      buyerSide.store[changeCurrency] += 1;

      return {
        buyer: buyerSide.store,
        seller: sellerSide.store,
        isComplete() {
          return true;
        },
        missing: 0,
        missingChange: 0,
      };
    }

    return {
      buyer: buyerSide.store,
      seller: sellerSide.store,
      isComplete() {
        return false;
      },
      missing: missingBeforeClean,
      missingChange: sellerSide.value,
    };
  }

  private fillCurrencyForBuyer() {
    const { store, value } = this.fillCurrencySide(
      this.value,
      this.buyInventory,
    );

    return new CurrencyExchangeBuyer({
      value,
      store,
      exchange: this,
    });
  }

  private fillCurrencyForSeller(sellerValue: number) {
    const { store, value } = this.fillCurrencySide(
      sellerValue,
      this.sellInventory,
    );

    return new CurrencyExchangeSeller({
      value,
      store,
      exchange: this,
    });
  }

  private fillCurrencySide(
    value: number,
    inventory: ICurrencyStore,
  ): IExchangeSide {
    const store: ICurrencyStore = {
      keys: 0,
      ref: 0,
      rec: 0,
      scrap: 0,
    };

    const currencies: CurrencyName[] = ['keys', 'ref', 'rec', 'scrap'];
    currencies.forEach((currency) => {
      const amount = this.getAmountToFill({
        currency,
        inventory,
        value,
      });

      store[currency] += amount;
      value -= amount * this.getCurrencyValue(currency);
    });

    return {
      value,
      store,
      isComplete(): boolean {
        return value === 0;
      },
    };
  }

  private getAmountToFill({
    currency,
    value,
    inventory,
  }: {
    currency: CurrencyName;
    value: number;
    inventory: ICurrencyStore;
  }): number {
    const currencyValue = this.getCurrencyValue(currency);
    if (currencyValue > value) {
      return 0;
    }

    const howManyCanFit = Math.trunc(value / currencyValue);
    const amount = inventory[currency];
    const howManyCanAdd = amount > howManyCanFit ? howManyCanFit : amount;

    return howManyCanAdd;
  }
}
