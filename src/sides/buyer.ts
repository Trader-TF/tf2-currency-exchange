import { CurrencyExchangeSide } from './side';
import { CurrencyName } from '../types';

export class CurrencyExchangeBuyer extends CurrencyExchangeSide {
  selectChange() {
    const currencies: CurrencyName[] = ['rec', 'ref', 'keys'];

    return currencies.find((currency) => {
      const currencyValue = this.exchange.getCurrencyValue(currency);

      if (this.value >= currencyValue) {
        return false;
      }

      return (
        this.exchange.getBuyerInventory()[currency] - this.store[currency] > 0
      );
    });
  }

  clean(changeCurrency: CurrencyName) {
    const curreniesToClean = this.getCurrenciesToClean(changeCurrency);
    if (curreniesToClean.length < 2) {
      return;
    }

    curreniesToClean.forEach((currency) => {
      const amount = this.store[currency];
      const value = amount * this.exchange.getCurrencyValue(currency);
      this.store[currency] = 0;
      this.value += value;
    });
  }

  private getCurrenciesToClean(changeCurrency: CurrencyName) {
    const changeValue = this.exchange.getCurrencyValue(changeCurrency);
    const currencies: CurrencyName[] = ['keys', 'ref', 'rec', 'scrap'];
    const thresholdIndex = currencies.findIndex((currency) => {
      return this.exchange.getCurrencyValue(currency) < changeValue;
    });

    return currencies.slice(thresholdIndex);
  }
}
