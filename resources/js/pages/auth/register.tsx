import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, Mail, User, UserPlus } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Daftar" />

            <Card className="border-0 shadow-xl shadow-gray-200/50">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-center text-2xl font-bold">Buat Akun Baru</CardTitle>
                    <CardDescription className="text-center">Daftar untuk mulai menggunakan sistem inventaris</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Nama Lengkap
                            </Label>
                            <div className="relative">
                                <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoComplete="name"
                                    autoFocus
                                    className="h-11 border-gray-200 bg-gray-50 pl-10 transition-colors focus:bg-white"
                                />
                            </div>
                            {errors.name && (
                                <p className="flex items-center gap-1 text-sm text-red-500">
                                    <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="email"
                                    className="h-11 border-gray-200 bg-gray-50 pl-10 transition-colors focus:bg-white"
                                />
                            </div>
                            {errors.email && (
                                <p className="flex items-center gap-1 text-sm text-red-500">
                                    <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Minimal 8 karakter"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                    className="h-11 border-gray-200 bg-gray-50 pr-10 transition-colors focus:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="flex items-center gap-1 text-sm text-red-500">
                                    <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                Konfirmasi Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Ulangi password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    autoComplete="new-password"
                                    className="h-11 border-gray-200 bg-gray-50 pr-10 transition-colors focus:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="flex items-center gap-1 text-sm text-red-500">
                                    <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="h-11 w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                            disabled={processing}
                        >
                            {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                            Daftar
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">atau</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
                            Masuk
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
