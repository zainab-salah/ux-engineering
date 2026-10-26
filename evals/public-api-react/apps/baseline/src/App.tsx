import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, Box, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, CircleX, DollarSign, ExternalLink, FolderOpen, Info, Layers3, LoaderCircle, Menu, Package, PackageCheck, PackageOpen, Pencil, Plus, Search, SearchX, ShieldCheck, SlidersHorizontal, Trash2, TriangleAlert, X } from 'lucide-react';
import { apiRequest, categoryName, EMPTY_CHANGES, filterProducts, mergeProducts, money, stockStatus, STORAGE_KEY, validProduct, type Changes, type Product, type StockFilter } from './products';

type FormValues = { title: string; description: string; category: string; price: string; stock: string; brand: string; sku: string; thumbnail: string };
type Notification = { message: string; tone: 'success' | 'warning' };
const PAGE_SIZE = 8;

function readChanges(): Changes {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (saved && Array.isArray(saved.upserts) && saved.upserts.every(validProduct) && Array.isArray(saved.deleted) && saved.deleted.every((key: unknown) => typeof key === 'string')) return saved;
  } catch { /* Start with the server catalog if browser storage is unavailable. */ }
  return EMPTY_CHANGES;
}

function ProductImage({ product, className = '' }: { product: Pick<Product, 'thumbnail' | 'title'>; className?: string }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [product.thumbnail]);
  return <div className={`product-image ${className}`}>{product.thumbnail && !broken ? <img src={product.thumbnail} alt="" loading="lazy" onError={() => setBroken(true)} /> : <Package size={24} />}</div>;
}

function Dialog({ title, children, onClose, busy, className = '' }: { title: string; children: ReactNode; onClose: () => void; busy?: boolean; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.showModal();
    return () => { ref.current?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className={className} aria-label={title} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} onClick={event => { if (event.target === event.currentTarget && !busy) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }}>
    <button type="button" className="icon-button dialog-close" aria-label="Close dialog" disabled={busy} onClick={onClose}><X size={20} /></button>
    {children}
  </dialog>;
}

function ProductForm({ product, categories, onSave, onClose }: { product?: Product; categories: string[]; onSave: (values: FormValues, product?: Product) => Promise<void>; onClose: () => void }) {
  const [values, setValues] = useState<FormValues>({ title: product?.title ?? '', description: product?.description ?? '', category: product?.category ?? '', price: product?.price.toString() ?? '', stock: product?.stock.toString() ?? '0', brand: product?.brand ?? '', sku: product?.sku ?? '', thumbnail: product?.thumbnail ?? '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const change = (name: keyof FormValues, value: string) => setValues(current => ({ ...current, [name]: value }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.title.trim()) { setError('Enter a product name.'); return; }
    if (!values.category || !Number.isFinite(Number(values.price)) || Number(values.price) < 0 || !Number.isInteger(Number(values.stock)) || Number(values.stock) < 0) { setError('Choose a category and enter a valid price and stock quantity.'); return; }
    if (values.thumbnail && !/^https?:\/\//i.test(values.thumbnail)) { setError('Use an image URL starting with https:// or http://.'); return; }
    setBusy(true); setError('');
    try { await onSave(values, product); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Something went wrong. Try again.'); setBusy(false); }
  }
  return <Dialog title={product ? 'Edit product' : 'Add product'} onClose={onClose} busy={busy} className="product-dialog">
    <div className="dialog-heading"><span className="dialog-symbol"><Package size={23} /></span><h2>{product ? 'Edit product' : 'Add a new product'}</h2><p>{product ? 'Make changes to your product details.' : 'Give your next product a place on the shelf.'}</p></div>
    <form onSubmit={submit}>
      <div className="form-body">
        {product && <div className="editing-product"><ProductImage product={product} /><div><strong>{product.title}</strong><span>{product.sku || `Product #${product.id}`}</span></div><span className="badge neutral">{product.local ? 'Local product' : `#${product.id}`}</span></div>}
        <div className="form-grid">
          <label className="full-width">Product name <span>*</span><input autoFocus name="title" required maxLength={150} placeholder="e.g. Everyday canvas tote" value={values.title} onChange={event => change('title', event.target.value)} disabled={busy} /></label>
          <label>Category <span>*</span><div className="select-wrap"><select name="category" required value={values.category} onChange={event => change('category', event.target.value)} disabled={busy}><option value="" disabled>Select a category</option>{categories.map(category => <option key={category} value={category}>{categoryName(category)}</option>)}</select><ChevronDown size={15} /></div></label>
          <label>Brand<input name="brand" maxLength={100} placeholder="Brand name" value={values.brand} onChange={event => change('brand', event.target.value)} disabled={busy} /></label>
          <label>Price (USD) <span>*</span><div className="input-prefix"><span>$</span><input name="price" type="number" min="0" step="0.01" max="999999999" required placeholder="0.00" value={values.price} onChange={event => change('price', event.target.value)} disabled={busy} /></div></label>
          <label>Stock quantity <span>*</span><input name="stock" type="number" min="0" step="1" max="999999999" required value={values.stock} onChange={event => change('stock', event.target.value)} disabled={busy} /></label>
          <label className="full-width">SKU<input name="sku" maxLength={100} placeholder="e.g. TOTE-001" value={values.sku} onChange={event => change('sku', event.target.value)} disabled={busy} /></label>
          <label className="full-width">Description<textarea name="description" maxLength={3000} rows={3} placeholder="What makes this product special?" value={values.description} onChange={event => change('description', event.target.value)} disabled={busy} /></label>
          <label className="full-width">Image URL<input name="thumbnail" type="url" placeholder="https://example.com/product.jpg" value={values.thumbnail} onChange={event => change('thumbnail', event.target.value)} disabled={busy} /><small>Optional. Add a direct link to your product image.</small></label>
        </div>
        {error && <div className="form-error" role="alert"><CircleX size={17} /><span>{error}</span></div>}
      </div>
      <div className="dialog-footer"><span><ShieldCheck size={15} /> Saved in this browser</span><button type="button" className="button secondary" onClick={onClose} disabled={busy}>Cancel</button><button className="button primary" disabled={busy}>{busy ? <LoaderCircle size={17} className="spin" /> : product ? <Check size={17} /> : <Plus size={17} />}{busy ? 'Saving…' : product ? 'Save changes' : 'Add product'}</button></div>
    </form>
  </Dialog>;
}

export default function App() {
  const [baseProducts, setBaseProducts] = useState<Product[]>([]);
  const [changes, setChanges] = useState<Changes>(readChanges);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState<StockFilter>('all');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<Product | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setLoadError('');
    apiRequest<{ products: Record<string, unknown>[] }>('?limit=0', { signal: controller.signal }).then(data => {
      if (!Array.isArray(data.products)) throw new Error('The catalog returned an unexpected response. Please try again.');
      const products = data.products.map(raw => ({ ...raw, key: String(raw.id), brand: raw.brand ?? '', sku: raw.sku ?? '', thumbnail: raw.thumbnail ?? '', description: raw.description ?? '', rating: raw.rating ?? 0 } as Product));
      if (!products.every(validProduct)) throw new Error('Some catalog information could not be read. Please try again.');
      setBaseProducts(products);
    }).catch(reason => { if (!controller.signal.aborted) setLoadError(reason instanceof Error ? reason.message : 'Unable to load products.'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [loadAttempt]);

  useEffect(() => { if (notification) { const timeout = setTimeout(() => setNotification(null), 5500); return () => clearTimeout(timeout); } }, [notification]);
  const products = useMemo(() => mergeProducts(baseProducts, changes), [baseProducts, changes]);
  const categories = useMemo(() => [...new Set(products.map(product => product.category))].sort(), [products]);
  const filtered = useMemo(() => filterProducts(products, search, category, stock, sort), [products, search, category, stock, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleProducts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const lowStock = products.filter(product => product.stock > 0 && product.stock <= 10).length;
  const outOfStock = products.filter(product => product.stock === 0).length;
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  const hasFilters = !!search || !!category || stock !== 'all';

  function persist(next: Changes, message: string) {
    setChanges(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setNotification({ message, tone: 'success' }); }
    catch { setNotification({ message: `${message} Browser storage is unavailable; changes will last until you reload.`, tone: 'warning' }); }
  }

  async function save(values: FormValues, product?: Product) {
    const payload = { ...values, title: values.title.trim(), description: values.description.trim(), brand: values.brand.trim(), sku: values.sku.trim(), thumbnail: values.thumbnail.trim(), price: Number(values.price), stock: Number(values.stock) };
    // DummyJSON does not persist added IDs, so later changes to a new item stay local.
    const response = product?.local ? {} : await apiRequest<Partial<Product>>(product ? `/${product.id}` : '/add', { method: product ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    const updated: Product = { ...product, ...response, ...payload, id: product?.id ?? response.id ?? 0, key: product?.key ?? `local-${crypto.randomUUID()}`, rating: product?.rating ?? 0, local: product?.local ?? !product };
    persist({ ...changes, upserts: [updated, ...changes.upserts.filter(existing => existing.key !== updated.key)] }, product ? 'Product updated successfully.' : 'Your new product is on the shelf.');
    if (!product) { setSearch(''); setCategory(''); setStock('all'); setSort('default'); setPage(1); }
    setEditor(null);
  }

  async function remove() {
    if (!deleting) return;
    setDeleteBusy(true); setDeleteError('');
    try {
      if (!deleting.local) await apiRequest(`/${deleting.id}`, { method: 'DELETE' });
      persist({ upserts: changes.upserts.filter(product => product.key !== deleting.key), deleted: deleting.local ? changes.deleted : [...changes.deleted, deleting.key] }, 'Product deleted successfully.');
      setDeleting(null);
    } catch (reason) { setDeleteError(reason instanceof Error ? reason.message : 'Unable to delete this product.'); }
    finally { setDeleteBusy(false); }
  }

  function selectStock(value: StockFilter) { setStock(value); setPage(1); setSidebarOpen(false); }
  function clearFilters() { setSearch(''); setCategory(''); setStock('all'); setPage(1); }

  return <div className="app-shell">
    {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
    <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`} aria-label="Main navigation">
      <a className="brand" href="#" onClick={event => { event.preventDefault(); clearFilters(); }}><span className="brand-mark"><Layers3 size={23} strokeWidth={2.2} /></span>shelf<span className="brand-dot">.</span></a>
      <div className="workspace"><div className="workspace-icon">S</div><div><strong>My workspace</strong><span>Product management</span></div><ChevronDown size={15} /></div>
      <div className="nav-label">CATALOG</div>
      <nav>
        <button className={`nav-item ${stock === 'all' ? 'active' : ''}`} onClick={() => selectStock('all')}><Package size={19} /><span>All products</span><span className="nav-count">{loading ? '—' : products.length}</span></button>
        <button className={`nav-item ${stock === 'low' ? 'active' : ''}`} onClick={() => selectStock('low')}><TriangleAlert size={19} /><span>Low stock</span>{!loading && <span className="nav-count">{lowStock}</span>}</button>
        <button className={`nav-item ${stock === 'out' ? 'active' : ''}`} onClick={() => selectStock('out')}><PackageOpen size={19} /><span>Out of stock</span>{!loading && <span className="nav-count">{outOfStock}</span>}</button>
      </nav>
      <div className="sidebar-footer"><div className="connected-card"><span className="connection-indicator" /><strong>Demo workspace</strong><p>Connected to DummyJSON.<br />A little space to try things out.</p><a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">API documentation <ArrowUpRight size={14} /></a></div><div className="sidebar-user"><div className="avatar">S</div><div><strong>Shelf workspace</strong><span>Personal catalog</span></div><span className="small-status" /></div></div>
    </aside>

    <div className="main-shell">
      <header className="topbar"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>Products</strong></div><div className="topbar-right"><span className="demo-pill"><span /> Demo mode</span><a className="icon-button" href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer" aria-label="View API help"><CircleHelp size={20} /></a><span className="topbar-divider" /><div className="avatar small">S</div></div></header>
      <main>
        <div className="page-heading"><div><div className="eyebrow">YOUR WORKSPACE, ORGANIZED</div><h1>Products<span className="heading-dot">.</span></h1><p>A little more order. A lot less busywork.</p></div><button className="button primary add-product" onClick={() => setEditor('new')} disabled={loading || !!loadError}><Plus size={18} /> Add product</button></div>

        <section className="stats-grid" aria-label="Catalog overview">
          <div className="stat-card"><div className="stat-top"><span>Total products</span><span className="stat-icon green"><Package size={18} /></span></div><div className="stat-value">{loading ? '—' : products.length}<span className="stat-label">products</span></div><div className="stat-note"><span className="mini-dot green-dot" /> Across {loading ? '—' : categories.length} categories</div></div>
          <div className="stat-card"><div className="stat-top"><span>In stock</span><span className="stat-icon blue"><PackageCheck size={18} /></span></div><div className="stat-value">{loading ? '—' : products.length - outOfStock}<span className="stat-label">products</span></div><div className="stat-note">Ready for your customers</div></div>
          <div className="stat-card"><div className="stat-top"><span>Low stock</span><span className="stat-icon amber"><TriangleAlert size={18} /></span></div><div className="stat-value">{loading ? '—' : lowStock}<span className="stat-label">products</span></div><button className="stat-link" onClick={() => selectStock('low')}>10 or fewer units remaining <ArrowUpRight size={14} /></button></div>
          <div className="stat-card"><div className="stat-top"><span>Inventory value</span><span className="stat-icon purple"><DollarSign size={18} /></span></div><div className="stat-value money">{loading ? '—' : money(inventoryValue)}</div><div className="stat-note">Based on current stock · USD</div></div>
        </section>

        <div className="demo-notice"><Info size={17} /><p><strong>A safe space to manage your catalog.</strong> This is demo data. Your changes are saved in this browser.</p><a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">Learn more <ExternalLink size={13} /></a></div>

        <section className="catalog-card" aria-label="Products catalog">
          <div className="catalog-title"><div><h2>{stock === 'low' ? 'Low stock products' : stock === 'out' ? 'Out of stock products' : 'Product catalog'}</h2><span className="count-pill">{loading ? '—' : filtered.length}</span></div><span className="catalog-subtitle">Everything on your shelf</span></div>
          <div className="catalog-tools"><div className="search-field"><Search size={18} /><input aria-label="Search products" placeholder="Search by name, brand, or SKU…" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} />{search && <button className="icon-button" aria-label="Clear search" onClick={() => { setSearch(''); setPage(1); }}><X size={15} /></button>}</div><div className="filter-controls"><div className="select-wrap category-select"><FolderOpen size={16} /><select aria-label="Filter by category" value={category} onChange={event => { setCategory(event.target.value); setPage(1); }}><option value="">All categories</option>{categories.map(item => <option value={item} key={item}>{categoryName(item)}</option>)}</select><ChevronDown size={14} /></div><div className="select-wrap sort-select"><SlidersHorizontal size={16} /><select aria-label="Sort products" value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value="default">Default order</option><option value="name">Name: A to Z</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="stock">Stock: low to high</option></select><ChevronDown size={14} /></div></div></div>
          {hasFilters && !loading && <div className="active-filters"><span>{filtered.length} matching {filtered.length === 1 ? 'product' : 'products'}</span>{category && <span className="filter-chip">{categoryName(category)}<button aria-label="Remove category filter" onClick={() => setCategory('')}><X size={12} /></button></span>}{stock !== 'all' && <span className="filter-chip">{stock === 'low' ? 'Low stock' : 'Out of stock'}<button aria-label="Remove stock filter" onClick={() => selectStock('all')}><X size={12} /></button></span>}<button className="text-button" onClick={clearFilters}>Clear filters</button></div>}

          {loadError ? <div className="empty-state" role="alert"><span className="empty-icon error"><TriangleAlert size={29} /></span><h3>We couldn’t load your catalog</h3><p>{loadError}</p><button className="button primary" onClick={() => setLoadAttempt(attempt => attempt + 1)}>Try again</button></div> : <div className="table-scroll"><table><thead><tr><th className="product-column">Product</th><th>Category</th><th className="numeric">Price</th><th className="stock-column">Stock</th><th>Status</th><th className="actions-heading">Actions</th></tr></thead><tbody>
            {loading ? Array.from({ length: PAGE_SIZE }, (_, index) => <tr className="skeleton-row" key={index}><td><div className="skeleton-product"><span className="skeleton skeleton-image" /><div><span className="skeleton skeleton-title" /><span className="skeleton skeleton-subtitle" /></div></div></td><td><span className="skeleton skeleton-category" /></td><td><span className="skeleton skeleton-price" /></td><td><span className="skeleton skeleton-category" /></td><td><span className="skeleton skeleton-category" /></td><td><span className="skeleton skeleton-price" /></td></tr>) : visibleProducts.map(product => <tr key={product.key}>
              <td><div className="product-cell"><ProductImage product={product} /><div className="product-name"><button onClick={() => setEditor(product)} title={`Edit ${product.title}`}>{product.title}</button><span>{product.sku || product.brand || `Product #${product.id}`}{product.local && <span className="local-label"> · Local</span>}</span></div></div></td>
              <td><span className="category-badge">{categoryName(product.category)}</span></td><td className="numeric price">{money(product.price)}</td><td><div className="stock-number">{product.stock}<span> units</span></div><div className="stock-bar"><span style={{ width: `${Math.min(product.stock, 100)}%` }} className={product.stock <= 10 ? 'low' : ''} /></div></td>
              <td><span className={`badge ${product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'in'}`}><span />{stockStatus(product.stock)}</span></td><td><div className="row-actions"><button className="icon-button edit-action" aria-label={`Edit ${product.title}`} title="Edit product" onClick={() => setEditor(product)}><Pencil size={16} /></button><button className="icon-button delete-action" aria-label={`Delete ${product.title}`} title="Delete product" onClick={() => { setDeleting(product); setDeleteError(''); }}><Trash2 size={16} /></button></div></td>
            </tr>)}
          </tbody></table>{!loading && !filtered.length && <div className="empty-state"><span className="empty-icon">{hasFilters ? <SearchX size={29} /> : <Box size={29} />}</span><h3>{hasFilters ? 'No products found' : 'Your shelf is ready'}</h3><p>{hasFilters ? 'Try a different search or give your filters a fresh start.' : 'Add your first product to start building your catalog.'}</p><button className="button secondary" onClick={hasFilters ? clearFilters : () => setEditor('new')}>{hasFilters ? 'Clear filters' : 'Add product'}</button></div>}</div>}
          {!loadError && <div className="table-footer"><p>{loading ? 'Loading your catalog…' : <>Showing <strong>{filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> products</>}</p><div className="pagination"><button className="pagination-arrow" aria-label="Previous page" disabled={loading || currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={17} /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).filter(number => number === 1 || number === pageCount || Math.abs(number - currentPage) <= 1).map((number, index, numbers) => <span className="page-slot" key={number}>{index > 0 && number - numbers[index - 1] > 1 && <span className="page-ellipsis">…</span>}<button aria-label={`Page ${number}`} aria-current={number === currentPage ? 'page' : undefined} className={number === currentPage ? 'selected' : ''} onClick={() => setPage(number)} disabled={loading}>{number}</button></span>)}<button className="pagination-arrow" aria-label="Next page" disabled={loading || currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRight size={17} /></button></div></div>}
        </section>
        <footer className="page-footer"><span><Layers3 size={14} /> A place for every product.</span><span>Made for a well-kept catalog <span className="footer-dot">✦</span></span></footer>
      </main>
    </div>
    {editor && <ProductForm product={editor === 'new' ? undefined : editor} categories={categories} onSave={save} onClose={() => setEditor(null)} />}
    {deleting && <Dialog title="Delete product" onClose={() => setDeleting(null)} busy={deleteBusy} className="delete-dialog"><div className="delete-symbol"><Trash2 size={25} /></div><h2>Remove this product?</h2><p><strong>{deleting.title}</strong> will be removed from your catalog in this browser. This action cannot be undone.</p><div className="delete-product"><ProductImage product={deleting} /><div><strong>{deleting.title}</strong><span>{categoryName(deleting.category)} · {money(deleting.price)}</span></div></div>{deleteError && <div className="form-error" role="alert"><CircleX size={17} />{deleteError}</div>}<div className="delete-footer"><button className="button secondary" onClick={() => setDeleting(null)} disabled={deleteBusy}>Keep product</button><button className="button danger" onClick={remove} disabled={deleteBusy}>{deleteBusy ? <LoaderCircle size={16} className="spin" /> : <Trash2 size={16} />}{deleteBusy ? 'Deleting…' : 'Delete product'}</button></div></Dialog>}
    {notification && <div role="status" className={`toast ${notification.tone}`}>{notification.tone === 'success' ? <CheckCircle2 size={21} /> : <TriangleAlert size={21} />}<span>{notification.message}</span><button className="icon-button" aria-label="Dismiss notification" onClick={() => setNotification(null)}><X size={16} /></button></div>}
  </div>;
}
