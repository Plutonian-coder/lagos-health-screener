import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Simplified Component without external icons/animations to ensure stability
export default function CrowdFunding({ onNavigate }) {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState("0.00");
    const [donationAmount, setDonationAmount] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);

    // Mock Blockchain Data
    const contractAddress = "0x1e1d54389bab00e8fdbfa00dd03a95d39e120c17";
    const totalRaised = "45.2 ETH";

    useEffect(() => {
        console.log("CrowdFunding MOUNTED");
        const checkConnection = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setBalance("1.45");
                    }
                } catch (e) { console.error(e); }
            }
        };
        checkConnection();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask not found!");
            return;
        }
        try {
            setIsConnecting(true);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            setBalance("1.45");
        } catch (error) {
            console.error(error);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDonate = async () => {
        if (!account) return alert("Connect Wallet first");
        try {
            const params = {
                to: contractAddress,
                from: account,
                value: (parseFloat(donationAmount) * 1e18).toString(16)
            };
            await window.ethereum.request({ method: 'eth_sendTransaction', params: [params] });
            alert("Donation Sent!");
        } catch (e) {
            console.error(e);
            alert("Transaction Failed");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <button onClick={() => onNavigate('patient-dashboard')} className="mb-8 text-gray-400 hover:text-white">
                &larr; Back to Dashboard
            </button>

            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold text-green-500">LagosChain Aid</h1>
                    {account ? (
                        <div className="bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
                            Connected: {account.substring(0, 6)}...
                        </div>
                    ) : (
                        <button onClick={connectWallet} className="bg-green-500 text-black px-6 py-2 rounded-full font-bold">
                            {isConnecting ? "Connecting..." : "Connect Wallet"}
                        </button>
                    )}
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-4">Donate to Pool</h2>
                        <input
                            type="number"
                            className="w-full bg-black border border-gray-700 p-4 rounded-xl text-2xl mb-4 text-white"
                            placeholder="0.00 ETH"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                        />
                        <button onClick={handleDonate} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl text-lg">
                            Confirm Contribution
                        </button>
                        <p className="mt-4 text-xs text-gray-500">Contract: {contractAddress}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                            <div className="text-gray-400 text-sm uppercase">Total Value Locked</div>
                            <div className="text-4xl font-bold">{totalRaised}</div>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                            <h3 className="font-bold mb-4">Live Activity</h3>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="border-b border-gray-800 pb-2">DangoteFdn sent 20 ETH</div>
                                <div className="border-b border-gray-800 pb-2">Anonymous sent 5 ETH</div>
                                <div>Disbursed 1.2 ETH to General Hospital</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
