import { useState } from "react";
import { abi } from "./../contractDetails/abi";
import { json } from "@helia/json";
import { createHelia } from "helia";
// import { useEthersSigner } from "./../ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { usePrepareContractWrite } from "wagmi";
import { useContractRead } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { EtherInput } from "~~/components/scaffold-eth";

const questionsData = {
  questions: ["What is your name?", "What is your quest?", "What is your favorite color?"],
};

// console.log(myImmutableAddress.toString(base64));
// console.log(await j.get(parsea));
// const ImmutableAddressString = myImmutableAddress.toString();
// const parsea = CID.parse(ImmutableAddressString);

const SubmitSurvey: NextPage = () => {
  const [answers, setAnswers] = useState(new Array(questionsData.questions.length).fill(""));
  const { data, isError, isLoading } = useContractRead({
    address: "0x1B9C7392a5253c9dB15107e35AF6598020c14D0f",
    abi: abi,
    functionName: "ownerSurveys",
  });

  const handleInputChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const result = {
      questions: questionsData.questions,
      answers: answers,
    };
    console.log(result); // or send this result to some server endpoint
  };

  return (
    <>
      <MetaHeader
        title="Submit Survey "
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      {/* @ts-ignore */}
      <p>{console.log(data)}</p>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-1/3 mx-auto mt-10">
        {questionsData.questions.map((question, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <label htmlFor={`answer-${index}`} className="text-lg font-medium">
              {question}
            </label>
            <input
              type="text"
              id={`answer-${index}`}
              value={answers[index]}
              onChange={event => handleInputChange(index, event)}
              className="p-2 border rounded-md"
            />
          </div>
        ))}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Submit
        </button>
      </form>
    </>
  );
};

export default SubmitSurvey;
