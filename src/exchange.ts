import { Currency, ICurrency, toScrap } from 'tf2-currency';
import { CurrencyExchangeSide } from './exchange-side';
import {
  Intent,
  ExchangeResult,
  ConvertedExchangeResult,
  ICurrencyInventory,
} from './types';

export class CurrencyExchange {
  public readonly value: number;
  public readonly keyPrice: number;
  public readonly keyPriceForChange?: number;

  private seller: CurrencyExchangeSide;
  private buyer: CurrencyExchangeSide;

  constructor({
    buyInventory,
    sellInventory,
    price,
    keyPrice,
    keyPriceForChange,
  }: {
    buyInventory: ICurrencyInventory;
    sellInventory: ICurrencyInventory;
    /**
     * Price in keys and metal.
     */
    price: ICurrency;
    /**
     * Key price in metal.
     */
    keyPrice: number;
    keyPriceForChange?: number;
  }) {
    this.keyPrice = toScrap(keyPrice);
    this.keyPriceForChange = keyPriceForChange
      ? toScrap(keyPriceForChange)
      : this.keyPrice;

    this.value = new Currency(price).toScrap(keyPrice);

    this.buyer = new CurrencyExchangeSide({
      value: this.value,
      inventory: buyInventory,
      keyPrice: this.keyPrice,
    });

    this.seller = new CurrencyExchangeSide({
      value: 0,
      inventory: sellInventory,
      keyPrice: this.keyPriceForChange || this.keyPrice,
    });
  }

  isComplete() {
    return this.seller.isComplete() && this.buyer.isComplete();
  }

  /**
   * This method attempts to complete the exchange.
   */
  trade() {
    this.buyer.fillCurrencySide();

    if (this.buyer.isComplete()) {
      return this.getResult();
    }

    const changeCurrency = this.buyer.selectChange();
    if (!changeCurrency) {
      return this.getResult();
    }

    this.buyer.clean(changeCurrency);

    this.seller.value =
      this.seller.getCurrencyValue(changeCurrency) - this.buyer.value;
    this.seller.fillCurrencySide();

    if (this.seller.isComplete()) {
      this.buyer.store[changeCurrency] += 1;
      this.buyer.value = 0;
      this.buyer.missingBeforeClean = 0;
    }

    return this.getResult();
  }

  private getResult(): ExchangeResult {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return {
      buyer: self.buyer.store,
      seller: self.seller.store,
      missing: self.buyer.missingBeforeClean || self.buyer.value,
      missingChange: self.seller.value,
      isComplete() {
        return self.isComplete();
      },
      convertByIntent(intent: Intent): ConvertedExchangeResult {
        return {
          our: intent === 'sell' ? this.seller : this.buyer,
          their: intent === 'buy' ? this.seller : this.buyer,
          missing: this.missing,
          missingChange: this.missingChange,
          isComplete() {
            return self.isComplete();
          },
        };
      },
    };
  }
}
