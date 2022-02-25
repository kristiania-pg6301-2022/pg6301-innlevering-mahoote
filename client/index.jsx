import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function FrontPage() {
  return <div>Front page</div>;
}

function Question() {
  const [question, setQuestion] = useState();
  useEffect(async () => {
    const res = await fetch("/api/question");
    setQuestion(await res.json());
  });
  return <div>{question}</div>;
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
