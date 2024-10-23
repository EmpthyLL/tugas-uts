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
  const pagePath = path.join(__dirname, page + ".ejs");
  const layoutPath = path.join(__dirname, "views", data.layout + ".ejs");

  // Render the main page content
  fs.readFile(pagePath, "utf-8", (err, pageContent) => {
    if (err) {
      console.error("Error loading page:", err);
      res.writeHead(404);
      res.end("Error: Page not found");
      return;
    }

    // Inject the page content into the layout
    fs.readFile(layoutPath, "utf-8", (layoutErr, layoutContent) => {
      if (layoutErr) {
        console.error("Error loading layout:", layoutErr);
        res.writeHead(500);
        res.end("Error: Layout not found");
        return;
      }

      // Render the page content and inject it into the layout
      const renderedPage = ejs.render(pageContent, data);
      const finalHtml = ejs.render(layoutContent, {
        ...data,
        body: renderedPage,
      });

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(finalHtml);
    });
  });
}

const serveStatic = (req, res) => {
  const filePath = path.join(__dirname, "public", req.url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("File not found:", filePath); // Log the error for debugging
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 - File Not Found</h1>");
    } else {
      // Set content type based on file extension
      const ext = path.extname(filePath);
      const contentType =
        ext === ".js"
          ? "application/javascript"
          : ext === ".css"
          ? "text/css"
          : "text/html";

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
};

// Handle routing and sessions
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Get the session or create a new one
  const session = getSession(req, res);

  if (pathname === "/" || pathname === "/home") {
    renderEjs(
      "views/index",
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
      {
        title: "Page Not Found",
        layout: "error/error_view",
        code: "4 0 4",
        message: "<b>Whoops!</b> We couldn't find what you were looking for.",
      },
      res
    );
  }
}

const uploadSingle = upload("images").single("image");
console.log(uploadSingle.filename);
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    if (req.method === "GET") {
      // Check if the request is for a static file (CSS or JS)
      if (req.url.startsWith("/css") || req.url.startsWith("/node_modules")) {
        serveStatic(req, res); // Serve the static file
      } else {
        handleRequest(req, res); // Handle other routes
      }
    }
  } else if (req.method === "POST") {
    if (req.url === "/upload") {
      uploadSingle(req, res, function (err) {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end("Error: File upload failed");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end("File uploaded successfully");
        }
      });
    }
  }
});

// Start the server
const port = 3001;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
