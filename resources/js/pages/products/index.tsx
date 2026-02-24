import { Link, router } from '@inertiajs/react';
import { Edit, Eye, Filter, MoreHorizontal, Package, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { Category, PaginatedData, Product } from '@/types';

type ProductsIndexProps = {
    products: PaginatedData<Product & { category: Category }>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        stock?: string;
    };
};

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [stockFilter, setStockFilter] = useState(filters.stock || '');
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleFilter = () => {
        router.get(
            '/products',
            {
                search: search || undefined,
                category: categoryFilter || undefined,
                stock: stockFilter || undefined,
            },
            { preserveState: true },
        );
    };

    const handleReset = () => {
        setSearch('');
        setCategoryFilter('');
        setStockFilter('');
        router.get('/products');
    };

    const handleDelete = () => {
        if (!deletingProduct) return;

        router.delete(`/products/${deletingProduct.id}`, {
            onSuccess: () => {
                setDeletingProduct(null);
                toast.success('Produk berhasil dihapus');
            },
        });
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return <Badge variant="destructive">Habis</Badge>;
        } else if (stock <= 10) {
            return (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Menipis ({stock})
                </Badge>
            );
        }
        return <Badge variant="secondary">{stock}</Badge>;
    };

    return (
        <AppLayout title="Produk">
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Produk</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Kelola data produk inventaris</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Produk
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Filter className="h-4 w-4" />
                            Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                            <div className="w-full sm:min-w-[200px] sm:flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari produk..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                                <Select value={categoryFilter || 'all'} onValueChange={(v) => setCategoryFilter(v === 'all' ? '' : v)}>
                                    <SelectTrigger className="w-full sm:w-[160px]">
                                        <SelectValue placeholder="Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={stockFilter || 'all'} onValueChange={(v) => setStockFilter(v === 'all' ? '' : v)}>
                                    <SelectTrigger className="w-full sm:w-[160px]">
                                        <SelectValue placeholder="Stok" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Stok</SelectItem>
                                        <SelectItem value="available">Tersedia (&gt;10)</SelectItem>
                                        <SelectItem value="low">Menipis (1-10)</SelectItem>
                                        <SelectItem value="out">Habis (0)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleFilter} className="flex-1 sm:flex-initial">
                                    Filter
                                </Button>
                                <Button variant="outline" onClick={handleReset} className="flex-1 sm:flex-initial">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Daftar Produk</CardTitle>
                        <CardDescription>Total {products.total} produk</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        {/* Mobile: Card-based view */}
                        <div className="divide-y divide-gray-100 sm:hidden">
                            {products.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Package className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                                    <p className="text-muted-foreground">Tidak ada produk ditemukan</p>
                                </div>
                            ) : (
                                products.data.map((product) => (
                                    <div key={product.id} className="p-4">
                                        <div className="flex gap-3">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/${product.image}`}
                                                    alt={product.name}
                                                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-medium">{product.name}</p>
                                                        <Badge variant="outline" className="mt-1">
                                                            {product.category?.name || '-'}
                                                        </Badge>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="-mt-1 -mr-2">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/products/${product.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/products/${product.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingProduct(product)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="font-semibold text-blue-600">{formatCurrency(product.price)}</span>
                                                    {getStockBadge(product.stock)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop: Table view */}
                        <div className="hidden sm:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="text-center">Stok</TableHead>
                                        <TableHead className="text-right">Harga</TableHead>
                                        <TableHead className="w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                                <Package className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                                                Tidak ada produk ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.data.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {product.image ? (
                                                            <img
                                                                src={`/storage/${product.image}`}
                                                                alt={product.name}
                                                                className="h-10 w-10 rounded object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                                                                <Package className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{product.name}</p>
                                                            {product.description && (
                                                                <p className="line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{product.category?.name || '-'}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center">{getStockBadge(product.stock)}</TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(product.price)}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/products/${product.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/products/${product.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingProduct(product)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-1 px-4 pb-4 sm:gap-2 sm:px-0 sm:pb-0">
                                {products.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="h-8 min-w-[32px] px-2 text-xs sm:h-9 sm:min-w-[36px] sm:px-3 sm:text-sm"
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
                <AlertDialogContent className="mx-4 max-w-md sm:mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus produk "{deletingProduct?.name}"? Semua transaksi terkait juga akan terhapus. Tindakan
                            ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                        <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:w-auto"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
