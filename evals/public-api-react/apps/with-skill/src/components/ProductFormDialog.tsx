import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { CircleX, LoaderCircle, X } from 'lucide-react';
import { productFormSchema } from '../schema';
import { categoryName, toFormValues, toPayload, type Product, type ProductFormValues, type ProductPayload } from '../products';
import { Combobox } from './Combobox';
import { ProductImage } from './ProductImage';

interface Props {
  product?: Product;
  categories: string[];
  onSubmit: (payload: ProductPayload, product?: Product) => Promise<void>;
  onClose: () => void;
}

function Field({ id, label, required, hint, error, children }: { id: string; label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode }) {
  return <div className="field">
    <label htmlFor={id}>{label}{required ? <span className="req" aria-hidden="true"> *</span> : <span className="opt"> (optional)</span>}</label>
    {children}
    {hint && !error && <p className="hint" id={`${id}-hint`}>{hint}</p>}
    {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
  </div>;
}

export function ProductFormDialog({ product, categories, onSubmit, onClose }: Props) {
  const { register, control, handleSubmit, setFocus, formState: { errors, isDirty, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema), defaultValues: toFormValues(product), mode: 'onTouched',
  });
  const [serverError, setServerError] = useState('');
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const inFlight = useRef(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const aria = (name: keyof ProductFormValues, hint?: boolean) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : hint ? `${name}-hint` : undefined,
  });

  const submit = handleSubmit(async values => {
    if (inFlight.current) return; // second Enter/click while a request is pending
    inFlight.current = true; setServerError(''); setConfirmDiscard(false);
    try { await onSubmit(toPayload(values), product); }
    catch (reason) {
      setServerError(reason instanceof Error ? reason.message : 'Something went wrong.');
      setTimeout(() => alertRef.current?.focus(), 0);
    } finally { inFlight.current = false; }
  });

  const requestClose = () => { if (isSubmitting) return; if (isDirty) setConfirmDiscard(true); else onClose(); };
  const title = product ? 'Edit product' : 'Add product';

  return <Dialog.Root open onOpenChange={open => { if (!open) requestClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="overlay" />
      <Dialog.Content className="dialog product-dialog" aria-describedby={undefined} onOpenAutoFocus={event => { event.preventDefault(); setFocus('title'); }}>
        <div className="dialog-head">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Close className="icon-button" aria-label="Close" disabled={isSubmitting}><X size={18} /></Dialog.Close>
        </div>
        <form onSubmit={submit} noValidate>
          {serverError && <div className="form-error" role="alert" tabIndex={-1} ref={alertRef}><CircleX size={18} aria-hidden="true" /><div><strong>Not saved.</strong> {serverError} <span>Your entries are still here. Try again when you are ready.</span></div></div>}
          {confirmDiscard && <div className="form-error discard" role="alertdialog" aria-label="Discard changes?"><div><strong>Discard your changes?</strong> <span>What you entered will be lost.</span></div><div className="inline-actions"><button type="button" className="button" onClick={() => setConfirmDiscard(false)}>Keep editing</button><button type="button" className="button danger" onClick={onClose}>Discard</button></div></div>}
          <fieldset disabled={isSubmitting} className="form-body">
            {product && <div className="editing-product"><ProductImage product={product} /><div><strong>{product.title}</strong><span>{product.local ? 'Local product · stored only in this browser' : `Product #${product.id}`}</span></div></div>}
            {!product && <p className="form-note">DummyJSON will accept this product but not store it. It is kept in this browser as a local product.</p>}
            <div className="form-grid">
              <div className="span-2"><Field id="title" label="Product name" required error={errors.title?.message}>
                <input id="title" className="control" maxLength={150} placeholder="e.g. Everyday canvas tote" {...aria('title')} {...register('title')} />
              </Field></div>
              <Field id="category" label="Category" required error={errors.category?.message}>
                <Controller control={control} name="category" render={({ field }) => <Combobox id="category" value={field.value} onChange={field.onChange} onBlur={field.onBlur} triggerRef={field.ref}
                  options={categories.map(value => ({ value, label: categoryName(value) }))} placeholder="Select a category" searchPlaceholder="Search categories…" invalid={!!errors.category} describedBy={errors.category ? 'category-error' : undefined} />} />
              </Field>
              <Field id="brand" label="Brand" error={errors.brand?.message}>
                <input id="brand" className="control" maxLength={100} {...aria('brand')} {...register('brand')} />
              </Field>
              <Field id="price" label="Price (USD)" required error={errors.price?.message}>
                <input id="price" className="control" inputMode="decimal" placeholder="0.00" autoComplete="off" {...aria('price')} {...register('price')} />
              </Field>
              <Field id="stock" label="Stock quantity" required hint="Units on hand. 10 or fewer counts as low stock." error={errors.stock?.message}>
                <input id="stock" className="control" inputMode="numeric" autoComplete="off" {...aria('stock', true)} {...register('stock')} />
              </Field>
              <div className="span-2"><Field id="sku" label="SKU" error={errors.sku?.message}>
                <input id="sku" className="control" maxLength={100} placeholder="e.g. TOTE-001" {...aria('sku')} {...register('sku')} />
              </Field></div>
              <div className="span-2"><Field id="description" label="Description" error={errors.description?.message}>
                <textarea id="description" className="control" rows={3} maxLength={3000} {...aria('description')} {...register('description')} />
              </Field></div>
              <div className="span-2"><Field id="thumbnail" label="Image URL" hint="A direct link to an image, starting with https://" error={errors.thumbnail?.message}>
                <input id="thumbnail" className="control" type="url" inputMode="url" placeholder="https://example.com/product.jpg" {...aria('thumbnail', true)} {...register('thumbnail')} />
              </Field></div>
            </div>
          </fieldset>
          <div className="dialog-foot">
            <button type="button" className="button" onClick={requestClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="button primary" disabled={isSubmitting} aria-disabled={isSubmitting}>{isSubmitting && <LoaderCircle size={16} className="spin" aria-hidden="true" />}{isSubmitting ? 'Saving…' : serverError ? 'Try again' : product ? 'Save changes' : 'Add product'}</button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
