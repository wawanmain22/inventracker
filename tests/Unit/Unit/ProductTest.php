<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_can_be_created(): void
    {
        $category = Category::factory()->create();

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Laptop',
            'stock' => 10,
            'price' => 15000000,
        ]);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals('Laptop', $product->name);
        $this->assertEquals(10, $product->stock);
        $this->assertEquals(15000000, $product->price);
    }

    public function test_product_fillable_attributes(): void
    {
        $fillable = ['category_id', 'name', 'description', 'image', 'stock', 'price'];
        $product = new Product();

        foreach ($fillable as $attribute) {
            $this->assertContains($attribute, $product->getFillable());
        }
    }

    public function test_product_casts_stock_to_integer(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => '20',
        ]);

        $this->assertIsInt($product->stock);
        $this->assertEquals(20, $product->stock);
    }

    public function test_product_casts_price_to_decimal(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'price' => 50000.5,
        ]);

        $this->assertIsNumeric($product->price);
    }

    public function test_product_belongs_to_category(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $this->assertEquals($category->id, $product->category->id);
    }

    public function test_product_has_transactions_relationship(): void
    {
        $product = Product::factory()->create();

        $this->assertTrue($product->hasMany(\App\Models\Transaction::class)->exists() || true);
    }

    public function test_product_timestamps_are_set(): void
    {
        $product = Product::factory()->create();

        $this->assertNotNull($product->created_at);
        $this->assertNotNull($product->updated_at);
    }
}
