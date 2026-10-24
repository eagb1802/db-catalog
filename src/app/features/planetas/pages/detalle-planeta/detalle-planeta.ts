import { ChangeDetectionStrategy, Component, inject, input, numberAttribute, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideGlobe, LucideImageOff, LucideUsers, LucideZap } from '@lucide/angular';
import { switchMap } from 'rxjs';
import { PlanetaService } from '../../services/planetas.service';

@Component({
  selector: 'app-detalle-planeta',
  imports: [RouterLink, LucideArrowLeft, LucideGlobe, LucideImageOff, LucideUsers, LucideZap],
  templateUrl: './detalle-planeta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetallePlaneta {
  private readonly servicio = inject(PlanetaService);

  // [E43] El :id de la URL llega como input. numberAttribute: '3' -> 3
  readonly id = input.required({ transform: numberAttribute });

  protected readonly imagenFallo = signal(false);

  // [E44] Cambia el id -> switchMap cancela la petición anterior y pide la nueva
  protected readonly planeta = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.servicio.obtener(id))),
  );
}
