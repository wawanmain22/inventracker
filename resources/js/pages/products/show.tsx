import { Link } from '@inertiajs/react';
import { ArrowDownCircle, ArrowLeft, ArrowUpCircle, Edit, Package } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { Category, Product, Transaction, User } from '@/types';

type ProductsShowProps = {
    product: Product & {
        category: Category;
        transactions: (Transaction & { user: User })[];
    };
};

export default function ProductsShow({ product }: ProductsShowProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: '2-digit',
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
        return <Badge variant="secondary">{stock} unit</Badge>;
    };

    return (
        <AppLayout title={product.name}>
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Button variant="ghost" size="icon" asChild className="shrink-0">
                            <Link href="/products">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="min-w-0">
                            <h1 className="truncate text-xl font-bold sm:text-2xl lg:text-3xl">{product.name}</h1>
                            <p className="text-xs text-muted-foreground sm:text-sm">Detail produk</p>
                        </div>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href={`/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Produk
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    {/* Image Card - Shows first on mobile */}
                    <div className="order-first lg:order-last lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Gambar Produk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {product.image ? (
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={product.name}
                                        className="mx-auto aspect-square w-full max-w-[200px] rounded-lg object-cover sm:max-w-none"
                                    />
                                ) : (
                                    <div className="mx-auto flex aspect-square w-full max-w-[200px] flex-col items-center justify-center rounded-lg bg-muted sm:max-w-none">
                                        <Package className="h-12 w-12 text-muted-foreground sm:h-16 sm:w-16" />
                                        <p className="mt-2 text-sm text-muted-foreground">Tidak ada gambar</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info and Transactions */}
                    <div className="space-y-4 sm:space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Informasi Produk</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Kategori</p>
                                        <Badge variant="outline" className="mt-1">
                                            {product.category?.name || '-'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Stok</p>
                                        <div className="mt-1">{getStockBadge(product.stock)}</div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Harga</p>
                                        <p className="text-base font-bold sm:text-lg">{formatCurrency(product.price)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Total Nilai Stok</p>
                                        <p className="text-base font-bold sm:text-lg">{formatCurrency(product.price * product.stock)}</p>
                                    </div>
                                </div>

                                {product.description && (
                                    <div>
                                        <p className="text-xs text-muted-foreground sm:text-sm">Deskripsi</p>
                                        <p className="mt-1 text-sm sm:text-base">{product.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Riwayat Transaksi</CardTitle>
                                <CardDescription className="text-xs sm:text-sm">Semua transaksi untuk produk ini</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 sm:p-6">
                                {product.transactions.length === 0 ? (
                                    <p className="py-8 text-center text-muted-foreground">Belum ada transaksi</p>
                                ) : (
                                    <>
                                        {/* Mobile: Card-based view */}
                                        <div className="divide-y divide-gray-100 sm:hidden">
                                            {product.transactions.map((transaction) => (
                                                <div key={transaction.id} className="flex items-center justify-between p-4">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            {transaction.type === 'in' ? (
                                                                <Badge variant="outline" className="border-green-500 text-green-600">
                                                                    <ArrowDownCircle className="mr-1 h-3 w-3" />
                                                                    Masuk
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="border-red-500 text-red-600">
                                                                    <ArrowUpCircle className="mr-1 h-3 w-3" />
                                                                    Keluar
                                                                </Badge>
                                                            )}
                                                            <span className="font-semibold">{transaction.quantity}</span>
                                                        </div>
                                                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span>{formatDateShort(transaction.created_at)}</span>
                                                            <span>-</span>
                                                            <span>{transaction.user?.name || '-'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Desktop: Table view */}
                                        <div className="hidden sm:block">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Tanggal</TableHead>
                                                        <TableHead>Tipe</TableHead>
                                                        <TableHead className="text-right">Jumlah</TableHead>
                                                        <TableHead>Oleh</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {product.transactions.map((transaction) => (
                                                        <TableRow key={transaction.id}>
                                                            <TableCell>{formatDate(transaction.created_at)}</TableCell>
                                                            <TableCell>
                                                                {transaction.type === 'in' ? (
                                                                    <Badge variant="outline" className="border-green-500 text-green-600">
                                                                        <ArrowDownCircle className="mr-1 h-3 w-3" />
                                                                        Masuk
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="border-red-500 text-red-600">
                                                                        <ArrowUpCircle className="mr-1 h-3 w-3" />
                                                                        Keluar
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium">{transaction.quantity}</TableCell>
                                                            <TableCell>{transaction.user?.name || '-'}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
