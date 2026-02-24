<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['in', 'out']),
            'quantity' => fake()->numberBetween(1, 50),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that this is an incoming transaction.
     */
    public function incoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'in',
        ]);
    }

    /**
     * Indicate that this is an outgoing transaction.
     */
    public function outgoing(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'out',
        ]);
    }
}
