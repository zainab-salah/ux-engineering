import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import type { Product } from '../products';

export function ProductImage({ product }: { product: Pick<Product, 'thumbnail'> }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [product.thumbnail]);
  return <div className="product-image" aria-hidden="true">{product.thumbnail && !broken ? <img src={product.thumbnail} alt="" loading="lazy" onError={() => setBroken(true)} /> : <Package size={20} />}</div>;
}
