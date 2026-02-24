<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $category = Category::factory()->create();
        $this->product = Product::factory()->create([
            'category_id' => $category->id,
            'stock' => 100,
        ]);
    }

    public function test_authenticated_user_can_view_transactions_page(): void
    {
        $response = $this->actingAs($this->user)->get(route('transactions.index'));

        $response->assertOk();
    }

    public function test_unauthenticated_user_cannot_view_transactions_page(): void
    {
        $response = $this->get(route('transactions.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_record_stock_in(): void
    {
        $initialStock = $this->product->stock;

        $data = [
            'product_id' => $this->product->id,
            'type' => 'in',
            'quantity' => 20,
            'notes' => 'Restock from supplier',
        ];

        $response = $this->actingAs($this->user)->post(route('transactions.store'), $data);

        $this->product->refresh();
        $this->assertEquals($initialStock + 20, $this->product->stock);
    }

    public function test_authenticated_user_can_record_stock_out(): void
    {
        $initialStock = $this->product->stock;

        $data = [
            'product_id' => $this->product->id,
            'type' => 'out',
            'quantity' => 10,
            'notes' => 'Sold to customer',
        ];

        $response = $this->actingAs($this->user)->post(route('transactions.store'), $data);

        $this->product->refresh();
        $this->assertEquals($initialStock - 10, $this->product->stock);
    }

    public function test_stock_out_cannot_exceed_available_stock(): void
    {
        $data = [
            'product_id' => $this->product->id,
            'type' => 'out',
            'quantity' => 200,
            'notes' => 'Invalid quantity',
        ];

        $response = $this->actingAs($this->user)->post(route('transactions.store'), $data);

        $response->assertSessionHasErrors('quantity');
    }

    public function test_transaction_quantity_is_required(): void
    {
        $data = [
            'product_id' => $this->product->id,
            'type' => 'in',
            'quantity' => '',
            'notes' => 'Notes',
        ];

        $response = $this->actingAs($this->user)->post(route('transactions.store'), $data);

        $response->assertSessionHasErrors('quantity');
    }

    public function test_transaction_quantity_must_be_positive(): void
    {
        $data = [
            'product_id' => $this->product->id,
            'type' => 'in',
            'quantity' => -5,
            'notes' => 'Notes',
        ];

        $response = $this->actingAs($this->user)->post(route('transactions.store'), $data);

        $response->assertSessionHasErrors('quantity');
    }

    public function test_transaction_belongs_to_product(): void
    {
        $transaction = Transaction::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $this->user->id,
        ]);

        $this->assertEquals($this->product->id, $transaction->product->id);
    }

    public function test_transaction_belongs_to_user(): void
    {
        $transaction = Transaction::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $this->user->id,
        ]);

        $this->assertEquals($this->user->id, $transaction->user->id);
    }

    public function test_multiple_transactions_update_stock_correctly(): void
    {
        $initialStock = $this->product->stock;

        // Stock in
        $this->actingAs($this->user)->post(route('transactions.store'), [
            'product_id' => $this->product->id,
            'type' => 'in',
            'quantity' => 50,
        ]);

        // Stock out
        $this->actingAs($this->user)->post(route('transactions.store'), [
            'product_id' => $this->product->id,
            'type' => 'out',
            'quantity' => 30,
        ]);

        $this->product->refresh();
        $this->assertEquals($initialStock + 50 - 30, $this->product->stock);
    }
}
