import express from "express";
import { isCorrectAnswer, randomQuestion } from "./questions.js";
import * as path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

let totalAnswers = 0;
let correctAnswers = 0;

app.get("/api/question", (req, res) => {
  const question = randomQuestion();
  res.json(question);
});

app.get("/api/results", (req, res) => {
  res.cookie("correctAnswers", correctAnswers, { signed: true });
  res.cookie("totalAnswers", totalAnswers, { signed: true });

  const cookies = req.signedCookies;
  res.json({
    total: cookies["totalAnswers"],
    correct: cookies["correctAnswers"],
  });
});

app.post("/api/question", (req, res) => {
  const { data, userAnswer } = req.body;
  const isCorrect = isCorrectAnswer(data, userAnswer);

  if (isCorrect)
    res.cookie("correctAnswers", correctAnswers++, { signed: true });
  else res.cookie("correctAnswers", correctAnswers, { signed: true });

  res.cookie("totalAnswers", totalAnswers++, { signed: true });

  res.sendStatus(200);
});

app.delete("/api/clearCookies", (req, res) => {
  totalAnswers = 0;
  correctAnswers = 0;

  res.clearCookie("correctAnswers");
  res.clearCookie("totalAnswers");
  res.end();
});

app.use(express.static("../client/dist"));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on http://localhost:${server.address().port}`);
});
