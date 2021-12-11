export interface ICurrencyStore {
  keys: number;
  ref: number;
  rec: number;
  scrap: number;
}

export type CurrencyName = keyof ICurrencyStore;

export type Intent = 'buy' | 'sell';

export interface IExchangeSide {
  store: ICurrencyStore;
  value: number;
  isComplete(): boolean;
}

export type InventoryStore = {
  keys: string[];
  ref: string[];
  rec: string[];
  scrap: string[];
};

export type ExchangeResult = {
  seller: ICurrencyStore;
  buyer: ICurrencyStore;
  isComplete(): boolean;
  missing: number;
  missingChange: number;
};
