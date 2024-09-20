import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  listUser: string[] = [];
  showUsers: boolean = false;
  newUser: string = '';
  editingIndex: number | null = null; // Stocke l'index de l'utilisateur en cours d'édition
  editedUserName: string = ''; // Stocke le nom d'utilisateur modifié
  // user: string = '' ;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getUser().subscribe((response) => {
      console.log(response);
      this.listUser = response;
    });
  }

  // Fonction pour ajouter un utilisateur
  ajoutUser(userName: string) {
    if (userName != '') {
      this.apiService.addUser({ nom: userName }).subscribe((response) => {
        this.listUser.push(userName); //Ajoute le nouvel utilisateur
        this.newUser = ''; //Réinitialise le champ de saisie
      });
      window.location.reload();
    }
  }

  // Fonction pour afficher ou cacher les utilisateurs
  toggleDisplayUsers() {
    this.showUsers = !this.showUsers;
  }

  // Activer le mode édition pour un utilisateur
  editUser(index: number) {
    this.editingIndex = index; // Définir l'index de l'utilisateur à éditer
    this.editedUserName = this.listUser[index]; // Pré-remplir avec l'utilisateur existant
  }

  // Mettre à jour l'utilisateur
  updateUser() {
    if (this.editingIndex !== null && this.editedUserName) {
      this.apiService
        .updateUser(this.editingIndex, { nom: this.editedUserName })
        .subscribe((response) => {
          this.listUser[this.editingIndex!] = this.editedUserName; // Mettre à jour localement
        });
      this.editingIndex = null; // Désactiver le mode édition
      window.location.reload();
    }
  }

  // Annuler la modification
  cancelEdit() {
    this.editingIndex = null; // Désactiver le mode édition
    this.editedUserName = ''; // Réinitialiser le champ
  }

  // Fonction pour effacer tous les utilisateurs
  clearAllUsers() {
    this.apiService.deleteUser().subscribe(() => {
      this.listUser = [];
    });
    window.location.reload();
  }



  //fonction pour supprimer un seul utilisateur
  // deleteUser(index: number) {
  //   this.apiService.deleteOneUser(index).subscribe(() => {
  //     this.listUser.splice(index, 1);
  //   });
  //   window.location.reload();
  // }
}
