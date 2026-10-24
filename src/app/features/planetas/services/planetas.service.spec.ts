import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PlanetaService } from './planetas.service';

describe('PlanetaService', () => {
  let servicio: PlanetaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(PlanetaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sin filtros pide la página y el límite', () => {
    servicio.buscar({ pagina: 2, nombre: '', estado: 'todos' }).subscribe();
    const req = http.expectOne((r) => r.url.endsWith('/planets'));
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('8');
    expect(req.request.params.has('name')).toBe(false);
    expect(req.request.params.has('isDestroyed')).toBe(false);
    req.flush({ items: [], meta: { totalItems: 0, itemCount: 0, itemsPerPage: 8, totalPages: 0, currentPage: 2 } });
  });

  it('con filtro de nombre y estado destruido manda parámetros correspondientes', () => {
    let total = -1;
    servicio.buscar({ pagina: 1, nombre: 'Namek', estado: 'destruidos' }).subscribe((r) => (total = r.meta.totalItems));
    const req = http.expectOne((r) => r.url.endsWith('/planets'));
    expect(req.request.params.get('name')).toBe('Namek');
    expect(req.request.params.get('isDestroyed')).toBe('true');
    expect(req.request.params.has('page')).toBe(false);
    req.flush([{ id: 1, name: 'Namek', isDestroyed: true, description: '', image: '' }]);
    expect(total).toBe(1);
  });

  it('con filtro intactos manda isDestroyed en false', () => {
    servicio.buscar({ pagina: 1, nombre: '', estado: 'intactos' }).subscribe();
    const req = http.expectOne((r) => r.url.endsWith('/planets'));
    expect(req.request.params.get('isDestroyed')).toBe('false');
    req.flush([]);
  });

  it('un 404 se convierte en cero resultados', () => {
    let total = -1;
    servicio.buscar({ pagina: 1, nombre: 'desconocido', estado: 'todos' }).subscribe((r) => (total = r.meta.totalItems));
    http.expectOne(() => true).flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    expect(total).toBe(0);
  });

  it('obtener() pide el planeta por su id', () => {
    let nombre = '';
    servicio.obtener(1).subscribe((p) => (nombre = p.name));
    const req = http.expectOne((r) => r.url.endsWith('/planets/1'));
    req.flush({ id: 1, name: 'Namek', isDestroyed: true, description: '', image: '', characters: [] });
    expect(nombre).toBe('Namek');
  });

  it('varios() hace una petición por id en paralelo', () => {
    let nombres: string[] = [];
    servicio.varios([1, 2]).subscribe((r) => (nombres = r.map((p) => p.name)));
    http.expectOne((r) => r.url.endsWith('/planets/1')).flush({ id: 1, name: 'Namek' });
    http.expectOne((r) => r.url.endsWith('/planets/2')).flush({ id: 2, name: 'Tierra' });
    expect(nombres).toEqual(['Namek', 'Tierra']);
  });
});
