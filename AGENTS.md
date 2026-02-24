# AGENTS.md - Coding Agent Guidelines

This document provides essential information for AI coding agents working in this Laravel 12 + Inertia v2 + React application.

## Tech Stack

- **Backend:** PHP 8.3, Laravel 12, Inertia v2
- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Testing:** PHPUnit 11
- **Code Style:** Laravel Pint (PHP), ESLint + Prettier (TS/JS)

---

## Build / Lint / Test Commands

### Development

```bash
composer run dev          # Start all services (server, queue, vite)
npm run dev               # Vite dev server only
npm run build             # Production build
```

### Linting & Formatting

```bash
# PHP
vendor/bin/pint           # Fix PHP code style (Laravel preset)
vendor/bin/pint --dirty   # Fix only modified files
composer run lint         # Run pint with parallel flag

# TypeScript/JavaScript
npm run lint              # ESLint with auto-fix
npm run format            # Prettier format resources/
npm run format:check      # Check formatting without changes
npm run types             # TypeScript type checking (tsc --noEmit)
```

### Testing

```bash
# Run all tests
php artisan test --compact
composer run test                    # Includes lint check + all tests

# Run specific test file
php artisan test tests/Feature/ExampleTest.php

# Run single test by name (RECOMMENDED)
php artisan test --filter=test_example_returns_successful_response

# Run test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit
```

### Artisan Make Commands (Development)

```bash
# Models & Factories
php artisan make:model ModelName --no-interaction
php artisan make:model ModelName --migration --no-interaction
php artisan make:model ModelName --migration --factory --no-interaction
php artisan make:model ModelName --migration --factory --seeder --no-interaction

# Controllers
php artisan make:controller ControllerName --no-interaction
php artisan make:controller ControllerName --model=ModelName --no-interaction
php artisan make:controller ControllerName --resource --no-interaction
php artisan make:controller ControllerName --api --no-interaction

# Requests (Form Validation)
php artisan make:request StoreModelRequest --no-interaction
php artisan make:request UpdateModelRequest --no-interaction

# Migrations
php artisan make:migration create_table_name_table --no-interaction
php artisan make:migration add_column_to_table_name_table --no-interaction

# Views (if needed)
php artisan make:view view.name --no-interaction

# Classes & Utilities
php artisan make:class ClassName --no-interaction
php artisan make:service ServiceName --no-interaction

# Tests
php artisan make:test FeatureTestName --no-interaction         # Feature test
php artisan make:test UnitTestName --unit --no-interaction     # Unit test

# Other
php artisan make:job JobName --no-interaction
php artisan make:event EventName --no-interaction
php artisan make:listener ListenerName --no-interaction
php artisan make:middleware MiddlewareName --no-interaction
```

---

## Code Style Guidelines

### PHP Conventions

- **Formatting:** Laravel Pint with `laravel` preset
- **Braces:** Always use curly braces, even for single-line bodies
- **Constructors:** Use PHP 8 constructor property promotion
- **Types:** Always declare return types and parameter types
- **Comments:** Prefer PHPDoc blocks over inline comments
- **Enums:** Use TitleCase for enum keys (e.g., `Monthly`, `Weekly`)

```php
// Constructor promotion
public function __construct(public UserService $userService) {}

// Explicit types
protected function isEligible(User $user, ?string $code = null): bool
{
    return $user->isActive();
}
```

### TypeScript/React Conventions

- **Quotes:** Single quotes
- **Semicolons:** Required
- **Indentation:** 4 spaces
- **Print Width:** 150 characters
- **Imports:** Use `import type` for type-only imports
- **Import Order:** Alphabetized, grouped (builtin, external, internal, parent, sibling)
- **Types:** Prefer type aliases over interfaces
- **Page Files:** Lowercase filenames (e.g., `welcome.tsx`, not `Welcome.tsx`)
- **Components:** Default export function components

```typescript
import type { User } from '@/types';

import { Head } from '@inertiajs/react';

export default function Dashboard({ user }: { user: User }) {
    return <Head title="Dashboard" />;
}
```

### Naming Conventions

| Element             | Convention                     | Example               |
| ------------------- | ------------------------------ | --------------------- |
| PHP Classes         | PascalCase                     | `UserController`      |
| PHP Methods         | camelCase                      | `getUserById()`       |
| PHP Variables       | camelCase                      | `$isActive`           |
| Test Methods        | snake*case with `test*` prefix | `test_user_can_login` |
| TS/React Components | PascalCase                     | `UserProfile`         |
| TS Variables        | camelCase                      | `isLoading`           |
| Page Files          | lowercase                      | `dashboard.tsx`       |
| Route Names         | dot notation                   | `users.index`         |

---

## Laravel-Specific Guidelines

### Database & Eloquent

- Use `Model::query()` instead of `DB::` facade
- Use eager loading to prevent N+1 queries
- Define casts via `casts()` method, not `$casts` property
- Use factories with `fake()` helper (not `$this->faker`)

### Controllers & Validation

- Create Form Request classes for validation
- Use `php artisan make:request StoreUserRequest`

### Routes

- Use named routes with `route()` helper
- Frontend: Import from `@/actions/` (controllers) or `@/routes/` (named routes)

### Configuration

- Never use `env()` outside config files
- Always use `config('app.name')` instead

---

## Testing Guidelines

### PHPUnit (Not Pest)

- All tests must be PHPUnit classes
- Create tests: `php artisan make:test UserTest` (Feature) or `--unit` (Unit)
- Use `RefreshDatabase` trait for database tests
- Use model factories with states

```php
class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_dashboard(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
    }
}
```

### Running Tests After Changes

1. Run the specific test: `php artisan test --filter=test_name`
2. Run related test file: `php artisan test tests/Feature/UserTest.php`
3. Before finalizing, offer to run full suite

---

## Project Structure

```
app/
├── Http/Controllers/      # Controllers
├── Http/Middleware/       # Middleware
├── Http/Requests/         # Form Requests
├── Models/                # Eloquent Models
└── Providers/             # Service Providers

bootstrap/
├── app.php                # Middleware, exceptions, routing config
└── providers.php          # Service providers list

resources/js/
├── components/            # Reusable React components
├── layouts/               # Layout components
├── lib/                   # Utilities (cn, utils)
├── pages/                 # Inertia page components (lowercase)
├── types/                 # TypeScript type definitions
└── app.tsx                # Inertia entry point

routes/
├── web.php                # Web routes
├── api.php                # API routes
└── console.php            # Console commands

tests/
├── Feature/               # Feature/integration tests
└── Unit/                  # Unit tests
```

---

## Pre-Commit Checklist

1. **PHP:** Run `vendor/bin/pint --dirty`
2. **TS/JS:** Run `npm run lint && npm run format`
3. **Types:** Run `npm run types`
4. **Tests:** Run relevant tests with `--filter`

---

## Responsive Design Guidelines

This application is fully responsive across mobile, tablet, and desktop viewports.

### Breakpoints

- **Mobile:** < 640px (default styles, no prefix)
- **Tablet:** `sm:` (640px+)
- **Desktop:** `lg:` (1024px+) - Sidebar shows at this breakpoint

### Responsive Patterns

#### 1. Sidebar Navigation

- **Desktop (lg+):** Fixed sidebar visible
- **Mobile/Tablet:** Hamburger menu with Sheet (drawer) component from shadcn/ui

```tsx
// Mobile hamburger button (visible on mobile/tablet)
<Button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
    <Menu className="h-5 w-5" />
</Button>

// Desktop sidebar (hidden on mobile/tablet)
<aside className="hidden lg:flex lg:w-64 lg:flex-col">
    {/* Sidebar content */}
</aside>
```

#### 2. Tables to Cards

- **Desktop (sm+):** Full table with TableHeader, TableBody
- **Mobile:** Card-based view with individual cards per row

```tsx
{
    /* Mobile: Card-based view */
}
<div className="space-y-3 sm:hidden">
    {items.map((item) => (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">{/* Card content */}</div>
    ))}
</div>;

{
    /* Desktop: Table view */
}
<div className="hidden sm:block">
    <Table>...</Table>
</div>;
```

#### 3. Grid Layouts

```tsx
// Stats cards: 2 columns mobile, 4 columns desktop
<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

// Summary cards: 3 columns always
<div className="grid grid-cols-3 gap-3 sm:gap-4">

// Form layouts: stack on mobile, columns on desktop
<div className="grid gap-4 lg:grid-cols-3">
```

#### 4. Form Layouts

- **Desktop:** Multi-column layouts (2-3 columns)
- **Mobile:** Single column, stacked vertically
- Image upload sections appear first on mobile (`order-first lg:order-none`)

### Mobile Card Style

Always use this consistent card style for mobile list views:

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    {/* Badge with icon */}
    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        <ArrowDownCircle className="mr-1 h-3 w-3" />
        Masuk
    </Badge>

    {/* Title */}
    <p className="mt-2 text-base font-semibold text-gray-900">Product Name</p>

    {/* Category badge */}
    <Badge variant="secondary" className="mt-1.5">
        Category
    </Badge>

    {/* Footer with separator */}
    <div className="mt-3 border-t border-gray-100 pt-3 text-xs text-muted-foreground">
        <span>24 Feb 26</span>
        <span className="text-gray-300">|</span>
        <span>User Name</span>
    </div>
</div>
```

### Pages with Responsive Implementation

| Page                      | Mobile Card View                   | Responsive Layout    |
| ------------------------- | ---------------------------------- | -------------------- |
| `dashboard.tsx`           | Transaksi Terbaru, Peringatan Stok | Stats 2x2 grid       |
| `categories/index.tsx`    | Category list                      | Responsive dialogs   |
| `products/index.tsx`      | Product list with images           | Responsive filters   |
| `products/create.tsx`     | -                                  | 3-column form layout |
| `products/edit.tsx`       | -                                  | 3-column form layout |
| `products/show.tsx`       | Transaction history                | Detail layout        |
| `transactions/index.tsx`  | Transaction list                   | Responsive filters   |
| `transactions/create.tsx` | -                                  | Responsive form      |
| `reports/index.tsx`       | Daftar Transaksi, Log Aktivitas    | Summary cards        |
| `profile/edit.tsx`        | -                                  | Responsive form      |

### Testing Responsive Design

Use Playwright MCP to test across viewports:

```typescript
// Mobile
await page.setViewportSize({ width: 375, height: 667 });

// Tablet
await page.setViewportSize({ width: 768, height: 1024 });

// Desktop
await page.setViewportSize({ width: 1920, height: 1080 });
```

---

## Error Handling

### Vite Manifest Error

If you see `ViteException: Unable to locate file in Vite manifest`:

- Run `npm run build` or
- Ask user to run `npm run dev`

### Frontend Changes Not Reflecting

User may need to run `npm run dev` or `composer run dev`

---

## Important Notes

- Use `php artisan make:*` commands with `--no-interaction` flag
- Check sibling files for conventions before creating new files
- Do not create new base directories without approval
- Do not modify dependencies without approval
- Activate `wayfinder-development` skill when working with frontend routes

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.3.28
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/wayfinder (WAYFINDER) - v0
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- phpunit/phpunit (PHPUNIT) - v11
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER) - v0
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Skills Activation

This project has domain-specific skills available. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

- `wayfinder-development` — Activates whenever referencing backend routes in frontend components. Use when importing from @/actions or @/routes, calling Laravel routes from TypeScript, or working with Wayfinder route functions.
- `inertia-react-development` — Develops Inertia.js v2 React client-side applications. Activates when creating React pages, forms, or navigation; using &lt;Link&gt;, &lt;Form&gt;, useForm, or router; working with deferred props, prefetching, or polling; or when user mentions React with Inertia, React pages, React forms, or React navigation.
- `tailwindcss-development` — Styles applications using Tailwind CSS v4 utilities. Activates when adding styles, restyling components, working with gradients, spacing, layout, flex, grid, responsive design, dark mode, colors, typography, or borders; or when the user mentions CSS, styling, classes, Tailwind, restyle, hero section, cards, buttons, or any visual/UI changes.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan

- Use the `list-artisan-commands` tool when you need to call an Artisan command to double-check the available parameters.

## URLs

- Whenever you share a project URL with the user, you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain/IP, and port.

## Tinker / Debugging

- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool

- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)

- Boost comes with a powerful `search-docs` tool you should use before trying other approaches when working with Laravel or Laravel ecosystem packages. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic-based queries at once. For example: `['rate limiting', 'routing rate limiting', 'routing']`. The most relevant results will be returned first.
- Do not add package names to queries; package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'.
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit".
3. Quoted Phrases (Exact Position) - query="infinite scroll" - words must be adjacent and in that order.
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit".
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms.

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.

## Constructors

- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function \_\_construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters unless the constructor is private.

## Type Declarations

- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Enums

- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.

## Comments

- Prefer PHPDoc blocks over inline comments. Never use comments within the code itself unless the logic is exceptionally complex.

## PHPDoc Blocks

- Add useful array shape type definitions when appropriate.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/Pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

=== inertia-laravel/v2 rules ===

# Inertia v2

- Use all Inertia features from v1 and v2. Check the documentation before making changes to ensure the correct approach.
- New features: deferred props, infinite scrolling (merging props + `WhenVisible`), lazy loading on scroll, polling, prefetching.
- When using deferred props, add an empty state with a pulsing or animated skeleton.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

## Database

- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries.
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## Controllers & Validation

- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

## Authentication & Authorization

- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Queues

- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

## Configuration

- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== laravel/v12 rules ===

# Laravel 12

- CRITICAL: ALWAYS use `search-docs` tool for version-specific Laravel documentation and updated code examples.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

## Laravel 12 Structure

- In Laravel 12, middleware are no longer registered in `app/Http/Kernel.php`.
- Middleware are configured declaratively in `bootstrap/app.php` using `Application::configure()->withMiddleware()`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- The `app\Console\Kernel.php` file no longer exists; use `bootstrap/app.php` or `routes/console.php` for console configuration.
- Console commands in `app/Console/Commands/` are automatically available and do not require manual registration.

## Database

- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 12 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models

- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.

=== wayfinder/core rules ===

# Laravel Wayfinder

Wayfinder generates TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

- IMPORTANT: Activate `wayfinder-development` skill whenever referencing backend routes in frontend components.
- Invokable Controllers: `import StorePost from '@/actions/.../StorePostController'; StorePost()`.
- Parameter Binding: Detects route keys (`{post:slug}`) — `show({ slug: "my-post" })`.
- Query Merging: `show(1, { mergeQuery: { page: 2, sort: null } })` merges with current URL, `null` removes params.
- Inertia: Use `.form()` with `<Form>` component or `form.submit(store())` with useForm.

=== pint/core rules ===

# Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.

=== phpunit/core rules ===

# PHPUnit

- This application uses PHPUnit for testing. All tests must be written as PHPUnit classes. Use `php artisan make:test --phpunit {name}` to create a new test.
- If you see a test using "Pest", convert it to PHPUnit.
- Every time a test has been updated, run that singular test.
- When the tests relating to your feature are passing, ask the user if they would like to also run the entire test suite to make sure everything is still passing.
- Tests should cover all happy paths, failure paths, and edge cases.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files; these are core to the application.

## Running Tests

- Run the minimal number of tests, using an appropriate filter, before finalizing.
- To run all tests: `php artisan test --compact`.
- To run all tests in a file: `php artisan test --compact tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --compact --filter=testName` (recommended after making a change to a related file).

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

=== tailwindcss/core rules ===

# Tailwind CSS

- Always use existing Tailwind conventions; check project patterns before adding new ones.
- IMPORTANT: Always use `search-docs` tool for version-specific Tailwind CSS documentation and updated code examples. Never rely on training data.
- IMPORTANT: Activate `tailwindcss-development` every time you're working with a Tailwind CSS or styling-related task.
  </laravel-boost-guidelines>
