const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse les requêtes JSON

/////////////////////////////////////////////////////////////////////////////

// Fonction utilitaire pour lire le fichier utilisateur
function readUserFile(callback) {
  fs.readFile("list_user.json", "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      try {
        const users = JSON.parse(data);
        callback(null, users);
      } catch (parseError) {
        callback(parseError, null);
      }
    }
  });
}

// Fonction utilitaire pour écrire dans le fichier utilisateur
function writeUserFile(data, callback) {
  fs.writeFile("list_user.json", JSON.stringify(data, null, 2), "utf8", callback);
}

// GET pour récupérer les utilisateurs
app.get("/user", (req, res) => {
  readUserFile((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la lecture des utilisateurs" });
    }
    res.json(users);
  });
});

// POST pour ajouter un utilisateur
app.post("/user", (req, res) => {
  const newUser = req.body.nom;
  if (!newUser) {
    return res.status(400).json({ error: "Nom d'utilisateur manquant" });
  }

  readUserFile((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la lecture des utilisateurs" });
    }

    users.push(newUser); // Ajoute le nouvel utilisateur

    writeUserFile(users, (err) => {
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

  readUserFile((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la lecture des utilisateurs" });
    }

    if (index >= 0 && index < users.length) {
      users[index] = newUserName;

      writeUserFile(users, (err) => {
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
  writeUserFile([], (err) => {
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
