"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProducts } from '@/hooks/use-products.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Product } from '@/lib/types';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  imageHint: z.string().min(2, 'Image hint must be at least 2 characters.').max(30, 'Image hint must be less than 30 characters.'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative.'),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onFinished: () => void;
}

export function ProductForm({ product, onFinished }: ProductFormProps) {
  const { addProduct, updateProduct } = useProducts();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      imageHint: '',
      stock: 0,
    },
  });
  
  useEffect(() => {
    if (product) {
      form.reset(product);
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        imageHint: '',
        stock: 0,
      });
    }
  }, [product, form]);

  const onSubmit = async (data: ProductFormValues) => {
    if (product) {
      await updateProduct({ ...product, ...data });
      toast({ title: "Product Updated", description: `${data.name} has been successfully updated.` });
    } else {
      await addProduct(data);
      toast({ title: "Product Added", description: `${data.name} has been successfully added.` });
    }
    onFinished();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Modern Chair" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description of the product." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="299.99" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Items in Stock</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                       <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => form.setValue('stock', field.value - 1)}
                        disabled={field.value <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        className="h-8 text-center w-16"
                      />
                       <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => form.setValue('stock', field.value + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://picsum.photos/seed/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Hint</FormLabel>
              <FormControl>
                <Input placeholder="modern chair" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : (product ? 'Save Changes' : 'Create Product')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
