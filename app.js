const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const url = require("url");
const ejs = require("ejs");
const upload = require("./utils/upload");

// In-memory session store
const sessionStore = {};

// Function to parse cookies
function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      let parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });
  }
  return list;
}

// Function to create a new session
function createSession(res) {
  const sessionId = crypto.randomBytes(16).toString("hex");
  sessionStore[sessionId] = { createdAt: Date.now() };
  res.setHeader("Set-Cookie", `sessionId=${sessionId}; HttpOnly`);
  return sessionId;
}

// Function to get or create a session
function getSession(req, res) {
  const cookies = parseCookies(req);
  let sessionId = cookies["sessionId"];

  if (sessionId && sessionStore[sessionId]) {
    return sessionStore[sessionId];
  } else {
    sessionId = createSession(res);
    return sessionStore[sessionId];
  }
}

// Function to render EJS templates
function renderEjs(page, data, res) {
  const filePath = path.join(__dirname, page + ".ejs"); // Ensure it looks for .ejs file
  console.log(`Rendering EJS file from path: ${filePath}`); // Debug log

  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err) {
      console.error("Error loading page:", err); // Log detailed error
      res.writeHead(404);
      res.end("Error: Page not found");
    } else {
      const rendered = ejs.render(content, data);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(rendered);
    }
  });
}

// Handle routing and sessions
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Get the session or create a new one
  const session = getSession(req, res);

  if (pathname === "/" || pathname === "/home") {
    renderEjs(
      "views/home",
      { title: "Home Page", layout: "components/layout" },
      res
    );
  } else if (pathname === "/about") {
    renderEjs(
      "views/about",
      { title: "About Us", layout: "components/layout" },
      res
    );
  } else if (pathname === "/contact") {
    renderEjs(
      "views/contact",
      { title: "Contact Us", layout: "components/layout" },
      res
    );
  } else if (pathname === "/upload" && req.method === "GET") {
    // Serve an upload form
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <form action="/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="image" accept="image/*" required />
        <button type="submit">Upload Image</button>
      </form>
    `);
  } else {
    // 404 Error
    renderEjs(
      "views/error/404",
      { title: "Page Not Found", layout: "error/error_view" },
      res
    );
  }
}

// Middleware to handle file uploads
const uploadSingle = upload("images").single("image");

// Create the HTTP server
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    handleRequest(req, res);
  } else if (req.method === "POST") {
    if (req.url === "/upload") {
      // Handle file upload with multer
      uploadSingle(req, res, function (err) {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end("Error: File upload failed");
        } else {
          // Successfully uploaded
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end("File uploaded successfully");
        }
      });
    }
  }
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
