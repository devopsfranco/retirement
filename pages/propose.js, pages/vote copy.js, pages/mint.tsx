import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletNFTs } from "../hooks/useWalletNFTs";
import { PublicKey } from "@solana/web3.js";

const Propose = () => {
    const wallet = useWallet();
    const router = useRouter();
    const updateAuthority = "9u48hDfYSQsEuV9mdKaP31dF1CtqSuxL1mqeBY6Mz1CP";
    const { nfts, fetchNFTs } = useWalletNFTs(updateAuthority);
    const [votingPower, setVotingPower] = useState(0);
    const [topicTitle, setTopicTitle] = useState("");
    const [options, setOptions] = useState([""]);

    useEffect(() => {
        if (wallet.connected) {
            fetchNFTs(wallet.publicKey.toString());
        }
    }, [wallet.connected]);

    useEffect(() => {
        setVotingPower(nfts.length);
    }, [nfts]);

    const addOption = () => {
        if (options.length < 5) {
            setOptions([...options, ""]);
        } else {
            toast.warning("Maximum of 5 options allowed.");
        }
    };

    const removeOption = (index) => {
        if (options.length > 1) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const submitProposal = async () => {
        if (!wallet.connected) {
            toast.error("Please connect your wallet.");
            return;
        }

        if (!topicTitle.trim()) {
            toast.error("Topic title is required.");
            return;
        }

        if (options.some((opt) => !opt.trim())) {
            toast.error("All options must be filled.");
            return;
        }

        try {
            // Replace with Anchor program interaction
            console.log("Submitting proposal to Solana program...");
            toast.success("Proposal submitted successfully!");
            router.push("/vote");
        } catch (error) {
            console.error("Error submitting proposal:", error);
            toast.error("Failed to submit proposal.");
        }
    };

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            <div className="uk-container uk-margin-top">
                <h2>Propose a New Vote</h2>
                <div className="uk-margin">
                    <label>Topic Title:</label>
                    <input
                        type="text"
                        className="uk-input"
                        value={topicTitle}
                        onChange={(e) => setTopicTitle(e.target.value)}
                        placeholder="Enter topic title..."
                    />
                </div>
                <div className="uk-margin">
                    <label>Options:</label>
                    {options.map((option, index) => (
                        <div key={index} className="uk-flex uk-margin-small">
                            <input
                                type="text"
                                className="uk-input uk-width-expand"
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                            />
                            {options.length > 1 && (
                                <button
                                    className="uk-button uk-button-danger uk-margin-left"
                                    onClick={() => removeOption(index)}
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    ))}
                    {options.length < 5 && (
                        <button className="uk-button uk-button-secondary uk-margin-top" onClick={addOption}>
                            ➕ Add Option
                        </button>
                    )}
                </div>
                <button
                    className="uk-button uk-button-primary uk-margin-top"
                    onClick={submitProposal}
                    disabled={votingPower === 0}
                >
                    Submit Proposal
                </button>
                {votingPower === 0 && <p className="uk-text-danger">No voting power available.</p>}
            </div>
        </Layout>
    );
};

export default Propose;
```

#### File 2: `pages/vote copy.js`
```
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletNFTs } from "../hooks/useWalletNFTs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Vote = () => {
    const wallet = useWallet();
    const updateAuthority = "9u48hDfYSQsEuV9mdKaP31dF1CtqSuxL1mqeBY6Mz1CP";
    const { nfts, fetchNFTs } = useWalletNFTs(updateAuthority);
    const [votingPower, setVotingPower] = useState(0);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);

    useEffect(() => {
        if (wallet.connected) {
            fetchNFTs(wallet.publicKey.toString());
        }
    }, [wallet.connected]);

    useEffect(() => {
        setVotingPower(nfts.length);
    }, [nfts]);

    const fetchTopics = async () => {
        try {
            // Replace with Anchor program interaction
            console.log("Fetching topics from Solana program...");
            setTopics([
                { id: 1, title: "Topic 1", votes: 10 },
                { id: 2, title: "Topic 2", votes: 20 },
            ]);
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const submitVote = async () => {
        if (!wallet.connected) {
            toast.error("Please connect your wallet.");
            return;
        }

        if (!selectedTopic) {
            toast.warning("Select a topic before voting.");
            return;
        }

        try {
            // Replace with Anchor program interaction
            console.log("Submitting vote to Solana program...");
            toast.success("Vote submitted successfully!");
        } catch (error) {
            console.error("Error submitting vote:", error);
            toast.error("Failed to submit vote.");
        }
    };

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            <div className="uk-container uk-margin-top">
                <h2>Vote on Topics</h2>
                <ul>
                    {topics.map((topic) => (
                        <li key={topic.id}>
                            <label>
                                <input
                                    type="radio"
                                    name="topic"
                                    value={topic.id}
                                    onChange={() => setSelectedTopic(topic.id)}
                                />
                                {topic.title} (Votes: {topic.votes})
                            </label>
                        </li>
                    ))}
                </ul>
                <button
                    className="uk-button uk-button-primary uk-margin-top"
                    onClick={submitVote}
                    disabled={!selectedTopic || votingPower === 0}
                >
                    Submit Vote
                </button>
                {votingPower === 0 && <p className="uk-text-danger">No voting power available.</p>}
            </div>
        </Layout>
    );
};

export default Vote;
```

#### File 3: `pages/mint.tsx`
```
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { mintV2 } from "@metaplex-foundation/mpl-candy-machine";

const Mint = () => {
    const wallet = useWallet();
    const [minting, setMinting] = useState(false);

    const mintNFT = async () => {
        if (!wallet.connected) {
            alert("Please connect your wallet.");
            return;
        }

        setMinting(true);
        try {
            const mintPublicKey = new PublicKey("YourCandyMachinePublicKey");
            console.log("Minting NFT from Solana program...");
            await mintV2({
                candyMachine: mintPublicKey,
                payer: wallet.publicKey,
            });
            alert("NFT minted successfully!");
        } catch (error) {
            console.error("Error minting NFT:", error);
            alert("Failed to mint NFT.");
        } finally {
            setMinting(false);
        }
    };

    return (
        <Layout>
            <div className="uk-container uk-margin-top">
                <h2>Mint Your NFT</h2>
                <button
                    className="uk-button uk-button-primary"
                    onClick={mintNFT}
                    disabled={minting}
                >
                    {minting ? "Minting..." : "Mint NFT"}
                </button>
            </div>
        </Layout>
    );
};

export default Mint;
