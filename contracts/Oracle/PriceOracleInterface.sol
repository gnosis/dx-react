pragma solidity ^0.4.18;

import "./../DutchExchange/DutchExchangeInterface.sol";
import "./../Utils/Math.sol";

contract PriceOracleInterface {
    using Math for *;

    mapping (address => uint)lastPrices;
    uint public lastPriceETHUSD = 0;
    DutchExchangeInterface dutchExchange ;
    address etherToken;
    address owner;
    

     // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    ///@dev constructor of the contract, 
    function PriceOracleInterface(address _owner, address _etherToken)
        public
    {
        owner = _owner;
        etherToken=_etherToken;
    }
    
    function updateDutchExchange(address _dutchExchange)
        public
        onlyOwner();
    /// @dev returns the USDETH price in Cents, ie current value would be 45034 == 450 USD and 34 Cents
    function getUSDETHPrice() 
        public
        view
        returns (uint);

    /// @dev anyone can trigger the Update process for the USD ETH feed. 
    ///  possible solutions could be realityCheck with a big 
    ///  set of arbitrators: realityKey, Gnosis, Consensus, oralize or chainlink request
    function updateETHUSDPrice() 
        public;
    
    function getTokensValueInCENTS(
        address tokenAddress,
        uint amount
    ) 
        public 
        view
        returns (uint);

    function getTokensValueInETH(
        address tokenAddress,
        uint amount
    ) 
        public 
        view
        returns (uint);
    function getTokensValueInETHwithMinVolume(address tokenAddress, uint amount, uint minVolumeInETH) 
    public 
    view
    returns (uint);

    function getTokensValueInToken(address token1, address token2, uint amount1, uint amount2) 
    public 
    view
    returns (uint);
    

}
