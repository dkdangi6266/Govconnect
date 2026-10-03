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

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/consents", consentRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/officers", officerRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});