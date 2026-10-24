import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideSearch } from '@lucide/angular';
import { ESTADOS_PLANETA, FiltroEstadoPlaneta } from '../../models/planeta.model';
@Component({
  selector: 'app-filtros-planetas',
  imports: [LucideSearch],
  templateUrl: './filtros-planetas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltrosPlanetas {
  // [E54] Presentación: solo input() y output(), no inyecta servicios
  readonly texto = input('');
  readonly estado = input<FiltroEstadoPlaneta>('todos');
  readonly estados = ESTADOS_PLANETA;

  readonly textoCambio = output<string>();
  readonly estadoCambio = output<FiltroEstadoPlaneta>();

  // [E55] Lee el valor del DOM y lo emite hacia la página
  protected alEscribir(evento: Event) {
    this.textoCambio.emit((evento.target as HTMLInputElement).value);
  }

  protected alElegirEstado(evento: Event) {
    this.estadoCambio.emit((evento.target as HTMLSelectElement).value as FiltroEstadoPlaneta);
  }
}
