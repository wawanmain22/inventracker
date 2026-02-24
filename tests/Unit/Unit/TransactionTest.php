<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_transaction_can_be_created(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $transaction = Transaction::factory()->create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'type' => 'in',
            'quantity' => 10,
        ]);

        $this->assertInstanceOf(Transaction::class, $transaction);
        $this->assertEquals('in', $transaction->type);
        $this->assertEquals(10, $transaction->quantity);
    }

    public function test_transaction_fillable_attributes(): void
    {
        $fillable = ['product_id', 'user_id', 'type', 'quantity', 'notes'];
        $transaction = new Transaction();

        foreach ($fillable as $attribute) {
            $this->assertContains($attribute, $transaction->getFillable());
        }
    }

    public function test_transaction_casts_quantity_to_integer(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $transaction = Transaction::factory()->create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'quantity' => '15',
        ]);

        $this->assertIsInt($transaction->quantity);
        $this->assertEquals(15, $transaction->quantity);
    }

    public function test_transaction_belongs_to_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $transaction = Transaction::factory()->create([
            'product_id' => $product->id,
            'user_id' => $user->id,
        ]);

        $this->assertEquals($product->id, $transaction->product->id);
    }

    public function test_transaction_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $transaction = Transaction::factory()->create([
            'product_id' => $product->id,
            'user_id' => $user->id,
        ]);

        $this->assertEquals($user->id, $transaction->user->id);
    }

    public function test_transaction_type_can_be_in(): void
    {
        $transaction = Transaction::factory()->create(['type' => 'in']);

        $this->assertEquals('in', $transaction->type);
    }

    public function test_transaction_type_can_be_out(): void
    {
        $transaction = Transaction::factory()->create(['type' => 'out']);

        $this->assertEquals('out', $transaction->type);
    }

    public function test_transaction_timestamps_are_set(): void
    {
        $transaction = Transaction::factory()->create();

        $this->assertNotNull($transaction->created_at);
        $this->assertNotNull($transaction->updated_at);
    }
}
