<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_login_page(): void
    {
        $response = $this->get(route('login'));

        $response->assertOk();
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post(route('login'), [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post(route('login'), [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_email_is_required_for_login(): void
    {
        $response = $this->post(route('login'), [
            'email' => '',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_password_is_required_for_login(): void
    {
        $response = $this->post(route('login'), [
            'email' => 'test@example.com',
            'password' => '',
        ]);

        $response->assertSessionHasErrors('password');
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('logout'));

        $this->assertGuest();
    }

    public function test_authenticated_user_cannot_view_login_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('login'));

        $response->assertRedirect(route('dashboard'));
    }

    public function test_user_can_view_register_page(): void
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_user_can_register_with_valid_data(): void
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->post(route('register'), $data);

        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    }

    public function test_user_cannot_register_with_existing_email(): void
    {
        User::factory()->create(['email' => 'john@example.com']);

        $data = [
            'name' => 'Jane Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->post(route('register'), $data);

        $response->assertSessionHasErrors('email');
    }

    public function test_password_confirmation_must_match(): void
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'differentpassword',
        ];

        $response = $this->post(route('register'), $data);

        $response->assertSessionHasErrors('password');
    }

    public function test_name_is_required_for_registration(): void
    {
        $data = [
            'name' => '',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->post(route('register'), $data);

        $response->assertSessionHasErrors('name');
    }
}
