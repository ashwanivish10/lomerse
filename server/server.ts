// // ============================================
// // ✅ SERVER.TS — Unified Backend + Frontend
// // ============================================

// import 'dotenv/config'; // MUST be first
// import express, { type Request, Response, NextFunction } from "express";
// import session from "express-session";
// import passport from "passport";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// // import paymentRoutes from "./paymentRoutes";
// import invoiceRoutes from "./routes/invoiceRoutes";
// import authRoutes from "./routes/authRoutes";
// import apiRoutes from "./routes/apiRoutes";
// import { registerRoutes } from "./routes";
// import { setupVite, serveStatic, log } from "./vite";
// import { connectDB } from "./models";
// import "./config/passport-setup"; // Load passport config

// // ============================================
// // 🔧 Initialize Express App
// // ============================================
// const app = express();

// // --------------------------------------------
// // 🧩 Connect MongoDB
// // --------------------------------------------
// connectDB().catch(err => {
//   console.error("❌ Failed to connect to MongoDB:", err);
//   process.exit(1);
// });

// // --------------------------------------------
// // 🧾 Razorpay webhook needs raw body
// // --------------------------------------------
// app.use("/api/razorpay-webhook", express.raw({ type: "application/json" }));

// // --------------------------------------------
// // ⚙️ Standard middleware
// // --------------------------------------------
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // --------------------------------------------
// // 🔐 Session & Passport Setup
// // --------------------------------------------
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET!,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// // --------------------------------------------
// // 🪵 Logging Middleware
// // --------------------------------------------
// app.use((req, res, next) => {
//   const start = Date.now();
//   const path = req.path;
//   let capturedJsonResponse: Record<string, any> | undefined = undefined;

//   const originalResJson = res.json;
//   res.json = function (bodyJson, ...args) {
//     capturedJsonResponse = bodyJson;
//     return originalResJson.apply(res, [bodyJson, ...args]);
//   };

//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     if (path.startsWith("/api") || path.startsWith("/auth")) {
//       let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
//       if (capturedJsonResponse) {
//         logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
//       }
//       if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
//       log(logLine);
//     }
//   });

//   next();
// });

// // ============================================
// // 🚀 Async Setup (routes + frontend serve)
// // ============================================
// (async () => {
//   // ------------------------------------------
//   // 🧭 Root Health Check (Optional)
//   // ------------------------------------------
//   app.get("/health", (_req: Request, res: Response) => {
//     res.status(200).json({
//       message: "✅ Server running properly",
//       status: "OK",
//     });
//   });

//   // ------------------------------------------
//   // 🧩 Backend API Routes
//   // ------------------------------------------
//   app.use("/auth", authRoutes);
//   app.use("/api", apiRoutes);
//   app.use("/api/invoice", invoiceRoutes);
//   // app.use("/api/payment", paymentRoutes);

//   // Register any extra routes dynamically
//   const server = await registerRoutes(app);

//   // ==========================================
//   // 🧱 Serve Vite React Build (Landing Page)
//   // ==========================================
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   // -----------------------------------------------------------------
//   // This path is now correct.
//   // `__dirname` will be `.../creatorflow/dist`.
//   // Client assets are in `.../creatorflow/dist/public`.
//   // -----------------------------------------------------------------
//   const frontendPath = path.join(__dirname, "public");

//   app.use(express.static(frontendPath));

//   // Serve index.html for all non-API routes
//   app.get("*", (req, res) => {
//     if (req.path.startsWith("/api") || req.path.startsWith("/auth")) {
//       return res.status(404).json({ message: "Not Found" });
//     }

//     // This will now correctly resolve to `.../dist/public/index.html`
//     res.sendFile(path.join(frontendPath, "index.html"), (err) => {
//       if (err) {
//         // Add logging in case the file is still not found
//         console.error("❌ Error sending index.html:", err);
//         res.status(500).json({ message: "Error serving frontend." });
//       }
//     });
//   });

//   // ------------------------------------------
//   // ⚠️ Global Error Handler
//   // ------------------------------------------
//   app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
//     const status = err.status || err.statusCode || 500;
//     const message = err.message || "Internal Server Error";
//     console.error("❌ Error:", err);
//     res.status(status).json({ message });
//   });

//   // ==========================================
// // 🧰 Vite Integration (Dev vs Prod)
// // ==========================================
//   if (app.get("env") === "development") {
//     await setupVite(app, server);
//   } else {
//     serveStatic(app);
//   }

// // ==========================================
// // 🚦 Start the Server
//  // ==========================================
//   const port = parseInt(process.env.PORT || "5000", 10);
//   // ❗ CORRECTION HERE: Removed the stray 'D'
//   server.listen(
//     {
//       port,
//       host: "0.0.0.0",
//     },
//     () => {
//       log(`✅ Server running on http://localhost:${port}`);
//     }
//   );
// })();



// ============================================
// ✅ SERVER.TS — Unified Backend + Frontend
// ============================================

import 'dotenv/config'; // MUST be first
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// import paymentRoutes from "./paymentRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import authRoutes from "./routes/authRoutes";
import apiRoutes from "./routes/apiRoutes";
import { registerRoutes } from "./routes";
import { log, serveStatic } from "./utils";
import { connectDB } from "./models";
import "./config/passport-setup"; // Load passport config
import MongoStore from "connect-mongo";
// ============================================
// 🔧 Initialize Express App
// ============================================
const app = express();

// --------------------------------------------
// 🧩 Connect MongoDB
// --------------------------------------------
connectDB().catch(err => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});

// --------------------------------------------
// 🧾 Razorpay webhook needs raw body
// --------------------------------------------
app.use("/api/razorpay-webhook", express.raw({ type: "application/json" }));

// --------------------------------------------
// ⚙️ Standard middleware
// --------------------------------------------
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --------------------------------------------
// 🔐 Session & Passport Setup
// --------------------------------------------
const isProduction = process.env.NODE_ENV === 'production';

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60, // 24 hours
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProduction, // true in production for HTTPS
      sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production
    },
    proxy: isProduction, // Trust first proxy in production
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --------------------------------------------
// 🪵 Logging Middleware
// --------------------------------------------
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api") || path.startsWith("/auth")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// ============================================
// 🚀 Async Setup (routes + frontend serve)
// ============================================
(async () => {
  // ------------------------------------------
  // 🧭 Root Health Check (Optional)
  // ------------------------------------------
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      message: "✅ Server running properly",
      status: "OK",
    });
  });

  // ------------------------------------------
  // 🧩 Backend API Routes
  // ------------------------------------------
  app.use("/auth", authRoutes);
  app.use("/api", apiRoutes);
  app.use("/api/invoice", invoiceRoutes);
  // app.use("/api/payment", paymentRoutes);

  // Register any extra routes dynamically
  const server = await registerRoutes(app);

  // ==========================================
  // 🧱 Serve Vite React Build (Landing Page)
  // ==========================================

  // ❗ REMOVED: The static file serving logic below was for production only
  // and was conflicting with the Vite dev server.
  // We will let the `serveStatic` function (in the `else` block below)
  // handle this logic in production.

  // ------------------------------------------
  // ⚠️ Global Error Handler
  // ------------------------------------------
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("❌ Error:", err);
    res.status(status).json({ message });
  });

  // ==========================================
  // 🧰 Static File Serving (Production Only)
  // ==========================================
  // NOTE: In development, run with `npm run dev` which uses tsx directly
  // and doesn't need this build. Vite dev server is handled separately.
  // This bundled server.js is ONLY for production.
  serveStatic(app);

  // ==========================================
  // 🚦 Start the Server
  // ==========================================
  const port = parseInt(process.env.PORT || "5000", 10);
  // ❗ CORRECTION: Removed stray character
  server.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`✅ Server running on http://localhost:${port}`);
    }
  );
})();

