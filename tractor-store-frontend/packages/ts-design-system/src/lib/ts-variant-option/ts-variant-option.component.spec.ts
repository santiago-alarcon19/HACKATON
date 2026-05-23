import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsVariantOptionComponent } from './ts-variant-option.component';

describe('TsVariantOptionComponent', () => {
  let fixture: ComponentFixture<TsVariantOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsVariantOptionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TsVariantOptionComponent);
    fixture.componentInstance.label = 'Orange';
    fixture.componentInstance.price = 1500;
    fixture.componentInstance.colorHex = '#ff8800';
    fixture.detectChanges();
  });

  it('emits selectedChange when clicked', () => {
    const selectedChange = jest.fn();
    fixture.componentInstance.selectedChange.subscribe(selectedChange);
    fixture.nativeElement.querySelector('button').click();
    expect(selectedChange).toHaveBeenCalled();
  });

  it('does not emit when disabled', () => {
    const selectedChange = jest.fn();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    fixture.componentInstance.selectedChange.subscribe(selectedChange);
    fixture.componentInstance.onSelect(new MouseEvent('click'));
    expect(selectedChange).not.toHaveBeenCalled();
  });
});
