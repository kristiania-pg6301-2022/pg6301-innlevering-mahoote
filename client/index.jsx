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
      <ul>
        <li>
          <Link to={"/question"}>New questionnaire</Link>
        </li>
        <li>
          <Link to={"/results"}>Your results</Link>
        </li>
      </ul>
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
      const res = await fetch("/api/question");
      setQuestion(await res.json());
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
      <br />
      <button onClick={(q) => navigate("/results")}>
        Submit Questionnaire
      </button>
    </div>
  );
}

function Results() {
  const navigate = useNavigate();

  const [cookies, setCookies] = useState();

  useEffect(async () => {
    const res = await fetch("/api/results");
    setCookies(await res.json());
  }, []);
  if (!cookies) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your results</h1>
      <p>
        {cookies.correct} correct answers out of {cookies.total} total
        questions.
      </p>
      <ul>
        <li>
          <Link to={"/question"}>New questionnaire</Link>
        </li>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
      </ul>
    </div>
  );
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
