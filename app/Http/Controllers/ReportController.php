<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Display the reports page.
     */
    public function index(Request $request): Response
    {
        $query = Transaction::with(['product.category', 'user']);

        // Date range filter
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $transactions = $query->latest()->paginate(15)->withQueryString();

        // Summary statistics
        $summary = [
            'total_in' => Transaction::query()
                ->when($request->from_date, fn ($q) => $q->whereDate('created_at', '>=', $request->from_date))
                ->when($request->to_date, fn ($q) => $q->whereDate('created_at', '<=', $request->to_date))
                ->where('type', 'in')
                ->sum('quantity'),
            'total_out' => Transaction::query()
                ->when($request->from_date, fn ($q) => $q->whereDate('created_at', '>=', $request->from_date))
                ->when($request->to_date, fn ($q) => $q->whereDate('created_at', '<=', $request->to_date))
                ->where('type', 'out')
                ->sum('quantity'),
            'transaction_count' => Transaction::query()
                ->when($request->from_date, fn ($q) => $q->whereDate('created_at', '>=', $request->from_date))
                ->when($request->to_date, fn ($q) => $q->whereDate('created_at', '<=', $request->to_date))
                ->when($request->type, fn ($q) => $q->where('type', $request->type))
                ->count(),
        ];

        // Activity logs
        $activityLogs = ActivityLog::with('user')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('reports/index', [
            'transactions' => $transactions,
            'summary' => $summary,
            'activityLogs' => $activityLogs,
            'filters' => $request->only(['from_date', 'to_date', 'type']),
        ]);
    }

    /**
     * Export report as PDF.
     */
    public function export(Request $request): HttpResponse
    {
        $query = Transaction::with(['product.category', 'user']);

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $transactions = $query->latest()->get();

        $summary = [
            'total_in' => $transactions->where('type', 'in')->sum('quantity'),
            'total_out' => $transactions->where('type', 'out')->sum('quantity'),
            'count' => $transactions->count(),
        ];

        $products = Product::with('category')->get();

        $pdf = Pdf::loadView('reports.pdf', [
            'transactions' => $transactions,
            'summary' => $summary,
            'products' => $products,
            'filters' => [
                'from_date' => $request->from_date,
                'to_date' => $request->to_date,
                'type' => $request->type,
            ],
        ]);

        return $pdf->download('laporan-inventaris-'.now()->format('Y-m-d').'.pdf');
    }
}
