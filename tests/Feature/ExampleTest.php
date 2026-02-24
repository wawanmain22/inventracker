<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_redirects_to_login(): void
    {
        $response = $this->get(route('home'));

        $response->assertRedirect(route('login'));
    }

    public function test_login_page_returns_successful_response(): void
    {
        $response = $this->get(route('login'));

        $response->assertOk();
    }

    public function test_dashboard_requires_authentication(): void
    {
        $response = $this->get(route('dashboard'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_access_dashboard(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
    }
}
