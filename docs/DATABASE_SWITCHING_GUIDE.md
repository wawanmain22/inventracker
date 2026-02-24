# Database Switching Guide

Panduan lengkap untuk mengganti database dari SQLite ke MySQL, PostgreSQL, atau database lainnya di aplikasi ujikom-app.

## ✅ Kabar Baik: AMAN untuk Diganti!

**TIDAK ada yang perlu diubah di Model atau Controller!** Semua Model dan Controller sudah **database-agnostic** (tidak tergantung database tertentu).

### Alasan Aman:

1. **Eloquent ORM** - Semua query menggunakan Laravel Eloquent yang abstrak dari driver database
2. **Migrations** - Laravel migrations sudah compatible dengan semua database
3. **No Raw Queries** - Tidak ada raw SQL queries yang spesifik untuk SQLite
4. **Configuration-Based** - Cukup ubah `.env` dan sudah beres!

---

## Quick Switch Guide

### 🔄 Dari SQLite ke MySQL

#### 1. Update `.env`

```bash
# Ubah dari:
DB_CONNECTION=sqlite

# Menjadi:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventracker
DB_USERNAME=root
DB_PASSWORD=
```

#### 2. Jalankan Migration

```bash
php artisan migrate:fresh --seed
```

That's it! ✅

---

### 🔄 Dari SQLite ke PostgreSQL

#### 1. Update `.env`

```bash
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=inventracker
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_CHARSET=utf8
```

#### 2. Jalankan Migration

```bash
php artisan migrate:fresh --seed
```

---

### 🔄 Dari SQLite ke MariaDB

#### 1. Update `.env`

```bash
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventracker
DB_USERNAME=root
DB_PASSWORD=
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
```

#### 2. Jalankan Migration

```bash
php artisan migrate:fresh --seed
```

---

## Detailed Configuration Reference

### MySQL Configuration

```php
// config/database.php
'mysql' => [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'unix_socket' => env('DB_SOCKET', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'strict' => true,
    'engine' => null,
],
```

**Min PHP Version:** 5.6.0+
**Driver:** pdo_mysql

---

### PostgreSQL Configuration

```php
// config/database.php
'pgsql' => [
    'driver' => 'pgsql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'search_path' => 'public',
    'sslmode' => env('DB_SSLMODE', 'prefer'),
],
```

**Min PHP Version:** 5.6.0+
**Driver:** pdo_pgsql
**Port:** 5432 (default)

---

### MariaDB Configuration

```php
// config/database.php
'mariadb' => [
    'driver' => 'mariadb',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'strict' => true,
],
```

**Drop-in replacement for MySQL** - Use `mysql` driver, just change connection name
**Port:** 3306 (default)

---

### Microsoft SQL Server Configuration

```php
// config/database.php
'sqlsrv' => [
    'driver' => 'sqlsrv',
    'host' => env('DB_HOST', 'localhost'),
    'port' => env('DB_PORT', '1433'),
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
],
```

**Port:** 1433 (default)
**Requirements:** sqlsrv + pdo_sqlsrv PHP extensions

---

## Step-by-Step Migration Process

### 1. Backup Current Data (SQLite)

```bash
# Backup database.sqlite
cp database/database.sqlite database/database.sqlite.backup
```

### 2. Export Data (Optional)

Jika ingin migrate data dari SQLite ke database baru:

```bash
# Export dari SQLite
php artisan db:seed --class=DatabaseSeeder
```

### 3. Update Environment

Edit `.env` file dengan credentials database baru

### 4. Prepare Database

```bash
# Untuk MySQL
mysql -u root -p
> CREATE DATABASE inventracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;

# Untuk PostgreSQL
psql -U postgres
> CREATE DATABASE inventracker;
> \q

# Untuk MariaDB (sama dengan MySQL)
```

### 5. Run Migrations

```bash
# Fresh migration (recommended untuk dev)
php artisan migrate:fresh --seed

# Atau step-by-step
php artisan migrate
php artisan db:seed
```

### 6. Verify

```bash
# Check tables
php artisan tinker
>>> DB::table('users')->count();

# Run tests
php artisan test --compact
```

---

## Potential Issues & Solutions

### Issue: Connection Refused

**Cause:** Database server not running
**Solution:**

```bash
# MySQL
mysql -u root -p  # Check if accessible

# PostgreSQL
psql -U postgres  # Check if accessible
```

---

### Issue: Driver Not Found

**Cause:** PHP extension tidak installed
**Solution:**

```bash
# MySQL
php -m | grep pdo_mysql

# PostgreSQL
php -m | grep pdo_pgsql

# Install if missing:
# Ubuntu/Debian
sudo apt-get install php-mysql  # MySQL
sudo apt-get install php-pgsql  # PostgreSQL

# Windows (via Composer)
composer require pdo_mysql  # Usually included
```

---

### Issue: Authentication Failed

**Cause:** Wrong username/password
**Solution:**

- Double-check credentials in `.env`
- Verify user exists in database
- Check user permissions

```bash
# MySQL - Create user
mysql -u root -p
> CREATE USER 'inventracker'@'localhost' IDENTIFIED BY 'password';
> GRANT ALL PRIVILEGES ON inventracker.* TO 'inventracker'@'localhost';
> FLUSH PRIVILEGES;
> EXIT;
```

---

### Issue: Charset Issues

**For MySQL/MariaDB:**

```bash
# Ensure UTF-8 support
ALTER DATABASE inventracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Foreign Key Constraints

### SQLite (Default: Enabled)

```php
// .env
DB_FOREIGN_KEYS=true  # Already set
```

### MySQL/MariaDB (Enabled by default in Laravel 12)

No additional configuration needed - Laravel handles it

### PostgreSQL (Enabled by default)

No additional configuration needed

---

## Testing After Switch

### 1. Unit Tests

```bash
php artisan test --testsuite=Unit --compact
```

### 2. Feature Tests

```bash
php artisan test --testsuite=Feature --compact
```

### 3. All Tests

```bash
php artisan test --compact

# Expected: 90 passed ✅
```

### 4. Manual Testing

```bash
# Start dev server
composer run dev

# Open http://localhost:8000
# Test all major features:
# - Login/Register
# - Create/Edit Category
# - Create/Edit Product
# - Record Transactions
# - View Reports
```

---

## Advanced: Using Database URLs

Laravel supports connection URLs (helpful for hosted environments):

```bash
# MySQL via URL
DB_URL=mysql://root:password@127.0.0.1:3306/inventracker

# PostgreSQL via URL
DB_URL=postgresql://user:password@127.0.0.1:5432/inventracker

# SQLite via URL
DB_URL=sqlite:///full/path/to/database.sqlite
```

---

## Comparison Table

| Feature         | SQLite             | MySQL          | PostgreSQL     | MariaDB        | MSSQL          |
| --------------- | ------------------ | -------------- | -------------- | -------------- | -------------- |
| **Setup**       | ✅ Easiest         | ⚠️ Medium      | ⚠️ Medium      | ⚠️ Medium      | ❌ Hard        |
| **Performance** | ✅ Good (dev)      | ✅ Great       | ✅ Great       | ✅ Great       | ✅ Great       |
| **Scaling**     | ❌ Limited         | ✅ Excellent   | ✅ Excellent   | ✅ Excellent   | ✅ Excellent   |
| **Concurrency** | ❌ Poor            | ✅ Good        | ✅ Excellent   | ✅ Good        | ✅ Good        |
| **Production**  | ⚠️ Not Recommended | ✅ Recommended | ✅ Recommended | ✅ Recommended | ✅ Recommended |
| **Free**        | ✅ Yes             | ✅ Yes         | ✅ Yes         | ✅ Yes         | ❌ No          |

---

## Recommendations

### For Development

**Use SQLite** (current setup) - Already configured ✅

### For Production

Choose based on your hosting:

- **Shared Hosting** → MySQL (most common)
- **Cloud/VPS** → PostgreSQL (most reliable)
- **Windows Servers** → MSSQL
- **Any Platform** → MySQL (safest choice)

### For Scaling

1. Start with **MySQL**
2. Scale to **PostgreSQL** if you need advanced features
3. Consider **Read Replicas** for high traffic

---

## Checklist untuk Switch Database

- [ ] Backup current SQLite database
- [ ] Create new database & user
- [ ] Update `.env` file
- [ ] Test connection: `php artisan tinker`
- [ ] Run migrations: `php artisan migrate:fresh --seed`
- [ ] Run tests: `php artisan test --compact`
- [ ] Manual testing di browser
- [ ] Check logs: `storage/logs/laravel.log`
- [ ] Verify all CRUD operations work
- [ ] Check file uploads still work

---

## Summary

✅ **SAFE TO SWITCH!**

- Models: No changes needed
- Controllers: No changes needed
- Views: No changes needed
- Just update `.env` → run migrations → test!

**Total time required:** 5-15 minutes (depending on data size)

Untuk info lebih detail, lihat:

- [Laravel Database Documentation](https://laravel.com/docs/12.x/database)
- `config/database.php` - Full configuration examples
