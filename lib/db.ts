// lib/db.ts
import mysql, {
  Pool,
  RowDataPacket,
  ResultSetHeader,
  OkPacket,
} from "mysql2/promise";

// Export MySQL types for use elsewhere
export type { RowDataPacket, ResultSetHeader, OkPacket };

// Type for database configuration
interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
  connectTimeout: number;
  dateStrings: boolean;
}

// Create database configuration with full debug info
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "Saara_ThesisDB",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 0,
  connectTimeout: 60000, // 60 seconds timeout
  dateStrings: true, // Return dates as strings
};

// Debug log connection parameters (WITHOUT password)
console.log("🔌 [DATABASE] Initializing connection with:", {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port,
  connectTimeout: dbConfig.connectTimeout,
});

// Log environment variables (WITHOUT password)
console.log("🔧 [DATABASE] Environment variables:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  NODE_ENV: process.env.NODE_ENV,
});

// Create and export pool with error handling
let pool: Pool;

try {
  // Create pool
  pool = mysql.createPool(dbConfig);
  console.log("✅ [DATABASE] Pool created successfully");

  // Test pool with ping
  pool
    .query("SELECT 1")
    .then(() => console.log("✅ [DATABASE] Pool ping successful"))
    .catch((err) => console.error("❌ [DATABASE] Pool ping failed:", err));
} catch (err) {
  console.error("❌ [DATABASE] Failed to create database pool:", err);
  throw err;
}

export default pool;
