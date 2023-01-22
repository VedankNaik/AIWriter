import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [submitKey, setSubmitKey] = useState("");

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  const onKeyChangeText = (event) => {
    setApiKey(event.target.value);
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, submitKey }),
    });

    const data = await response.json();
    const { output } = data;

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const submitApiKey = () => {
    localStorage.setItem("apikey", apiKey);
    setSubmitKey(localStorage.getItem("apikey"));
  };

  const changeApiKey = () => {
    localStorage.removeItem("apikey");
    setSubmitKey("");
  };

  useEffect(() => {
    setSubmitKey(localStorage.getItem("apikey"));
  }, []);

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer</title>
      </Head>
      <div className="container">
        {!submitKey ? (
          <div>
            <input
              placeholder="Enter OPENAI API KEY"
              className="prompt-box small"
              value={apiKey}
              onChange={onKeyChangeText}
              required
            ></input>
            <p className="note">
              Note: <a href="https://beta.openai.com/overview">OPENAI</a>{" "}
              provides limited usage for free. Create and use your own api key
              for this app.
            </p>
            <div className="prompt-buttons">
              <a className={"generate-button"} onClick={submitApiKey}>
                <div className="generate">
                  <p>Submit</p>
                </div>
              </a>
            </div>
          </div>
        ) : (
          <>
            <div>
              <button onClick={changeApiKey} className="change-key">
                Change key
              </button>
            </div>
            <div className="header">
              <div className="header-title">
                <h1>amazing writer!</h1>
              </div>
              <div className="header-subtitle">
                <h2>insert your title below, app will do the rest.</h2>
              </div>
            </div>
            <div className="prompt-container">
              <textarea
                placeholder="start typing here"
                className="prompt-box"
                value={userInput}
                onChange={onUserChangedText}
              />
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
        )}
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
