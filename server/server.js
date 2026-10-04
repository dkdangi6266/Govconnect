const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRouts");
const serviceRoutes = require("./routes/serviceRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const consentRoutes = require("./routes/consentRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const officerRoutes = require("./routes/officerRoutes");
const auditRoutes = require("./routes/auditRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const documentRoutes = require("./routes/documentRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/consents", consentRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/documents", documentRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});