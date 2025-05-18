// app/api/menu-items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MenuItem, ApiError, ApiSuccess } from "@/types/menu";
import * as menuService from "@/lib/menuService";

/**
 * Type for route parameters
 */
interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET handler for retrieving a menu item by ID
 */
export async function GET(
  _: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<MenuItem | ApiError>> {
  try {
    const id = parseInt(params.id, 10);

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid menu item ID" },
        { status: 400 }
      );
    }

    const menuItem = await menuService.getMenuItemById(id);

    if (!menuItem) {
      return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      {
        message: "Failed to retrieve menu item",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a menu item
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<MenuItem | ApiError>> {
  try {
    const id = parseInt(params.id, 10);

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid menu item ID" },
        { status: 400 }
      );
    }

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

    // Check if menu item exists
    const exists = await menuService.menuItemExists(id);

    if (!exists) {
      return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 }
      );
    }

    // Update menu item with type-safe description
    const updatedItem = await menuService.updateMenuItem(id, {
      name,
      description,
      price,
      status: body.status || "active",
    });

    if (!updatedItem) {
      return NextResponse.json(
        { message: "Failed to update menu item" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      {
        message: "Failed to update menu item",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a menu item
 */
export async function DELETE(
  _: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiSuccess<null> | ApiError>> {
  try {
    const id = parseInt(params.id, 10);

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid menu item ID" },
        { status: 400 }
      );
    }

    // Check if menu item exists
    const exists = await menuService.menuItemExists(id);

    if (!exists) {
      return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 }
      );
    }

    // Check if menu item is used in any order
    const inUse = await menuService.menuItemInUse(id);

    if (inUse) {
      return NextResponse.json(
        {
          message: "Cannot delete menu item because it is referenced in orders",
          suggestion: "Consider updating the item instead of deleting it",
        },
        { status: 400 }
      );
    }

    // Delete menu item
    const deleted = await menuService.deleteMenuItem(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Failed to delete menu item" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      {
        message: "Failed to delete menu item",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
