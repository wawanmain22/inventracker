<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create categories
        $categories = [
            ['name' => 'Elektronik', 'description' => 'Perangkat elektronik dan gadget'],
            ['name' => 'Pakaian', 'description' => 'Pakaian pria, wanita, dan anak'],
            ['name' => 'Makanan & Minuman', 'description' => 'Produk makanan dan minuman'],
            ['name' => 'Peralatan Rumah', 'description' => 'Peralatan untuk kebutuhan rumah tangga'],
            ['name' => 'Kesehatan', 'description' => 'Produk kesehatan dan obat-obatan'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create products
        $products = [
            ['category_id' => 1, 'name' => 'Laptop Asus', 'stock' => 15, 'price' => 8500000],
            ['category_id' => 1, 'name' => 'Mouse Wireless', 'stock' => 50, 'price' => 150000],
            ['category_id' => 1, 'name' => 'Keyboard Mechanical', 'stock' => 8, 'price' => 750000],
            ['category_id' => 1, 'name' => 'Monitor 24 inch', 'stock' => 5, 'price' => 2500000],
            ['category_id' => 2, 'name' => 'Kaos Polos', 'stock' => 100, 'price' => 75000],
            ['category_id' => 2, 'name' => 'Celana Jeans', 'stock' => 30, 'price' => 250000],
            ['category_id' => 2, 'name' => 'Jaket Hoodie', 'stock' => 3, 'price' => 350000],
            ['category_id' => 3, 'name' => 'Mie Instan', 'stock' => 200, 'price' => 3500],
            ['category_id' => 3, 'name' => 'Air Mineral 600ml', 'stock' => 150, 'price' => 4000],
            ['category_id' => 3, 'name' => 'Kopi Sachet', 'stock' => 0, 'price' => 2500],
            ['category_id' => 4, 'name' => 'Sapu', 'stock' => 25, 'price' => 35000],
            ['category_id' => 4, 'name' => 'Ember Plastik', 'stock' => 10, 'price' => 45000],
            ['category_id' => 5, 'name' => 'Paracetamol', 'stock' => 2, 'price' => 5000],
            ['category_id' => 5, 'name' => 'Vitamin C', 'stock' => 18, 'price' => 15000],
            ['category_id' => 5, 'name' => 'Masker Medis', 'stock' => 75, 'price' => 25000],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Create some transactions
        $transactionData = [
            ['product_id' => 1, 'type' => 'in', 'quantity' => 20],
            ['product_id' => 1, 'type' => 'out', 'quantity' => 5],
            ['product_id' => 2, 'type' => 'in', 'quantity' => 100],
            ['product_id' => 2, 'type' => 'out', 'quantity' => 50],
            ['product_id' => 3, 'type' => 'in', 'quantity' => 15],
            ['product_id' => 3, 'type' => 'out', 'quantity' => 7],
            ['product_id' => 5, 'type' => 'in', 'quantity' => 150],
            ['product_id' => 5, 'type' => 'out', 'quantity' => 50],
            ['product_id' => 8, 'type' => 'in', 'quantity' => 300],
            ['product_id' => 8, 'type' => 'out', 'quantity' => 100],
        ];

        foreach ($transactionData as $data) {
            Transaction::create([
                ...$data,
                'user_id' => $admin->id,
                'notes' => $data['type'] === 'in' ? 'Restock barang' : 'Penjualan',
            ]);
        }
    }
}
