import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, LogIn, Mail } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Login" />

            <Card className="border-0 shadow-xl shadow-gray-200/50">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-center text-2xl font-bold">Masuk ke Akun</CardTitle>
                    <CardDescription className="text-center">Masukkan email dan password Anda untuk melanjutkan</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-5">
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
                                    autoFocus
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
                                    placeholder="Masukkan password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked: boolean) => setData('remember', checked)}
                                />
                                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-gray-600">
                                    Ingat saya
                                </Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="h-11 w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                            disabled={processing}
                        >
                            {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                            Masuk
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
                        Belum punya akun?{' '}
                        <Link href="/register" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
                            Daftar sekarang
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
