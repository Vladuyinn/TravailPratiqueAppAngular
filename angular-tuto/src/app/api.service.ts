import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  //Méthode GET pour récupérer les utilisateurs
  getUser(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  //Méthode POST pour ajouter les utilisateurs
  addUser(user: { nom: string }): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  //Méthode DELETE pour supprimer tous les utilisateurs
  deleteUser(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }

  //Méthode UPDATE pour modifier les utilisateurs
  updateUser(index: number, user: { nom: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${index}`, user); // Envoyer la requête PUT
  }

  //Méthode DELETE pour suppirmer un utilisateur
  // deleteOneUser(index: number):Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${index}`);
  // }
}
