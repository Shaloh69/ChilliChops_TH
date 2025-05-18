// app/menu/page.tsx or equivalent location
"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Import types
import { MenuItem, MenuItemsResponse } from "@/types/menu";

// HeroUI Components
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";

export default function MenuItemsPage() {
  // State Management with proper types
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<
    Omit<MenuItem, "menu_item_id" | "created_at" | "updated_at">
  >({
    name: "",
    description: null, // Changed from "" to null
    price: 0,
    status: "active",
  });
  const [debugMode, setDebugMode] = useState<boolean>(false);

  // Use HeroUI's useDisclosure for modal management
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  // Fetch Menu Items
  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<MenuItemsResponse>("/api/menu-items");
      setMenuItems(response.data.items);
    } catch (error) {
      console.error("Menu items fetch error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Create Menu Item
  const createMenuItem = async () => {
    setIsLoading(true);
    try {
      // Ensure price is a valid number with 2 decimal places
      const validatedData = {
        ...formData,
        price: Number(parseFloat(formData.price.toString()).toFixed(2)),
      };

      const response = await axios.post<MenuItem>(
        "/api/menu-items",
        validatedData
      );
      setMenuItems((prev) => [...prev, response.data]);
      setFormData({
        name: "",
        description: null, // Changed from "" to null
        price: 0,
        status: "active",
      });
      onClose();
    } catch (error) {
      console.error("Create menu item error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Menu Item
  const updateMenuItem = async () => {
    if (!selectedMenuItem?.menu_item_id) return;

    setIsLoading(true);
    try {
      // Ensure price is a valid number with 2 decimal places
      const validatedData = {
        ...formData,
        price: Number(parseFloat(formData.price.toString()).toFixed(2)),
      };

      const response = await axios.put<MenuItem>(
        `/api/menu-items/${selectedMenuItem.menu_item_id}`,
        validatedData
      );
      setMenuItems((prev) =>
        prev.map((item) =>
          item.menu_item_id === selectedMenuItem.menu_item_id
            ? response.data
            : item
        )
      );
      onClose();
    } catch (error) {
      console.error("Update menu item error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Menu Item
  const deleteMenuItem = async (id: number) => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/menu-items/${id}`);
      setMenuItems((prev) => prev.filter((item) => item.menu_item_id !== id));
    } catch (error) {
      console.error("Delete menu item error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug function to add random menu items
  const addDebugMenuItems = () => {
    const foodItems: Omit<
      MenuItem,
      "menu_item_id" | "created_at" | "updated_at"
    >[] = [
      {
        name: "Chicken Adobo",
        description:
          "Tender chicken stewed in vinegar, soy sauce, garlic, and spices",
        price: 11.99,
        status: "active",
      },
      {
        name: "Pork Sinigang",
        description:
          "Sour tamarind-based soup with pork and assorted vegetables",
        price: 12.49,
        status: "active",
      },
      {
        name: "Pancit Canton",
        description:
          "Stir-fried egg noodles with vegetables, shrimp, and chicken",
        price: 9.99,
        status: "active",
      },
      {
        name: "Lumpiang Shanghai",
        description: "Crispy spring rolls filled with seasoned pork",
        price: 6.99,
        status: "active",
      },
      {
        name: "Lechon Kawali",
        description: "Crispy deep-fried pork belly served with liver sauce",
        price: 13.99,
        status: "active",
      },
      {
        name: "Halo-Halo",
        description:
          "Shaved ice dessert with sweet beans, fruits, jellies, and leche flan",
        price: 5.49,
        status: "active",
      },
      {
        name: "Buko Pandan",
        description: "Sweet coconut and pandan gelatin salad with cream",
        price: 4.99,
        status: "active",
      },
      {
        name: "Taho",
        description:
          "Warm silken tofu with arnibal (brown sugar syrup) and sago pearls",
        price: 3.49,
        status: "active",
      },
      {
        name: "Sisig",
        description:
          "Sizzling chopped pork ears and cheeks seasoned with calamansi and chili",
        price: 10.49,
        status: "active",
      },
      {
        name: "Bibingka",
        description:
          "Rice cake cooked in banana leaves, topped with salted egg and cheese",
        price: 4.99,
        status: "active",
      },
      {
        name: "Kare-Kare",
        description:
          "Oxtail stew with peanut sauce served with bagoong (fermented shrimp paste)",
        price: 14.99,
        status: "active",
      },
      {
        name: "Kinilaw",
        description:
          "Fresh raw fish marinated in vinegar, ginger, onion, and chili",
        price: 8.99,
        status: "active",
      },
      {
        name: "Puto",
        description: "Steamed rice cakes, fluffy and slightly sweet",
        price: 3.99,
        status: "active",
      },
      {
        name: "Sago’t Gulaman",
        description:
          "Refreshing drink with tapioca pearls and jelly in sweet syrup",
        price: 2.99,
        status: "active",
      },
      {
        name: "Balut",
        description:
          "Boiled fertilized duck egg seasoned with salt and vinegar",
        price: 2.49,
        status: "inactive",
      },
      {
        name: "Arroz Caldo",
        description:
          "Comforting rice porridge with chicken, ginger, and garlic",
        price: 7.99,
        status: "active",
      },
      {
        name: "Pinakbet",
        description: "Mixed vegetables stewed in shrimp paste",
        price: 8.49,
        status: "active",
      },
      {
        name: "Dinuguan",
        description: "Savory pork blood stew with vinegar and chili",
        price: 9.49,
        status: "active",
      },
      {
        name: "Embutido",
        description: "Filipino-style meatloaf with eggs and raisins",
        price: 8.99,
        status: "active",
      },
      {
        name: "Bicol Express",
        description: "Spicy coconut milk stew with pork and chili",
        price: 10.99,
        status: "active",
      },
      {
        name: "Caldereta",
        description:
          "Hearty beef stew with tomato sauce, potatoes, and carrots",
        price: 13.49,
        status: "active",
      },
      {
        name: "Pancit Malabon",
        description: "Thick rice noodles with seafood and savory sauce",
        price: 11.49,
        status: "active",
      },
      {
        name: "Puto Bumbong",
        description:
          "Purple rice cake steamed on bamboo tubes, topped with coconut and sugar",
        price: 4.49,
        status: "active",
      },
      {
        name: "Salabat",
        description: "Ginger tea served hot with honey",
        price: 2.99,
        status: "active",
      },
      {
        name: "Tsokolate",
        description: "Thick hot chocolate made from local cacao beans",
        price: 3.99,
        status: "active",
      },
      {
        name: "Mango Float",
        description:
          "Layered dessert of graham crackers, cream, and ripe mangoes",
        price: 5.99,
        status: "active",
      },
      {
        name: "Empanada Iloco",
        description: "Savory Ilocos-style pastry filled with meat and egg",
        price: 3.99,
        status: "active",
      },
      {
        name: "Longganisa",
        description: "Sweet Philippine sausage served with garlic rice",
        price: 6.99,
        status: "active",
      },
      {
        name: "Tocino",
        description:
          "Sweet cured pork strips, pan-fried to caramelized perfection",
        price: 6.49,
        status: "active",
      },
      {
        name: "Bangus Sisig",
        description: "Deconstructed sisig using milkfish, onions, and chili",
        price: 11.99,
        status: "active",
      },
      {
        name: "Inihaw na Liempo",
        description: "Grilled marinated pork belly with dipping sauce",
        price: 12.99,
        status: "active",
      },
      {
        name: "Ginataang Langka",
        description: "Young jackfruit cooked in coconut milk and spices",
        price: 9.49,
        status: "active",
      },
      {
        name: "Ukoy",
        description: "Shrimp and vegetable fritters served with spiced vinegar",
        price: 7.49,
        status: "active",
      },
      {
        name: "Lugaw",
        description:
          "Plain rice porridge garnished with fried garlic and scallions",
        price: 5.99,
        status: "active",
      },
      {
        name: "Sinampalukang Manok",
        description: "Chicken soup with tamarind leaves and ginger",
        price: 10.49,
        status: "active",
      },
      {
        name: "Pinangat",
        description: "Fish wrapped in taro leaves cooked in coconut milk",
        price: 11.49,
        status: "active",
      },
      {
        name: "Tortang Talong",
        description: "Eggplant omelette with minced meat and onions",
        price: 8.49,
        status: "active",
      },
      {
        name: "Batchoy",
        description: "Laoag-style noodle soup with pork, liver, and chicharron",
        price: 9.99,
        status: "active",
      },
      {
        name: "Laing",
        description: "Taro leaves simmered in coconut milk and chili",
        price: 8.99,
        status: "active",
      },
      {
        name: "Papaitan",
        description: "Bitter soup made from goat innards and bile",
        price: 9.49,
        status: "active",
      },
      {
        name: "Pochero",
        description:
          "Hearty stew with beef, plantains, potatoes, and chickpeas",
        price: 12.49,
        status: "active",
      },
      {
        name: "Sinuglaw",
        description: "Combination of grilled pork belly and ceviche-style fish",
        price: 13.49,
        status: "active",
      },
      {
        name: "Chicken Inasal",
        description:
          "Bacolod-style grilled chicken marinated in achuete and cane vinegar",
        price: 12.49,
        status: "active",
      },
      {
        name: "Leche Flan",
        description: "Creamy caramel custard dessert",
        price: 4.99,
        status: "active",
      },
      // More items added below
      {
        name: "Kutsinta",
        description: "Steamed rice cake with annatto and grated coconut",
        price: 3.49,
        status: "active",
      },
      {
        name: "Maja Blanca",
        description: "Coconut pudding with corn kernels and latik topping",
        price: 4.49,
        status: "active",
      },
      {
        name: "Ginataang Bilo-Bilo",
        description:
          "Sticky rice balls in coconut milk with fruits and tapioca",
        price: 5.49,
        status: "active",
      },
      {
        name: "Pinoy Spaghetti",
        description: "Sweet-style spaghetti with hot dog slices and cheese",
        price: 8.99,
        status: "active",
      },
      {
        name: "Chicharon Bulaklak",
        description: "Crispy fried ruffled fat with vinegar dip",
        price: 7.99,
        status: "active",
      },
      {
        name: "Chicharon",
        description: "Crunchy pork rind snack",
        price: 3.99,
        status: "active",
      },
      {
        name: "Sinigang na Hipon",
        description: "Shrimp in sour tamarind broth with vegetables",
        price: 12.99,
        status: "active",
      },
      {
        name: "Sinigang na Bangus",
        description: "Milkfish in tamarind soup with veggies",
        price: 13.49,
        status: "active",
      },
      {
        name: "La Paz Batchoy",
        description: "Rich noodle soup with pork offals, egg, and chicharron",
        price: 10.49,
        status: "active",
      },
      {
        name: "Espasol",
        description:
          "Rice cake dusted with toasted rice flour and coconut milk",
        price: 3.99,
        status: "active",
      },
      {
        name: "Otap",
        description: "Crispy puff pastry rolled with sugar",
        price: 2.99,
        status: "active",
      },
      {
        name: "Pichi-Pichi",
        description: "Cassava-based gelatin topped with grated coconut",
        price: 4.49,
        status: "active",
      },
      {
        name: "Sapin-Sapin",
        description: "Layered glutinous rice dessert with coconut and ube",
        price: 4.99,
        status: "active",
      },
      {
        name: "Sorbetes",
        description: "Traditional street ice cream in various local flavors",
        price: 3.49,
        status: "active",
      },
      {
        name: "Tinumok",
        description: "Sticky rice rolled in banana leaves and grilled",
        price: 5.99,
        status: "active",
      },
    ];

    // Use Promise.all to handle multiple async requests
    Promise.all(
      foodItems.map((item) => axios.post<MenuItem>("/api/menu-items", item))
    )
      .then((responses) => {
        const newItems = responses.map((res) => res.data);
        setMenuItems((prev) => [...prev, ...newItems]);
      })
      .catch((error) => {
        console.error("Debug items creation error", error);
      });
  };

  // Pagination Logic
  const itemsPerPage = 5;
  const filteredMenuItems = useMemo(
    () =>
      menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [menuItems, searchTerm]
  );

  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);
  const paginatedMenuItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMenuItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMenuItems, currentPage]);

  // Handlers
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleOpenCreateModal = () => {
    setSelectedMenuItem(null);
    setIsEditing(false);
    setFormData({
      name: "",
      description: null, // Changed from "" to null
      price: 0,
      status: "active",
    });
    onOpen();
  };

  const handleOpenEditModal = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsEditing(true);
    setFormData({
      name: menuItem.name,
      description: menuItem.description, // Already string | null
      price: menuItem.price,
      status: menuItem.status || "active",
    });
    onOpen();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? parseFloat(value) || 0
          : name === "description"
            ? value || null // Convert empty string to null
            : value,
    }));
  };

  const handleStatusChange = (isChecked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      status: isChecked ? "active" : "inactive",
    }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateMenuItem();
    } else {
      createMenuItem();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Menu Items Management</h1>
            <div className="flex items-center space-x-2">
              <Switch
                isSelected={debugMode}
                onValueChange={setDebugMode}
                size="sm"
              />
              <span className="text-sm">Debug Mode</span>
            </div>
          </div>

          <div className="flex mb-4 space-x-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search menu items..."
              className="flex-grow"
            />
            <Button onPress={handleSearch}>Search</Button>
            <Button color="primary" onPress={handleOpenCreateModal}>
              Add Item
            </Button>
            {debugMode && (
              <Button color="secondary" onPress={addDebugMenuItems}>
                Add Debug Items
              </Button>
            )}
          </div>

          {isLoading ? (
            <Card className="w-full space-y-5 p-4" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Description</TableColumn>
                  <TableColumn>Price</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {paginatedMenuItems.length > 0 ? (
                    paginatedMenuItems.map((item) => (
                      <TableRow key={item.menu_item_id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.description || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip color="success">
                            ₱
                            {typeof item.price === "number"
                              ? item.price.toFixed(2)
                              : Number(item.price).toFixed(2)}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={
                              item.status === "active" ? "primary" : "default"
                            }
                          >
                            {item.status || "active"}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onPress={() => handleOpenEditModal(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              onPress={() =>
                                item.menu_item_id &&
                                deleteMenuItem(item.menu_item_id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        {searchTerm
                          ? "No menu items match your search"
                          : "No menu items found. Add some!"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredMenuItems.length > itemsPerPage && (
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                  className="mt-4"
                />
              )}
            </>
          )}
        </div>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Item name"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description || ""} // Handle null when displaying
                      onChange={handleInputChange}
                      placeholder="Item description"
                      maxLength={400}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price (₱)
                    </label>
                    <Input
                      name="price"
                      type="number"
                      value={
                        formData.price != null ? formData.price.toString() : ""
                      }
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      max="9999.99" // Max DECIMAL(10,2) can store
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      isSelected={formData.status === "active"}
                      onValueChange={handleStatusChange}
                    />
                    <span>Active</span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isDisabled={!formData.name || formData.price <= 0}
                >
                  {isEditing ? "Update" : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
