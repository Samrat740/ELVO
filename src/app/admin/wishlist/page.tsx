
"use client";

import { useProducts } from "@/hooks/use-products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart as BarChartIcon, Heart, TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart } from "recharts";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const chartConfig = {
  count: {
    label: "Wishlist Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AdminWishlistPage() {
  const { products, loading } = useProducts();

  const wishlistedProducts = useMemo(() => {
    return products
      .filter((p) => (p.wishlistCount ?? 0) > 0)
      .sort((a, b) => (b.wishlistCount ?? 0) - (a.wishlistCount ?? 0));
  }, [products]);

  const totalWishlists = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.wishlistCount ?? 0), 0);
  }, [products]);

  const topProduct = wishlistedProducts[0];

  const chartData = useMemo(() => {
    return wishlistedProducts.slice(0, 10).map(p => ({
        name: p.name,
        count: p.wishlistCount
    })).reverse();
  }, [wishlistedProducts]);

  if (loading) {
    return <div className="container mx-auto py-12 px-4 text-center">Loading wishlist data...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Wishlist Insights</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wishlist Adds</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWishlists}</div>
            <p className="text-xs text-muted-foreground">Total times any product has been wishlisted.</p>
          </CardContent>
        </Card>
        {topProduct && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most Popular Product</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold truncate">{topProduct.name}</div>
                    <p className="text-xs text-muted-foreground">Wishlisted by {topProduct.wishlistCount} users.</p>
                </CardContent>
            </Card>
        )}
      </div>

       <Card className="mb-8">
            <CardHeader>
            <CardTitle>Top 10 Most Wishlisted Products</CardTitle>
            <CardDescription>
                A look at the products your customers are loving the most.
            </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 120 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="count" />
                      <YAxis 
                          dataKey="name" 
                          type="category" 
                          tickLine={false} 
                          axisLine={false}
                          tick={{ fontSize: 12 }}
                          width={200}
                      />
                      <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                  </BarChart>
              </ChartContainer>
                </div>
            </CardContent>
        </Card>


      <Card>
        <CardHeader>
          <CardTitle>All Wishlisted Products</CardTitle>
          <CardDescription>
            A detailed list of all products that have been wishlisted, sorted by popularity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Wishlist Count</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {wishlistedProducts.length > 0 ? (
                        wishlistedProducts.map((product) => (
                            <TableRow key={product.id}>
                            <TableCell>
                                <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="rounded-md object-cover"
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                <Link href={`/admin/products?edit_id=${product.id}`} className="hover:underline">
                                    {product.name}
                                </Link>
                            </TableCell>
                             <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                            <TableCell className="text-right font-bold text-lg">{product.wishlistCount}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No products have been wishlisted yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
