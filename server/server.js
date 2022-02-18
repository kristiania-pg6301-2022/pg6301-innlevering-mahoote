import express from "express";

const app = express();

app.get("/api/login", (req, res, next) => {
  res.json({
    username: "admin",
    fullName: "Noen André Persson",
  });
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on http://localhost:${server.address().port}`);
});
