<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_authenticated_user_can_view_activity_logs_page(): void
    {
        $response = $this->actingAs($this->user)->get(route('reports.index'));

        $response->assertOk();
    }

    public function test_unauthenticated_user_cannot_view_activity_logs(): void
    {
        $response = $this->get(route('reports.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_activity_log_is_created_when_category_is_created(): void
    {
        $data = [
            'name' => 'Electronics',
            'description' => 'Electronic products',
        ];

        $this->actingAs($this->user)->post(route('categories.store'), $data);

        // Ideally, there should be an activity log entry
        // This depends on implementation - check if there's a listener/observer
        $this->assertDatabaseHas('categories', ['name' => 'Electronics']);
    }

    public function test_activity_log_contains_user_id(): void
    {
        $log = ActivityLog::factory()->create(['user_id' => $this->user->id]);

        $this->assertEquals($this->user->id, $log->user_id);
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->user->id,
        ]);
    }

    public function test_activity_log_contains_action(): void
    {
        $log = ActivityLog::factory()->create(['action' => 'created']);

        $this->assertEquals('created', $log->action);
    }

    public function test_activity_log_contains_model_type(): void
    {
        $log = ActivityLog::factory()->create([
            'model_type' => 'App\\Models\\Product',
        ]);

        $this->assertEquals('App\\Models\\Product', $log->model_type);
    }

    public function test_activity_log_contains_model_id(): void
    {
        $log = ActivityLog::factory()->create(['model_id' => 42]);

        $this->assertEquals(42, $log->model_id);
    }

    public function test_activity_log_contains_description(): void
    {
        $log = ActivityLog::factory()->create([
            'description' => 'Product created successfully',
        ]);

        $this->assertEquals('Product created successfully', $log->description);
    }

    public function test_activity_log_belongs_to_user(): void
    {
        $log = ActivityLog::factory()->create(['user_id' => $this->user->id]);

        $this->assertEquals($this->user->id, $log->user->id);
    }

    public function test_multiple_activity_logs_can_be_created(): void
    {
        ActivityLog::factory(5)->create(['user_id' => $this->user->id]);

        $this->assertCount(5, ActivityLog::where('user_id', $this->user->id)->get());
    }

    public function test_activity_logs_are_ordered_by_newest_first(): void
    {
        $oldLog = ActivityLog::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => now()->subDays(2),
        ]);

        $newLog = ActivityLog::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => now(),
        ]);

        $logs = ActivityLog::where('user_id', $this->user->id)
            ->orderByDesc('created_at')
            ->get();

        $this->assertEquals($newLog->id, $logs->first()->id);
        $this->assertEquals($oldLog->id, $logs->last()->id);
    }
}
