// Add this at the top of menuService.ts
import pool, { RowDataPacket, ResultSetHeader } from "./db";
import { MenuItem } from "@/types/menu";

// Define types for database rows
interface MenuItemRow extends MenuItem, RowDataPacket {}

/**
 * Retrieves all menu items from database
 */
export async function getAllMenuItems(): Promise<MenuItem[]> {
  console.log("🔍 [MENU SERVICE] getAllMenuItems - Starting...");

  try {
    console.log("🔍 [MENU SERVICE] Executing query for all menu items");
    const [rows] = await pool.query<MenuItemRow[]>(`
      SELECT 
        menu_item_id, 
        name, 
        description, 
        price, 
        created_at, 
        updated_at,
        'active' as status
      FROM menu_item
      ORDER BY name ASC
    `);

    console.log(`✅ [MENU SERVICE] Retrieved ${rows.length} menu items`);
    // Convert price to number
    const menuItems = rows.map((item) => ({
      ...item,
      price: Number(item.price), // Ensure price is a number
    }));

    return menuItems;
  } catch (error) {
    console.error("❌ [MENU SERVICE] Error in getAllMenuItems:", error);

    // Enhanced error details
    if (error instanceof Error) {
      console.error("❌ [MENU SERVICE] Error details:", {
        message: error.message,
        // @ts-ignore - Access MySQL-specific properties
        code: error.code,
        // @ts-ignore - Access MySQL-specific properties
        errno: error.errno,
        // @ts-ignore - Access MySQL-specific properties
        sqlState: error.sqlState,
        // @ts-ignore - Access MySQL-specific properties
        sqlMessage: error.sqlMessage,
      });
    }

    throw error;
  }
}

/**
 * Retrieves a single menu item by ID
 */
export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  const [rows] = await pool.query<MenuItemRow[]>(
    `
    SELECT 
      menu_item_id, 
      name, 
      description, 
      price, 
      created_at, 
      updated_at,
      'active' as status
    FROM menu_item 
    WHERE menu_item_id = ?
  `,
    [id]
  );

  return {
    ...rows[0],
    price: Number(rows[0].price), // Ensure price is a number
  };
}

/**
 * Creates a new menu item
 */
export async function createMenuItem(
  item: Omit<MenuItem, "menu_item_id" | "created_at" | "updated_at">
): Promise<MenuItem | null> {
  const { name, description, price } = item;

  // Ensure description is null if it's undefined (TypeScript safety)
  const safeDescription = description === undefined ? null : description;

  const [result] = await pool.query<ResultSetHeader>(
    `
    INSERT INTO menu_item (name, description, price)
    VALUES (?, ?, ?)
  `,
    [name, safeDescription, price]
  );

  if (result.insertId) {
    return getMenuItemById(result.insertId);
  }

  return null;
}

/**
 * Updates an existing menu item
 */
export async function updateMenuItem(
  id: number,
  item: Omit<MenuItem, "menu_item_id" | "created_at" | "updated_at">
): Promise<MenuItem | null> {
  const { name, description, price } = item;

  // Ensure description is null if it's undefined (TypeScript safety)
  const safeDescription = description === undefined ? null : description;

  const [result] = await pool.query<ResultSetHeader>(
    `
    UPDATE menu_item 
    SET name = ?, description = ?, price = ?
    WHERE menu_item_id = ?
  `,
    [name, safeDescription, price, id]
  );

  if (result.affectedRows > 0) {
    return getMenuItemById(id);
  }

  return null;
}

/**
 * Checks if a menu item exists
 */
export async function menuItemExists(id: number): Promise<boolean> {
  const [rows] = await pool.query<MenuItemRow[]>(
    "SELECT menu_item_id FROM menu_item WHERE menu_item_id = ?",
    [id]
  );

  return rows.length > 0;
}

/**
 * Checks if a menu item is used in any orders
 */
export async function menuItemInUse(id: number): Promise<boolean> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT order_item_id FROM order_item WHERE menu_item_id = ? LIMIT 1",
    [id]
  );

  return rows.length > 0;
}

/**
 * Deletes a menu item
 */
export async function deleteMenuItem(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM menu_item WHERE menu_item_id = ?",
    [id]
  );

  return result.affectedRows > 0;
}
