import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { API_URL } from '@core/config/api';
import { Pagina, unaSolaPagina } from '@shared/models/pagina.model';
import { FiltroPlaneta, Planeta, PlanetaDetalle } from '../models/planeta.model';

// Acceso a datos: el único lugar de la app que sabe cómo se le habla a /planets.
// [E27] providedIn root: una sola instancia para toda la app
@Injectable({ providedIn: 'root' })
export class PlanetaService {
  // [E28] inject(): pedir una dependencia (antes: en el constructor)
  private readonly http = inject(HttpClient);
  // [E29] La URL sale de core/config: el servicio no repite la dirección
  private readonly url = `${API_URL}/planets`;
  private readonly porPagina = 8;

  // Sin filtros la API pagina (?page=1&limit=8).
  // Con filtros (?name=Namek o ?isDestroyed=true) devuelve un arreglo simple, sin paginación.
  // [E61] buscar(): con filtro manda name/isDestroyed, sin filtro manda page/limit
  buscar(filtro: FiltroPlaneta): Observable<Pagina<Planeta>> {
    const hayFiltro = filtro.nombre !== '' || filtro.estado !== 'todos';

    // [E62] HttpParams es inmutable: set() devuelve uno nuevo -> params = params.set()
    let params = new HttpParams();
    if (hayFiltro) {
      if (filtro.nombre) {
        params = params.set('name', filtro.nombre);
      }
      if (filtro.estado === 'destruidos') {
        params = params.set('isDestroyed', 'true');
      } else if (filtro.estado === 'intactos') {
        params = params.set('isDestroyed', 'false');
      }
    } else {
      params = params.set('page', filtro.pagina).set('limit', this.porPagina);
    }

    return this.http.get<Pagina<Planeta> | Planeta[]>(this.url, { params }).pipe(
      // [E63] map: las dos formas de respuesta quedan como Pagina<Planeta>
      map((r) => (Array.isArray(r) ? unaSolaPagina(r) : r)),
      // [E64] catchError: 404 -> página vacía; cualquier otro error se relanza
      // Si la API responde 404 lo tratamos como "sin resultados"
      catchError((err: HttpErrorResponse) =>
        err.status === 404 ? of(unaSolaPagina<Planeta>([])) : throwError(() => err),
      ),
    );
  }

  // Varios planetas a la vez: una petición por id, en paralelo
  // [E66] forkJoin: N peticiones en paralelo, emite cuando terminan todas
  varios(ids: number[]): Observable<Planeta[]> {
    return ids.length ? forkJoin(ids.map((id) => this.obtener(id))) : of([]);
  }

  // [E30] http.get devuelve un Observable: la petición sale recién al suscribirse
  obtener(id: number): Observable<PlanetaDetalle> {
    return this.http.get<PlanetaDetalle>(`${this.url}/${id}`);
  }
}

export { PlanetaService as PlanetasService };
