import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, pageCount, onPage, from, to, total }: { page: number; pageCount: number; onPage: (page: number) => void; from: number; to: number; total: number }) {
  const numbers = Array.from({ length: pageCount }, (_, i) => i + 1).filter(n => n === 1 || n === pageCount || Math.abs(n - page) <= 1);
  return <div className="table-footer">
    <p aria-live="polite">Showing <strong>{from}–{to}</strong> of <strong>{total}</strong></p>
    {pageCount > 1 && <nav aria-label="Pagination" className="pagination">
      <button type="button" className="icon-button" aria-label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)}><ChevronLeft size={17} /></button>
      {numbers.map((n, i) => <span className="page-slot" key={n}>{i > 0 && n - numbers[i - 1] > 1 && <span aria-hidden="true">…</span>}
        <button type="button" className={`page-button${n === page ? ' selected' : ''}`} aria-label={`Page ${n}`} aria-current={n === page ? 'page' : undefined} onClick={() => onPage(n)}>{n}</button></span>)}
      <button type="button" className="icon-button" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPage(page + 1)}><ChevronRight size={17} /></button>
    </nav>}
  </div>;
}
