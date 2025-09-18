
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
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ImageUp, Minus, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from './ui/switch';
import { Card, CardContent } from './ui/card';
import Image from 'next/image';

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0.'),
  imageFile: z.any()
    .refine((files) => {
        if (files && files.length > 0) {
            return files[0].size <= 5000000;
        }
        return true;
    }, `Max file size is 5MB.`)
    .refine(
      (files) => {
          if (files && files.length > 0) {
            return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
          }
          return true;
      },
      ".jpg, .jpeg, .png and .webp files are accepted."
    ).optional(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative.'),
  category: z.enum(['Backpack', 'Handbags', 'Accessory']),
  audience: z.enum(['For Him', 'For Her']),
  featured: z.boolean(),
});

type ProductFormValues = Omit<z.infer<typeof productSchema>, 'imageFile'> & { imageUrl?: string, imageFile?: FileList };

interface ProductFormProps {
  product?: Product;
  onFinished: () => void;
}

const defaultValues: ProductFormValues = {
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  stock: 0,
  category: 'Handbags' as const,
  audience: 'For Her' as const,
  featured: false,
};

export function ProductForm({ product, onFinished }: ProductFormProps) {
  const { addProduct, updateProduct } = useProducts();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? { ...defaultValues, ...product } : defaultValues,
  });

  const imageFile = form.watch('imageFile');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (product?.imageUrl) {
        setImagePreview(product.imageUrl);
    } else {
        setImagePreview(null);
    }
  }, [imageFile, product]);
  
  useEffect(() => {
    const resetValues = product ? { ...defaultValues, ...product } : defaultValues;
    form.reset({ ...resetValues, imageFile: undefined });
    setImagePreview(product?.imageUrl || null);
  }, [product, form]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
        const productDataToSave = { ...data, imageUrl: imagePreview || '' };
        if (product) {
          await updateProduct(product.id, productDataToSave);
          toast({ title: "Product Updated", description: `${data.name} has been successfully updated.` });
        } else {
          await addProduct(productDataToSave);
          toast({ title: "Product Added", description: `${data.name} has been successfully added.` });
        }
        onFinished();
    } catch (error) {
        console.error("Failed to save product:", error);
        toast({ variant: 'destructive', title: "Save Failed", description: "There was a problem saving the product." });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
             <Card className="bg-muted/50">
                <CardContent className="p-4">
                <FormField
                    control={form.control}
                    name="imageFile"
                    render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl>
                            <div className="w-full">
                                {imagePreview ? (
                                    <div className="relative aspect-square w-full rounded-md overflow-hidden">
                                        <Image src={imagePreview} alt="Product preview" fill className="object-cover"/>
                                        <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7" onClick={() => {
                                            form.setValue('imageFile', undefined);
                                            setImagePreview(null);
                                        }}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <ImageUp className="w-8 h-8 mb-4 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG, up to 5MB</p>
                                        </div>
                                        <Input 
                                            type="file" 
                                            className="hidden" 
                                            accept={ACCEPTED_IMAGE_TYPES.join(",")} 
                                            onChange={(e) => onChange(e.target.files)}
                                            {...rest}
                                        />
                                    </label>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. The Minimalist Tote" {...field} />
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
                    <FormLabel>Price (₹)</FormLabel>
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
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                        <div className="flex items-center gap-2">
                            <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 shrink-0"
                            onClick={() => form.setValue('stock', Math.max(0, (Number(field.value) || 0) - 1))}
                            disabled={field.value <= 0}
                            >
                            <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                            {...field}
                            type="number"
                            min="0"
                            className="h-9 text-center w-full"
                            />
                            <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 shrink-0"
                            onClick={() => form.setValue('stock', (Number(field.value) || 0) + 1)}
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
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Backpack">Backpack</SelectItem>
                        <SelectItem value="Handbags">Handbags</SelectItem>
                        <SelectItem value="Accessory">Accessory</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Audience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an audience" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="For Him">For Him</SelectItem>
                        <SelectItem value="For Her">For Her</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                    <FormLabel>Featured Product</FormLabel>
                    <FormMessage />
                    </div>
                    <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                </FormItem>
                )}
            />
          </div>
        </div>
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : (product ? 'Save Changes' : 'Create Product')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
