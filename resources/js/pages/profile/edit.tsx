import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types';

type ProfileEditProps = {
    user: User;
};

export default function ProfileEdit({ user }: ProfileEditProps) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/profile', {
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation');
                toast.success('Profil berhasil diperbarui');
            },
        });
    };

    return (
        <AppLayout title="Pengaturan Profil">
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Pengaturan Profil</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">Kelola informasi akun Anda</p>
                </div>

                <form onSubmit={submit}>
                    <div className="max-w-2xl space-y-4 sm:space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Informasi Profil</CardTitle>
                                <CardDescription className="text-xs sm:text-sm">Perbarui nama dan alamat email Anda</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm">
                                        Nama
                                    </Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama lengkap" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Email"
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Ubah Password</CardTitle>
                                <CardDescription className="text-xs sm:text-sm">Pastikan password minimal 8 karakter</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password" className="text-sm">
                                        Password Saat Ini
                                    </Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        placeholder="Masukkan password saat ini"
                                    />
                                    {errors.current_password && <p className="text-sm text-destructive">{errors.current_password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm">
                                        Password Baru
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan password baru"
                                    />
                                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-sm">
                                        Konfirmasi Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Konfirmasi password baru"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
