import { NextRequest, NextResponse } from "next/server";
import { MenuItem, MenuItemsResponse, ApiError } from "@/types/menu";
import * as menuService from "@/lib/menuService";

/**
 * GET handler for retrieving all menu items
 */
export async function GET(): Promise<
  NextResponse<MenuItemsResponse | ApiError>
> {
  console.log("🔍 [API] GET /api/menu-items - Starting...");

  try {
    console.log("🔍 [API] Calling menuService.getAllMenuItems()");
    const items = await menuService.getAllMenuItems();
    console.log(`✅ [API] Successfully retrieved ${items.length} menu items`);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("❌ [API] Error in GET /api/menu-items:", error);

    // Enhanced error details
    let errorDetails: any = {};
    if (error instanceof Error) {
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };

      // MySQL specific error properties
      // @ts-ignore
      if (error.code) {
        // @ts-ignore
        errorDetails.code = error.code;
        // @ts-ignore
        errorDetails.errno = error.errno;
        // @ts-ignore
        errorDetails.sqlState = error.sqlState;
        // @ts-ignore
        errorDetails.sqlMessage = error.sqlMessage;
      }
    }

    console.error("❌ [API] Detailed error:", errorDetails);

    return NextResponse.json(
      {
        message: "Failed to retrieve menu items",
        error: error instanceof Error ? error.message : String(error),
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new menu item
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<MenuItem | ApiError>> {
  try {
    const body = (await request.json()) as Partial<MenuItem>;
    const { name, price } = body;

    // Safely handle description field (could be undefined from JSON)
    const description: string | null =
      body.description === undefined ? null : body.description;

    // Validate required fields
    if (!name || price === undefined) {
      return NextResponse.json(
        { message: "Name and price are required fields" },
        { status: 400 }
      );
    }

    // Validate price format
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      return NextResponse.json(
        { message: "Price must be a valid non-negative number" },
        { status: 400 }
      );
    }

    // Create menu item with type-safe description
    const newItem = await menuService.createMenuItem({
      name,
      description,
      price,
      status: body.status || "active",
    });

    if (!newItem) {
      return NextResponse.json(
        { message: "Failed to create menu item" },
        { status: 500 }
      );
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      {
        message: "Failed to create menu item",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
