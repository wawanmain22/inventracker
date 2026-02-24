import { Activity, AlertTriangle, ArrowDownCircle, ArrowUpCircle, Package, Tags, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { Product, Transaction, User } from '@/types';

type Stats = {
    totalProducts: number;
    totalCategories: number;
    lowStockProducts: number;
    totalTransactions: number;
};

type MonthlySummary = {
    month: string;
    total_in: number;
    total_out: number;
};

type DashboardProps = {
    stats: Stats;
    recentTransactions: (Transaction & { product: Product; user: User })[];
    lowStockItems: (Product & { category: { name: string } })[];
    monthlySummary: MonthlySummary[];
};

export default function Dashboard({ stats, recentTransactions, lowStockItems }: DashboardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6 lg:space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
                    <p className="text-sm text-gray-500 sm:text-base">Selamat datang kembali! Berikut ringkasan inventaris Anda hari ini.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                    {/* Total Produk */}
                    <Card className="relative overflow-hidden border-0 shadow-lg shadow-blue-500/5 transition-shadow duration-300 hover:shadow-xl">
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">Total Produk</CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 sm:h-10 sm:w-10 sm:rounded-xl">
                                <Package className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-bold text-gray-900 sm:text-3xl">{stats.totalProducts}</div>
                            <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">produk terdaftar</p>
                        </CardContent>
                    </Card>

                    {/* Total Kategori */}
                    <Card className="relative overflow-hidden border-0 shadow-lg shadow-purple-500/5 transition-shadow duration-300 hover:shadow-xl">
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">Total Kategori</CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 sm:h-10 sm:w-10 sm:rounded-xl">
                                <Tags className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-bold text-gray-900 sm:text-3xl">{stats.totalCategories}</div>
                            <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">kategori aktif</p>
                        </CardContent>
                    </Card>

                    {/* Stok Menipis */}
                    <Card className="relative overflow-hidden border-0 shadow-lg shadow-orange-500/5 transition-shadow duration-300 hover:shadow-xl">
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-gradient-to-br from-orange-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">Stok Menipis</CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 sm:h-10 sm:w-10 sm:rounded-xl">
                                <AlertTriangle className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-bold text-orange-600 sm:text-3xl">{stats.lowStockProducts}</div>
                            <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">perlu restock</p>
                        </CardContent>
                    </Card>

                    {/* Total Transaksi */}
                    <Card className="relative overflow-hidden border-0 shadow-lg shadow-emerald-500/5 transition-shadow duration-300 hover:shadow-xl">
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">Total Transaksi</CardTitle>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 sm:h-10 sm:w-10 sm:rounded-xl">
                                <TrendingUp className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-2xl font-bold text-gray-900 sm:text-3xl">{stats.totalTransactions}</div>
                            <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">transaksi tercatat</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                    {/* Recent Transactions */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base lg:text-lg">Transaksi Terbaru</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">5 transaksi terakhir</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-0">
                            {recentTransactions.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Activity className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                    <p className="text-gray-500">Belum ada transaksi</p>
                                </div>
                            ) : (
                                <>
                                    {/* Mobile: Card-based view */}
                                    <div className="space-y-3 sm:hidden">
                                        {recentTransactions.map((transaction) => (
                                            <div key={transaction.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-semibold text-gray-900">{transaction.product.name}</p>
                                                        <p className="mt-1 text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        {transaction.type === 'in' ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                                <ArrowDownCircle className="h-3 w-3" />
                                                                Masuk
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                                                <ArrowUpCircle className="h-3 w-3" />
                                                                Keluar
                                                            </span>
                                                        )}
                                                        <span className="text-lg font-bold text-gray-900">{transaction.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop: Table view */}
                                    <div className="hidden sm:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                                    <TableHead className="font-semibold">Produk</TableHead>
                                                    <TableHead className="font-semibold">Tipe</TableHead>
                                                    <TableHead className="text-right font-semibold">Jumlah</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {recentTransactions.map((transaction) => (
                                                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{transaction.product.name}</p>
                                                                <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {transaction.type === 'in' ? (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                                    <ArrowDownCircle className="h-3.5 w-3.5" />
                                                                    Masuk
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                                                    <ArrowUpCircle className="h-3.5 w-3.5" />
                                                                    Keluar
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <span className="font-semibold text-gray-900">{transaction.quantity}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Low Stock Alert */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="border-b border-gray-100 bg-orange-50/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base lg:text-lg">Peringatan Stok</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Produk dengan stok di bawah 10 unit</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-0">
                            {lowStockItems.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Package className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                    <p className="text-gray-500">Semua stok dalam kondisi aman</p>
                                </div>
                            ) : (
                                <>
                                    {/* Mobile: Card-based view */}
                                    <div className="space-y-3 sm:hidden">
                                        {lowStockItems.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-semibold text-gray-900">{product.name}</p>
                                                    <p className="mt-0.5 text-xs text-gray-500">{product.category?.name || '-'}</p>
                                                </div>
                                                <Badge
                                                    className={
                                                        product.stock === 0
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-100'
                                                            : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                                                    }
                                                >
                                                    {product.stock}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop: Table view */}
                                    <div className="hidden sm:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                                    <TableHead className="font-semibold">Produk</TableHead>
                                                    <TableHead className="font-semibold">Kategori</TableHead>
                                                    <TableHead className="text-right font-semibold">Stok</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {lowStockItems.map((product) => (
                                                    <TableRow key={product.id} className="hover:bg-gray-50">
                                                        <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                                                        <TableCell>
                                                            <span className="text-gray-600">{product.category?.name || '-'}</span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge
                                                                className={
                                                                    product.stock === 0
                                                                        ? 'bg-red-100 text-red-700 hover:bg-red-100'
                                                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                                                                }
                                                            >
                                                                {product.stock}
                                                            </Badge>
                                                        </TableCell>
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
        </AppLayout>
    );
}
