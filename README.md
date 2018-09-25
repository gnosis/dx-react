[![Build Status](https://travis-ci.org/gnosis/dx-react.svg?branch=master)](https://travis-ci.org/gnosis/dx-react?branch=master)

<p align="center">
  <img width="350px" src="http://dutchx.readthedocs.io/en/latest/_static/DutchX-logo_blue.svg" />
</p>

# slow.trade Seller Interface

**DX-React** is a React/Redux/Truffle + Web3 frontend application interfacing with the [DX-Contracts][dx-contracts]

<span style="background-color:#ffa07a; color:#000;">**The rest of this guide assumes you are using up-to-date versions of Node, NPM, Chrome and MetaMask, respectively.**</span>

# Running locally
1. Install `ganache-cli` & `truffle` globally - we recommend `truffle@4.1.5` right now for stability
    > `npm i -g ganache-cli truffle@4.1.5`
2. Grab the `dx-react` project
    > `git clone git@github.com:gnosis/dx-react.git`
3. Install deps - please be patient as this _may_ take a little while.
    > `npm install`
4. Running the app - please have 3 terminals/tabs ready
    > **Step 1**: `npm run rpc`

    > **Step 2**: `npm run migrate`
    
    > **Step 3**: `npm start`
5. Head to `localhost:5000` in Chrome

# Adding and deploying a test token
> Please refer to the [Truffle Docs][truffle-suite] for much more in-depth info on migrations/deployment
1. Take a look inside `./test/contracts` to see 2 local only contracts used in testing
    > When using test tokens, they first need to be created as in the above folder, and then deployed
2. Take a look inside `./migrations`
    > Notice that the files are named clearly and superseded by numbers. Migration scripts are fired sequentially!
    > Use conditionals here to facilitate deploying contracts only on certain networks - e.g:
    ```
    module.exports = (deployer, network) => {
        if (network === 'development') return deployer.deploy(TokenOMG, 50000e18).then(() => deployer.deploy(TokenRDN, 50000e18))

        return console.log('Not running on development, skipping.')
    }
    ```
    > The migration script export accepts 3 params:
        a. `module.exports = (deployer, network, accounts) => { ... }`
        
        1. deployer: Function
        2. network:  string
        3. accounts: string[]
    
    > from the TruffleContract repo:

    #### DEPLOYER
    Your migration files will use the deployer to stage deployment tasks. As such, you can write deployment tasks synchronously and they'll be executed in the correct order:

    ```
    // Stage deploying A before B
    deployer.deploy(A);
    deployer.deploy(B);
    ```

    Alternatively, each function on the deployer can be used as a Promise, to queue up deployment tasks that depend on the execution of the previous task:

    ```
    // Deploy A, then deploy B, passing in A's newly deployed address
    deployer.deploy(A).then(function() {
    return deployer.deploy(B, A.address);
    });
    ```

    #### NETWORKS
    `returns string ('development' | 'rinkeby' | 'main', 'kovan' | 'ropsten')`
    
    As mentioned above, can be used to grab network info in migrations flow. Conditional migrating, for example

    #### ACCOUNTS
    `returns string[]`
    
    Use to migrate/deploy contracts with certain addresses. On local these are the accounts first listed in `ganache-cli`
    > Please refer to the [Ganache-CLI][ganache-cli] repo for more information

    3. Deploying contracts
        > Now it's time to deploy! Finally! Your `./migrations` folder will contain files something like:

        1. `1_initial_migrations.js`
        2. `2_DEV_ONLY_Migrate_Deps.js`
        3. `3_DEV_ONLY_Migrate_Test_Tokens.js`

        Where numbers 2 and 3 use conditional network checking logic to only deploy when ganache is set on the `development` (local) network.

License
----

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/gnosis/dx-react/blob/master/LICENSE) file for details

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

    
   [dx-contracts]: <https://github.com/gnosis/dx-contracts>
   [ganache-cli]: <https://github.com/trufflesuite/ganache-cli>
   [truffle-suite]: <https://truffleframework.com/docs>
