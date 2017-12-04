pragma solidity ^0.4.18;

contract PriceOracle{

  mapping (address => uint)lastPrices;
  uint public lastPriceETHvsUSD=0;
  address DutchExchange=0;

  function PriceOracle(address _DutchExchange) public{
    DutchExchange=_DutchExchange;
  }

  function getETHvsTokenPrice(address TokenAddress) public
  returns (uint)
  {
    // lastPrices[GNOTokenAddress]=DutchExchange.getlastPrice(GNOTokenAddress)
    require(lastPrices[TokenAddress]!=0);
    return lastPrices[TokenAddress];
  }
  function getUSDvsETHPrice() public
  returns (uint){
    // lastPricesETHUSD=calculatePricesFromOracles();
    return lastPriceETHvsUSD;
  }
}
