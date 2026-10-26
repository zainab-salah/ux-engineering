import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ExternalLink, Info, LoaderCircle, Plus, RotateCcw, Search, SearchX, Box, TriangleAlert, X, Layers3 } from 'lucide-react';
import { createProduct, deleteProduct, fetchCategories, fetchProducts, updateProduct } from './api';
import { useLocalChanges } from './localChanges';
import {
  buildSavedProduct, categoryName, categoryOptions, filterProducts, hasChanges, isLowStock, mergeProducts, money, paginate,
  removeProduct, restoreProduct, upsertProduct, type Product, type ProductPayload, type SortKey, type StockFilter,
} from './products';
import { Combobox } from './components/Combobox';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Pagination } from './components/Pagination';
import { ProductFormDialog } from './components/ProductFormDialog';
import { ProductImage } from './components/ProductImage';
import { ProductTable } from './components/ProductTable';

const PAGE_SIZE = 10;
const DOCS = 'https://dummyjson.com/docs/products';
const STOCK_FILTERS: { value: StockFilter; label: string }[] = [{ value: 'all', label: 'All' }, { value: 'low', label: 'Low stock' }, { value: 'out', label: 'Out of stock' }];

export default function App() {
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: ({ signal }) => fetchProducts(signal) });
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: ({ signal }) => fetchCategories(signal) });
  const { changes, update, reset, storageOk } = useLocalChanges();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState<StockFilter>('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<Product | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [resetting, setResetting] = useState(false);

  const products = useMemo(() => mergeProducts(productsQuery.data ?? [], changes), [productsQuery.data, changes]);
  const categories = useMemo(() => categoryOptions(categoriesQuery.data ?? [], products, editor && editor !== 'new' ? editor.category : undefined), [categoriesQuery.data, products, editor]);
  const filterCategories = useMemo(() => categoryOptions([], products), [products]);
  const filtered = useMemo(() => filterProducts(products, search, category, stock, sort), [products, search, category, stock, sort]);
  const view = paginate(filtered, page, PAGE_SIZE);
  const counts = useMemo(() => ({ all: products.length, low: products.filter(isLowStock).length, out: products.filter(p => p.stock === 0).length }), [products]);
  const inventoryValue = useMemo(() => products.reduce((sum, p) => sum + p.price * p.stock, 0), [products]);
  const hasFilters = !!search || !!category || stock !== 'all';
  const loading = productsQuery.isPending;
  const failed = productsQuery.isError && !productsQuery.data;

  const saveMutation = useMutation({
    mutationFn: async ({ payload, product }: { payload: ProductPayload; product?: Product }) =>
      // Local products do not exist on the server; calling PUT for them would 404.
      product?.local ? {} : product ? updateProduct(product.id, payload) : createProduct(payload),
  });
  const deleteMutation = useMutation({ mutationFn: async (product: Product) => { if (!product.local) await deleteProduct(product.id); } });

  async function save(payload: ProductPayload, product?: Product) {
    const response = await saveMutation.mutateAsync({ payload, product });
    const saved = buildSavedProduct(product, response, payload, () => `local-${crypto.randomUUID()}`);
    update(current => upsertProduct(current, saved));
    if (!product) { setSearch(''); setCategory(''); setStock('all'); setSort('default'); setPage(1); }
    setEditor(null);
    const where = storageOk ? 'Saved in this browser.' : 'Browser storage is unavailable, so this lasts until you reload.';
    if (!product) toast.success(`Added “${saved.title}” as a local product.`, { description: `DummyJSON accepted the request but does not store new products. ${where}` });
    else if (product.local) toast.success(`Updated “${saved.title}”.`, { description: `This product exists only in this browser, so no request was sent. ${where}` });
    else toast.success(`Updated “${saved.title}”.`, { description: `DummyJSON simulated the update. ${where}` });
  }

  async function confirmDelete(product: Product) {
    await deleteMutation.mutateAsync(product);
    update(current => removeProduct(current, product));
    setDeleting(null);
    toast.success(`Deleted “${product.title}”.`, {
      description: product.local ? 'It only existed in this browser.' : 'DummyJSON simulated the delete; it is hidden in this browser.',
      action: { label: 'Undo', onClick: () => update(current => restoreProduct(current, product)) },
    });
  }

  const setFilter = <T,>(set: (value: T) => void) => (value: T) => { set(value); setPage(1); };
  const clearFilters = () => { setSearch(''); setCategory(''); setStock('all'); setPage(1); };

  return <div className="app">
    <header className="topbar">
      <a className="brand" href="/" aria-label="Shelf home"><Layers3 size={20} aria-hidden="true" />Shelf</a>
      <a className="docs-link" href={DOCS} target="_blank" rel="noreferrer">DummyJSON API docs <ExternalLink size={13} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
    </header>
    <main>
      <div className="page-head">
        <div>
          <h1>Products</h1>
          <p className="summary" aria-live="polite">{loading ? 'Loading catalog…' : failed ? 'Catalog unavailable' : `${counts.all} products · ${counts.low} low stock · ${counts.out} out of stock · ${money(inventoryValue)} inventory value`}</p>
        </div>
        <button type="button" className="button primary" onClick={() => setEditor('new')} disabled={loading || failed}><Plus size={18} aria-hidden="true" /> Add product</button>
      </div>

      <div className="notice" role="note">
        <Info size={17} aria-hidden="true" />
        <p><strong>Demo data.</strong> DummyJSON simulates writes and never stores them. Your adds, edits and deletes are saved only in this browser{storageOk ? '' : ' (storage is blocked, so they last until reload)'}.</p>
        {hasChanges(changes) && <button type="button" className="button small" onClick={() => setResetting(true)}><RotateCcw size={14} aria-hidden="true" /> Reset local changes</button>}
      </div>

      <section className="card" aria-label="Product list">
        <div className="toolbar">
          <div className="search-field">
            <Search size={17} aria-hidden="true" />
            <input type="search" className="control" aria-label="Search products" placeholder="Search products" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} />
          </div>
          <div className="toolbar-field"><label htmlFor="category-filter" className="sr-only">Category</label>
            <Combobox id="category-filter" value={category} onChange={setFilter(setCategory)} options={filterCategories.map(value => ({ value, label: categoryName(value) }))} placeholder="All categories" emptyOptionLabel="All categories" searchPlaceholder="Search categories…" /></div>
          <div className="segmented" role="group" aria-label="Stock level">
            {STOCK_FILTERS.map(option => <button key={option.value} type="button" aria-pressed={stock === option.value} onClick={() => setFilter(setStock)(option.value)}>{option.label}{!loading && !failed && <span className="count">{counts[option.value]}</span>}</button>)}
          </div>
          <div className="toolbar-field"><label htmlFor="sort" className="sr-only">Sort</label>
            <select id="sort" className="control" value={sort} onChange={event => setFilter(setSort)(event.target.value as SortKey)}>
              <option value="default">Default order</option><option value="name">Name: A to Z</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="stock">Stock: low to high</option>
            </select></div>
        </div>

        {hasFilters && !loading && !failed && <div className="active-filters"><span>{filtered.length} matching {filtered.length === 1 ? 'product' : 'products'}</span>
          {category && <span className="chip removable">{categoryName(category)}<button type="button" aria-label={`Remove category filter ${categoryName(category)}`} onClick={() => setFilter(setCategory)('')}><X size={12} /></button></span>}
          <button type="button" className="link-button" onClick={clearFilters}>Clear filters</button></div>}

        {failed ? <div className="state" role="alert"><TriangleAlert size={28} aria-hidden="true" /><h2>We couldn’t load the catalog</h2><p>{productsQuery.error.message}</p>
          <button type="button" className="button primary" onClick={() => productsQuery.refetch()} disabled={productsQuery.isFetching}>{productsQuery.isFetching && <LoaderCircle size={16} className="spin" aria-hidden="true" />}Try again</button></div>
        : loading ? <div className="state" role="status"><LoaderCircle size={24} className="spin" aria-hidden="true" /><p>Loading products…</p><div className="skeletons" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <span key={i} className="skeleton" />)}</div></div>
        : filtered.length === 0 ? <div className="state">{hasFilters ? <SearchX size={28} aria-hidden="true" /> : <Box size={28} aria-hidden="true" />}<h2>{hasFilters ? 'No products match' : 'No products yet'}</h2>
          <p>{hasFilters ? 'Try a different search or clear the filters.' : 'Add a product to get started.'}</p>
          <button type="button" className="button" onClick={hasFilters ? clearFilters : () => setEditor('new')}>{hasFilters ? 'Clear filters' : 'Add product'}</button></div>
        : <><ProductTable products={view.items} onEdit={setEditor} onDelete={setDeleting} /><Pagination page={view.page} pageCount={view.pageCount} onPage={setPage} from={view.from} to={view.to} total={filtered.length} /></>}
      </section>
    </main>

    {editor && <ProductFormDialog key={editor === 'new' ? 'new' : editor.key} product={editor === 'new' ? undefined : editor} categories={categories} onSubmit={save} onClose={() => setEditor(null)} />}
    {deleting && <ConfirmDialog title="Delete this product?" confirmLabel="Delete product" busyLabel="Deleting…" onConfirm={() => confirmDelete(deleting)} onClose={() => setDeleting(null)}>
      <div className="delete-product"><ProductImage product={deleting} /><div><strong>{deleting.title}</strong><span>{categoryName(deleting.category)} · {money(deleting.price)}</span></div></div>
      <p>{deleting.local ? 'This product exists only in this browser, so no request is sent.' : 'DummyJSON accepts the delete but keeps the product on its server. It will be hidden in this browser.'} You can undo right after.</p>
    </ConfirmDialog>}
    {resetting && <ConfirmDialog title="Reset local changes?" confirmLabel="Reset" busyLabel="Resetting…" onConfirm={async () => { reset(); setResetting(false); toast.success('Local changes cleared. Showing the original DummyJSON catalog.'); }} onClose={() => setResetting(false)}>
      <p>This removes every product you added and restores every product you edited or deleted in this browser.</p>
    </ConfirmDialog>}
  </div>;
}
