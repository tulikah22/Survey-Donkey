/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect } from "react";
import { MessageContext } from "../Context";
import Chat from "../components/Chat";
import { MetaHeader } from "~~/components/MetaHeader";

const PEER_ADDRESS = "0x7E0b0363404751346930AF92C80D1fef932Cc48a";
const MALIK_ADDRESS = "0x7E0b0363404751346930AF92C80D1fef932Cc48a";
const GM_BOT = "0x937C0d4a6294cdfa575de17382c7076b579DC176";


const Broadcast = () => {
  const [messages, setMessages] = useContext(MessageContext);

  const handleSubmit = () => {
    console.log("LOG!");
  };

  return (
    <>
      <MetaHeader
        title="Broadcast Survey"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      {console.log(messages, "MESSAGES")}
      <Chat messageHistory={messages.messages} client={messages.clientRef} conversation={messages.convRef}></Chat>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-1/3 mx-auto mt-10">
        <h1>Notification Messages</h1>
        
        {/* {questionsData.questions.map((question, index) => (
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
        ))} */}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Submit
        </button>
      </form>
    </>
  );
};

export default Broadcast;
