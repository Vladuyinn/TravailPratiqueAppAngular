const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 3000;
const mysql = require("mysql");

const db = mysql.createConnection({
  host: '192.168.0.210',
  user: 'rcrombe',
  password: '[R@JYvkKRZ4s465j',
  database: 'rcrombe'
});

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse les requêtes JSON

/////////////////////////////////////////////////////////////////////////////

// // Fonction utilitaire pour lire et "décoder" les utilisateurs du fichier JSON
// function decodeUserFile(callback) {
//   fs.readFile("list_user.json", "utf8", (err, data) => {
//     if (err) {
//       callback(err, null);
//     } else {
//       try {
//         const users = JSON.parse(data); // JSON.decode equivalent
//         callback(null, users);
//       } catch (parseError) {
//         callback(parseError, null);
//       }
//     }
//   });
// }

// // Fonction utilitaire pour "encoder" et écrire les utilisateurs dans le fichier JSON
// function encodeUserFile(users, callback) {
//   const data = JSON.stringify(users, null, 2); // JSON.encode equivalent
//   fs.writeFile("list_user.json", data, "utf8", callback);
// }

////////////////////////////////////////////////////////////////////////////////

app.get("/user", (req, res) => {
  // decodeUserFile((err, users) => {
  //   if (err) {
  //     return res.status(500).json({ error: "Erreur lors de la lecture des utilisateurs" });
  //   }
  //   res.json(users); // Renvoie les utilisateurs décodés
  // });
  
  const query = 'SELECT prenom FROM utilisateurs'; // La requête pour récupérer tous les utilisateurs

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
    res.json(results); // Envoie les résultats de la base de données sous forme de JSON
  });
});


// POST pour ajouter un utilisateur
app.post("/user", (req, res) => {
  const newUser = req.body.nom;
  if (!newUser) {
    return res.status(400).json({ error: "Nom d'utilisateur manquant" });
  }

  decodeUserFile((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la lecture des utilisateurs" });
    }

    users.push(newUser); // Ajoute le nouvel utilisateur

    encodeUserFile(users, (err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de l'écriture des utilisateurs" });
      }
      res.send("Utilisateur ajouté avec succès");
    });
  });
});

// PUT pour modifier un utilisateur
app.put("/user/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  const newUserName = req.body.nom;

  if (!newUserName) {
    return res.status(400).json({ error: "Nom d'utilisateur manquant" });
  }

  decodeUserFile((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la lecture des utilisateurs" });
    }

    if (index >= 0 && index < users.length) {
      users[index] = newUserName; // Modifie le nom de l'utilisateur

      encodeUserFile(users, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de l'écriture des utilisateurs" });
        }
        res.send("Utilisateur mis à jour avec succès");
      });
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  });
});

// DELETE pour supprimer tous les utilisateurs
app.delete("/user", (req, res) => {
  encodeUserFile([], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la suppression des utilisateurs" });
    }
    res.send("Tous les utilisateurs ont été supprimés avec succès");
  });
});

// Serveur écoute sur le port spécifié
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
