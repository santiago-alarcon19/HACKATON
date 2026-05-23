import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ts-variant-option',
  standalone: true,
  template: `
    <button
      class="variant"
      [class.variant--selected]="selected"
      [disabled]="disabled"
      type="button"
      [attr.aria-pressed]="selected"
      (click)="onSelect($event)"
    >
      @if (colorHex) {
        <span class="variant__swatch" [style.background]="colorHex" aria-hidden="true"></span>
      }
      <span class="variant__text">
        <span class="variant__label">{{ label }}</span>
        <span class="variant__price">{{ price | currency }}</span>
      </span>
    </button>
  `,
  imports: [CurrencyPipe],
  styles: [
    `
      @import '../tokens.scss';
      :host {
        display: block;
      }

      .variant {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        width: 100%;
        padding: 1rem 1.15rem;
        border: 2px solid var(--ts-border);
        border-radius: var(--ts-radius-md);
        background: var(--ts-white);
        cursor: pointer;
        font: inherit;
        text-align: left;
        transition:
          border-color var(--ts-transition),
          background var(--ts-transition),
          box-shadow var(--ts-transition);
      }
      .variant:hover:not(:disabled) {
        border-color: var(--ts-green-500);
        box-shadow: var(--ts-shadow-sm);
      }
      .variant--selected {
        border-color: var(--ts-green-600);
        background: var(--ts-green-50);
        box-shadow: 0 0 0 3px rgba(31, 143, 84, 0.12);
      }
      .variant:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .variant__swatch {
        flex-shrink: 0;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.9);
        box-shadow:
          inset 0 1px 2px rgba(0, 0, 0, 0.15),
          0 2px 6px rgba(10, 46, 31, 0.2);
      }

      .variant--selected .variant__swatch {
        box-shadow:
          0 0 0 2px var(--ts-green-600),
          inset 0 1px 2px rgba(0, 0, 0, 0.15);
      }

      .variant__text {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        min-width: 0;
      }

      .variant__label {
        font-weight: 600;
        color: var(--ts-ink);
      }
      .variant__price {
        font-weight: 700;
        color: var(--ts-green-700);
        white-space: nowrap;
      }
    `,
  ],
})
export class TsVariantOptionComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) price!: number;
  @Input() colorHex?: string;
  @Input() selected = false;
  @Input() disabled = false;
  @Output() selectedChange = new EventEmitter<void>();

  onSelect(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.selectedChange.emit();
  }
}
