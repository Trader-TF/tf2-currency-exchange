export class CurrencyExchangeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CurrencyExchangeError";
    }
}
