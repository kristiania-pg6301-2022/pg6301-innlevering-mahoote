import React, { useEffect, useState } from "react";
import ReactDOM, { render } from "react-dom";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

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
  const navigate = useNavigate();
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

  function handleSubmit() {}

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
      <button onClick={(q) => navigate("/results")}>
        Submit Questionnaire
      </button>
    </div>
  );
}

function Results() {
  const [cookies, setCookies] = useState();

  useEffect(async () => {
    const res = await fetch("/api/results");
    setCookies(await res.json());
  }, []);

  return <div>{cookies}</div>;
}

function Application() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<FrontPage />} />
        <Route path={"/question"} element={<Question />} />
        <Route path={"/results"} element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
