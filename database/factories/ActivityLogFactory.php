<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $actions = ['created', 'updated', 'deleted', 'viewed'];
        $modelTypes = ['App\\Models\\Category', 'App\\Models\\Product', 'App\\Models\\Transaction'];

        return [
            'user_id' => \App\Models\User::factory(),
            'action' => $this->faker->randomElement($actions),
            'model_type' => $this->faker->randomElement($modelTypes),
            'model_id' => $this->faker->numberBetween(1, 100),
            'description' => $this->faker->sentence(),
        ];
    }
}
