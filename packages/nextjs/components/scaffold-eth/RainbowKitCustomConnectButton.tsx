/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import { MessageContext } from "../../Context";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signMessage } from "@wagmi/core";
import { Client } from "@xmtp/xmtp-js";
import { QRCodeSVG } from "qrcode.react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDisconnect, useSwitchNetwork, useWalletClient } from "wagmi";
import {
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { Address, Balance, BlockieAvatar } from "~~/components/scaffold-eth";
import { useAutoConnect, useNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

// import { useWalletClient } from 'wagmi'

const PEER_ADDRESS = "0x7E0b0363404751346930AF92C80D1fef932Cc48a";
// const Add1 = "0x2078313796dF19f63AB42abE424edd3466298Ef3";
// const Add2 = "0xF7F1eeCEea32902958bD4924c576548412E537F3";
// const Add3 = "0x2F1c379ce19218D07dcd1DE08A5b3576a1F21B4A";
// const broadcasts_array = [Add1, Add2, "0x937C0d4a6294cdfa575de17382c7076b579DC176"];
let globalXmtp: Client<string | undefined>;

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  useAutoConnect();
  const networkColor = useNetworkColor();
  const configuredNetwork = getTargetNetwork();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const [addressCopied, setAddressCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const convRef = useRef(null);
  const clientRef = useRef(null);
  const { data: walletClient } = useWalletClient();
  const [messages, setMessages] = useContext(MessageContext);

  //Function to load the existing messages in a conversation
  const newConversation = async function (xmtp_client: any) {
    //Creates a new conversation with the address
    if (await xmtp_client?.canMessage(PEER_ADDRESS)) {
      const conversation = await xmtp_client.conversations.newConversation();
      convRef.current = conversation;
      const messages = await conversation.messages();
      setMessages(messages);
    } else {
      console.log("cant message because is not on the network.");
      //cant message because is not on the network.
    }
  };

  //Function to initialize the XMTP client
  const initXmtp = async function () {
    // Create the XMTP client
    if (!walletClient) {
      console.warn("No account");
      return;
    }
    const { account } = walletClient;
    const signer = {
      getAddress: async () => account.address,
      signMessage: async (message: string) => {
        const signature = await signMessage({ message });
        return signature;
      },
    };
    const xmtp = await Client.create(signer, { env: "production" });
    globalXmtp = xmtp;
    setIsConnected(true);
    //Create or load conversation with Gm bot
    newConversation(xmtp);
    // Set the XMTP client in state for later use
    setIsOnNetwork(!!xmtp.address);
    //Set the client in the ref
    //@ts-ignore
    clientRef.current = xmtp;
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== configuredNetwork.id) {
                return (
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-error btn-sm dropdown-toggle gap-1">
                      <span>Wrong network</span>
                      <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
                    >
                      <li>
                        <button
                          className="btn-sm !rounded-xl flex py-3 gap-3"
                          type="button"
                          onClick={() => switchNetwork?.(configuredNetwork.id)}
                        >
                          <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
                          <span className="whitespace-nowrap">
                            Switch to <span style={{ color: networkColor }}>{configuredNetwork.name}</span>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="menu-item text-error btn-sm !rounded-xl flex gap-3 py-3"
                          type="button"
                          onClick={() => disconnect()}
                        >
                          <ArrowLeftOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Disconnect</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                );
              }

              // if (!chain.unsupported && connected && !isOnNetwork) {
              //   return (
              //     <div>
              //       <button onClick={() => initXmtp()}>Connect to XMTP</button>
              //     </div>
              //   );
              // }

              return (
                <div className="px-2 flex justify-end items-center">
                  <div className="flex flex-col items-center mr-1">
                    <Balance address={account.address} className="min-h-0 h-auto" />
                    <span className="text-xs" style={{ color: networkColor }}>
                      {chain.name}
                    </span>
                  </div>
                  <div className="dropdown dropdown-end leading-3">
                    <label
                      tabIndex={0}
                      className="btn btn-secondary btn-sm pl-0 pr-2 shadow-md dropdown-toggle gap-0 !h-auto"
                    >
                      <BlockieAvatar address={account.address} size={30} ensImage={account.ensAvatar} />
                      <span className="ml-2 mr-1">{account.displayName}</span>
                      <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu z-[2] p-2 mt-2 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
                    >
                      <li>
                        {addressCopied ? (
                          <div className="btn-sm !rounded-xl flex gap-3 py-3">
                            <CheckCircleIcon
                              className="text-xl font-normal h-6 w-4 cursor-pointer ml-2 sm:ml-0"
                              aria-hidden="true"
                            />
                            <span className=" whitespace-nowrap">Copy address</span>
                          </div>
                        ) : (
                          <CopyToClipboard
                            text={account.address}
                            onCopy={() => {
                              setAddressCopied(true);
                              setTimeout(() => {
                                setAddressCopied(false);
                              }, 800);
                            }}
                          >
                            <div className="btn-sm !rounded-xl flex gap-3 py-3">
                              <DocumentDuplicateIcon
                                className="text-xl font-normal h-6 w-4 cursor-pointer ml-2 sm:ml-0"
                                aria-hidden="true"
                              />
                              <span className=" whitespace-nowrap">Copy address</span>
                            </div>
                          </CopyToClipboard>
                        )}
                      </li>
                      <li>
                        <label htmlFor="qrcode-modal" className="btn-sm !rounded-xl flex gap-3 py-3">
                          <QrCodeIcon className="h-6 w-4 ml-2 sm:ml-0" />
                          <span className="whitespace-nowrap">View QR Code</span>
                        </label>
                      </li>
                      <li>
                        <button
                          className="menu-item btn-sm !rounded-xl flex gap-3 py-3"
                          type="button"
                          onClick={() => initXmtp()}
                        >
                          <ArrowTopRightOnSquareIcon className="h-6 w-4 ml-2 sm:ml-0" />
                          <a target="_blank" rel="noopener noreferrer" className="whitespace-nowrap">
                            Connect to XMTP
                          </a>
                        </button>
                      </li>
                      <li>
                        <button
                          className="menu-item btn-sm !rounded-xl flex gap-3 py-3"
                          type="button"
                          onClick={() => newConversation(globalXmtp)}
                        >
                          <ArrowTopRightOnSquareIcon className="h-6 w-4 ml-2 sm:ml-0" />
                          <a target="_blank" rel="noopener noreferrer" className="whitespace-nowrap">
                            Broadcast
                          </a>
                        </button>
                      </li>
                      <li>
                        <button
                          className="menu-item text-error btn-sm !rounded-xl flex gap-3 py-3"
                          type="button"
                          onClick={() => disconnect()}
                        >
                          <ArrowLeftOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Disconnect</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <input type="checkbox" id="qrcode-modal" className="modal-toggle" />
                    <label htmlFor="qrcode-modal" className="modal cursor-pointer">
                      <label className="modal-box relative">
                        {/* dummy input to capture event onclick on modal box */}
                        <input className="h-0 w-0 absolute top-0 left-0" />
                        <label
                          htmlFor="qrcode-modal"
                          className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3"
                        >
                          ✕
                        </label>
                        <div className="space-y-3 py-6">
                          <div className="flex space-x-4 flex-col items-center gap-6">
                            <QRCodeSVG value={account.address} size={256} />
                            <Address address={account.address} format="long" disableAddressLink />
                          </div>
                        </div>
                      </label>
                    </label>
                  </div>
                </div>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
