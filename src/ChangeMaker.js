import _ from 'underscore';
import Drawer from './Drawer';

export default class ChangeMaker {
  change = (amountToChange, drawer=this.getDrawer(), change=(new Drawer), memo=[]) => {
    const largestAvailableBill = drawer.getLargestAvailableBill();
    const smallestBillAvailable = drawer.getSmallestAvailableBill();

    if (amountToChange == 0) {
      return change;
    }

    if (drawer.isEmpty()) {
      return null;
    } else {
      if (smallestBillAvailable > amountToChange) {
        if (memo.length == 0)  {
          return 'sorry';
        } else {
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
      } else {
        if (largestAvailableBill > amountToChange) {
          return this.change(
            amountToChange,
            new Drawer(drawer.take({ [largestAvailableBill]: 1 })),
            change,
            memo
          );
        }

        else {
          const newAmountToChange = amountToChange - parseInt(largestAvailableBill);
          const newChange = new Drawer(change.add({[largestAvailableBill]: 1}));
          const newDrawer = new Drawer(drawer.take({ [largestAvailableBill]: 1 }));
          memo.push({[largestAvailableBill]: 1});
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
}