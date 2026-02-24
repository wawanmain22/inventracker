<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Inventaris - InvenTrack</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.5;
            color: #1f2937;
            background: #fff;
        }

        .page {
            padding: 40px;
        }

        /* Header Section */
        .header {
            display: table;
            width: 100%;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }

        .header-left {
            display: table-cell;
            vertical-align: middle;
            width: 70%;
        }

        .header-right {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            width: 30%;
        }

        .logo-section {
            display: table;
        }

        .logo-icon {
            display: table-cell;
            vertical-align: middle;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border-radius: 10px;
            text-align: center;
            line-height: 50px;
            color: white;
            font-size: 24px;
            font-weight: bold;
        }

        .logo-text {
            display: table-cell;
            vertical-align: middle;
            padding-left: 12px;
        }

        .company-name {
            font-size: 22px;
            font-weight: 700;
            color: #1e40af;
            margin: 0;
        }

        .company-tagline {
            font-size: 10px;
            color: #6b7280;
            margin: 0;
        }

        .report-title {
            font-size: 28px;
            font-weight: 700;
            color: #111827;
            margin-top: 15px;
        }

        .report-date {
            font-size: 11px;
            color: #6b7280;
            margin-top: 5px;
        }

        .doc-info {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            font-size: 10px;
        }

        .doc-info p {
            margin: 3px 0;
            color: #64748b;
        }

        .doc-info strong {
            color: #334155;
        }

        /* Filter Section */
        .filter-section {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 15px 20px;
            margin-bottom: 25px;
        }

        .filter-title {
            font-size: 11px;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .filter-content {
            display: table;
            width: 100%;
        }

        .filter-item {
            display: table-cell;
            width: 33.33%;
        }

        .filter-label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .filter-value {
            font-size: 12px;
            font-weight: 600;
            color: #1e3a8a;
        }

        /* Summary Cards */
        .summary-section {
            margin-bottom: 30px;
        }

        .summary-title {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }

        .summary-cards {
            display: table;
            width: 100%;
            table-layout: fixed;
        }

        .summary-card {
            display: table-cell;
            width: 32%;
            padding: 0 8px;
        }

        .summary-card:first-child {
            padding-left: 0;
        }

        .summary-card:last-child {
            padding-right: 0;
        }

        .card-inner {
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }

        .card-in {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 1px solid #a7f3d0;
        }

        .card-out {
            background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
            border: 1px solid #fca5a5;
        }

        .card-total {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 1px solid #93c5fd;
        }

        .card-number {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .card-in .card-number {
            color: #059669;
        }

        .card-out .card-number {
            color: #dc2626;
        }

        .card-total .card-number {
            color: #2563eb;
        }

        .card-label {
            font-size: 11px;
            font-weight: 500;
        }

        .card-in .card-label {
            color: #047857;
        }

        .card-out .card-label {
            color: #b91c1c;
        }

        .card-total .card-label {
            color: #1d4ed8;
        }

        .card-icon {
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 8px;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }

        .card-in .card-icon {
            background: rgba(5, 150, 105, 0.15);
            color: #059669;
        }

        .card-out .card-icon {
            background: rgba(220, 38, 38, 0.15);
            color: #dc2626;
        }

        .card-total .card-icon {
            background: rgba(37, 99, 235, 0.15);
            color: #2563eb;
        }

        /* Section Title */
        .section {
            margin-bottom: 30px;
        }

        .section-header {
            display: table;
            width: 100%;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2563eb;
        }

        .section-title {
            display: table-cell;
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
        }

        .section-badge {
            display: table-cell;
            text-align: right;
            vertical-align: middle;
        }

        .badge-count {
            background: #2563eb;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 600;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        th {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: white;
            padding: 12px 10px;
            text-align: left;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        th:first-child {
            border-radius: 6px 0 0 0;
        }

        th:last-child {
            border-radius: 0 6px 0 0;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11px;
        }

        tr:nth-child(even) {
            background-color: #f9fafb;
        }

        tr:hover {
            background-color: #f3f4f6;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        /* Badges */
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .badge-in {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-out {
            background: #fee2e2;
            color: #991b1b;
        }

        .badge-stock-ok {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-stock-low {
            background: #fef3c7;
            color: #92400e;
        }

        .badge-stock-out {
            background: #fee2e2;
            color: #991b1b;
        }

        /* Product Name with Category */
        .product-name {
            font-weight: 600;
            color: #111827;
        }

        .product-category {
            font-size: 9px;
            color: #6b7280;
            margin-top: 2px;
        }

        /* Price Formatting */
        .price {
            font-weight: 600;
            color: #059669;
        }

        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
        }

        .footer-content {
            display: table;
            width: 100%;
        }

        .footer-left {
            display: table-cell;
            width: 60%;
            vertical-align: top;
        }

        .footer-right {
            display: table-cell;
            width: 40%;
            text-align: right;
            vertical-align: top;
        }

        .footer-note {
            font-size: 9px;
            color: #9ca3af;
            line-height: 1.6;
        }

        .footer-signature {
            margin-top: 30px;
        }

        .signature-line {
            width: 150px;
            border-bottom: 1px solid #374151;
            margin-left: auto;
            margin-bottom: 5px;
        }

        .signature-label {
            font-size: 10px;
            color: #6b7280;
        }

        .signature-title {
            font-size: 11px;
            font-weight: 600;
            color: #374151;
            margin-top: 3px;
        }

        /* Page Break */
        .page-break {
            page-break-after: always;
        }

        /* No Data */
        .no-data {
            text-align: center;
            padding: 40px;
            color: #9ca3af;
            font-style: italic;
        }

        /* Watermark Effect */
        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 8px;
            color: #d1d5db;
            transform: rotate(-45deg);
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <div class="logo-section">
                    <div class="logo-icon">I</div>
                    <div class="logo-text">
                        <p class="company-name">InvenTrack</p>
                        <p class="company-tagline">Inventory Management System</p>
                    </div>
                </div>
                <h1 class="report-title">Laporan Inventaris</h1>
                <p class="report-date">Periode: {{ $filters['from_date'] ?? 'Semua waktu' }} s/d {{ $filters['to_date'] ?? 'Sekarang' }}</p>
            </div>
            <div class="header-right">
                <div class="doc-info">
                    <p><strong>No. Dokumen:</strong> INV-{{ now()->format('Ymd-His') }}</p>
                    <p><strong>Tanggal Cetak:</strong> {{ now()->format('d F Y') }}</p>
                    <p><strong>Waktu:</strong> {{ now()->format('H:i') }} WIB</p>
                    <p><strong>Dicetak oleh:</strong> {{ auth()->user()->name ?? 'System' }}</p>
                </div>
            </div>
        </div>

        <!-- Filter Info -->
        <div class="filter-section">
            <div class="filter-title">Parameter Laporan</div>
            <div class="filter-content">
                <div class="filter-item">
                    <div class="filter-label">Tanggal Mulai</div>
                    <div class="filter-value">{{ $filters['from_date'] ?? 'Tidak ditentukan' }}</div>
                </div>
                <div class="filter-item">
                    <div class="filter-label">Tanggal Akhir</div>
                    <div class="filter-value">{{ $filters['to_date'] ?? 'Tidak ditentukan' }}</div>
                </div>
                <div class="filter-item">
                    <div class="filter-label">Tipe Transaksi</div>
                    <div class="filter-value">
                        @if($filters['type'] === 'in')
                            Stok Masuk
                        @elseif($filters['type'] === 'out')
                            Stok Keluar
                        @else
                            Semua Tipe
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="summary-section">
            <div class="summary-title">Ringkasan Transaksi</div>
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="card-inner card-in">
                        <div class="card-icon">IN</div>
                        <div class="card-number">{{ number_format($summary['total_in']) }}</div>
                        <div class="card-label">Total Stok Masuk</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="card-inner card-out">
                        <div class="card-icon">OUT</div>
                        <div class="card-number">{{ number_format($summary['total_out']) }}</div>
                        <div class="card-label">Total Stok Keluar</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="card-inner card-total">
                        <div class="card-icon">ALL</div>
                        <div class="card-number">{{ number_format($summary['count']) }}</div>
                        <div class="card-label">Total Transaksi</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transaction Table -->
        <div class="section">
            <div class="section-header">
                <div class="section-title">Daftar Transaksi</div>
                <div class="section-badge">
                    <span class="badge-count">{{ count($transactions) }} Data</span>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;" class="text-center">No</th>
                        <th style="width: 15%;">Tanggal</th>
                        <th style="width: 25%;">Produk</th>
                        <th style="width: 15%;">Kategori</th>
                        <th style="width: 12%;" class="text-center">Tipe</th>
                        <th style="width: 13%;" class="text-right">Jumlah</th>
                        <th style="width: 15%;">Operator</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($transactions as $index => $transaction)
                        <tr>
                            <td class="text-center">{{ $index + 1 }}</td>
                            <td>{{ $transaction->created_at->format('d/m/Y H:i') }}</td>
                            <td>
                                <div class="product-name">{{ $transaction->product->name }}</div>
                            </td>
                            <td>{{ $transaction->product->category->name ?? '-' }}</td>
                            <td class="text-center">
                                <span class="badge badge-{{ $transaction->type }}">
                                    {{ $transaction->type === 'in' ? 'MASUK' : 'KELUAR' }}
                                </span>
                            </td>
                            <td class="text-right">{{ number_format($transaction->quantity) }} unit</td>
                            <td>{{ $transaction->user->name }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="no-data">Tidak ada data transaksi untuk periode ini</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Product Table -->
        <div class="section">
            <div class="section-header">
                <div class="section-title">Daftar Produk & Stok</div>
                <div class="section-badge">
                    <span class="badge-count">{{ count($products) }} Produk</span>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;" class="text-center">No</th>
                        <th style="width: 35%;">Nama Produk</th>
                        <th style="width: 20%;">Kategori</th>
                        <th style="width: 15%;" class="text-center">Status Stok</th>
                        <th style="width: 10%;" class="text-right">Stok</th>
                        <th style="width: 15%;" class="text-right">Harga</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($products as $index => $product)
                        <tr>
                            <td class="text-center">{{ $index + 1 }}</td>
                            <td>
                                <div class="product-name">{{ $product->name }}</div>
                                @if($product->description)
                                    <div class="product-category">{{ Str::limit($product->description, 50) }}</div>
                                @endif
                            </td>
                            <td>{{ $product->category->name ?? '-' }}</td>
                            <td class="text-center">
                                @if($product->stock === 0)
                                    <span class="badge badge-stock-out">HABIS</span>
                                @elseif($product->stock <= 10)
                                    <span class="badge badge-stock-low">MENIPIS</span>
                                @else
                                    <span class="badge badge-stock-ok">TERSEDIA</span>
                                @endif
                            </td>
                            <td class="text-right">{{ number_format($product->stock) }}</td>
                            <td class="text-right price">Rp {{ number_format($product->price, 0, ',', '.') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <div class="footer-left">
                    <div class="footer-note">
                        <strong>Catatan:</strong><br>
                        - Laporan ini digenerate secara otomatis oleh sistem InvenTrack<br>
                        - Data yang ditampilkan sesuai dengan filter yang dipilih<br>
                        - Untuk pertanyaan, hubungi administrator sistem
                    </div>
                </div>
                <div class="footer-right">
                    <div class="footer-signature">
                        <div class="signature-line"></div>
                        <div class="signature-label">Mengetahui,</div>
                        <div class="signature-title">Administrator</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
