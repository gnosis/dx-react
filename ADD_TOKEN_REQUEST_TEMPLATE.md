# Add Token Request Template

If you want a token to be included on the Rinkeby token list for the [graphical user interface](https://rinkeby.slow.trade) in the dx-react, it must already be added to the *DutchX* contract on Rinkeby network.
 
You can make sure that the Token is indeed listed in the contract by calling the [API endpoint](https://dutchx-rinkeby.d.exchange/api/v1/tokens) and checking that your Token is present in the response received.

Then, please submit an issue titled **Add Token Request: <TOKEN_NAME>** to this repo following this template:

```markdown

I wish to add <Token> to the Rinkeby token list

[comment]: # (required fields)
Token address: <TOKEN_ADDRESS>
Token image: <LINK_TO_SVG_FILE>

[comment]: # (optional fileds)
Token name: <TOKEN_NAME>
Token symbol: <TOKEN_SYMBOL>
Token decimals: <TOKEN_DECIMALS>

```

Finally add **ATR** label to your issue and you are good to go.

Thank you for requesting that we add your token to the list. We will try our best to add your token as soon as possible. Unfortunately, we cannot guarantee that we will add it. We also reserve the right to take down any tokens that we have previously added. 

We strongly recommend that you take a look at running [minimal liquidity bots](https://dutchx.readthedocs.io/en/latest/run-your-own-bots.html#run-your-own-bots-on-the-dutchx).
