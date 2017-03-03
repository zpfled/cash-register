import CashRegister from '../src/CashRegister';
import { describe, it } from 'mocha';
import expect from 'expect';

describe('CashRegister', () => {
  const cr = new CashRegister();

  it('represent current moneys as a string', () => {
    expect(cr.toString()).toEqual('$0 0x20 0x10 0x5 0x2 0x1');
  });

  it('add bills in each denomination: #$20 #$10 #$5 #$2 #$1', () => {
    cr.add({ 20: 2, 10: 4, 5: 6, 2: 4, 1: 10 });
    expect(cr.toString()).toEqual('$128 2x20 4x10 6x5 4x2 10x1');
  });

  it('take bills in each denomination: #$20 #$10 #$5 #$2 #$1', () => {
    cr.take({ 20: 1, 10: 4, 5: 3, 2: 0, 1: 10 });
    expect(cr.toString()).toEqual('$43 1x20 0x10 3x5 4x2 0x1');
  });

  it('given a dollar amount, remove money from cash register to make change', () => {
    cr.change(11);
    expect(cr.toString()).toEqual('$32 1x20 0x10 2x5 1x2 0x1');
  });

  it('raise error if change cannot be made', () => {
    expect(cr.change(14)).toEqual('sorry');
  });
});