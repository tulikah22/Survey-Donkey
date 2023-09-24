pragma solidity ^0.8.0;

contract SurveyDapp {
	struct Survey {
		address owner;
		string ipfsHash;
		uint surveyReward;
	}

	struct Response {
		address user;
		string surveyIpfsHash;
		string responseIpfsHash;
	}

	mapping(string => Survey) public surveys;

	mapping(string => Response[]) public surveyResponses;

	mapping(address => string[]) public ownerSurveys;

	mapping(address => uint) public rewards;

	function createSurvey(string memory ipfsHash, uint rewardAmount) public {
		require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
		require(rewardAmount > 0, "Reward must be greater than zero");

		surveys[ipfsHash] = Survey(msg.sender, ipfsHash, rewardAmount);
		ownerSurveys[msg.sender].push(ipfsHash);
	}

	function submitResponse(
		string memory surveyIpfsHash,
		string memory responseIpfsHash
	) public {
		require(
			bytes(surveyIpfsHash).length > 0,
			"Survey IPFS hash cannot be empty"
		);
		require(
			bytes(responseIpfsHash).length > 0,
			"Response IPFS hash cannot be empty"
		);
		require(surveys[surveyIpfsHash].owner != address(0), "Invalid survey");

		surveyResponses[surveyIpfsHash].push(
			Response(msg.sender, surveyIpfsHash, responseIpfsHash)
		);
	}

	function claimReward(string memory surveyIpfsHash) public {
		require(
			hasCompletedSurvey(msg.sender, surveyIpfsHash),
			"Survey not completed"
		);

		uint reward = getRewardForSurvey(surveyIpfsHash);
		rewards[msg.sender] += reward;
	}

	function hasCompletedSurvey(
		address responder,
		string memory surveyIpfsHash
	) private view returns (bool) {
		for (uint i = 0; i < surveyResponses[surveyIpfsHash].length; i++) {
			if (surveyResponses[surveyIpfsHash][i].user == responder) {
				return true;
			}
		}
	}

	function getRewardForSurvey(
		string memory surveyIpfsHash
	) private view returns (uint) {
		return surveys[surveyIpfsHash].surveyReward;
	}
}
