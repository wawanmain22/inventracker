<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_authenticated_user_can_view_categories_page(): void
    {
        $response = $this->actingAs($this->user)->get(route('categories.index'));

        $response->assertOk();
    }

    public function test_unauthenticated_user_cannot_view_categories_page(): void
    {
        $response = $this->get(route('categories.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_create_category(): void
    {
        $data = [
            'name' => 'Electronics',
            'description' => 'Electronic products and gadgets',
        ];

        $response = $this->actingAs($this->user)->post(route('categories.store'), $data);

        $this->assertDatabaseHas('categories', $data);
    }

    public function test_category_name_is_required(): void
    {
        $data = [
            'name' => '',
            'description' => 'Description',
        ];

        $response = $this->actingAs($this->user)->post(route('categories.store'), $data);

        $response->assertSessionHasErrors('name');
    }

    public function test_category_name_must_be_unique(): void
    {
        Category::factory()->create(['name' => 'Electronics']);

        $data = [
            'name' => 'Electronics',
            'description' => 'Different description',
        ];

        $response = $this->actingAs($this->user)->post(route('categories.store'), $data);

        $response->assertSessionHasErrors('name');
    }

    public function test_authenticated_user_can_update_category(): void
    {
        $category = Category::factory()->create();

        $data = [
            'name' => 'Updated Name',
            'description' => 'Updated description',
        ];

        $response = $this->actingAs($this->user)->put(
            route('categories.update', $category),
            $data
        );

        $this->assertDatabaseHas('categories', $data);
    }

    public function test_authenticated_user_can_delete_category(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->user)->delete(route('categories.destroy', $category));

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_category_has_many_products(): void
    {
        $category = Category::factory()->create();
        $products = \App\Models\Product::factory(3)->create(['category_id' => $category->id]);

        $this->assertCount(3, $category->products);
        $this->assertTrue($category->products->contains($products->first()));
    }
}
