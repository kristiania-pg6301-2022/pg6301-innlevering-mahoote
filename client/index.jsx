import React, { useEffect, useState } from "react";
import ReactDOM, { render } from "react-dom";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function FrontPage() {
  return (
    <div>
      <h1>Front page</h1>
      <Link to={"/question"}>Question</Link>
    </div>
  );
}

function Question() {
  const [question, setQuestion] = useState();

  useEffect(async () => {
    const res = await fetch("/api/question");
    setQuestion(await res.json());
  }, []);

  if (!question) return <div>Loading...</div>;

  function handleNext(question, userAnswer) {
    fetch("/api/question", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ question, userAnswer }),
    }).then(async () => {
      const temp = await fetch("/api/question");
      setQuestion(await temp.json());
    });
  }

  return (
    <div>
      <h1>{question.question}</h1>
      {Object.keys(question.answers)
        .filter((a) => question.answers[a])
        .map((answer) => (
          <div key={answer}>
            <button onClick={(q) => handleNext(question, answer)}>
              {question.answers[answer]}
            </button>
          </div>
        ))}
      <button>Submit Questionnaire</button>
    </div>
  );
}

function Application() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<FrontPage />} />
        <Route path={"/question"} element={<Question />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
