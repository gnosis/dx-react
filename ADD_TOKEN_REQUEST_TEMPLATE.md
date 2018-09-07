# Add Token Request Template

If you want a token to be included in the Rinkeby token list in the dx-react, it must already be added to the *DutchExchange* contract on Rinkeby network.
 
You can make sure that the Token is indeed listed in the contract by calling the api endpoint https://dutchx-rinkeby.d.exchange/api/v1/tokens and checking that your Token is present in the response received.

Then please submit an issue titled **Add Token Request: <TOKEN_NAME>** to this repo following this template:

```md

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

Thank you for adding your Token to the list! We are looking forward to any and all contributions.
