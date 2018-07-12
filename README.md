[![Build Status](https://travis-ci.org/gnosis/dx-react.svg?branch=master)](https://travis-ci.org/gnosis/dx-react?branch=master)

<p align="center">
  <img width="350px" src="http://dutchx.readthedocs.io/en/latest/_static/DutchX-logo_blue.svg" />
</p>

# DutchX Seller Interface

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

License
----



[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

    
   [dx-contracts]: <https://github.com/gnosis/dx-contracts>
