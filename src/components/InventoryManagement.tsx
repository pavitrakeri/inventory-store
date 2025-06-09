
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Warehouse, Plus, AlertTriangle } from "lucide-react";

interface InventoryItem {
  id: string;
  itemName: string;
  quantity: number;
  minStockLevel: number;
  location: string;
  lastUpdated: string;
}

const InventoryManagement = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    minStockLevel: "",
    location: ""
  });

  const locations = ["Warehouse A", "Warehouse B", "Store Front", "Back Office", "Display Area"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.quantity || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newInventoryItem: InventoryItem = {
      id: Date.now().toString(),
      itemName: formData.itemName,
      quantity: parseInt(formData.quantity),
      minStockLevel: parseInt(formData.minStockLevel) || 5,
      location: formData.location,
      lastUpdated: new Date().toLocaleString()
    };

    setInventory([...inventory, newInventoryItem]);
    setFormData({ itemName: "", quantity: "", minStockLevel: "", location: "" });
    toast.success("Inventory item added successfully!");
  };

  const handleUpdateStock = (id: string, newQuantity: number) => {
    setInventory(inventory.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, lastUpdated: new Date().toLocaleString() }
        : item
    ));
    toast.success("Stock quantity updated!");
  };

  const handleDelete = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
    toast.success("Inventory item deleted!");
  };

  const isLowStock = (item: InventoryItem) => item.quantity <= item.minStockLevel;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Inventory Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name *</Label>
              <Input
                id="itemName"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
              <Input
                id="minStockLevel"
                type="number"
                value={formData.minStockLevel}
                onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                <Warehouse className="h-4 w-4 mr-2" />
                Add to Inventory
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview ({inventory.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No inventory items added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Item Name</th>
                    <th className="border border-border p-3 text-left">Quantity</th>
                    <th className="border border-border p-3 text-left">Min Stock</th>
                    <th className="border border-border p-3 text-left">Location</th>
                    <th className="border border-border p-3 text-left">Status</th>
                    <th className="border border-border p-3 text-left">Last Updated</th>
                    <th className="border border-border p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className={`hover:bg-muted/50 ${isLowStock(item) ? 'bg-red-50' : ''}`}>
                      <td className="border border-border p-3">{item.itemName}</td>
                      <td className="border border-border p-3">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateStock(item.id, parseInt(e.target.value))}
                          className="w-20"
                        />
                      </td>
                      <td className="border border-border p-3">{item.minStockLevel}</td>
                      <td className="border border-border p-3">{item.location}</td>
                      <td className="border border-border p-3">
                        {isLowStock(item) ? (
                          <span className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-green-600">In Stock</span>
                        )}
                      </td>
                      <td className="border border-border p-3 text-sm">{item.lastUpdated}</td>
                      <td className="border border-border p-3">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
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

export default InventoryManagement;
