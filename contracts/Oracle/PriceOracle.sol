pragma solidity ^0.4.18;

<<<<<<< Updated upstream
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
=======
import "./../DutchExchange/DutchExchangeInterface.sol";
import "./../Utils/Math.sol";

contract OracleContract {
    using Math for *;

    mapping (address => uint)lastPrices;
    uint public lastPriceETHUSD = 0;
    DutchExchangeInterface dutchExchange = 0;
    address etherToken;
    address owner;
    

     // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    ///@dev constructor of the contract, 
    function OracleContract(address _owner)
        public
    {
        owner = _owner;
    }
    
    function updateDutchExchange(address _dutchExchange)
        public
        onlyOwner(msg.sender)
    {
        dutchExchange = DutchExchangeInterface(_dutchExchange);
    }

    /// @dev returns the USDETH price in Cents, ie current value would be 45034 == 450 USD and 34 Cents
    function getUSDETHPrice() 
        public
        view
        returns (uint)
    {
        return lastPriceETHUSD;
    }

    /// @dev anyone can trigger the Update process for the USD ETH feed. 
    ///  possible solutions could be realityCheck with a big 
    ///  set of arbitrators: realityKey, Gnosis, Consensus, oralize or chainlink request
    function updateETHUSDPrice() 
        public
    {
            // lastPricesETHUSD = calculatePricesFromOracles();    
    }
    
    function getTokensValueInCENTS(
        address tokenAddress,
        uint amount
    ) 
        public 
        view
        returns (uint)
    {
        uint tokenValueInETH=getTokensValueInETH(tokenAddress, amount);
        return tokenValueInETH*lastPriceETHUSD;
    }

    function getTokensValueInETH(
        address tokenAddress,
        uint amount
    ) 
        public 
        view
        returns (uint)
    {
        uint startIndex = dutchExchange.latestAuctionIndex[etherToken][tokenAddress]();
        require(startIndex > 1);
        if (dutchExchange.closingPrices[etherToken][tokenAddress][startIndex].den == 0) startIndex--;
        return amount * dutchExchange.closingPrices[etherToken][tokenAddress][startIndex].num / dutchExchange.closingPrices[etherToken][tokenAddress][startIndex].den;
        //weighted volume from opposite auction would be better, but more expensive
    }

    function getTokensValueInETHwithMinVolume(address tokenAddress, uint amount, uint minVolumeInETH) 
    public 
    view
    returns (uint)
    {
        uint startIndex = dutchExchange.latestAuctionIndex[etherToken][tokenAddress];
        require(startIndex > 1);
        if (dutchExchange.closingPrices[etherToken][tokenAddress][startIndex].den == 0) startIndex--;
        uint value=0;
        uint sumOfVolumes=0;
        uint nrOfAuctions=0;
        while (minVolumeInETH > sumOfVolumes && startIndex > 0) {
            value += amount * dutchExchange.closingPrices[etherToken][tokenAddress][startIndex].num / dutchExchange.closingPrices[etherToken][tokenAddress][startIndex].den;
            startIndex--;
            nrOfAuctions++;
        }
        return value / nrOfAuctions;
        //weighted volume from opposite auction would be better, but more expensive
    }

    function getTokensValueInToken(address token1, address token2, uint amount1, uint amount2) 
    public 
    view
    returns (uint)
    {
        return getTokensValueInETH(token1, amount1) / getTokensValueInETH(token2, amount2);
    }

>>>>>>> Stashed changes
}
