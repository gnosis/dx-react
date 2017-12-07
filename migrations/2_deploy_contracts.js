

let Math = artifacts.require('Math')
let DutchExchange = artifacts.require('DutchExchange')
let EtherToken = artifacts.require('EtherToken')
let PriceOracle = artifacts.require('PriceOracle')
let StandardToken = artifacts.require('StandardToken')
let TokenGNO = artifacts.require('TokenGNO')
let OWL = artifacts.require('OWL')

module.exports = function (deployer, networks, accounts) {

	var TokenGNOInstance,PriceOracleInstance;
    deployer.deploy(Math)
    deployer.link(Math, [PriceOracle, DutchExchange, StandardToken,EtherToken, TokenGNO])

    deployer.deploy(EtherToken).then(function() {

	    deployer.deploy(TokenGNO).then(function() {

		    deployer.deploy(StandardToken).then(function() {

			    deployer.deploy(PriceOracle, accounts[0]).then(function(priceOracleInstance) {
			    	console.log(TokenGNO.address);
			    	console.log(PriceOracle.address);
			    	//deployer.deploy(OWL,TokenGNO.address, PriceOracle.adress).then(function() {

					    deployer.deploy(DutchExchange, accounts[0], 
					        EtherToken.address,
					        PriceOracle.address,
					        StandardToken.address,
					        EtherToken.address).then(function() {					     	
					     	//priceOracleInstance.updateDutchExchange(DutchExchange.address);					     	

					    }) 						        
					//})
				})
			})
		})
	})	
}