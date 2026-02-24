import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Upload } from 'lucide-react';
import type { ChangeEvent, FormEventHandler } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Category } from '@/types';

type ProductsCreateProps = {
    categories: Category[];
};

export default function ProductsCreate({ categories }: ProductsCreateProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        category_id: string;
        name: string;
        description: string;
        image: File | null;
        stock: string;
        price: string;
    }>({
        category_id: '',
        name: '',
        description: '',
        image: null,
        stock: '0',
        price: '0',
    });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/products', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Produk berhasil ditambahkan');
            },
        });
    };

    return (
        <AppLayout title="Tambah Produk">
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/products">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold sm:text-2xl lg:text-3xl">Tambah Produk</h1>
                        <p className="truncate text-xs text-muted-foreground sm:text-sm">Tambahkan produk baru ke inventaris</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                        {/* Image Card - Shows first on mobile */}
                        <div className="order-first lg:order-last lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Gambar Produk</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Upload gambar produk (maks 2MB)</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {preview ? (
                                            <div className="relative">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="mx-auto aspect-square w-full max-w-[200px] rounded-lg object-cover sm:max-w-none"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => {
                                                        setPreview(null);
                                                        setData('image', null);
                                                    }}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        ) : (
                                            <label className="mx-auto flex aspect-square w-full max-w-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50 sm:max-w-none">
                                                <Upload className="mb-2 h-8 w-8 text-muted-foreground sm:h-10 sm:w-10" />
                                                <span className="text-xs text-muted-foreground sm:text-sm">Klik untuk upload</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                            </label>
                                        )}
                                        {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Form Cards */}
                        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Informasi Produk</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Detail dasar produk</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm">
                                            Nama Produk *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Masukkan nama produk"
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-sm">
                                            Kategori *
                                        </Label>
                                        <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={String(category.id)}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm">
                                            Deskripsi
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Masukkan deskripsi produk (opsional)"
                                            rows={4}
                                        />
                                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Harga & Stok</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Informasi harga dan ketersediaan</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="price" className="text-sm">
                                                Harga (Rp) *
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0"
                                            />
                                            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="stock" className="text-sm">
                                                Stok Awal *
                                            </Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                min="0"
                                                value={data.stock}
                                                onChange={(e) => setData('stock', e.target.value)}
                                                placeholder="0"
                                            />
                                            {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button type="button" variant="outline" className="w-full sm:w-auto" asChild>
                                    <Link href="/products">Batal</Link>
                                </Button>
                                <Button type="submit" className="w-full sm:w-auto" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
