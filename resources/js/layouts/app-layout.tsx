import { Head, Link, router, usePage } from '@inertiajs/react';
import { Archive, ArrowLeftRight, ChevronDown, FileText, LayoutDashboard, LogOut, Menu, Settings, Tags } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Toaster } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { cn } from '@/lib/utils';
import type { User } from '@/types';

type AppLayoutProps = PropsWithChildren<{
    title?: string;
}>;

type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Kategori', href: '/categories', icon: Tags },
    { label: 'Produk', href: '/products', icon: Archive },
    { label: 'Transaksi', href: '/transactions', icon: ArrowLeftRight },
    { label: 'Laporan', href: '/reports', icon: FileText },
];

function SidebarContent({ currentPath, onNavigate }: { currentPath: string; onNavigate?: () => void }) {
    return (
        <>
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-6">
                <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
                <div>
                    <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-lg font-bold text-transparent">InvenTrack</span>
                    <p className="-mt-0.5 text-[10px] text-gray-400">Inventory Management</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                <p className="mb-3 px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Menu Utama</p>
                {navItems.map((item) => {
                    const isActive = currentPath.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                                    isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200',
                                )}
                            >
                                <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700')} />
                            </div>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const currentPath = window.location.pathname;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    const UserMenu = ({ isMobile = false }: { isMobile?: boolean }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn('h-auto justify-start gap-3 rounded-xl px-3 py-3 hover:bg-gray-100', isMobile ? 'w-full' : 'w-full')}
                >
                    <Avatar className="h-10 w-10 border-2 border-blue-100">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900">{auth.user.name}</span>
                        <span className="max-w-[140px] truncate text-xs text-gray-500">{auth.user.email}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
                <DropdownMenuItem asChild className="rounded-lg">
                    <Link href="/profile" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="h-4 w-4" />
                        Pengaturan Profil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <>
            <Head title={title} />
            <Toaster position="top-right" richColors closeButton />

            <div className="flex min-h-screen bg-gray-50">
                {/* Desktop Sidebar */}
                <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 border-r border-gray-200 bg-white shadow-sm lg:block">
                    <div className="flex h-full flex-col">
                        <SidebarContent currentPath={currentPath} />

                        {/* User Menu */}
                        <div className="border-t border-gray-100 p-4">
                            <UserMenu />
                        </div>
                    </div>
                </aside>

                {/* Mobile Header */}
                <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text font-bold text-transparent">InvenTrack</span>
                    </div>

                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 p-0">
                            <div className="flex h-full flex-col">
                                <SidebarContent currentPath={currentPath} onNavigate={() => setMobileMenuOpen(false)} />

                                {/* User Menu */}
                                <div className="border-t border-gray-100 p-4">
                                    <UserMenu isMobile />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Main Content */}
                <main className="flex-1 pt-16 lg:ml-64 lg:pt-0">
                    <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                </main>
            </div>
        </>
    );
}
