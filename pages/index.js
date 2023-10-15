import Image from "next/image";
import { Inter, Young_Serif, Tangerine } from "next/font/google";
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import ProgressBar from "@/components/ProgressBar";
import Timer from "@/components/Timer";

const young = Young_Serif({ weight: "400", subsets: ["latin"] });
const tangerine = Tangerine({ weight: "400", subsets: ["latin"] });

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const [progress, setProgress] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
          if (progress < 100) {
              setProgress(8.5);
          } else {
              clearInterval(interval);
          }
      }, 1000);

      // Cleanup the interval on component unmount
      return () => clearInterval(interval);
  }, [progress]);


  const [amount, setAmount] = useState("");

  function calculate(amount) {
    return amount * 1000000;
  }

  const [signer, setSigner] = useState();

    // Connect to MetaMask and initialize web3 instance
    async function connectWallet() {
      // Check if the browser has MetaMask (or another dApp browser)
      if (typeof window.ethereum !== 'undefined') {
          let provider = new ethers.providers.Web3Provider(window.ethereum,"goerli");
  
          try {
              // Request account access
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              
              let signer = setSigner(provider.getSigner());

              console.log("Connected to wallet:", await signer.getAddress());
              
  
          } catch (error) {
              console.error("User denied account access");
          }
      } else {
          console.error("Ethereum provider (e.g., MetaMask) not detected");
      }
  }
  


  async function sendEther() {
    if (!signer) {
        console.error("Wallet not connected");
        return;
    }

    const toAddress = "0x3410A1eefF78C51F9668dB0bcEAe695EcA3d6A7A"; // Replace with the recipient's address
    const amountInEther = amount;
    const amountInWei = ethers.utils.parseEther(amountInEther.toString());

    try {
        const tx = await signer.sendTransaction({
            to: toAddress,
            value: amountInWei
        });

        console.log('Transaction Hash:', tx.hash);
        
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log('Transaction was mined in block', receipt.blockNumber);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

  return (
    <main
      className={`flex min-h-screen flex-col items-center   ${inter.className}`}
    >
      <div className={young.className}>
        <Image src="/logodragontwo.png" width={180} height={180} />
        <p className="text-3xl text-white pb-8"> Drakengate </p>
      </div>
      <div className="flex rounded-xl justify-start p-12 items-start border w-[300px] md:w-[550px] h-[600px] md:h-[600px]">
        <div className={young.className}>
          <div className="flex flex-col text-center">
            <p className="text-white">
              MAX BUY : <span className="text-lg"> 0.5 ETH</span>{" "}
            </p>
            <p className="text-white">
              MIN BUY : <span className="text-lg"> 0.01 ETH</span>{" "}
            </p>
            <p className="text-white">
              PRESALE PRICE :{" "}
              <span className="text-lg"> 1000 DRAKEN per 0.001 ETH</span>{" "}
            </p>
          </div>
          <div className="pt-4 pb-2 w-full md:w-[450px] text-center flex flex-col justify-center">
            <p className="text-white py-2">Enter ETH Amount</p>
            <input
              className="w-full p-2 bg-gray-300 rounded-lg"
              placeholder="Amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            ></input>
            <p className="text-white text-xl pt-4">
              Total: {calculate(amount)} DRAKEN
            </p>
          </div>
          <div className="w-full">
            <button onClick={connectWallet} className="text-black bg-white w-full mb-2 disabled:cursor-default px-4 cursor-pointer py-3 flex justify-center items-center rounded-xl">
              Connect Wallet
            </button>
            <button
              onClick={sendEther}
              disabled={
                calculate(amount) > 500000 || calculate(amount) < 10000
                  ? true
                  : false
              }
              className="text-black bg-white w-full disabled:opacity-40 disabled:cursor-default px-4 cursor-pointer py-3 flex justify-center items-center rounded-xl"
            >
              {calculate(amount) > 500000
                ? "Please buy less than max amount"
                : calculate(amount) < 10000
                ? "Please buy more than min amount"
                : "Buy Now"}
            </button>
            <ProgressBar percentage={progress} />
            <p className="text-xl text-center text-white">
             
             Remaining Time : 
            </p>
            <Timer></Timer>

          </div>
        </div>
      </div>
    </main>
  );
}