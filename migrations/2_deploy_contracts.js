

let Math = artifacts.require('Math')
let DutchExchange = artifacts.require('DutchExchange')
let EtherToken = artifacts.require('EtherToken')
let PriceOracle = artifacts.require('PriceOracle');
let StandardToken = artifacts.require('StandardToken');
let TokenGNO = artifacts.require('TokenGNO');
let OWL = artifacts.require('OWL');

module.exports = function (deployer, networks, accounts) {

	var TokenGNOInstance,PriceOracleInstance;

    deployer.deploy(Math)
    deployer.link(Math, [OWL, PriceOracle, DutchExchange, StandardToken,EtherToken, TokenGNO])

    deployer.deploy(EtherToken).then(function() {

	   return deployer.deploy(TokenGNO)

	}).then(function() {

    return deployer.deploy(StandardToken)
	
	}).then(function(p) {
	
	return deployer.deploy(PriceOracle, accounts[0], EtherToken.address)

	}).then(function(){
	
	return PriceOracle.deployed();					     	

	}).then(function(p){
		PriceOracleInstance=p;
		return PriceOracleInstance.owner.call();

	}).then(function(oI){

		console.log(oI)
		console.log(accounts[0])
	return 	deployer.deploy(OWL,TokenGNO.address /*,PriceOracle.adress*/)

	}).then(function() {
			    		
	return deployer.deploy(DutchExchange, accounts[0], 
					        EtherToken.address,
					        PriceOracle.address,
					        StandardToken.address,
					        TokenGNO.address)
	
	}).then(function(){
		console.log(DutchExchange.address)
		console.log(PriceOracleInstance.address)
		return PriceOracleInstance.updateDutchExchange(DutchExchange.address,{from: accounts[0]})
	}).then(function(){

		return PriceOracleInstance.getCurrentDutchExchange.call();

	}).then(function(DutchExchangeAddress){

		console.log(DutchExchangeAddress)

	}); 						        
}