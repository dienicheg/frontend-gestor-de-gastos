import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';


import { RegisterResponse, LoginResponse, CreateUser, LoginUser } from './interfaces/request.interface';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { AuthStatus } from './interfaces/auth-status.enum';
import { CheckTokenResponse, User } from './interfaces/check-token.interface';
import { GetGastoResponse } from './interfaces/gastos-response';
import { Router } from '@angular/router';
import { Gasto } from './interfaces/gasto.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private readonly baseUrl = environment.url

  private router = inject(Router)
  private http = inject(HttpClient)

  //Authentication
  private _authStatus = signal<AuthStatus>(AuthStatus.checking)
  public authStatus = computed(() => this._authStatus())

  private _currentUser = signal<User|null>(null)
  public currentUser = computed( () => this._currentUser() )

  //Presupuestos
  private _presupuesto = computed<number>( () => this._currentUser()!.presupuesto )
  public presupuesto = computed<number>(() => this._presupuesto())

  private _totalGastado = signal<number>(0)
  public totalGastado = computed<number>(() => this._totalGastado())

  private _disponible = computed<number>(() => this._presupuesto() - this._totalGastado())
  public disponible = computed<number>(() => this._disponible())

  //Gastos
  private _gastos = signal<GetGastoResponse[]>([])
  public gastos = computed(() => this._gastos())

  private _loading = signal<boolean>(false)
  public loading = computed<boolean>(() => this._loading())

  constructor() {
    this.checkAuthStatus().subscribe()
  }


  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/user/check-token`

    if(!localStorage.getItem('token')) {
      this.logout()
      return of(false)
    }

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${ localStorage.getItem('token') }`);

    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map( ({token, user}) => this.setAuthentication(user, token)),
        catchError(() => {
          this.logout()
          this._authStatus.set( AuthStatus.notAuthenticated )
          this.router.navigateByUrl('/auth/login')

          return of(false)
        })
      )
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user)
    this._authStatus.set(AuthStatus.authenticated)
    localStorage.setItem('token', token)
    return true
  }

  createUser( body: CreateUser ) {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/user/register`, body)
    .pipe(
      catchError(err => throwError(() => err.error.message))
    )
  }

  loginUser( body: LoginUser ) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/user/login`, body)
      .pipe(
        map(({token, user}) => {
          localStorage.setItem('token', token)
          this._authStatus.set(AuthStatus.authenticated)
          this._currentUser.set(user)
        }),
        catchError(err => throwError(() => err.error.message))
      )
  }

  getGastos() {
    this._loading.set(true)

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${ localStorage.getItem('token') }`);
    const url = `${this.baseUrl}/gastos`
    return this.http.get<GetGastoResponse[]>(url, {headers} )
      .pipe(
        map((gastos) => {
          this._totalGastado.set(gastos.reduce(( accumulator, gasto ) => accumulator + gasto.cantidad, 0))
          this._gastos.set(gastos)
          this._loading.set(false)
        }),
        catchError(() => of(this._loading.set(false)))
      ).subscribe()
  }

  updatePresupuesto(body: { presupuesto: number }) {
    this._loading.set(true)

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${ localStorage.getItem('token') }`);
    const url = `${this.baseUrl}/user/${this.currentUser()?._id}`

    return this.http.patch<User>(url, body, {headers})
      .pipe(
        map(user => {
          this._currentUser.set(user)
          this._loading.set(false)
        }),
        catchError(() => of(this._loading.set(false)))

      ).subscribe()
  }

  createGasto(body: Gasto) {
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${ localStorage.getItem('token') }`);
    const url = `${this.baseUrl}/gastos`
    return this.http.post<GetGastoResponse>(url, body, {headers})
      .pipe(
        map(gasto => {
          this._gastos.set([...this._gastos(), gasto])
          this._totalGastado.set(this.gastos().reduce(( accumulator, gasto ) => accumulator + gasto.cantidad, 0))
        }),
        catchError(() => of(this._loading.set(false)))
      ).subscribe()
  }

  updateGasto(id: string, body: Gasto){
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${ localStorage.getItem('token') }`);
    const url = `${this.baseUrl}/gastos/${id}`
    return this.http.patch<GetGastoResponse>(url,body ,{headers})
      .pipe(
        map(updatedGasto => {
          this._gastos.set(this._gastos().filter(gasto => gasto._id !== id))
          this._gastos.set([...this._gastos(), updatedGasto])
          this._totalGastado.set(this.gastos().reduce(( accumulator, gasto ) => accumulator + gasto.cantidad, 0))
        }),
        catchError(() => of(this._loading.set(false)))
      ).subscribe()
  }

  deleteGasto(id: string){
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${ localStorage.getItem('token') }`);
    const url = `${this.baseUrl}/gastos/${id}`

    return this.http.delete(url, {headers})
      .pipe(
        map(() => {
          this._gastos.set(this._gastos().filter(gasto => gasto._id !== id))
          this._totalGastado.set(this.gastos().reduce(( accumulator, gasto ) => accumulator + gasto.cantidad, 0))
        }),
        catchError(() => of(this._loading.set(false)))
      ).subscribe()
  }

  logout(){
    localStorage.removeItem('token')
    this._authStatus.set(AuthStatus.notAuthenticated)
    this._currentUser.set(null)
  }
}
