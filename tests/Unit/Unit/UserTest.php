<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_created(): void
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
    }

    public function test_user_fillable_attributes(): void
    {
        $fillable = ['name', 'email', 'password'];
        $user = new User();

        foreach ($fillable as $attribute) {
            $this->assertContains($attribute, $user->getFillable());
        }
    }

    public function test_user_password_is_hashed(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('secret123'),
        ]);

        $this->assertNotEquals('secret123', $user->password);
    }

    public function test_user_hidden_attributes(): void
    {
        $user = User::factory()->create();

        $this->assertContains('password', $user->getHidden());
        $this->assertContains('remember_token', $user->getHidden());
    }

    public function test_user_casts_email_verified_at_to_datetime(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->assertIsObject($user->email_verified_at);
    }

    public function test_user_timestamps_are_set(): void
    {
        $user = User::factory()->create();

        $this->assertNotNull($user->created_at);
        $this->assertNotNull($user->updated_at);
    }

    public function test_user_can_be_authenticated(): void
    {
        $user = User::factory()->create();

        $this->assertNotNull($user->getAuthIdentifier());
    }
}
