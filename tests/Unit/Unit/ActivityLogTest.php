<?php

namespace Tests\Unit;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_activity_log_can_be_created(): void
    {
        $user = User::factory()->create();

        $log = ActivityLog::factory()->create([
            'user_id' => $user->id,
            'action' => 'created',
            'model_type' => 'App\\Models\\Product',
            'model_id' => 1,
            'description' => 'Product created',
        ]);

        $this->assertInstanceOf(ActivityLog::class, $log);
        $this->assertEquals('created', $log->action);
        $this->assertEquals(1, $log->model_id);
    }

    public function test_activity_log_fillable_attributes(): void
    {
        $fillable = ['user_id', 'action', 'model_type', 'model_id', 'description'];
        $log = new ActivityLog();

        foreach ($fillable as $attribute) {
            $this->assertContains($attribute, $log->getFillable());
        }
    }

    public function test_activity_log_action_types(): void
    {
        $actions = ['created', 'updated', 'deleted', 'viewed'];

        foreach ($actions as $action) {
            $log = ActivityLog::factory()->create(['action' => $action]);
            $this->assertEquals($action, $log->action);
        }
    }

    public function test_activity_log_model_types(): void
    {
        $modelTypes = [
            'App\\Models\\Category',
            'App\\Models\\Product',
            'App\\Models\\Transaction',
        ];

        foreach ($modelTypes as $modelType) {
            $log = ActivityLog::factory()->create(['model_type' => $modelType]);
            $this->assertEquals($modelType, $log->model_type);
        }
    }

    public function test_activity_log_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $log = ActivityLog::factory()->create(['user_id' => $user->id]);

        $this->assertEquals($user->id, $log->user->id);
        $this->assertInstanceOf(User::class, $log->user);
    }

    public function test_activity_log_timestamps_are_set(): void
    {
        $log = ActivityLog::factory()->create();

        $this->assertNotNull($log->created_at);
        $this->assertNotNull($log->updated_at);
    }

    public function test_activity_log_can_have_different_descriptions(): void
    {
        $descriptions = [
            'Category created',
            'Product updated',
            'Transaction recorded',
            'User deleted',
        ];

        foreach ($descriptions as $description) {
            $log = ActivityLog::factory()->create(['description' => $description]);
            $this->assertEquals($description, $log->description);
        }
    }

    public function test_activity_log_model_id_is_numeric(): void
    {
        $log = ActivityLog::factory()->create(['model_id' => 123]);

        $this->assertIsInt($log->model_id);
        $this->assertEquals(123, $log->model_id);
    }
}
