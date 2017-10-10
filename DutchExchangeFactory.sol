pragma solidity ^0.4.17;
import "@gnosis/gnosis-contracts/contracts/Tokens/Token.sol";

/// @title Dutch Exchange Factory - propose new dutch exchanges
/// @author Dominik Teiml - dominik.teiml@gnosis.pm
contract DutchExchangeFactory {
	// This contract manages proposals for new exchanges

	// Types
	enum ProposalState {
		// Initial state, nobody has claimed anything
		TOKENS_UNCLAIMED,
		// Sell tokens have been claimed
		SELL_TOKENS_CLAIMED,
		// Collateral tokens have been claimed
		COLLATERAL_TOKENS_CLAIMED
	}

	// Proposed price will be a rational number, so we need a concept of a fraction
    struct fraction {
        uint256 numerator;
        uint256 denominator;
    }

	struct TokenPair {
		Token sellToken;
		Token buyToken;
	}

	struct voteCountForAndAgainst {
		uint256 votesFor;
		uint256 votesAgainst;
	}

	// Index of most recent proposal
	uint256 public proposalIndex;

	// Proposed tokens by proposalIndex
	mapping (uint256 => TokenPair) public proposalTokens;

	// Amounts submitted together with proposal
	mapping (uint256 => uint256) public amountsSubmitted;

	// Proposed values of submitted amounts
	mapping (uint256 => uint256) public proposedValues;

	// Each proposal is valid only 24 hrs, so we need to store proposal start times:
	mapping (uint256 => uint256) public proposalStartTimes;

	// We have to store whether a proposal has been resolved or not
	mapping (uint256 => bool) public proposalResolved;

	// We need to store proposers' addresses for reclaiming tokens
	mapping (uint256 => address) public proposers;

	// DUTCHX tokens are used to vote on proposed token pair
	Token public DUTCHX;

	// We need to count votes for and against
	mapping (uint256 => voteCountForAndAgainst) voteCounts;

	// Here we store created exchanges
	mapping (uint256 => address) public exchangesCreated;

	// Events
	event newProposal(
		uint256 indexed proposalIndex,
		Token indexed sellToken,
		Token indexed buyToken,
		uint256 amount,
		uint256 proposedValue);

	event newVoteFor(uint256 indexed proposalIndex, uint256 weight);
	event newVoteAgainst(uint256 indexed proposalIndex, uint256 weight);
	event sellTokensClaimed(uint256 indexed proposalIndex);
	event collateralTokensClaimed(uint256 indexed proposalIndex);
	event proposalHasBeenResolved(uint256 indexed proposalIndex, string outcome);

	// Constructor
	function DutchExchangeFactory(Token _DUTCHX) {
		DUTCHX = _DUTCHX;
	}

	// Checks whether submitted proposal index is valid time-wise
	modifier proposalIsRunning(_proposalIndex) {
		require(proposalStartTimes[_proposalIndex] < now);
		require(proposalStartTimes[_proposalIndex] + 1 * 1 days > now);

		_;
	}

	// Propose a new exchange
	function proposeExchange(
		Token sellToken,
		Token buyToken,
		uint256 amount,
		uint256 proposedValue) 
	public returns (bool success)
	{
		proposalIndex++;

		// Perform transfer of tokens
		require(sellToken.transferFrom(msg.sender, this, amount));

		// Perform transfer of collateral
		uint256 collateral = proposedValue / 2;
		require(buyToken.transferFrom(msg.sender, this, collateral));

		// Update state variables
		proposers[proposalIndex] = msg.sender;
		amountsSubmitted[proposalIndex] = amount;
		proposedValues[proposalIndex] = proposedValue;
		proposalStartTimes[proposalIndex] = now;
		proposalStates[proposalIndex] = ProposalState.TOKENS_UNCLAIMED;

		newProposal(proposalIndex, sellToken, buyToken, amount, proposedValues);
	}

	// Vote for a particular proposal
	function voteFor(uint256 _proposalIndex, uint256 weight) public proposalIsRunning(_proposalIndex) returns (bool success) {
		// Transfer DUTCHX tokens
		require(DUTCHX.transferFrom(msg.sender, this, weight));

		// Update state variable
		voteCounts[_proposalIndex].votesAgainst += weight;

		newVoteFor(_proposalIndex, weight);
		success = true;
	}

	// Vote against a particular proposal
	function voteAgainst(uint256 _proposalIndex, uint256 weight) public proposalIsRunning(_proposalIndex) returns (bool success) {
		// Transfer DUTCHX tokens
		require(DUTCHX.transferFrom(msg.sender, this, weight));

		// Update state variable
		voteCounts[_proposalIndex].votesFor += weight;

		newVoteAgainst(_proposalIndex, weight);
		success = true;
	}

	function claimSellTokens(uint256 _proposalIndex) public proposalIsRunning(_proposalIndex) returns (bool success) {
		// Get token pair for particular proposal
		(sellToken, buyToken) = proposalTokens[_proposalIndex];

		// The cost for claiming the submitted amount is twice the proposed value
		uint256 claimCost = proposedValues[_proposalIndex] * 2;
		require(buyToken.transferFrom(msg.sender, this, claimCost);

		// Perform transfer
		require(sellToken.transfer(msg.sender, amountsSubmitted[_proposalIndex]);

		// Update proposal state
		proposalStates[_proposalIndex] = ProposalState.SELL_TOKENS_CLAIMED;

		sellTokensClaimed(_proposalIndex);
		success = true;
	}

	function claimCollateralTokens(uint256 _proposalIndex) public proposalIsRunning(_proposalIndex) returns (bool success) {
		// Get token pair for particular proposal
		Token sellToken = proposalTokens[_proposalIndex].sellToken;
		Token buyToken = proposalTokens[_proposalIndex].buyToken;

		// The cost of claiming the collateral is twice the amount submitted
		uint256 claimCost = proposedValues[_proposalIndex] * 2;
		require(sellToken.transferFrom(msg.sender, this, amountsSubmitted[_proposalIndex]);

		// Perform transfer of collateral, which is half of the proposed value
		uint256 claimedAmount = proposedValues[_proposalIndex] / 2;
		require(buyToken.transfer(msg.sender, claimedAmount);

		// Update proposal state
		proposalStates[_proposalIndex] = ProposalState.COLLATERAL_TOKENS_CLAIMED;

		collateralTokensClaimed(_proposalIndex);
		success = true;
	}

	// After 24 hrs, we can resolve the proposal
	function resolveProposal(uint256 _proposalIndex) public returns (bool auctionCreated) {
		// Check if proposal has been initialised & is not running
		require(proposalStartTimes[_proposalIndex] > 0);
		require(proposalStartTimes[_proposalIndex] + 1 * 1 days < now);

		// Check nobody has claimed sell tokens or collateral
		// And votes for overweigh votes against
		if (proposalStates[_proposalIndex] == ProposalState.TOKENS_UNCLAIMED
			&& voteCounts[_proposalIndex].votesFor > voteCounts[_proposalIndex].votesAgainst) {

			// Calculate proposed price
			fraction memory proposedPrice;
			proposedPrice.numerator = amountsSubmitted[_proposalIndex];
			proposedPrice.denominator = proposedValues[_proposalIndex];

			// Get proposed tokens
			Token sellToken = proposalTokens[_proposalIndex].sellToken;
			Token buyToken = proposalTokens[_proposalIndex].buyToken;

			// Create exchange
			address newExchange = new DutchExchange(
				proposedPrice,
				sellToken,
				buyToken,
				DUTCHX);

			// Update state variables
			exchangesCreated[_proposalIndex] = newExchange;

			proposalHasBeenResolved(_proposalIndex, 'Proposal accepted');
			auctionCreated = true;
		} else {
			// Update state variable

			proposalHasBeenResolved(_proposalIndex, 'Proposal rejected');
			auctionCreated = false;
		}

		proposalResolved[_proposalIndex] = true;
	}

	// Allows submitter proposal to reclaim their tokens
	function reclaimTokens(uint256 _proposalIndex)
		public 
		returns (uint256 sellTokensReturned, uint256 collateralTokensReturned) 
	{
		// Only account that can reclaim tokens is original proposer
		require(msg.sender == proposers[_proposalIndex]);

		// Require proposal to have been resolved
		require(proposalResolved[_proposalIndex]);

		// Decide which tokens to transfer
		bool transferSellTokens = false;
		bool transferCollateralTokens = false;

		if (proposalStates[_proposalIndex] == ProposalState.SELL_TOKENS_CLAIMED) {
			transferCollateralTokens = true;
		}

		if (proposalStates[_proposalIndex] == ProposalState.COLLATERAL_TOKENS_CLAIMED) {
			transferSellTokens = true;
		}

		if (proposalStates[_proposalIndex] == ProposalState.TOKENS_UNCLAIMED) {
			transferSellTokens = true;
			transferCollateralTokens = true;
		}

		// Transfer sell tokens
		if (transferSellTokens) {
			sellTokensReturned = amountsSubmitted[_proposalIndex];
			proposalTokens[_proposalIndex].sellToken.transfer(msg.sender, sellTokensReturned);
		}

		// Transfer collateral tokens
		if (transferCollateralTokens) {
			// Collateral is half of proposed value
			collateralTokensReturned = proposedValues[_proposalIndex] / 2;
			proposalTokens[_proposalIndex].buyToken.transfer(msg.sender, collateralTokensReturned);
		}
	}
}