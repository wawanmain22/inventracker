import { router, useForm } from '@inertiajs/react';
import { Edit, LoaderCircle, MoreHorizontal, Plus, Tags, Trash2 } from 'lucide-react';
import type { FormEventHandler } from 'react';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Category, PaginatedData } from '@/types';

type CategoriesIndexProps = {
    categories: PaginatedData<Category>;
};

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const createForm = useForm({
        name: '',
        description: '',
    });

    const editForm = useForm({
        name: '',
        description: '',
    });

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post('/categories', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Kategori berhasil ditambahkan');
            },
        });
    };

    const handleEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingCategory) return;

        editForm.put(`/categories/${editingCategory.id}`, {
            onSuccess: () => {
                setEditingCategory(null);
                editForm.reset();
                toast.success('Kategori berhasil diperbarui');
            },
        });
    };

    const handleDelete = () => {
        if (!deletingCategory) return;

        router.delete(`/categories/${deletingCategory.id}`, {
            onSuccess: () => {
                setDeletingCategory(null);
                toast.success('Kategori berhasil dihapus');
            },
        });
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        editForm.setData({
            name: category.name,
            description: category.description || '',
        });
    };

    return (
        <AppLayout title="Kategori">
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Kategori</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Kelola kategori produk</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Kategori
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="mx-4 max-w-md sm:mx-auto">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Kategori Baru</DialogTitle>
                                    <DialogDescription>Isi form di bawah untuk menambahkan kategori baru.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create-name">Nama Kategori</Label>
                                        <Input
                                            id="create-name"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            placeholder="Masukkan nama kategori"
                                        />
                                        {createForm.errors.name && <p className="text-sm text-destructive">{createForm.errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create-description">Deskripsi</Label>
                                        <Textarea
                                            id="create-description"
                                            value={createForm.data.description}
                                            onChange={(e) => createForm.setData('description', e.target.value)}
                                            placeholder="Masukkan deskripsi (opsional)"
                                            rows={3}
                                        />
                                        {createForm.errors.description && <p className="text-sm text-destructive">{createForm.errors.description}</p>}
                                    </div>
                                </div>
                                <DialogFooter className="flex-col gap-2 sm:flex-row">
                                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="w-full sm:w-auto">
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={createForm.processing} className="w-full sm:w-auto">
                                        {createForm.processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Simpan
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Daftar Kategori</CardTitle>
                        <CardDescription>Total {categories.total} kategori</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        {/* Mobile: Card-based view */}
                        <div className="divide-y divide-gray-100 sm:hidden">
                            {categories.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Tags className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                    <p className="text-muted-foreground">Belum ada kategori</p>
                                </div>
                            ) : (
                                categories.data.map((category) => (
                                    <div key={category.id} className="flex items-center justify-between p-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{category.name}</p>
                                            <p className="truncate text-xs text-muted-foreground">{category.description || 'Tidak ada deskripsi'}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">{category.products_count || 0} produk</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setDeletingCategory(category)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop: Table view */}
                        <div className="hidden sm:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-center">Jumlah Produk</TableHead>
                                        <TableHead className="w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                Belum ada kategori
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        categories.data.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medium">{category.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{category.description || '-'}</TableCell>
                                                <TableCell className="text-center">{category.products_count || 0}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingCategory(category)}
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
                        {categories.last_page > 1 && (
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-1 px-4 pb-4 sm:gap-2 sm:px-0 sm:pb-0">
                                {categories.links.map((link, index) => (
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

            {/* Edit Dialog */}
            <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                <DialogContent className="mx-4 max-w-md sm:mx-auto">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Kategori</DialogTitle>
                            <DialogDescription>Ubah informasi kategori.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Kategori</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    placeholder="Masukkan nama kategori"
                                />
                                {editForm.errors.name && <p className="text-sm text-destructive">{editForm.errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Deskripsi</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    placeholder="Masukkan deskripsi (opsional)"
                                    rows={3}
                                />
                                {editForm.errors.description && <p className="text-sm text-destructive">{editForm.errors.description}</p>}
                            </div>
                        </div>
                        <DialogFooter className="flex-col gap-2 sm:flex-row">
                            <Button type="button" variant="outline" onClick={() => setEditingCategory(null)} className="w-full sm:w-auto">
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing} className="w-full sm:w-auto">
                                {editForm.processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
                <AlertDialogContent className="mx-4 max-w-md sm:mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kategori "{deletingCategory?.name}"? Semua produk dalam kategori ini juga akan terhapus.
                            Tindakan ini tidak dapat dibatalkan.
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
