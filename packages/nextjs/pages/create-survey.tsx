import { useState } from "react";
import { abi } from "./../contractDetails/abi";
import { json } from "@helia/json";
import { createHelia } from "helia";
// import { useEthersSigner } from "./../ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { usePrepareContractWrite } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { EtherInput } from "~~/components/scaffold-eth";

const ExampleUI: NextPage = () => {
  const [rewards, setRewards] = useState("");
  const [jsonQuestion, setJsonQuestion] = useState("");
  const { address } = useAccount();

  //   const { config } = usePrepareContractWrite({
  //     address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
  //     abi: abi,
  //     functionName: "mint",
  //     args: [parseInt(tokenId)],
  //     enabled: Boolean(tokenId),
  //   });

  //   const handleDeploy = async () => {
  //     const Factory = new ethers.ContractFactory(abi, bytecodes, address);
  //     const contract = await Factory.deploy(param1, param2);

  //     console.log(contract.address);
  //   };

  const handleSubmit = async e => {
    e.preventDefault();
    const helia = await createHelia();
    const j = json(helia);
    console.log(rewards, jsonQuestion);

    const myImmutableAddress = await j.add({ rewards, jsonQuestion: jsonQuestion });
    console.log(myImmutableAddress);
    console.log(await j.get(myImmutableAddress));

    // Here, we'll call the API with the rewards and jsonQuestion data
    // const response = await fetch("/api/submitData", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     rewards,
    //     jsonQuestion,
    //   }),
    // });

    // const data = await response.json();
    // console.log(data);
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
          <label htmlFor="rewards" className="block text-sm font-medium text-gray-600 mb-2">
            Rewards:
          </label>
          {/* //You can enter ether quantity or USD quantity, but value will be always stored in ETH. */}
          <EtherInput value={rewards} onChange={amount => setRewards(amount)} />
        </div>

        <div className="mb-4">
          <label htmlFor="jsonQuestion" className="block text-sm font-medium text-gray-600 mb-2">
            JSON Question:
          </label>
          <textarea
            id="jsonQuestion"
            value={jsonQuestion}
            onChange={e => setJsonQuestion(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
          Create Survey
        </button>
      </form>
    </>
  );
};

export default ExampleUI;
