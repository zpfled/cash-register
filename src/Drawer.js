import _ from 'underscore';
const EMPTY_DRAWER = { 20: 0, 10: 0, 5: 0, 2: 0, 1:0 };
const DEFAULT_DENOMINATIONS = [ 20, 10, 5, 2, 1 ];

export default class Drawer {
  cash = {};
  denominations = DEFAULT_DENOMINATIONS;

  constructor(cash=EMPTY_DRAWER) {
    this.cash = { ...EMPTY_DRAWER, ...cash };
  }

  add = (cash) => {
    return { ...this.getCash(), ..._.mapObject(cash, (count, den) => this.getCash()[ den ] + (count || 0)) };
  };

  getCash = () => this.cash;
  getDenominations = () => _.sortBy(this.denominations, den => -1 * parseInt(den));

  getLargestAvailableBill = () => {
    const cash = this.getCash();
    let largestBill = null;
    this.getDenominations().reverse().map(denom => cash[ denom ] ? largestBill = denom : null);
    return largestBill;
  };

  getSmallestAvailableBill = () => {
    const cash = this.getCash();
    let smallestBill = null;
    this.getDenominations().map(denom => cash[ denom ] ? smallestBill = denom : null);
    return smallestBill;
  };

  getTotalCash = () => _.chain(this.getCash())
    .mapObject((count, den) => count * den)
    .values()
    .reduce((n, memo) => n + memo)
    .value() || 0;

  isEmpty =() => this.getTotalCash() == 0;

  take = (cash) => _.mapObject(this.getCash(), (count, den) => count - (cash[ den ] || 0));

  toString = () => {
    let string = `$${this.getTotalCash()}`;
    this.getDenominations().map(den => string += ` ${this.getCash()[ den ]}x${den}`);
    return string;
  }
}