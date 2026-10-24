import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideGlobe, LucideImageOff } from '@lucide/angular';
import { Planeta } from '../../models/planeta.model';

@Component({
  selector: 'app-planeta-card',
  // Clases en el host para layout masonry
  // [E17] host: clases sobre la etiqueta <app-planeta-card> misma
  host: { class: 'mb-4 block break-inside-avoid' },
  imports: [RouterLink, LucideGlobe, LucideImageOff],
  templateUrl: './planeta-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// Componente de presentación: muestra un planeta
export class PlanetaCard {
  // [E18] input.required: el padre está obligado a pasarlo
  readonly planeta = input.required<Planeta>();

  // [E20] Estado local para fallback de imagen rota
  protected readonly imagenFallo = signal(false);
}
