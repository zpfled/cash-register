// @flow
import _ from 'underscore';
const EMPTY_DRAWER = { 20: 0, 10: 0, 5: 0, 2: 0, 1:0 };
const DEFAULT_DENOMINATIONS = [ 20, 10, 5, 2, 1 ];

class Drawer {
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
    this.getDenominations().map(den => string += ` ${this.getCash()[ den ]}x${den}`)
    return string;
  }
}

export default class CashRegister {
  constructor() {
    this.drawer = new Drawer;
  }

  add = (cash) => this.setDrawer(new Drawer(this.getDrawer().add(cash)));

  //returns drawer with change taken out
  change = (amountToChange, drawer=this.getDrawer(), change=(new Drawer), memo=[]) => {
    const largestAvailableBill = drawer.getLargestAvailableBill();
    const smallestBillAvailable = drawer.getSmallestAvailableBill();

    //can I make change?
    if (amountToChange == 0) {
      this.take(change.getCash());
      return change;
    }
    //is my drawer empty?
    //  - yes
    if (drawer.isEmpty()) {
    //    - return 'sorry'
      return 'sorry';
    }

    //  - no
    else {
    //    - is my smallest bill greater than amount?
    //      - yes
      if (smallestBillAvailable > amountToChange) {
        if (memo.length == 0)  {
          return 'sorry';
        } else {
    //      - recurse with
    //        - same amount,
    //        - new starting drawer (drawer - change from last memo string),
    //        - change from last memo,
    //        - memo without last item
          const previousChangeTry = _.chain(memo).last().keys().first().value();
          memo.pop();
          return this.change(
            amountToChange + parseInt(previousChangeTry),
            drawer,
            new Drawer(change.take({[previousChangeTry]: 1})),
            // change,
            memo
          );
        }
      }
    //      - no
      else {
    //        - is my largest bill greater than amount?
    //          - yes
        if (largestAvailableBill > amountToChange) {
    //            - remove largest bill
    //            - recurse with same amount, new drawer, same change, same memo
          return this.change(
            amountToChange,
            new Drawer(drawer.take({ [largestAvailableBill]: 1 })),
            change,
            memo
          );
        }

        else {
    //          - no
    //            - subtract largest bill from amount
          const newAmountToChange = amountToChange - parseInt(largestAvailableBill);
    //            - add largest bill to change drawer
          const newChange = new Drawer(change.add({[largestAvailableBill]: 1}));
    //            - take change.getCash() from drawer
          const newDrawer = new Drawer(drawer.take({ [largestAvailableBill]: 1 }));
    //            - add { [largestAvailableBill]: change } to memo
          memo.push({[largestAvailableBill]: 1});
    //            - recurse with new amount, new drawer, change, memo
          return this.change(
            newAmountToChange,
            newDrawer,
            newChange,
            memo
          )
        }

      }
    }
  };

  getDrawer = () => this.drawer;
  setDrawer = (drawer) => this.drawer = drawer;

  take = (cash) => this.setDrawer(new Drawer(this.getDrawer().take(cash)));

  toString = () => this.getDrawer().toString();
}