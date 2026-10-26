import { Pencil, Trash2 } from 'lucide-react';
import { categoryName, money, stockStatus, type Product } from '../products';
import { ProductImage } from './ProductImage';

interface Props { products: Product[]; onEdit: (product: Product) => void; onDelete: (product: Product) => void }

const tone = (stock: number) => stock === 0 ? 'out' : stock <= 10 ? 'low' : 'in';

export function ProductTable({ products, onEdit, onDelete }: Props) {
  return <div className="table-scroll"><table>
    <caption className="sr-only">Products</caption>
    <thead><tr><th scope="col">Product</th><th scope="col" className="col-category">Category</th><th scope="col" className="numeric">Price</th><th scope="col" className="numeric col-stock">Stock</th><th scope="col" className="col-status">Status</th><th scope="col" className="actions-col"><span className="sr-only">Actions</span></th></tr></thead>
    <tbody>{products.map(product => <tr key={product.key}>
      <td><div className="product-cell"><ProductImage product={product} /><div className="product-name">
        <button type="button" className="link-button" onClick={() => onEdit(product)}>{product.title}</button>
        <span>{product.local ? <span className="local-tag">Local only</span> : `#${product.id}`}{(product.sku || product.brand) && ` · ${product.sku || product.brand}`}</span>
        <span className="row-meta">{categoryName(product.category)} · {stockStatus(product.stock)} ({product.stock})</span>
      </div></div></td>
      <td className="col-category"><span className="chip">{categoryName(product.category)}</span></td>
      <td className="numeric">{money(product.price)}</td>
      <td className="numeric col-stock">{product.stock}</td>
      <td className="col-status"><span className={`badge ${tone(product.stock)}`}>{stockStatus(product.stock)}</span></td>
      <td className="actions-col"><div className="row-actions">
        <button type="button" className="icon-button" aria-label={`Edit ${product.title}`} title="Edit" onClick={() => onEdit(product)}><Pencil size={16} /></button>
        <button type="button" className="icon-button danger-hover" aria-label={`Delete ${product.title}`} title="Delete" onClick={() => onDelete(product)}><Trash2 size={16} /></button>
      </div></td>
    </tr>)}</tbody>
  </table></div>;
}
