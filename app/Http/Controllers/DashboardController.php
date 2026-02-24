<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $lowStockProducts = Product::where('stock', '<=', 10)->count();
        $totalTransactions = Transaction::count();

        // Get recent transactions
        $recentTransactions = Transaction::with(['product', 'user'])
            ->latest()
            ->take(5)
            ->get();

        // Get low stock products
        $lowStockItems = Product::with('category')
            ->where('stock', '<=', 10)
            ->orderBy('stock')
            ->take(5)
            ->get();

        // Get monthly transaction summary (last 6 months)
        $monthlySummary = Transaction::selectRaw("
                TO_CHAR(created_at, 'YYYY-MM') as month,
                SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END) as total_in,
                SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END) as total_out
            ")
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'lowStockProducts' => $lowStockProducts,
                'totalTransactions' => $totalTransactions,
            ],
            'recentTransactions' => $recentTransactions,
            'lowStockItems' => $lowStockItems,
            'monthlySummary' => $monthlySummary,
        ]);
    }
}
