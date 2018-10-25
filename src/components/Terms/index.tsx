import React, { HTMLAttributes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { URLS } from 'globals'
import { State } from 'types'

export const TermsText = (props: HTMLAttributes<HTMLDivElement> & { network: string }) => (
  <div {...props}>
  {props.network === '1' || props.network === 'MAIN'
    ?
    <>
    <p>
      <strong>
        Terms &amp; Conditions of slow.trade
                </strong>
      <br />
      Last updated: September 2018
              </p>
    <div>
      Please read these Terms carefully before participating on our trading platform. These Terms tell you who we are, what we offer and what to do if there is a problem and other important information. If you think that there is a mistake in these Terms, please contact us to discuss at <a href="mailto:legal@slow.trade">legal@slow.trade</a>.
                <br /><br />
      <strong>
        TERMS AND CONDITIONS (“TERMS”)
                </strong>
      <br /><br />
      <strong>
        1. WHO WE ARE AND HOW TO CONTACT US
                </strong>
      <br />
      <div className="subText">
        1.1. Slow.trade is operated by d.ex OÜ (”
                  <strong>
          We
                  </strong>
        ”). We are a private limited company registered in Estonia under registry No. 14553524 at Ahtri 12, Kesklinna District, 10151 Tallinn, Harju County, Estonia. To contact us, please email us at <a href="mailTo: info@slow.trade">info@slow.trade</a>.
                  <br />
      </div>
      <strong>
        2. WHO YOU ARE: A BUSINESS CUSTOMER OR A CONSUMER?
                </strong>
      <div className="subText">
        2.1. In some areas you will have different rights under these terms depending on whether you are a business or consumer.
                  <br />
        2.2. You are a consumer if:
                  <br />
        2.2.1. You are an individual and
                  <br />
        2.2.2. You are using our services from us wholly or mainly for your personal use (not for use in connection with your trade, business, craft or profession).
                  <br />
        2.3. Everyone else is a business customer.
                  <br />
        2.4. Provisions that only apply to consumers are in <span className="green">GREEN</span> and those that only apply to business customers are in <span className="red">RED</span>.
                  <br />
      </div>

      <strong>
        3. WE PROVIDE A PLATFORM TO INTERACTING WITH THE DUTCHX DECENTRALIZED TRADING PROTOCOL
                </strong>
      <br />
      <div className="subText">
        3.1. We provide a graphical user interface on the site https://slow.trade (the “
                  <strong>
          Platform
                  </strong>
        ”) to facilitate you interacting via a digital wallet, vault or storage mechanism (a “
                  <strong>
          Wallet
                  </strong>
        ”) with the DutchX decentralized trading protocol for ERC 20 tokens (the “
                  <strong>
          Protocol
                  </strong>
        ”).
                  <br />
        3.2. The Protocol was developed by Gnosis Limited and is governed by a series of smart contracts that allow peer-to-peer trades between users applying a Dutch auction mechanism and without the need for intermediaries on the Ethereum Blockchain. We did not develop and do not operate or maintain or have any control whatsoever over the Protocol. We are not a custodian or a counterparty to any transactions executed by you on the Protocol. We do not support any other service, particularly we do not provide any order matching, guaranteed prices, order cancellation or similar exchange or trading platform services.
                  <br />
        3.3. On our Platform, we assist you in (1) depositing ERC20 tokens listed on our Platform (the “
                  <strong>
          Supported Tokens
                  </strong>
        ”) for trading against other Supported Tokens via your Wallet into the auction conducted by the Protocol and (2) claiming the Supported Tokens you receive for your trade back to that same Wallet.
                  <br />
        3.4. If you wish to use ETH to trade on the Platform, we offer you an interface to interact with a smart contract developed by Gnosis Limited that wraps your ETH making it ERC20 compliant, which you will be prompted to before the trade.The Platform does not support the un-wrapping of wrapped ETH.
                  <br />
      </div>

      <strong>
        4. BY USING OUR PLATFORM, YOU ACCEPT THESE TERMS
                </strong>
      <div className="subText">
        4.1. These are the general terms and conditions ("
                  <strong>
          Terms
                  </strong>
        ") that apply to the use of our Platform.
                  <br />
        4.2. By using our Platform, you confirm that you (1) accept and agree to these Terms and that you agree to comply with them. If you do not agree, you must not use our Platform.
                  <br />
        4.3. You are responsible for ensuring that all persons who access or use our Platform through your device or internet connection are aware of these Terms, and that they comply with them.
                  <br />
        4.4. The Terms refer to the following additional terms, which also apply to your use of our Platform and are hereby incorporated by reference:
                  <br />
        <div className="subText">
          4.4.1. Our <a href="./PrivacyPolicy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                    <br />
          4.4.2. Our <Link to="/cookies">Cookie Policy</Link>, which sets out information about the cookies on our site.
                    <br />
        </div>
        4.5. We may amend these Terms at our sole discretion. We regularly do so. Every time you wish to use our Platform, please check these Terms to ensure you understand the terms that apply at that time.
                  <br />
        4.6. We may terminate or suspend your access to our Platform immediately, without prior notice or liability, if you breach any clause of the Terms. Upon termination of your access, your right to use the Platform will immediately cease. Clauses 7 to 25 survive any termination of these Terms.
                  <br />
        4.7. You may have been recommended to the Platform by a third party. We shall not be liable for any agreement or terms that may exist between you and the respective third party.
                  <br />
      </div>

      <strong>
        5. WHAT YOU REQUIRE TO USE OUR PLATFORM
                </strong>
      <div className="subText">
        5.1. Participants may use our Platform to interact with the Protocol and trade Supported Tokens against other Supported Tokens by placing their Supported Tokens via your Wallet into the next auction for that token pair running on the Protocol.
                  <br />
        5.2. A detailed step-by-step guide on how to use the Platform may be found <Link to="/content/HowItWorks">here</Link>.
                  <br />
        5.3. To use the Platform you require:
                  <br />
        <div className="subText">
          5.3.1. A Wallet compatible with the Platform. We currently only support MetaMask as your Wallet, which you may download from <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">www.metamask.io</a>. We have not tested compatibility with any other Wallet.
                    <br />
          5.3.2. We have not tested compatibility with any other Wallet.
                    <br />
          5.3.3. A Supported Token or ETH.
                    <br />
          5.3.4. ETH in your Wallet to pay for transactions fees, which are incurred through the Protocol and on the Ethereum Blockchain.
                    <br />
        </div>
      </div>
      <strong>
        6. NO FEES LEVIED BY US
                </strong>
      <div className="subText">
        6.1. We do not levy any fees on users of our Platform at this moment in time. This may however change in the future. Fees are incurred on the Protocol level and amount to a maximum of 0.5% of the tokens deposited with the Protocol by the user and are directly taken at the time of deposit. All the fees flow to the next auction of the same auction pair as an additional sell volume. Fees are not extracted from the Protocol.
                  <br />
        6.2. 50% of fees may be paid in OWL. OWL are generated by locking GNO Tokens, the native tokens of Gnosis Limited. Fees paid in OWL are consumed and do not go to any third party.
                  <br />
        6.3. The user has the ability to lower these fees based on a mechanism defined on Protocol level. The fees can be lowered to 0.
                  <br />
        6.4. Users interacting with the Ethereum Blockchain will incur network fees (so called gas costs). Gas costs are independent of the Platform and go to miners processing the transaction on the Ethereum Blockchain. We have no control over and do not set the gas costs, and do not benefit from them. Gas costs are calculated by multiplying the gas price with the gas used. The Platform does not change the default suggestion of your Wallet provider. Gas costs may differ significantly, depending on the ETH-USD rate and network usage at the transaction time. Users may be able to change the default gas price within their Wallet, depending on the Wallet used.
                  <br />
      </div>
      <strong>
        7. WE MAY MAKE CHANGES TO OR SUSPEND OR WITHDRAW OUR PLATFORM
                </strong>
      <div className="subText">
        7.1. We may update and change our Platform from time to time. Our Platform is made available free of charge. We do not guarantee that our Platform will always be available or be uninterrupted or be free of charge. We may suspend or withdraw or restrict the availability of all or any part of our Platform for business, operational or regulatory reasons at 2-days’ notice or, in case of Force Majeure in accordance with clause 7.2, at no notice.
                  <br />
        7.2. Force Majeure shall mean any event, circumstance or cause beyond our reasonable control, which makes the provision of our Platform impossible or onerous, including, without limitation:
                  <br />
        <div className="subText">
          7.2.1. acts of God, flood, storm, drought, earthquake or other natural disaster;
                    <br />
          7.2.2. epidemic or pandemic;
                    <br />
          7.2.3. terrorist attack, civil war, civil commotion or riots, war, threat of or preparation for war, armed conflict, imposition of sanctions, embargo, or breaking off of diplomatic relations;
                    <br />
          7.2.4. nuclear, chemical or biological contamination;
                    <br />
          7.2.5. any law or any action taken by a government or public authority, including without limitation imposing a prohibition, or failing to grant a necessary licence or consent;
                    <br />
          7.2.6. collapse of buildings, breakdown of plant or machinery, fire, explosion or accident; and
                    <br />
          7.2.7. strike, industrial action or lockout.
                    <br />
        </div>
        7.3. You are also responsible for ensuring that all persons who access our Site through your internet connection are aware of these Terms and that they comply with them.
                  <br />
      </div>
      <strong>
        8. YOU ARE RESPONSIBLE TO SECURE YOUR CRYPTOGRAPHIC ASSETS, WE DO NOT TAKE CUSTODY
                </strong>
      <div className="subText">
        8.1. You must own and fully control the Wallet you use in connection with our Platform.
                  <br />
        8.2. You are responsible for implementing all appropriate measures for securing the Wallet you use for the Platform, including any private key(s), seed words or other credentials necessary to access such storage mechanism(s). By using our Platform, we do not gain custody of any of your private keys.
                  <br />
        8.3. We advise you to bookmark https://slow.trade as web address imitation by hackers is a constant risk.
                  <br />
        8.4. We shall not be responsible for any security measures relating to the Wallet you use for the Platform and exclude (to the fullest extent permitted under applicable law) any and all liability for any security breaches or other acts or omissions, which result in your loss of access or custody of any cryptographic assets stored thereon.
                  <br />
      </div>
      <strong>
        9. YOU ARE RESPONSIBLE FOR AND DETERMINE YOUR TAX LIABILITIES
                </strong>
      <div className="subText">
        9.1. You are solely responsible to determine if your use of the Platform have tax implications for you. By using the Platform, and to the extent permitted by law, you agree not to hold us liable for any tax liability associated with or arising from the operation of the Platform or any other action or transaction related thereto.
                  <br />
      </div>
      <strong>
        10. INFORMATION ON THE PLATFORM ARE NOT ADVICE
                </strong>
      <div className="subText">
        10.1. None of the information available on our Platform, or made otherwise available to you in relation to its use, constitutes any legal, tax, financial or other advice. Where in doubt as to the action you should take, you should consult your legal, financial, tax or other professional advisors.
                  <br />
      </div>
      <strong>
        11. OUR SITE IS OPTIMISED FOR USERS IN ESTONIA
                </strong>
      <div className="subText">
        11.1. The Platform is directed to people residing in Estonia. We do not represent that our Platform is appropriate for use or available in other locations.
                  <br />
      </div>
      <strong>
        12. OUR INTELLECTUAL PROPERTY RIGHTS ARE RESERVED
                </strong>
      <div className="subText">
        12.1. We are the owner or the licensee of all intellectual property rights of the Platform. Those works are protected by intellectual property laws and treaties around the world. All such rights are reserved.
                  <br />
        12.2. Subject to your compliance with these Terms, we grant you a limited, revocable, non-exclusive, non-transferable, non-sublicensable licence to access and make personal and non-commercial use of the Platform. This licence does not include any resale, commercial or derivative use of our Platform. We reserve and retain all rights not expressly granted to you in these Terms. The Platform may not be reproduced, sold, or otherwise exploited for any commercial purpose without our express prior written consent. You may not frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information of us without our express prior written consent. You may not misuse the Platform and may only use it as permitted by law. If you breach our intellectual property rights in violation of these Terms, your license to use our Platform will automatically be revoked and terminate immediately.
                  <br />
      </div>
      <strong>
        13. WE ARE NOT RESPONSIBLE FOR VIRUSES AND YOU MUST NOT INTRODUCE THEM
                </strong>
      <div className="subText">
        13.1. We do not guarantee that our Platform will be secure or free from bugs or viruses.
                  <br />
        13.2. You are responsible for configuring your information technology and computer programmes to access our Platform. You should use your own virus protection software.
                  <br />
        13.3. You must not misuse our Platform by knowingly introducing material that is malicious or technologically harmful. You must not attempt to gain unauthorised access to our Platform, the server on which our interface is stored or any server, computer or database connected to our interface. You must not attack our Platform via a denial-of-service attack or a distributed denial-of service attack. By breaching this provision, you would commit a criminal offence. We will report any such breach to the relevant law enforcement authorities and we will cooperate with those authorities, including, where possible, by disclosing your identity to them. In the event of such a breach, your right to use our Platform will cease immediately.
                  <br />
      </div>
      <strong>
        14. RULES ABOUT YOU LINKING TO OUR SITE
                </strong>
      <div className="subText">
        14.1. You may link to our home page, provided you do so in a way that is fair and legal and does not damage our reputation or take advantage of it. You must not establish a link in such a way as to suggest any form of association, approval or endorsement on our part where none exists. You must not establish a link to our Platform in any website that is not owned by you.
                  <br />
        14.2. Our interface must not be framed on any other site, nor may you create a link to any part of our interface other than the home page. We reserve the right to withdraw linking permission without notice.
                  <br />
        14.3. The website in which you are linking must comply in all respects with the content standards set out in these Terms. If you wish to link to or make any use of content on our interface other than that set out above, please contact info@slow.trade.
                  <br />
      </div>
      <strong>
        15. WE DECIDE ON THE ACCESSIBILITY OF OUR PLATFORM AND THE CRYPTOGRAPHIC ASSETS LISTED
                </strong>
      <div className="subText">
        15.1. Our Platform is accessible only in those jurisdictions approved by us and only to you if you have confirmed to us that you are compliant with the respective local laws and regulations and that you agree to the Terms.
                  <br />
        15.2. In our absolute discretion, we determine the types of transactions (the “
                  <strong>
          Supported Actions
                  </strong>
        ”) and Supported Tokens available through our Platform and may from time to time and without prior notice to you list or delist the Supported Tokens or modify the Supported Actions.
                  <br />
      </div>
      <strong>
        16. WE COOPERATE WITH REGULATORS
                </strong>
      <div className="subText">
        16.1. We will provide full assistance to, and may also supply any relevant information without delay to any competent regulator. We will comply with all relevant laws and regulations, and any request of the competent regulators.
                  <br />
      </div>
      <strong>
        17. YOUR WARRANTIES AND REPRESENTATIONS TO US
                </strong>
      <div className="subText">
        17.1. By using our Platform you hereby agree, represent and warrant that:
                  <br />
        <div className="subText">
          17.1.1. you have read and understood the Terms and agree to be bound by them;
                    <br />
          17.1.2. you do not rely on, and shall have no remedies in respect of, any statement, representation, assurance or warranty (whether made innocently or negligently) that is not set out in these Terms;
                    <br />
          17.1.3. you have reached the legal age of majority applicable to you and you agree to provide legitimate and lawful documentation proving such status if we so request;
                    <br />
          17.1.4. your usage of our Platform is legal under the laws of your jurisdiction or under the laws of any other jurisdiction to which you may be subject;
                    <br />
          17.1.5. you understand the functionality, usage, storage, transmission mechanisms and intricacies associated with cryptographic assets (such as ETH), token storage facilities (including digital token wallets), blockchain technology and blockchain-based software systems;
                    <br />
          17.1.6. you understand that transactions on the Ethereum Blockchain are irreversible and may not be erased and that your wallet address and transaction is displayed permanently and publicly and that you relinquish any right of rectification or erasure of personal data;
                    <br />
          17.1.7. you shall comply with any applicable tax obligations in your jurisdiction arising from your use of the Platform;
                    <br />
          17.1.8. you shall not misuse or gain unauthorised access to our Platform by knowingly introducing viruses, Trojan horses, worms, time-bombs, keystroke loggers, spyware, adware or any other harmful programs or similar computer code designed to adversely affect our Platform and that in the event you do so or otherwise attack our Platform, we report any such activity to the relevant law enforcement authorities;
                    <br />
          17.1.9. you shall not access without authority, interfere with, damage or disrupt any part of our Platform, any equipment or network on which our Platform is stored, any software used in the provision of our Platform or any equipment or network or software owned or used by any third party;
                    <br />
          17.1.10. you shall not use our Platform for activities that are unlawful or fraudulent or have such purpose or effect or otherwise support any activities that breach applicable local, national or international law or regulations;
                    <br />
          17.1.11. you shall not use our Platform to trade cryptographic assets that are proceeds of criminal or fraudulent activity;
                    <br />
          17.1.12. the Platform, Protocol and the underlying Ethereum Blockchain are in an early development stage and we accordingly do not guarantee an error-free process and give no price or liquidity guarantee;
                    <br />
          17.1.13. you are using the Platform at your own risk;
                    <br />
          17.1.14. the risks of using the Platform are substantial and include, but are not limited to the ones set out in the
                    <span style={{ textDecoration: 'underline' }}>
            <strong>
              APPENDIX
                      </strong>
          </span>
          , which is hereby expressly incorporated into these Terms, and you are willing to accept the risk of loss associated therewith.
                    <br />
        </div>
      </div>
      <strong>
        18. YOUR INDEMNIFICATION AND LIABILITY TO US
                </strong>
      <div className="subText">
        18.1. You agree to release and indemnify, defend and hold us and any of our affiliates harmless, as well as any directors, officers, employees, shareholders and representatives of any of the foregoing, from and against any and all losses, liabilities, damages, costs claims or actions of any kind arising or resulting from your use of our Platform, your breach of these Terms, and any of your acts or omissions that infringe the rights of any person.
                  <br />
        18.2. We reserve the right, at our own expense, to assume exclusive defence and control of any matter otherwise subject to indemnification by you and, in such case, you agree to cooperate with us in the defence of such matter.
                  <br />
        18.3. The indemnity set out here is in addition to, and not in lieu of, any other remedies that may be available to us under applicable law.
                  <br />
      </div>
      <strong>
        19. OUR LIABILITY FOR LOSS SUFFERED BY YOU IS LIMITED
                </strong>
      <div className="subText">
        19.1.
                  <strong>
          Whether you are a consumer or a business user:
                  </strong>
        We do not exclude or limit our liability to you where it would be unlawful to do so. This includes liability for death or personal injury caused by our negligence or fraud.
                  <br />
        <strong>
          <span className="red">
            19.2. IF YOU ARE A BUSINESS USER: YOU USE THIS PLATFORM AT YOUR OWN RISK AND YOU ASSUME FULL RESPONSIBILITY FOR SUCH USE. WE EXCLUDE ALL IMPLIED CONDITIONS, WARRANTIES, REPRESENTATIONS OR OTHER TERMS THAT MAY APPLY TO OUR PLATFORM OR ANY OTHER CONTENT ON OUR INTERFACE. WE WILL NOT BE LIABLE TO YOU FOR ANY LOSS OR DAMAGE, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), BREACH OF STATUTORY DUTY, OR OTHERWISE, EVEN IF FORESEEABLE, ARISING UNDER OR IN CONNECTION WITH THE USE OF, OR INABILITY TO USE, OUR PLATFORM; OR THE USE OF OR RELIANCE ON ANY CONTENT DISPLAYED ON OUR INTERFACE. WE WILL NOT BE LIABLE FOR LOSS OF PROFITS, SALES, BUSINESS, OR REVENUE, BUSINESS INTERRUPTION, ANTICIPATED SAVINGS, BUSINESS OPPORTUNITY, GOODWILL OR REPUTATION OR ANY INDIRECT OR CONSEQUENTIAL LOSS OR DAMAGE.
                    </span>
          <br />
          <span className="green">
            19.3. IF YOU ARE A CONSUMER USER: YOU USE THIS PLATFORM AT YOUR OWN RISK AND YOU ASSUME FULL RESPONSIBILITY FOR SUCH USE. PLEASE NOTE THAT WE ONLY PROVIDE OUR PLATFORM FOR DOMESTIC AND PRIVATE USE. YOU AGREE NOT TO USE OUR PLATFORM FOR ANY COMMERCIAL OR BUSINESS PURPOSES, AND WE HAVE NO LIABILITY TO YOU FOR ANY LOSS OF PROFIT, LOSS OF BUSINESS, BUSINESS INTERRUPTION, OR LOSS OF BUSINESS OPPORTUNITY. ONLY IF OUR PLATFORM DAMAGES A DEVICE OR DIGITAL CONTENT BELONGING TO YOU AND THIS IS CAUSED BY OUR FAILURE TO USE REASONABLE CARE AND SKILL, WE WILL PAY YOU COMPENSATION.
                      <span style={{ textDecoration: 'underline' }}>
              SUCH COMPENSATION SHALL BE LIMITED TO THE AMOUNT OF FEES PAID BY YOU TO US FOR USING OUR PLATFORM. AT THIS POINT IN TIME, OUR SERVICE IS FREE OF CHARGE AND ACCORDINGLY NO COMPENSATION WILL BE PAYABLE TO YOU
                      </span>
            . MOREOVER, WE WILL NOT BE LIABLE FOR DAMAGE THAT YOU COULD HAVE AVOIDED BY FOLLOWING OUR ADVICE OR FOR DAMAGE THAT WAS CAUSED BY YOU FAILING TO CORRECTLY FOLLOW OUR INSTRUCTIONS OR TO HAVE IN PLACE THE MINIMUM SYSTEM REQUIREMENTS ADVISED BY US.
                    </span>
        </strong>
        <br />
      </div>
      <strong>
        20. HOW WE MAY USE YOUR PERSONAL INFORMATION
                </strong>
      <div className="subText">
        20.1. We will only use your personal information as set out in our Privacy Policy.
                  <br />
      </div>
      <strong>
        21. HOW TO RESOLVE COMPLAINTS AND DISPUTES
                </strong>
      <br />
      <div className="subText">
        21.1. If an alleged breach, controversy, claim, dispute or difference arises out of or in connection with the present Terms between you and us (a “
                    <strong>
          Dispute
                    </strong>
        ”), you agree to seek to resolve the matter with us amicably by referring the matter first to:
                    <br />

        <div className="subText">
          21.1.1. any member of your executive management in case of legal persons, or you personally if you are acting as a natural person;
                      <br />
          21.1.2. in the case of us, our Support team.
                      <br />
        </div>

        21.2. If you wish to report a Dispute, you must email our Support Team at support@slow.trade. The following information will need to be included:
                    <br />
        <div className="subText">
          21.2.1. your name and surname;
                      <br />
          21.2.2. your e-mail address (or other recognition details);
                      <br />
          21.2.3. detailed enquiry description;
                      <br />
          21.2.4. the date and time that the issue arose.
                      <br />
        </div>

        21.3. If you receive a response from the Support Team but deem it unsatisfactory, or if you have not received an e-mail within two weeks, you may contact the Legal Team at legal@slow.trade. Both teams shall:
                    <br />
        <div className="subText">
          21.3.1. send an initial e-mail confirming the receipt of your complaint;
                      <br />
          21.3.2. send an official response to you within 14 business days respectively;
                      <br />
          21.3.3. try to resolve the matter as soon as reasonably possible;
                      <br />
          21.3.4. inform you of the outcome.
                      <br />
        </div>
        21.4. Your right to take legal action remains unaffected by the existence or use of this complaints procedure.
                  <br />
      </div>
      <strong>
        22. GOVERNING LAW AND DISPUTE RESOLUTION
                </strong>
      <div className="subText">
        22.1.
                  <strong>
          Whether you are a consumer or a business user:
                  </strong>
        These Terms shall be exclusively governed by the laws of Estonia.
                  <br />
        <span className="red">
          22.2.
                    <strong>
            If you are a business:
                    </strong>
          In the event a Dispute is not resolved amicably in accordance with section 22, it shall be finally settled under the Rules of Arbitration of the International Chamber of Commerce by three arbitrators appointed in accordance with the said Rules. The seat of Arbitration shall be Tallinn, Estonia. The governing law of this clause 21.2 shall be Estonian law. The language of the arbitration shall be English.
                  </span>
        <br />
        <span className="green">
          22.3.
                    <strong>
            If you are a consumer:
                    </strong>
          In the event a Dispute is not resolved in accordance with section 22, the Estonian Courts shall have exclusive jurisdiction to settle it.
                  </span>
        <br />
      </div>
      <strong>
        23. NO THIRD PARTY BENEFICIARIES
                </strong>
      <div className="subText">
        23.1. Unless it expressly states otherwise, these Terms do not give rise to any third party rights, which may be enforced against us.
                  <br />
      </div>
      <strong>
        24. THE TERMS ARE OUR ENTIRE AGREEMENT WITH YOU AND WE MAY ASSIGN THE TERMS
                </strong>
      <div className="subText">
        24.1. We may assign these Terms to any of our affiliates or in connection with a merger or other disposition of all or substantially all of our assets.
                  <br />
        24.2. These Terms constitute the entire and exclusive agreement between us and you regarding its subject matter, and supersede and replace any previous or contemporaneous written or oral contract, promises, assurances, assurances, warranty, representation or understanding regarding its subject matter, whether written or oral. You shall have no claim for innocent or negligent misrepresentation or misstatement based on any statement in these Terms, though nothing in this clause shall limit or exclude any liability for fraud.
                  <br />
      </div>
      <strong>
        25. WE WAIVE NO RIGHTS AND DO NOT ALLOW ASSIGNMENT
                </strong>
      <div className="subText">
        25.1. You may not assign, transfer or delegate any of your rights or duties arising out of or in connection with these Terms to a third party. Any such assignment or transfer shall be void and shall not impose any obligation or liability on us to the assignee or transferee.
                  <br />
        25.2. Any delay or omission by us in relation to the exercise of any right granted by law or under these Terms shall not as a result exclude or prevent the later exercise of such a right.
                  <br />
      </div>
      <strong>
        26. PROVISIONS ARE SEVERABLE, IF FOUND INVALID
                </strong>
      <div className="subText">
        26.1. If any provision or part-provision of these Terms is or becomes invalid, illegal or unenforceable, it shall be deemed modified to the minimum extent necessary to make it valid, legal and enforceable. If such modification is not possible, the relevant provision or part-provision shall be deemed deleted. Any modification to or deletion of a provision or part-provision under this clause shall not affect the validity and enforceability of the rest of these Terms.
                </div>
    </div>
    <p>
      <strong>
        APPENDIX
                </strong>
    </p>
    <p>
      <strong>
        RISKS
                </strong>
    </p>
    <p>
      PRICE FLUCTUATIONS
                <br />
      ERC20 tokens are neither legal tender backed by governments nor by assets. The tokens’ value is highly volatile causing price fluctuations, as auctions typically run for some time and trades are not executed instantly.
              </p>
    <p>
      REGULATORY ACTION
                <br />
      We could be impacted by regulatory inquiries or action, which could impede or limit your ability to access or use the Platform.
              </p>
    <p>
      LOW LIQUIDITY
                <br />
      Although trading bots provide minimum liquidity for the Supported Tokens, there is no assurance of an active or liquid trading market for the Supported Tokens. The Supported Tokens are not currency issued by any central bank or national, supra-national or quasi-national organisation, nor are they - unless stated otherwise - backed by any hard assets or other credit. There is therefore no guarantee as to market price or liquidity of the Supported Tokens. Accordingly, we cannot ensure that there will be a market for Supported Tokens, or that our Clearing Prices represent the market price.
                <br />
      <br />
      TECHNICAL UNDERSTANDING
                <br />
      Cryptographic assets are described in technical language requiring a comprehensive understanding of computer science and mathematics to appreciate the inherent risks. The availability of Supported Tokens on our Platform do not indicate our approval or disapproval of the underlying technology regarding any Supported Token, and must not replace your own understanding of the risks specific to each Supported Token.
              </p>
    <p>
      TRANSACTIONS ON ETHEREUM BLOCKCHAIN ARE IMMUTABLE AND IRREVERSIBLE
                <br />
      Transactions on Ethereum Blockchain are generally immutable and irreversible. Any transaction thereon is therefore irrevocable and final as soon as it is settled thereon. In the event that you send your tokens to sell to any other destination other than the Protocol smart contracts, such tokens may not be returned. We assume no responsibility and shall have no obligation to you if this occurs, including but not limited to any responsibility to recover, or assist to recover, any such tokens.
              </p>
    <p>
      THIRD PARTY DATA CENTRE FAILURES
                <br />
      Our Platform may in part be established on servers at data centre facilities of third party providers. We may be required to transfer our Platform to different facilities, and may incur service interruption in connection with such relocation. Data centre facilities are vulnerable to force majeure events or other failures. Third party providers may suffer breaches of security and others may obtain unauthorised access to our server data. As techniques used to obtain unauthorised access change frequently and generally are not recognised until used against a target, it may not be possible to anticipate these techniques or to implement adequate preventive measures.
              </p>
    </>
    :
    <span>
      <h4>Disclaimer:</h4>
      <ul className="scrollableDisclaimerList">
        <li>The DutchX is a decentralized trading protocol for ERC20 tokens, governed by smart contracts that allow peer-to-peer trades between sellers and bidders without intermediary.</li>
        <li>You are solely responsible to safekeep your wallet and private information.</li>
        <li>Please bookmark {`https://${URLS.APP_URL_RINKEBY}`} as web address imitation by hackers is a risk!</li>
        <li>ERC20 tokens are neither legal tender backed by governments nor by assets. The tokens’ value is highly volatile causing price fluctuations, as auctions typically run for some time and trades are not executed instantly.</li>
        <li>Your jurisdiction allows you to trade on the DutchX.</li>
        <li>Blockchain transactions are irreversible. The wallet address and your transaction is displayed permanently and publicly. You agree to relinquish any right of rectification or erasure of personal data, which is not possible on the blockchain.</li>
        <li>You are not using the DutchX to trade tokens that are proceeds of criminal or fraudulent activity.</li>
        <li>The DutchX and the underlying Ethereum blockchain are in an early development stage. We do not guarantee an error-free process and give no price or liquidity guarantee.</li>
        <li>You recognize and agree to using the DutchX at your own risk.</li>
        <li>In no event shall any initiator, programmer, auditor, auctioneer, participant, or other person (all, the “Initiators”) involved in the creation or other interaction with the DutchX be liable for any loss or damage arising out of or in connection with the DutchX. </li>
        <li>You will indemnify the Initiators against any claims, actions, and costs that arise out of or in connection with you breaching this Disclaimer.</li>
        <li>You are prohibited from interacting with the DutchX, where your jurisdiction disallows our exclusions of liability or applies mandatory laws overriding this Disclaimer.</li>
        <li>This DutchX Version runs on the Rinkeby Test Network: Real funds are not at risk</li>
      </ul>
    </span>
  }
  </div>
)

export const Terms = ({ network }: { network: string }) =>
  <div className="contentPage" tabIndex={1}>
    <article>
      <TermsText network={network} />
    </article>
  </div>

const mapState = ({ blockchain: { network } }: Partial<State>) => ({
  network,
})

export default connect(mapState)(Terms)
