<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $categories = Category::withCount('products')
            ->latest()
            ->paginate(10);

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories'],
            'description' => ['nullable', 'string'],
        ]);

        $category = Category::create($validated);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'create',
            'model_type' => 'Category',
            'model_id' => $category->id,
            'description' => "Membuat kategori: {$category->name}",
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category): Response
    {
        return Inertia::render('categories/edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,'.$category->id],
            'description' => ['nullable', 'string'],
        ]);

        $category->update($validated);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update',
            'model_type' => 'Category',
            'model_id' => $category->id,
            'description' => "Mengubah kategori: {$category->name}",
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Category $category): RedirectResponse
    {
        $categoryName = $category->name;

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'delete',
            'model_type' => 'Category',
            'model_id' => $category->id,
            'description' => "Menghapus kategori: {$categoryName}",
        ]);

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }
}
