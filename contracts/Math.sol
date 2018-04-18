pragma solidity ^0.4.18;


library Math {
    function min(uint a, uint b) 
        public
        returns (uint)
    {
        if (a < b) {
            return a;
        } else {
            return b;
        }
    }

    function max(uint a, uint b)
        public
        returns (uint)
    {
        if (a < b) {
            return b;
        } else {
            return a;
        }
    }
}
