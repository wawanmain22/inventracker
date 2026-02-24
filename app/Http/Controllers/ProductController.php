<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Product::with('category');

        // Search filter
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Stock filter
        if ($request->filled('stock')) {
            if ($request->stock === 'low') {
                $query->where('stock', '<=', 10)->where('stock', '>', 0);
            } elseif ($request->stock === 'out') {
                $query->where('stock', 0);
            } elseif ($request->stock === 'available') {
                $query->where('stock', '>', 10);
            }
        }

        $products = $query->latest()->paginate(10)->withQueryString();
        $categories = Category::all();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'stock']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categories = Category::all();

        return Inertia::render('products/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'stock' => ['required', 'integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($validated);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'create',
            'model_type' => 'Product',
            'model_id' => $product->id,
            'description' => "Membuat produk: {$product->name}",
        ]);

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): Response
    {
        $product->load(['category', 'transactions.user']);

        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        $categories = Category::all();

        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'stock' => ['required', 'integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update',
            'model_type' => 'Product',
            'model_id' => $product->id,
            'description' => "Mengubah produk: {$product->name}",
        ]);

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $productName = $product->name;

        // Delete image if exists
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'delete',
            'model_type' => 'Product',
            'model_id' => $product->id,
            'description' => "Menghapus produk: {$productName}",
        ]);

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}
