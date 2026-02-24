<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->user = User::factory()->create();
        $this->category = Category::factory()->create();
    }

    public function test_authenticated_user_can_view_products_page(): void
    {
        $response = $this->actingAs($this->user)->get(route('products.index'));

        $response->assertOk();
    }

    public function test_unauthenticated_user_cannot_view_products_page(): void
    {
        $response = $this->get(route('products.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_create_product(): void
    {
        $data = [
            'category_id' => $this->category->id,
            'name' => 'Laptop',
            'description' => 'High-performance laptop',
            'stock' => 10,
            'price' => 15000000,
            'image' => UploadedFile::fake()->image('laptop.jpg'),
        ];

        $response = $this->actingAs($this->user)->post(route('products.store'), $data);

        $this->assertDatabaseHas('products', [
            'name' => 'Laptop',
            'stock' => 10,
            'price' => 15000000,
        ]);
    }

    public function test_product_name_is_required(): void
    {
        $data = [
            'category_id' => $this->category->id,
            'name' => '',
            'description' => 'Description',
            'stock' => 10,
            'price' => 50000,
        ];

        $response = $this->actingAs($this->user)->post(route('products.store'), $data);

        $response->assertSessionHasErrors('name');
    }

    public function test_product_stock_must_be_numeric(): void
    {
        $data = [
            'category_id' => $this->category->id,
            'name' => 'Product',
            'description' => 'Description',
            'stock' => 'invalid',
            'price' => 50000,
        ];

        $response = $this->actingAs($this->user)->post(route('products.store'), $data);

        $response->assertSessionHasErrors('stock');
    }

    public function test_product_price_must_be_numeric(): void
    {
        $data = [
            'category_id' => $this->category->id,
            'name' => 'Product',
            'description' => 'Description',
            'stock' => 10,
            'price' => 'invalid',
        ];

        $response = $this->actingAs($this->user)->post(route('products.store'), $data);

        $response->assertSessionHasErrors('price');
    }

    public function test_authenticated_user_can_update_product(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $data = [
            'category_id' => $this->category->id,
            'name' => 'Updated Product',
            'description' => 'Updated description',
            'stock' => 20,
            'price' => 100000,
        ];

        $response = $this->actingAs($this->user)->put(
            route('products.update', $product),
            $data
        );

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product',
            'stock' => 20,
        ]);
    }

    public function test_authenticated_user_can_delete_product(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $response = $this->actingAs($this->user)->delete(route('products.destroy', $product));

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_product_belongs_to_category(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $this->assertEquals($this->category->id, $product->category->id);
    }

    public function test_product_can_have_low_stock(): void
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
            'stock' => 5,
        ]);

        $this->assertEquals(5, $product->stock);
    }
}
