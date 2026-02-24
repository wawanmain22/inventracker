# Sistem Manajemen Inventaris

Aplikasi web untuk mengelola inventaris barang dengan fitur lengkap meliputi manajemen kategori, produk, transaksi stok, dan pelaporan.

## Tech Stack

- **Backend:** PHP 8.3, Laravel 12
- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Database:** SQLite
- **PDF Export:** DomPDF

## Fitur Utama

### 1. Autentikasi

- Login & Register
- Session management
- Password hashing

### 2. Dashboard

- Statistik overview (total produk, kategori, stok menipis, transaksi)
- Daftar transaksi terbaru
- Alert stok menipis

### 3. Manajemen Kategori

- CRUD kategori produk
- Modal dialog untuk tambah/edit
- Jumlah produk per kategori

### 4. Manajemen Produk

- CRUD produk dengan gambar
- Filter berdasarkan kategori dan status stok
- Pencarian produk
- Detail produk dengan riwayat transaksi

### 5. Transaksi Stok

- Stok masuk (pembelian/restock)
- Stok keluar (penjualan)
- Validasi stok otomatis
- Update stok real-time

### 6. Laporan

- Filter berdasarkan tanggal dan tipe transaksi
- Summary statistik
- Export ke PDF
- Activity log sistem

### 7. Profil Pengguna

- Update informasi profil
- Ganti password

## Instalasi

```bash
# Clone repository
git clone <repository-url>
cd ujikom-app

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate
php artisan db:seed

# Link storage
php artisan storage:link

# Build frontend
npm run build

# Jalankan server
php artisan serve
```

## Akun Demo

```
Email: admin@example.com
Password: password
```

## Struktur Database

### Categories

- id, name, description, timestamps

### Products

- id, category_id, name, description, image, stock, price, timestamps

### Transactions

- id, product_id, user_id, type (in/out), quantity, notes, timestamps

### Activity Logs

- id, user_id, action, model_type, model_id, description, timestamps

## Mapping 17 Kompetensi SKKNI

| No  | Kompetensi              | Implementasi                                           |
| --- | ----------------------- | ------------------------------------------------------ |
| 1   | Menganalisis Tools      | Laravel 12, React 19, shadcn/ui                        |
| 2   | Skalabilitas            | Pagination, eager loading, indexed queries             |
| 3   | Identifikasi Library    | DomPDF, shadcn/ui, lucide-react                        |
| 4   | UX                      | Responsive design, toast notifications, loading states |
| 5   | Pemrograman Terstruktur | Controllers, Form Requests, Services                   |
| 6   | OOP                     | Models, Relationships, Traits                          |
| 7   | SQL                     | Migrations, Foreign Keys, Indexes                      |
| 8   | Akses Basis Data        | Eloquent ORM, Query Scopes                             |
| 9   | Algoritma               | Stock calculation, Filtering, Sorting                  |
| 10  | Migrasi Teknologi       | Database migrations dengan rollback                    |
| 11  | Debugging               | Error handling, Laravel logs                           |
| 12  | Multimedia              | Upload & display gambar produk                         |
| 13  | Code Review             | Git commits, Laravel Pint                              |
| 14  | Pengujian Statis        | PHPUnit tests, ESLint                                  |
| 15  | Alert Notification      | Toast notifications (sonner)                           |
| 16  | Monitoring Resource     | Activity logs page                                     |
| 17  | Pembaharuan Software    | Composer/npm update scripts                            |

## Commands

### Development & Build

```bash
# Development
composer run dev      # Start all services (server, queue, vite)
npm run dev           # Vite dev server only
npm run build         # Production build
```

### Testing

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/ExampleTest.php

# Run single test by name
php artisan test --filter=test_example_returns_successful_response
```

### Linting & Formatting

```bash
# PHP
vendor/bin/pint           # Fix PHP code style
vendor/bin/pint --dirty   # Fix only modified files

# TypeScript/JavaScript
npm run lint              # ESLint with auto-fix
npm run format            # Prettier format
npm run format:check      # Check formatting without changes
npm run types             # TypeScript type checking
```

### Artisan Make Commands (Creating Files)

```bash
# Models & Factories
php artisan make:model ModelName --no-interaction
php artisan make:model ModelName --migration --no-interaction
php artisan make:model ModelName --migration --factory --no-interaction
php artisan make:model ModelName --migration --factory --seeder --no-interaction

# Controllers
php artisan make:controller ControllerName --no-interaction
php artisan make:controller ControllerName --model=ModelName --no-interaction
php artisan make:controller ControllerName --resource --no-interaction
php artisan make:controller ControllerName --api --no-interaction

# Form Requests (Validation)
php artisan make:request StoreModelRequest --no-interaction
php artisan make:request UpdateModelRequest --no-interaction

# Migrations
php artisan make:migration create_table_name_table --no-interaction
php artisan make:migration add_column_to_table_name_table --no-interaction

# Views
php artisan make:view view.name --no-interaction

# Classes & Utilities
php artisan make:class ClassName --no-interaction
php artisan make:service ServiceName --no-interaction

# Tests
php artisan make:test FeatureTestName --no-interaction         # Feature test
php artisan make:test UnitTestName --unit --no-interaction     # Unit test

# Jalankan semua test
php artisan test --compact
# Filter test tertentu
php artisan test --compact --filter=testName
# Per file
php artisan test --compact tests/Feature/AuthTest.php
# Per suite
php artisan test --compact --testsuite=Feature
php artisan test --compact --testsuite=Unit

# Other Artisan Commands
php artisan make:job JobName --no-interaction
php artisan make:event EventName --no-interaction
php artisan make:listener ListenerName --no-interaction
php artisan make:middleware MiddlewareName --no-interaction

```

## Screenshots

### Login Page

- Form login dengan validasi
- Link ke halaman register

### Dashboard

- 4 stat cards (produk, kategori, stok menipis, transaksi)
- Tabel transaksi terbaru
- Alert stok menipis

### Kategori

- Tabel kategori dengan jumlah produk
- Modal create/edit
- Konfirmasi hapus

### Produk

- Grid/list produk dengan gambar
- Filter & search
- Form create/edit dengan upload gambar

### Transaksi

- Form stok masuk/keluar
- Validasi stok real-time
- History transaksi

### Laporan

- Filter tanggal & tipe
- Summary cards
- Export PDF
- Activity log

## Dibuat untuk

Ujian Kompetensi Keahlian (Ujikom)
SKKNI 282 TH 2016 Software Development - Pemrograman
Pengembang Web

## Author

Ridwan - 2026
