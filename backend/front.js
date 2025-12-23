const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// ✅ API 프록시 (pathRewrite 필수)
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);

// 정적 파일 제공 (Vite → dist)
app.use(express.static(path.join(__dirname, "dist")));

// SPA 처리
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(8080, () => console.log("Running on port 8080..."));