import { Link, router } from '@inertiajs/react';
import { ArrowDownCircle, ArrowLeftRight, ArrowUpCircle, Filter, Plus, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Product, Transaction, User } from '@/types';

type TransactionsIndexProps = {
    transactions: PaginatedData<Transaction & { product: Product; user: User }>;
    products: Product[];
    filters: {
        type?: string;
        from_date?: string;
        to_date?: string;
        product?: string;
    };
};

export default function TransactionsIndex({ transactions, products, filters }: TransactionsIndexProps) {
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [productFilter, setProductFilter] = useState(filters.product || '');
    const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
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

    const handleFilter = () => {
        router.get(
            '/transactions',
            {
                type: typeFilter || undefined,
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
                product: productFilter || undefined,
            },
            { preserveState: true },
        );
    };

    const handleReset = () => {
        setTypeFilter('');
        setFromDate('');
        setToDate('');
        setProductFilter('');
        router.get('/transactions');
    };

    const handleDelete = () => {
        if (!deletingTransaction) return;

        router.delete(`/transactions/${deletingTransaction.id}`, {
            onSuccess: () => {
                setDeletingTransaction(null);
                toast.success('Transaksi berhasil dihapus');
            },
        });
    };

    return (
        <AppLayout title="Transaksi">
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Transaksi</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Kelola transaksi stok masuk dan keluar</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/transactions/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Transaksi
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
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Tipe</Label>
                                <Select value={typeFilter || 'all'} onValueChange={(v) => setTypeFilter(v === 'all' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tipe</SelectItem>
                                        <SelectItem value="in">Stok Masuk</SelectItem>
                                        <SelectItem value="out">Stok Keluar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Dari Tanggal</Label>
                                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Sampai Tanggal</Label>
                                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Produk</Label>
                                <Select value={productFilter || 'all'} onValueChange={(v) => setProductFilter(v === 'all' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Produk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Produk</SelectItem>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={String(product.id)}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={handleFilter} className="flex-1">
                                    Filter
                                </Button>
                                <Button variant="outline" onClick={handleReset} className="flex-1 lg:flex-initial">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Daftar Transaksi</CardTitle>
                        <CardDescription>Total {transactions.total} transaksi</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                        {/* Mobile: Card-based view */}
                        <div className="space-y-3 sm:hidden">
                            {transactions.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <ArrowLeftRight className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                                    <p className="text-muted-foreground">Tidak ada transaksi ditemukan</p>
                                </div>
                            ) : (
                                transactions.data.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    {transaction.type === 'in' ? (
                                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                                            <ArrowDownCircle className="mr-1 h-3 w-3" />
                                                            Masuk
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                                            <ArrowUpCircle className="mr-1 h-3 w-3" />
                                                            Keluar
                                                        </Badge>
                                                    )}
                                                    <span className="text-lg font-bold">{transaction.quantity}</span>
                                                </div>
                                                <Link
                                                    href={`/products/${transaction.product_id}`}
                                                    className="mt-2 block truncate text-base font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                                                >
                                                    {transaction.product?.name || '-'}
                                                </Link>
                                                {transaction.product?.category && (
                                                    <Badge variant="secondary" className="mt-1.5">
                                                        {transaction.product.category.name}
                                                    </Badge>
                                                )}
                                                {transaction.notes && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{transaction.notes}</p>}
                                                <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-muted-foreground">
                                                    <span>{formatDateShort(transaction.created_at)}</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span>{transaction.user?.name || '-'}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeletingTransaction(transaction)}
                                                className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                        <TableHead>Catatan</TableHead>
                                        <TableHead>Oleh</TableHead>
                                        <TableHead className="w-[80px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                                <ArrowLeftRight className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                                                Tidak ada transaksi ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.data.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="whitespace-nowrap">{formatDate(transaction.created_at)}</TableCell>
                                                <TableCell>
                                                    <Link href={`/products/${transaction.product_id}`} className="font-medium hover:underline">
                                                        {transaction.product?.name || '-'}
                                                    </Link>
                                                </TableCell>
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
                                                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                                    {transaction.notes || '-'}
                                                </TableCell>
                                                <TableCell>{transaction.user?.name || '-'}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeletingTransaction(transaction)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {transactions.last_page > 1 && (
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-1 px-4 pb-4 sm:gap-2 sm:px-0 sm:pb-0">
                                {transactions.links.map((link, index) => (
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
            <AlertDialog open={!!deletingTransaction} onOpenChange={(open) => !open && setDeletingTransaction(null)}>
                <AlertDialogContent className="mx-4 max-w-md sm:mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus transaksi ini? Stok produk akan dikembalikan ke kondisi sebelumnya. Tindakan ini tidak
                            dapat dibatalkan.
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
