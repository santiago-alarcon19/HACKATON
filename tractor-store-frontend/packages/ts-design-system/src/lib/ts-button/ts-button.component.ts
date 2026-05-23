import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ts-button',
  standalone: true,
  template: `
    <button
      class="ts-btn"
      [class.ts-btn--secondary]="variant === 'secondary'"
      [class.ts-btn--accent]="variant === 'accent'"
      [disabled]="disabled"
      type="button"
      (click)="clicked.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      @import '../tokens.scss';
      .ts-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: var(--ts-rust-400);
        color: #141a18;
        border: none;
        border-radius: 4px;
        padding: 0.85rem 1.6rem;
        cursor: pointer;
        font: inherit;
        font-weight: 600;
        letter-spacing: 0.02em;
        box-shadow: var(--ts-shadow-md);
        transition:
          transform var(--ts-transition),
          box-shadow var(--ts-transition),
          filter var(--ts-transition);
      }
      .ts-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: var(--ts-shadow-lg);
        filter: brightness(1.05);
      }
      .ts-btn:active:not(:disabled) {
        transform: translateY(0);
      }
      .ts-btn--secondary {
        background: transparent;
        color: #e8e4dc;
        border: 2px solid rgba(255, 255, 255, 0.25);
        box-shadow: none;
      }
      .ts-btn--secondary:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.06);
      }
      .ts-btn--accent {
        background: #2d3b34;
        color: var(--ts-rust-400);
        border: 2px solid var(--ts-rust-500);
      }
      .ts-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    `,
  ],
})
export class TsButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'accent' = 'primary';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<MouseEvent>();
}
