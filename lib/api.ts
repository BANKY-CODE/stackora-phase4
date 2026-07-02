// ── Marketplace API ────────────────────────────────────────────
export const marketplaceApi = {
  listProducts: (category?: string) =>
    apiFetch<{ data: Array<{
      id: string;
      title: string;
      description: string | null;
      category: string;
      priceNaira: number;
      coverUrl: string | null;
      contentUrl: string | null;
      salesCount: number;
      seller: string | null;
      sellerName: string | null;
      createdAt: string;
    }> }>(`/marketplace/products${category ? `?category=${category}` : ''}`),

  getProduct: (id: string) =>
    apiFetch<{ data: {
      id: string;
      title: string;
      description: string | null;
      category: string;
      priceNaira: number;
      coverUrl: string | null;
      contentUrl: string | null;
      salesCount: number;
      seller: string | null;
      sellerName: string | null;
      createdAt: string;
    } }>(`/marketplace/products/${id}`),

  createProduct: (data: { title: string; description?: string; category?: string; price: number; coverUrl?: string; contentUrl?: string }) =>
    apiFetch<{ data: { id: string; title: string } }>(
      '/marketplace/products',
      { method: 'POST', body: JSON.stringify(data) },
    ),

  myProducts: () =>
    apiFetch<{ data: Array<{ id: string; title: string; priceNaira: number; salesCount: number; category: string; createdAt: string }> }>(
      '/marketplace/my-products',
    ),

  myPurchases: () =>
    apiFetch<{ data: Array<{
      purchaseId: string;
      productId: string;
      title: string;
      description: string | null;
      category: string;
      contentUrl: string | null;
      seller: string;
      priceNaira: number;
      purchasedAt: string;
    }> }>('/marketplace/my-purchases'),

  buyProduct: (id: string) =>
    apiFetch<{ data: { reference: string; title: string; pricePaidNaira: number; balanceAfterNaira: number; contentUrl: string | null } }>(
      `/marketplace/products/${id}/buy`,
      { method: 'POST' },
    ),
};
