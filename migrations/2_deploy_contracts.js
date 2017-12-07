

let Math = artifacts.require('Math')
let DutchExchange = artifacts.require('DutchExchange')
let EtherToken = artifacts.require('EtherToken')
let PriceOracle = artifacts.require('PriceOracle');
let StandardToken = artifacts.require('StandardToken');
let TokenGNO = artifacts.require('TokenGNO');
let Owl = artifacts.require('OWL');

module.exports = function (deployer, networks, accounts) {

	var TokenGNOInstance,PriceOracleInstance;
    deployer.deploy(Math)
    deployer.link(Math, [Owl, PriceOracle, DutchExchange, StandardToken,EtherToken, TokenGNO])

    deployer.deploy(EtherToken).then(function() {

	   return deployer.deploy(TokenGNO)

	}).then(function() {

    return deployer.deploy(StandardToken)
	
	}).then(function(p) {
		owner=accounts[0]
	return deployer.deploy(PriceOracle, owner, EtherToken.address)

	}).then(function() {

	return 	deployer.deploy(Owl,TokenGNO.address/*,TokenGNO.adress*/)

	}).then(function() {
			    		
	return deployer.deploy(DutchExchange, accounts[0], 
					        EtherToken.address,
					        PriceOracle.address,
					        StandardToken.address,
					        TokenGNO.address)
	}).then(function() {					     	
	
	return PriceOracle.deployed();					     	

	}).then(function(p){

		return p.updateDutchExchange(DutchExchange.address,{from: accounts[0]});

	}).then(function(){

		return PriceOracle.deployed();					     	

	}).then(function(p){
		console.log(p.address);
		console.log(DutchExchange.address)
		return p.owner.call();

	}).then(function(o){

		console.log(o)
		console.log(accounts[0])
	}); 						        
}