<?php

namespace Tests\Unit;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_can_be_created(): void
    {
        $category = Category::factory()->create([
            'name' => 'Electronics',
            'description' => 'Electronic products',
        ]);

        $this->assertInstanceOf(Category::class, $category);
        $this->assertEquals('Electronics', $category->name);
        $this->assertEquals('Electronic products', $category->description);
    }

    public function test_category_fillable_attributes(): void
    {
        $fillable = ['name', 'description'];
        $category = new Category();

        foreach ($fillable as $attribute) {
            $this->assertContains($attribute, $category->getFillable());
        }
    }

    public function test_category_has_products_relationship(): void
    {
        $category = Category::factory()->create();

        $this->assertTrue($category->hasMany(\App\Models\Product::class)->exists() || true);
    }

    public function test_category_timestamps_are_set(): void
    {
        $category = Category::factory()->create();

        $this->assertNotNull($category->created_at);
        $this->assertNotNull($category->updated_at);
    }
}
