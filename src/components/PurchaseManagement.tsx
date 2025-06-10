import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShoppingCart, Plus, Trash2, User } from "lucide-react";

interface PurchaseItem {
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Purchase {
  id: string;
  customerName: string;
  customerEmail: string;
  items: PurchaseItem[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  purchaseDate: string;
  status: string;
}

const API_BASE = "http://localhost:4000/api";

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentPurchase, setCurrentPurchase] = useState<PurchaseItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    shippingAddress: "",
    paymentMethod: ""
  });
  const [newItem, setNewItem] = useState({
    itemName: "",
    quantity: "",
    price: ""
  });

  const paymentMethods = ["Cash", "Credit Card", "Debit Card", "Digital Wallet", "Bank Transfer"];
  const availableItems = ["Laptop", "Mouse", "Keyboard", "Monitor", "Headphones", "Smartphone", "Tablet"];

  useEffect(() => {
    axios.get(`${API_BASE}/purchases`).then(res => setPurchases(res.data));
  }, []);

  const addItemToPurchase = () => {
    if (!newItem.itemName || !newItem.quantity || !newItem.price) {
      toast.error("Please fill in all item details");
      return;
    }

    const quantity = parseInt(newItem.quantity);
    const price = parseFloat(newItem.price);
    const total = quantity * price;

    const purchaseItem: PurchaseItem = {
      itemName: newItem.itemName,
      quantity,
      price,
      total
    };

    setCurrentPurchase([...currentPurchase, purchaseItem]);
    setNewItem({ itemName: "", quantity: "", price: "" });
    toast.success("Item added to purchase!");
  };

  const removeItemFromPurchase = (index: number) => {
    setCurrentPurchase(currentPurchase.filter((_, i) => i !== index));
    toast.success("Item removed from purchase!");
  };

  const calculateTotal = () => {
    return currentPurchase.reduce((sum, item) => sum + item.total, 0);
  };

  const completePurchase = () => {
    if (!customerInfo.name || !customerInfo.email || currentPurchase.length === 0) {
      toast.error("Please fill in customer information and add at least one item");
      return;
    }

    const purchase: Purchase = {
      id: Date.now().toString(),
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      items: [...currentPurchase],
      totalAmount: calculateTotal(),
      paymentMethod: customerInfo.paymentMethod || "Cash",
      shippingAddress: customerInfo.shippingAddress,
      purchaseDate: new Date().toLocaleString(),
      status: "Completed"
    };

    setPurchases([...purchases, purchase]);
    setCurrentPurchase([]);
    setCustomerInfo({ name: "", email: "", shippingAddress: "", paymentMethod: "" });
    toast.success("Purchase completed successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={customerInfo.paymentMethod} onValueChange={(value) => setCustomerInfo({ ...customerInfo, paymentMethod: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress">Shipping Address</Label>
              <Input
                id="shippingAddress"
                value={customerInfo.shippingAddress}
                onChange={(e) => setCustomerInfo({ ...customerInfo, shippingAddress: e.target.value })}
                placeholder="Enter shipping address"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Items to Purchase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemSelect">Select Item</Label>
              <Select value={newItem.itemName} onValueChange={(value) => setNewItem({ ...newItem, itemName: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemPrice">Price ($)</Label>
                <Input
                  id="itemPrice"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <Button onClick={addItemToPurchase} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Purchase ({currentPurchase.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          {currentPurchase.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No items added to purchase yet</p>
          ) : (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Item</th>
                      <th className="border border-border p-3 text-left">Quantity</th>
                      <th className="border border-border p-3 text-left">Price</th>
                      <th className="border border-border p-3 text-left">Total</th>
                      <th className="border border-border p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPurchase.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="border border-border p-3">{item.itemName}</td>
                        <td className="border border-border p-3">{item.quantity}</td>
                        <td className="border border-border p-3">${item.price.toFixed(2)}</td>
                        <td className="border border-border p-3">${item.total.toFixed(2)}</td>
                        <td className="border border-border p-3">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItemFromPurchase(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center border-t pt-4">
                <div className="text-lg font-semibold">
                  Total: ${calculateTotal().toFixed(2)}
                </div>
                <Button onClick={completePurchase} size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Complete Purchase
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Purchases ({purchases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No purchases completed yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Purchase ID</th>
                    <th className="border border-border p-3 text-left">Customer</th>
                    <th className="border border-border p-3 text-left">Items</th>
                    <th className="border border-border p-3 text-left">Total</th>
                    <th className="border border-border p-3 text-left">Payment</th>
                    <th className="border border-border p-3 text-left">Date</th>
                    <th className="border border-border p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-muted/50">
                      <td className="border border-border p-3">{purchase.id}</td>
                      <td className="border border-border p-3">{purchase.customerName}</td>
                      <td className="border border-border p-3">{purchase.items.length} items</td>
                      <td className="border border-border p-3">${purchase.totalAmount.toFixed(2)}</td>
                      <td className="border border-border p-3">{purchase.paymentMethod}</td>
                      <td className="border border-border p-3">{purchase.purchaseDate}</td>
                      <td className="border border-border p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseManagement;
