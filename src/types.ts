export interface ICurrencyStore {
  keys: number;
  ref: number;
  rec: number;
  scrap: number;
}

export type CurrencyName = keyof ICurrencyStore;

export type Intent = 'buy' | 'sell';

export type InventoryStore = {
  keys: string[];
  ref: string[];
  rec: string[];
  scrap: string[];
};

export type ExchangeResult = {
  seller: ICurrencyStore;
  buyer: ICurrencyStore;
  missing: number;
  missingChange: number;
  convertByIntent(intent: Intent): ConvertedExchangeResult;
  isComplete(): boolean;
};

export type ConvertedExchangeResult = {
  our: ICurrencyStore;
  their: ICurrencyStore;
  missing: number;
  missingChange: number;
  isComplete(): boolean;
}

export type Change = {
  name: string;
  value: number;
};
