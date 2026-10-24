import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Paginador } from '@shared/ui/paginador/paginador';
import { FiltrosPlanetas } from '../../components/filtros-planetas/filtros-planetas';
import { PlanetaCard } from '../../components/planeta-card/planeta-card';
import { FiltroEstadoPlaneta } from '../../models/planeta.model';
import { PlanetaService } from '../../services/planetas.service';

@Component({
  selector: 'app-lista-planetas',
  imports: [FiltrosPlanetas, PlanetaCard, Paginador],
  templateUrl: './lista-planetas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPlanetas {
  private readonly servicio = inject(PlanetaService);

  protected readonly texto = signal('');
  protected readonly estado = signal<FiltroEstadoPlaneta>('todos');
  protected readonly pagina = signal(1);

  private readonly filtro = computed(() => ({
    nombre: this.texto().trim(),
    estado: this.estado(),
    pagina: this.pagina(),
  }));

  // signals -> RxJS (para debounce y switchMap) -> signal otra vez
  // [E50] toObservable -> debounceTime -> distinctUntilChanged -> switchMap -> toSignal
  private readonly respuesta = toSignal(
    toObservable(this.filtro).pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap((f) => this.servicio.buscar(f)),
    ),
  );

  // [E51] undefined = todavía no llegó la primera respuesta
  protected readonly cargando = computed(() => this.respuesta() === undefined);
  protected readonly planetas = computed(() => this.respuesta()?.items ?? []);
  protected readonly total = computed(() => this.respuesta()?.meta.totalItems ?? 0);
  protected readonly totalPaginas = computed(() => this.respuesta()?.meta.totalPages ?? 0);

  // [E52] El hijo avisa -> .set(). Si cambia el filtro, volvemos a la página 1
  protected alCambiarTexto(texto: string) {
    this.texto.set(texto);
    this.pagina.set(1);
  }

  protected alCambiarEstado(estado: FiltroEstadoPlaneta) {
    this.estado.set(estado);
    this.pagina.set(1);
  }
}
