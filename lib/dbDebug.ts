// lib/dbDebug.ts
import mysql from "mysql2/promise";

export async function testDatabaseConnection() {
  console.log("🔍 [DEBUG] Starting database connection test...");

  // Connection parameters from environment variables
  const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Saara_ThesisDB",
    port: parseInt(process.env.DB_PORT || "3306", 10),
  };

  console.log("🔍 [DEBUG] Connection parameters:", {
    ...config,
    password: "[REDACTED]",
  });

  try {
    // Try to create a direct connection (not from pool)
    console.log("🔍 [DEBUG] Attempting direct connection...");
    const connection = await mysql.createConnection({
      ...config,
      connectTimeout: 10000, // 10 seconds timeout
    });

    console.log("✅ [DEBUG] Direct connection successful!");

    // Test basic query
    console.log("🔍 [DEBUG] Testing simple query...");
    const [result] = await connection.query("SELECT 1 as test");
    console.log("✅ [DEBUG] Query result:", result);

    // Check if database exists
    console.log("🔍 [DEBUG] Checking if database exists...");
    const [databases] = await connection.query("SHOW DATABASES");
    console.log("✅ [DEBUG] Databases:", databases);

    // Check for tables in the database
    console.log("🔍 [DEBUG] Checking tables in database...");
    await connection.query(`USE ${config.database}`);
    const [tables] = await connection.query("SHOW TABLES");
    console.log("✅ [DEBUG] Tables:", tables);

    // Check menu_item table specifically
    console.log("🔍 [DEBUG] Checking menu_item table structure...");
    const [columns] = await connection.query("DESCRIBE menu_item");
    console.log("✅ [DEBUG] menu_item columns:", columns);

    // Close connection
    await connection.end();
    console.log("✅ [DEBUG] Connection closed properly");

    return {
      success: true,
      message: "Database connection and queries successful",
      details: {
        database: config.database,
        tables: tables,
      },
    };
  } catch (error) {
    console.error("❌ [DEBUG] Database connection test failed:", error);

    // Enhanced error reporting based on error type
    let errorMessage = "Unknown error";
    let errorCode = "UNKNOWN";

    if (error instanceof Error) {
      errorMessage = error.message;
      // @ts-ignore - Access MySQL-specific error properties
      errorCode = error.code || "UNKNOWN";

      // MySQL-specific error handling
      // @ts-ignore - Access MySQL-specific error properties
      if (error.code === "ECONNREFUSED") {
        errorMessage = `Connection refused. Make sure MySQL is running on ${config.host}:${config.port}`;
      }
      // @ts-ignore - Access MySQL-specific error properties
      else if (error.code === "ER_ACCESS_DENIED_ERROR") {
        errorMessage = "Access denied. Check your username and password";
      }
      // @ts-ignore - Access MySQL-specific error properties
      else if (error.code === "ER_BAD_DB_ERROR") {
        errorMessage = `Database '${config.database}' does not exist`;
      }
    }

    return {
      success: false,
      message: errorMessage,
      errorCode,
      error,
      config: {
        host: config.host,
        user: config.user,
        database: config.database,
        port: config.port,
      },
    };
  }
}
