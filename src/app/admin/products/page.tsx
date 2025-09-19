
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProducts } from '@/hooks/use-products.tsx';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from '@/components/ProductForm';
import { Product } from '@/lib/types';
import { Edit, PlusCircle, Trash2, CheckCircle, XCircle, PackageOpen, MoreVertical } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSearchParams } from 'next/navigation';

export default function AdminProductsPage() {
  const { products, deleteProduct, getProductById } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit_id');

  useEffect(() => {
    if (editId) {
      const productToEdit = getProductById(editId);
      if (productToEdit) {
        handleEdit(productToEdit);
      }
    }
  }, [editId, getProductById]);
  
  const handleAddNew = () => {
    setEditingProduct(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onFinished={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      data-ai-hint={product.imageHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <p className="font-mono text-xs text-muted-foreground" title={product.id}>{product.id}</p>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{product.audience}</Badge></TableCell>
                  <TableCell>
                    {product.hasDiscount && product.originalPrice ? (
                        <div className="flex flex-col">
                            <span className="text-destructive font-semibold">₹{product.price.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
                        </div>
                    ) : (
                        `₹${product.price.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {product.featured ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product "{product.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <PackageOpen className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Empty Inventory</h3>
                    <p className="text-muted-foreground">No products have been added yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Mobile Cards */}
       <div className="md:hidden grid gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                        data-ai-hint={product.imageHint}
                      />
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="font-mono text-xs text-muted-foreground pt-1" title={product.id}>{product.id}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge variant="outline">{product.audience}</Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                           </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the product "{product.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                 <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                       {product.hasDiscount && product.originalPrice ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-destructive font-semibold text-base">₹{product.price.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
                            </div>
                        ) : (
                            <p className="font-medium">₹{product.price.toFixed(2)}</p>
                        )}
                    </div>
                     <div>
                      <p className="text-muted-foreground">Stock</p>
                      <p className="font-medium">{product.stock}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Featured</p>
                       {product.featured ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                 </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center gap-4 text-center p-8 border-2 border-dashed rounded-lg">
            <PackageOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Empty Inventory</h3>
            <p className="text-muted-foreground">No products have been added yet.</p>
          </div>
        )}
       </div>

    </div>
  );
}
