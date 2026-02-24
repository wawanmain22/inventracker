import { router } from '@inertiajs/react';
import { ArrowDownCircle, ArrowUpCircle, Download, FileText, Filter } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { ActivityLog, PaginatedData, Product, Transaction, User } from '@/types';

type ReportsIndexProps = {
    transactions: PaginatedData<Transaction & { product: Product & { category: { name: string } }; user: User }>;
    summary: {
        total_in: number;
        total_out: number;
        transaction_count: number;
    };
    activityLogs: (ActivityLog & { user: User })[];
    filters: {
        from_date?: string;
        to_date?: string;
        type?: string;
    };
};

export default function ReportsIndex({ transactions, summary, activityLogs, filters }: ReportsIndexProps) {
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');

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
            '/reports',
            {
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
                type: typeFilter || undefined,
            },
            { preserveState: true },
        );
    };

    const handleReset = () => {
        setFromDate('');
        setToDate('');
        setTypeFilter('');
        router.get('/reports');
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        if (typeFilter) params.append('type', typeFilter);

        window.location.href = `/reports/export?${params.toString()}`;
    };

    return (
        <AppLayout title="Laporan">
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Laporan</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Laporan transaksi dan aktivitas sistem</p>
                    </div>
                    <Button onClick={handleExport} className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Filter className="h-4 w-4" />
                            Filter Laporan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Dari Tanggal</Label>
                                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Sampai Tanggal</Label>
                                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs sm:text-sm">Tipe Transaksi</Label>
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
                            <div className="flex items-end gap-2">
                                <Button onClick={handleFilter} className="flex-1">
                                    Filter
                                </Button>
                                <Button variant="outline" onClick={handleReset} className="flex-1 md:flex-initial">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium sm:text-sm">Stok Masuk</CardTitle>
                            <ArrowDownCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-lg font-bold text-green-600 sm:text-2xl">{summary.total_in.toLocaleString()}</div>
                            <p className="text-[10px] text-muted-foreground sm:text-xs">unit produk</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium sm:text-sm">Stok Keluar</CardTitle>
                            <ArrowUpCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-lg font-bold text-red-600 sm:text-2xl">{summary.total_out.toLocaleString()}</div>
                            <p className="text-[10px] text-muted-foreground sm:text-xs">unit produk</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium sm:text-sm">Transaksi</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-lg font-bold sm:text-2xl">{summary.transaction_count.toLocaleString()}</div>
                            <p className="text-[10px] text-muted-foreground sm:text-xs">tercatat</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Daftar Transaksi</CardTitle>
                        <CardDescription>Total {transactions.total} transaksi</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                        {/* Mobile: Card-based view */}
                        <div className="space-y-3 sm:hidden">
                            {transactions.data.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">Tidak ada transaksi ditemukan</div>
                            ) : (
                                transactions.data.map((transaction) => (
                                    <div key={transaction.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
                                                <p className="mt-2 truncate text-base font-semibold text-gray-900">
                                                    {transaction.product?.name || '-'}
                                                </p>
                                                <Badge variant="secondary" className="mt-1.5">
                                                    {transaction.product?.category?.name || '-'}
                                                </Badge>
                                                <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-muted-foreground">
                                                    <span>{formatDateShort(transaction.created_at)}</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span>{transaction.user?.name || '-'}</span>
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
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                        <TableHead>Oleh</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                                Tidak ada transaksi ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.data.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="whitespace-nowrap">{formatDate(transaction.created_at)}</TableCell>
                                                <TableCell className="font-medium">{transaction.product?.name || '-'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{transaction.product?.category?.name || '-'}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.type === 'in' ? (
                                                        <Badge variant="outline" className="border-green-500 text-green-600">
                                                            Masuk
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-red-500 text-red-600">
                                                            Keluar
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">{transaction.quantity}</TableCell>
                                                <TableCell>{transaction.user?.name || '-'}</TableCell>
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

                {/* Activity Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Log Aktivitas Terbaru</CardTitle>
                        <CardDescription>10 aktivitas terakhir di sistem</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                        {activityLogs.length === 0 ? (
                            <p className="py-4 text-center text-muted-foreground">Belum ada aktivitas</p>
                        ) : (
                            <>
                                {/* Mobile: Card-based view */}
                                <div className="space-y-3 sm:hidden">
                                    {activityLogs.map((log) => (
                                        <div key={log.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{log.description}</p>
                                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                                        oleh {log.user?.name || 'Unknown'} - {formatDate(log.created_at)}
                                                    </p>
                                                </div>
                                                <Badge
                                                    className={
                                                        log.action === 'create'
                                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                            : log.action === 'update'
                                                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                                              : 'bg-red-100 text-red-700 hover:bg-red-100'
                                                    }
                                                >
                                                    {log.action === 'create' && 'Buat'}
                                                    {log.action === 'update' && 'Ubah'}
                                                    {log.action === 'delete' && 'Hapus'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop: List view */}
                                <div className="hidden divide-y divide-gray-100 sm:block">
                                    {activityLogs.map((log) => (
                                        <div key={log.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium">{log.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    oleh {log.user?.name || 'Unknown'} - {formatDate(log.created_at)}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="shrink-0 text-xs">
                                                {log.action === 'create' && 'Buat'}
                                                {log.action === 'update' && 'Ubah'}
                                                {log.action === 'delete' && 'Hapus'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
