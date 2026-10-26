import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductFormDialog } from './components/ProductFormDialog';
import type { Product } from './products';

const product: Product = { id: 1, key: '1', title: 'Green Chair', description: '', category: 'furniture', price: 80, stock: 6, brand: 'Home', sku: 'C-01', thumbnail: '', rating: 0 };
const setup = (onSubmit: (...args: never[]) => Promise<void>, onClose = vi.fn()) => {
  render(<ProductFormDialog product={product} categories={['furniture', 'beauty']} onSubmit={onSubmit as never} onClose={onClose} />);
  return { user: userEvent.setup(), onClose };
};

describe('ProductFormDialog', () => {
  it('shows inline errors and does not submit invalid values', async () => {
    const onSubmit = vi.fn();
    const { user } = setup(onSubmit);
    await user.clear(screen.getByLabelText(/Price/));
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByText('Enter a price.')).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/)).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps the draft and shows a retryable error when saving fails, then succeeds on retry', async () => {
    const onSubmit = vi.fn().mockRejectedValueOnce(new Error('Server is down.')).mockResolvedValueOnce(undefined);
    const { user } = setup(onSubmit);
    const title = screen.getByLabelText(/Product name/);
    await user.clear(title); await user.type(title, 'Blue Chair');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Server is down.');
    expect(screen.getByLabelText(/Product name/)).toHaveValue('Blue Chair');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
    expect(onSubmit.mock.calls[1][0]).toMatchObject({ title: 'Blue Chair', price: 80 });
  });

  it('submits once when the button is clicked twice during a pending request', async () => {
    let resolve!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>(r => { resolve = r; }));
    const { user } = setup(onSubmit);
    const button = screen.getByRole('button', { name: 'Save changes' });
    await user.click(button); await user.click(button);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled());
    expect(onSubmit).toHaveBeenCalledTimes(1);
    resolve();
  });

  it('asks before discarding edited fields', async () => {
    const { user, onClose } = setup(vi.fn());
    await user.type(screen.getByLabelText(/Brand/), 'x');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Discard' }));
    expect(onClose).toHaveBeenCalled();
  });
});
