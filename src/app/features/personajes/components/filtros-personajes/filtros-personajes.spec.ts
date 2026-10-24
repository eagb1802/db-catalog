import { TestBed } from '@angular/core/testing';
import { FiltrosPersonajes } from './filtros-personajes';

describe('FiltrosPersonajes', () => {
  it('emite textoCambio cuando se escribe en el buscador', async () => {
    const fixture = TestBed.createComponent(FiltrosPersonajes);
    fixture.componentRef.setInput('razas', ['Saiyan', 'Human']);
    await fixture.whenStable();

    let emitido = '';
    fixture.componentInstance.textoCambio.subscribe((val) => (emitido = val));

    const input = (fixture.nativeElement as HTMLElement).querySelector('input')!;
    input.value = 'Goku';
    input.dispatchEvent(new Event('input'));

    expect(emitido).toBe('Goku');
  });

  it('emite razaCambio cuando se selecciona una raza', async () => {
    const fixture = TestBed.createComponent(FiltrosPersonajes);
    fixture.componentRef.setInput('razas', ['Saiyan', 'Human']);
    await fixture.whenStable();

    let emitido = '';
    fixture.componentInstance.razaCambio.subscribe((val) => (emitido = val));

    const selects = (fixture.nativeElement as HTMLElement).querySelectorAll('select');
    const selectRaza = selects[0];
    selectRaza.value = 'Saiyan';
    selectRaza.dispatchEvent(new Event('change'));

    expect(emitido).toBe('Saiyan');
  });

  it('emite generoCambio cuando se selecciona un genero', async () => {
    const fixture = TestBed.createComponent(FiltrosPersonajes);
    fixture.componentRef.setInput('razas', ['Saiyan', 'Human']);
    await fixture.whenStable();

    let emitido = '';
    fixture.componentInstance.generoCambio.subscribe((val) => (emitido = val));

    const selects = (fixture.nativeElement as HTMLElement).querySelectorAll('select');
    const selectGenero = selects[1];
    selectGenero.value = 'Female';
    selectGenero.dispatchEvent(new Event('change'));

    expect(emitido).toBe('Female');
  });
});
