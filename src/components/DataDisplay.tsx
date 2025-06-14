import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Package, Warehouse, ShoppingCart, Eye } from "lucide-react";

const API_BASE = "http://localhost:4000/api";

const DataDisplay = () => {
  const [items, setItems] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API_BASE}/items`).then(res => setItems(res.data));
    axios.get(`${API_BASE}/inventory`).then(res => setInventory(res.data));
    axios.get(`${API_BASE}/purchases`).then(res => setPurchases(res.data));
  }, []);

  const getStatusBadge = (status: string) => {
    const variant = status === "Low Stock" ? "destructive" : "default";
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{items.length}</div>
                <p className="text-xs text-muted-foreground">Items in catalog</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
                <Warehouse className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventory.length}</div>
                <p className="text-xs text-muted-foreground">
                  {inventory.filter(item => item.status === "Low Stock").length} low stock
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${purchases.reduce((sum, p) => sum + p.totalAmount, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">{purchases.length} transactions</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Items Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">ID</th>
                      <th className="border border-border p-3 text-left">Name</th>
                      <th className="border border-border p-3 text-left">Category</th>
                      <th className="border border-border p-3 text-left">Price</th>
                      <th className="border border-border p-3 text-left">Barcode</th>
                      <th className="border border-border p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="border border-border p-3">{item.id}</td>
                        <td className="border border-border p-3">{item.name}</td>
                        <td className="border border-border p-3">{item.category}</td>
                        <td className="border border-border p-3">${item.price}</td>
                        <td className="border border-border p-3">{item.barcode}</td>
                        <td className="border border-border p-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Inventory Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">ID</th>
                      <th className="border border-border p-3 text-left">Item</th>
                      <th className="border border-border p-3 text-left">Current Stock</th>
                      <th className="border border-border p-3 text-left">Min Stock</th>
                      <th className="border border-border p-3 text-left">Location</th>
                      <th className="border border-border p-3 text-left">Status</th>
                      <th className="border border-border p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="border border-border p-3">{item.id}</td>
                        <td className="border border-border p-3">{item.itemName}</td>
                        <td className="border border-border p-3">{item.quantity}</td>
                        <td className="border border-border p-3">{item.minStock}</td>
                        <td className="border border-border p-3">{item.location}</td>
                        <td className="border border-border p-3">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="border border-border p-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Update</Button>
                            <Button variant="destructive" size="sm">Remove</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase History & Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Purchase ID</th>
                        <th className="border border-border p-3 text-left">Customer</th>
                        <th className="border border-border p-3 text-left">Email</th>
                        <th className="border border-border p-3 text-left">Total Amount</th>
                        <th className="border border-border p-3 text-left">Payment Method</th>
                        <th className="border border-border p-3 text-left">Date</th>
                        <th className="border border-border p-3 text-left">Status</th>
                        <th className="border border-border p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase) => (
                        <tr key={purchase.id} className="hover:bg-muted/50">
                          <td className="border border-border p-3">{purchase.id}</td>
                          <td className="border border-border p-3">{purchase.customerName}</td>
                          <td className="border border-border p-3">{purchase.customerEmail}</td>
                          <td className="border border-border p-3">${purchase.totalAmount.toFixed(2)}</td>
                          <td className="border border-border p-3">{purchase.paymentMethod}</td>
                          <td className="border border-border p-3">{purchase.date}</td>
                          <td className="border border-border p-3">
                            <Badge variant="default">{purchase.status}</Badge>
                          </td>
                          <td className="border border-border p-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPurchase(selectedPurchase?.id === purchase.id ? null : purchase)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {selectedPurchase?.id === purchase.id ? 'Hide' : 'View'} Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedPurchase && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Purchase Details - ID: {selectedPurchase.id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold">Customer Information</h4>
                          <p>Name: {selectedPurchase.customerName}</p>
                          <p>Email: {selectedPurchase.customerEmail}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Purchase Information</h4>
                          <p>Date: {selectedPurchase.date}</p>
                          <p>Payment: {selectedPurchase.paymentMethod}</p>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold mb-2">Items Purchased</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border border-border p-2 text-left">Item</th>
                              <th className="border border-border p-2 text-left">Quantity</th>
                              <th className="border border-border p-2 text-left">Unit Price</th>
                              <th className="border border-border p-2 text-left">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPurchase.items.map((item: any, index: number) => (
                              <tr key={index} className="hover:bg-muted/50">
                                <td className="border border-border p-2">{item.itemName}</td>
                                <td className="border border-border p-2">{item.quantity}</td>
                                <td className="border border-border p-2">${item.price.toFixed(2)}</td>
                                <td className="border border-border p-2">${item.total.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-muted font-semibold">
                              <td colSpan={3} className="border border-border p-2 text-right">Total Amount:</td>
                              <td className="border border-border p-2">${selectedPurchase.totalAmount.toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataDisplay;
