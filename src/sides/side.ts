import { CurrencyExchange } from '../exchange';
import { ICurrencyStore, IExchangeSide } from '../types';

export abstract class CurrencyExchangeSide implements IExchangeSide {
  public value: number;
  public store: ICurrencyStore;
  public exchange: CurrencyExchange;

  constructor({
    value,
    store,
    exchange,
  }: {
    value: number;
    store: ICurrencyStore;
    exchange: CurrencyExchange;
  }) {
    this.value = value;
    this.store = store;
    this.exchange = exchange;
  }

  isComplete(): boolean {
    return this.value === 0;
  }
}
