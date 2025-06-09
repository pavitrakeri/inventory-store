
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Warehouse, Plus } from "lucide-react";
import ItemManagement from "@/components/ItemManagement";
import InventoryManagement from "@/components/InventoryManagement";
import PurchaseManagement from "@/components/PurchaseManagement";
import DataDisplay from "@/components/DataDisplay";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">QuickShop Management</h1>
          <p className="text-muted-foreground">Manage your store inventory, items, and sales transactions</p>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Warehouse className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Purchases
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              View All Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Item Management</CardTitle>
                <CardDescription>Add new items and manage existing ones</CardDescription>
              </CardHeader>
              <CardContent>
                <ItemManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Manage stock levels and inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Management</CardTitle>
                <CardDescription>Process sales and manage customer purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <PurchaseManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Overview</CardTitle>
                <CardDescription>View and manage all store data with full CRUD operations</CardDescription>
              </CardHeader>
              <CardContent>
                <DataDisplay />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
