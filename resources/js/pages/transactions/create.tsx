import { Link, useForm } from '@inertiajs/react';
import { ArrowDownCircle, ArrowLeft, ArrowUpCircle, LoaderCircle, Package } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Category, Product } from '@/types';

type TransactionsCreateProps = {
    products: (Product & { category: Category })[];
};

export default function TransactionsCreate({ products }: TransactionsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        type: '' as 'in' | 'out' | '',
        quantity: '',
        notes: '',
    });

    const selectedProduct = products.find((p) => String(p.id) === data.product_id);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/transactions', {
            onSuccess: () => {
                toast.success('Transaksi berhasil disimpan');
            },
        });
    };

    return (
        <AppLayout title="Tambah Transaksi">
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/transactions">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold sm:text-2xl lg:text-3xl">Tambah Transaksi</h1>
                        <p className="truncate text-xs text-muted-foreground sm:text-sm">Catat transaksi stok masuk atau keluar</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                        {/* Product Info Card - Shows first on mobile */}
                        <div className="order-first lg:order-last lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Info Produk</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedProduct ? (
                                        <div className="space-y-4">
                                            {selectedProduct.image ? (
                                                <img
                                                    src={`/storage/${selectedProduct.image}`}
                                                    alt={selectedProduct.name}
                                                    className="mx-auto aspect-square w-full max-w-[200px] rounded-lg object-cover sm:max-w-none"
                                                />
                                            ) : (
                                                <div className="mx-auto flex aspect-square w-full max-w-[200px] items-center justify-center rounded-lg bg-muted sm:max-w-none">
                                                    <Package className="h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <h3 className="font-semibold">{selectedProduct.name}</h3>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Kategori:</span>
                                                    <span>{selectedProduct.category?.name || '-'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Stok saat ini:</span>
                                                    <Badge variant={selectedProduct.stock <= 10 ? 'destructive' : 'secondary'}>
                                                        {selectedProduct.stock}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Harga:</span>
                                                    <span className="font-medium">{formatCurrency(selectedProduct.price)}</span>
                                                </div>
                                                {data.quantity && (
                                                    <div className="border-t pt-2">
                                                        <div className="flex justify-between text-sm font-medium">
                                                            <span>Stok setelah transaksi:</span>
                                                            <span>
                                                                {data.type === 'in'
                                                                    ? selectedProduct.stock + Number(data.quantity)
                                                                    : selectedProduct.stock - Number(data.quantity)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-muted-foreground">
                                            <Package className="mx-auto mb-2 h-10 w-10 sm:h-12 sm:w-12" />
                                            <p className="text-sm">Pilih produk untuk melihat detail</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Form Card */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Detail Transaksi</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Isi informasi transaksi</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 sm:space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm">Produk *</Label>
                                        <Select value={data.product_id} onValueChange={(value) => setData('product_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih produk" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={String(product.id)}>
                                                        <div className="flex w-full items-center justify-between">
                                                            <span>{product.name}</span>
                                                            <Badge variant="outline" className="ml-2">
                                                                Stok: {product.stock}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.product_id && <p className="text-sm text-destructive">{errors.product_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm">Tipe Transaksi *</Label>
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                            <Button
                                                type="button"
                                                variant={data.type === 'in' ? 'default' : 'outline'}
                                                className={data.type === 'in' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                onClick={() => setData('type', 'in')}
                                            >
                                                <ArrowDownCircle className="mr-1.5 h-4 w-4 sm:mr-2" />
                                                <span className="text-xs sm:text-sm">Stok Masuk</span>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={data.type === 'out' ? 'default' : 'outline'}
                                                className={data.type === 'out' ? 'bg-red-600 hover:bg-red-700' : ''}
                                                onClick={() => setData('type', 'out')}
                                            >
                                                <ArrowUpCircle className="mr-1.5 h-4 w-4 sm:mr-2" />
                                                <span className="text-xs sm:text-sm">Stok Keluar</span>
                                            </Button>
                                        </div>
                                        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="quantity" className="text-sm">
                                            Jumlah *
                                        </Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                            placeholder="Masukkan jumlah"
                                        />
                                        {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                                        {data.type === 'out' && selectedProduct && Number(data.quantity) > selectedProduct.stock && (
                                            <p className="text-sm text-orange-500">
                                                Peringatan: Jumlah melebihi stok yang tersedia ({selectedProduct.stock})
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes" className="text-sm">
                                            Catatan
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Tambahkan catatan (opsional)"
                                            rows={3}
                                        />
                                        {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                                        <Button type="button" variant="outline" className="w-full sm:w-auto" asChild>
                                            <Link href="/transactions">Batal</Link>
                                        </Button>
                                        <Button type="submit" className="w-full sm:w-auto" disabled={processing}>
                                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                            Simpan
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
