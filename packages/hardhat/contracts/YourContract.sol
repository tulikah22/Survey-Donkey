pragma solidity ^0.8.0;

contract Survey {
	// Define a structure for a question
	struct Question {
		uint id;
		string text;
	}

	// Define a structure for a response
	struct Response {
		string ipfsHash;
	}

	// Store questions
	Question[] public questions;

	// Map a user's wallet address to their response
	mapping(address => Response) public responses;

	// Add questions to the contract
	constructor() {
		questions.push(Question(1, "What is your twitter handle"));
		questions.push(Question(2, "What type of music do you like"));
		questions.push(
			Question(
				3,
				"On a scale of 1 to 5, how much do like this type of music"
			)
		);
	}

	// Store a user's response
	function storeResponse(string memory ipfsHash) public {
		responses[msg.sender] = Response(ipfsHash);
	}

	// Get a user's response
	function getResponse(address user) public view returns (string memory) {
		return responses[user].ipfsHash;
	}
}
