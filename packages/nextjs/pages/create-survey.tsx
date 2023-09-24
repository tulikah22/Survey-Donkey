import { useState } from "react";
import { abi } from "./../contractDetails/abi";
import { json } from "@helia/json";
import { createHelia } from "helia";
import type { NextPage } from "next";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
// import { useEthersSigner } from "./../ethers";
import { MetaHeader } from "~~/components/MetaHeader";
import { EtherInput } from "~~/components/scaffold-eth";

const ExampleUI: NextPage = () => {
  const [rewards, setRewards] = useState("");
  // const [jsonQuestion, setJsonQuestion] = useState("");
  const [jsonQuestions, setJsonQuestions] = useState([""]);
  const [ImmutableAddressString, SetImmutableAddressString] = useState(``);
  const { config } = usePrepareContractWrite({
    address: "0x1B9C7392a5253c9dB15107e35AF6598020c14D0f",
    abi: abi,
    functionName: "createSurvey",
    args: [ImmutableAddressString, rewards],
  });
  const { write } = useContractWrite(config);
  const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Validate that none of the questions are empty
    if (jsonQuestions.some(question => question.trim() === "")) {
      alert("Please make sure all question fields are filled out.");
      return;
    }
    const helia = await createHelia();
    const j = json(helia);
    console.log(rewards, jsonQuestions);

    // const blob = new Blob([JSON.stringify({ rewards, jsonQuestion: jsonQuestions })], { type: 'application/json' })
    // const client = new Web3Storage({ token: token })
    // const cid = await client.put(blob);
    const myImmutableAddress = await j.add({ rewards, jsonQuestion: jsonQuestions });
    await delay(5000);
    console.log(myImmutableAddress.toString());
    console.log(await j.get(myImmutableAddress));
    SetImmutableAddressString(myImmutableAddress.toString());
    await delay(5000);

    //@ts-ignore
    // write?.({
    //   args: [myImmutableAddress.toString(), rewards],
    // });
  };
  const handleQuestionChange = (value: string, index: number) => {
    const newQuestions = [...jsonQuestions];
    newQuestions[index] = value;
    setJsonQuestions(newQuestions);
  };
  const handleRemoveQuestion = (indexToRemove: number) => {
    const newQuestions = jsonQuestions.filter((_, index) => index !== indexToRemove);
    setJsonQuestions(newQuestions);
  };
  return (
    <>
      <MetaHeader
        title="Example UI | Scaffold-ETH 2"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-1/3 mx-auto mt-10">
        <div className="mb-4">
          {/* {isSuccess && (
            <div>
              Successfully minted your NFT!
              <div>
                <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
              </div>
            </div>
          )} */}
          <label htmlFor="rewards" className="block text-sm font-medium text-gray-600 mb-2">
            Rewards:
          </label>
          {/* //You can enter ether quantity or USD quantity, but value will be always stored in ETH. */}
          <EtherInput value={rewards} onChange={amount => setRewards(amount)} />
        </div>

        {jsonQuestions.map((question, index) => (
          <div key={index} className="mb-4 relative">
            <label htmlFor={`jsonQuestion-${index}`} className="block text-sm font-medium text-gray-600 mb-2">
              JSON Question {index + 1}:
            </label>
            <textarea
              id={`jsonQuestion-${index}`}
              value={question}
              onChange={e => handleQuestionChange(e.target.value, index)}
              className="p-2 border rounded-md w-full"
            />
            {jsonQuestions.length > 1 && ( // Only show remove if more than one question exists
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                onClick={() => handleRemoveQuestion(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded mb-4 block w-full"
          onClick={() => setJsonQuestions([...jsonQuestions, ""])}
        >
          Add Question
        </button>

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded block w-full">
          Create Survey Data
        </button>
        <br />
        {ImmutableAddressString !== "" && (
          <button onClick={write} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded block w-full">
            Deploy to Blockchain
          </button>
        )}
      </form>
    </>
  );
};

export default ExampleUI;
