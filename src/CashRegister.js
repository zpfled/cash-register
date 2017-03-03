import ChangeMaker from './ChangeMaker';
import Drawer from './Drawer';

export default class CashRegister {
  constructor(cash={}) {
    this.drawer = new Drawer(cash);
  }

  add = (cash) => this.setDrawer(new Drawer(this.getDrawer().add(cash)));

  change = (amountToChange) => {
    const change = (new ChangeMaker()).change(amountToChange, this.getDrawer());

    if (change) {
      this.take(change.getCash());
    } else {
      return 'sorry';
    }
  };

  getDrawer = () => this.drawer;

  setDrawer = (drawer) => this.drawer = drawer;

  take = (cash) => this.setDrawer(new Drawer(this.getDrawer().take(cash)));

  toString = () => this.getDrawer().toString();
}