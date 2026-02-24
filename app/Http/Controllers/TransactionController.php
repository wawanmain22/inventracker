<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Transaction::with(['product', 'user']);

        // Type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Date range filter
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Product filter
        if ($request->filled('product')) {
            $query->where('product_id', $request->product);
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();
        $products = Product::all();

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'products' => $products,
            'filters' => $request->only(['type', 'from_date', 'to_date', 'product']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $products = Product::with('category')->get();

        return Inertia::render('transactions/create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'type' => ['required', 'in:in,out'],
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Check if enough stock for outgoing transaction
        if ($validated['type'] === 'out' && $product->stock < $validated['quantity']) {
            return back()->withErrors([
                'quantity' => 'Stok tidak mencukupi. Stok tersedia: '.$product->stock,
            ]);
        }

        DB::transaction(function () use ($validated, $product, $request) {
            // Create transaction
            $transaction = Transaction::create([
                ...$validated,
                'user_id' => $request->user()->id,
            ]);

            // Update product stock
            if ($validated['type'] === 'in') {
                $product->increment('stock', $validated['quantity']);
            } else {
                $product->decrement('stock', $validated['quantity']);
            }

            $typeLabel = $validated['type'] === 'in' ? 'Stok Masuk' : 'Stok Keluar';
            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'create',
                'model_type' => 'Transaction',
                'model_id' => $transaction->id,
                'description' => "{$typeLabel}: {$product->name} ({$validated['quantity']} unit)",
            ]);
        });

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction): Response
    {
        $transaction->load(['product.category', 'user']);

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Transaction $transaction): RedirectResponse
    {
        $product = $transaction->product;

        DB::transaction(function () use ($transaction, $product, $request) {
            // Reverse the stock change
            if ($transaction->type === 'in') {
                $product->decrement('stock', $transaction->quantity);
            } else {
                $product->increment('stock', $transaction->quantity);
            }

            $typeLabel = $transaction->type === 'in' ? 'Stok Masuk' : 'Stok Keluar';
            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'delete',
                'model_type' => 'Transaction',
                'model_id' => $transaction->id,
                'description' => "Menghapus transaksi {$typeLabel}: {$product->name}",
            ]);

            $transaction->delete();
        });

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil dihapus.');
    }
}
