
"use client";

import { useWishlist } from "@/hooks/use-wishlist";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Star, Users } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminWishlistPage() {
  const { mostWishedFor, loading } = useWishlist();
  const router = useRouter();

  if (loading) {
    return <div className="p-8">Loading most wanted products...</div>;
  }
  
  const handleRowClick = (productId: string) => {
    router.push(`/admin/products?edit_id=${productId}`);
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Most Wanted Products</h1>
      </div>
      
       {mostWishedFor.length === 0 ? (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No Wishlisted Products Yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">When customers start adding items to their wishlist, you'll see the most popular ones here.</p>
        </div>
       ) : (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-lg border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Wishlisted By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mostWishedFor.map((item) => (
                    <TableRow key={item.productId} onClick={() => handleRowClick(item.productId)} className="cursor-pointer">
                        <TableCell>
                        <Image
                            src={item.productDetails.imageUrl}
                            alt={item.productDetails.name}
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
                        />
                        </TableCell>
                        <TableCell className="font-medium">{item.productDetails.name}</TableCell>
                        <TableCell><Badge variant="secondary">{item.productDetails.category}</Badge></TableCell>
                        <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{item.wishlistCount}</span>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            {/* Mobile Cards */}
            <div className="md:hidden grid gap-4">
                {mostWishedFor.map((item, index) => (
                    <Card key={item.productId} onClick={() => handleRowClick(item.productId)} className="cursor-pointer">
                        <CardHeader className="flex flex-row items-center gap-4">
                             <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-lg">
                                {index + 1}
                            </div>
                            <Image
                                src={item.productDetails.imageUrl}
                                alt={item.productDetails.name}
                                width={80}
                                height={80}
                                className="rounded-md object-cover"
                            />
                             <div>
                                <CardTitle className="text-lg">{item.productDetails.name}</CardTitle>
                                <Badge variant="secondary" className="mt-1">{item.productDetails.category}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center justify-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <span className="font-bold">{item.wishlistCount}</span>
                                <span className="text-muted-foreground">customers want this</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
       )}
    </div>
  );
}
