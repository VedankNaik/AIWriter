import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitKey, setSubmitKey] = useState("");

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  const onKeyChangeText = (event) => {
    setApiKey(event.target.value);
  };

  const callGenerateEndpoint = async () => {
    debugger;
    setIsGenerating(true);
    if (!userInput) {
      alert("Please enter your text");
      setIsGenerating(false);
      return;
    }
    if (!apiKey) {
      alert("Please enter your OPENAI API Key");
      setIsGenerating(false);
      return;
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, apiKey }),
    });
    if (!response.ok) {
      alert("Please check your API Key");
      setIsGenerating(false);
      return;
    }
    const data = await response.json();
    const { output } = data;

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  useEffect(() => {
    setSubmitKey(localStorage.getItem("apikey"));
  }, []);

  return (
    <div className="root">
      <Head>
        <title>AIWriter</title>
      </Head>
      <div className="container">
        <>
          <div className="header">
            <div className="header-title">
              <h1>AIWriter</h1>
            </div>
            <div className="header-subtitle">
              <h2>insert your title below, app will do the rest.</h2>
            </div>
          </div>
          <div className="prompt-container">
            <textarea
              placeholder="Start typing here"
              className="prompt-box"
              value={userInput}
              onChange={onUserChangedText}
              required
            />
            <input
              placeholder="Enter OPENAI API KEY"
              className="prompt-box small"
              value={apiKey}
              onChange={onKeyChangeText}
              required
            ></input>
            <p className="note">
              Create your account <a href="https://beta.openai.com">OPENAI</a>{" "}
              account and generate your own API key for this app{" "}
              <a href="https://beta.openai.com/account/api-keys">here</a>.
            </p>
            <div className="prompt-buttons">
              <a
                className={
                  isGenerating ? "generate-button loading" : "generate-button"
                }
                onClick={callGenerateEndpoint}
              >
                <div className="generate">
                  {isGenerating ? (
                    <span className="loader"></span>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </a>
            </div>
            {apiOutput && (
              <div className="output">
                <div className="output-header-container">
                  <div className="output-header">
                    <h3>Output</h3>
                  </div>
                </div>
                <div className="output-content">
                  <p>{apiOutput}</p>
                </div>
              </div>
            )}
          </div>
        </>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
