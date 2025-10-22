import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

// Routes
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import pacientesRoutes from "./modules/pacientes/pacientes.routes";
import consultasRoutes from "./modules/consultas/consultas.routes";
import examenesRoutes from "./modules/examenes/examenes.routes";
import seguimientoRoutes from "./modules/seguimiento/seguimiento.routes";
import uploadsRoutes from "./modules/uploads/uploads.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

// Middlewares
import { errorHandler, notFoundHandler } from "./modules/common/error.handler";

// Swagger documentation
import swaggerDocument from "../swagger.json";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/consultas", consultasRoutes);
app.use("/api/examenes", examenesRoutes);
app.use("/api/seguimiento", seguimientoRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;

