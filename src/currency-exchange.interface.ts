import { CurrencyStore } from './currency-exchange.type';

export interface ICurrencyInventory {
    getBuyerInventory(): CurrencyStore;
    getSellerInventory(): CurrencyStore;
}
