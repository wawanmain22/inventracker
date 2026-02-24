import type { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen">
            {/* Left Side - Branding */}
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:flex lg:w-1/2">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white blur-3xl" />
                    <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-blue-300 blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-indigo-300 blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 shadow-lg backdrop-blur-sm">
                                <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">InvenTrack</h1>
                                <p className="text-sm text-blue-200">Inventory Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Text */}
                    <h2 className="mb-6 text-4xl leading-tight font-bold text-white xl:text-5xl">
                        Kelola Inventaris
                        <br />
                        <span className="text-blue-200">Lebih Mudah & Efisien</span>
                    </h2>

                    <p className="mb-8 max-w-md text-lg text-blue-100">
                        Sistem manajemen inventaris modern untuk memantau stok, transaksi, dan laporan bisnis Anda secara real-time.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-white">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Pantau stok secara real-time</span>
                        </div>
                        <div className="flex items-center gap-3 text-white">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Laporan & export PDF otomatis</span>
                        </div>
                        <div className="flex items-center gap-3 text-white">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Notifikasi stok menipis</span>
                        </div>
                    </div>
                </div>

                {/* Bottom decoration */}
                <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-6 sm:p-8 lg:p-12">
                {/* Mobile Logo */}
                <div className="mb-8 flex items-center gap-3 lg:hidden">
                    <img src="/logo.svg" alt="Logo" className="h-12 w-12" />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">InvenTrack</h1>
                        <p className="text-xs text-gray-500">Inventory Management</p>
                    </div>
                </div>

                <div className="w-full max-w-md">{children}</div>

                <p className="mt-8 text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} InvenTrack - Sistem Manajemen Inventaris</p>
            </div>
        </div>
    );
}
