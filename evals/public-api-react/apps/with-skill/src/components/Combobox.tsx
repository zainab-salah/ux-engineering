import { useId, useState, type Ref } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Check, ChevronDown } from 'lucide-react';

export interface ComboboxOption { value: string; label: string }

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder: string;
  /** When set, adds a first option with an empty value (used by filters: "All categories"). */
  emptyOptionLabel?: string;
  searchPlaceholder?: string;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
  triggerRef?: Ref<HTMLButtonElement>;
  onBlur?: () => void;
}

/**
 * Searchable single-select (Radix Popover + cmdk, the shadcn combobox composition).
 * The trigger is a labelled button with role="combobox"; the popup holds a search field and a listbox.
 */
export function Combobox({ id, value, onChange, options, placeholder, emptyOptionLabel, searchPlaceholder = 'Search…', invalid, describedBy, disabled, triggerRef, onBlur }: Props) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const all: ComboboxOption[] = emptyOptionLabel ? [{ value: '', label: emptyOptionLabel }, ...options] : options;
  const selected = all.find(option => option.value === value);
  const pick = (next: string) => { onChange(next); setOpen(false); };
  return <Popover.Root open={open} onOpenChange={next => { setOpen(next); if (!next) onBlur?.(); }}>
    <Popover.Trigger asChild>
      <button ref={triggerRef} type="button" id={id} role="combobox" aria-expanded={open} aria-controls={open ? listId : undefined} aria-haspopup="listbox"
        aria-invalid={invalid || undefined} aria-describedby={describedBy} disabled={disabled} className={`control combobox-trigger${selected ? '' : ' is-placeholder'}`}>
        <span className="truncate">{selected?.label ?? placeholder}</span><ChevronDown size={16} aria-hidden="true" />
      </button>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content className="combobox-popup" align="start" sideOffset={4} collisionPadding={8}
        onWheel={event => event.stopPropagation()} onTouchMove={event => event.stopPropagation()}>
        <Command loop>
          <Command.Input className="combobox-search" placeholder={searchPlaceholder} aria-label={`${searchPlaceholder.replace(/…$/, '')}`} />
          <Command.List id={listId}>
            <Command.Empty className="combobox-empty">No matches.</Command.Empty>
            {all.map(option => <Command.Item key={option.value || '__all'} value={option.label} onSelect={() => pick(option.value)} className="combobox-item">
              <span className="truncate">{option.label}</span>{option.value === value && <Check size={15} aria-hidden="true" />}
            </Command.Item>)}
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>;
}
