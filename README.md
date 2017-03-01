// represent current moneys as a string
// e.g. $total #x20 #x10 #x5 #x2 #x1
> show
$0 0x20 0x10 0x5 0x2 0x1

// add bills in each denomination: #$20 #$10 #$5 #$2 #$1
> add 2 4 6 4 10
$128 2x20 4x10 6x5 4x2 10x1

// take bills in each denomination: #$20 #$10 #$5 #$2 #$1
> take 1 4 3 0 10
$43 1x20 0x10 3x5 4x2 0x1

// given a dollar amount, remove money from cash register to make change
> change 11
0x20 0x10 1x5 3x2 0x1

// the money is removed from the register
> show
$32 1x20 0x10 2x5 1x2 0x1

// raise error if change cannot be made
> change 14
sorry