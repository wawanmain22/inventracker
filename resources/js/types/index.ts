import type { Auth, User } from './auth';

export type * from './auth';

export type Category = {
    id: number;
    name: string;
    description: string | null;
    products_count?: number;
    created_at: string;
    updated_at: string;
};

export type Product = {
    id: number;
    category_id: number;
    name: string;
    description: string | null;
    image: string | null;
    stock: number;
    price: number;
    category?: Category;
    created_at: string;
    updated_at: string;
};

export type TransactionType = 'in' | 'out';

export type Transaction = {
    id: number;
    product_id: number;
    user_id: number;
    type: TransactionType;
    quantity: number;
    notes: string | null;
    product?: Product;
    user?: User;
    created_at: string;
    updated_at: string;
};

export type ActivityLog = {
    id: number;
    user_id: number;
    action: string;
    model_type: string;
    model_id: number;
    description: string;
    user?: User;
    created_at: string;
};

export type PaginatedData<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type Flash = {
    success?: string;
    error?: string;
};

export type SharedProps = {
    auth: Auth;
    flash: Flash;
};
