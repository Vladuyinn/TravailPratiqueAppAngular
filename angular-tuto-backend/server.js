const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse les requêtes JSON
app.use(bodyParser.json()); //Parse le corps de la requête
/////////////////////////////////////////////////////////////////////////////

//GET pour récupérer les utilisateurs
app.get("/user", (req, res) => {
  fs.readFile("list_user.json", "utf8", (err, data) => {
    res.json(JSON.parse(data));
    console.log(data);
  });
});

//POST pour ajouter des utilisateurs
app.post("/user", (req, res) => {
  const newUser = req.body.nom;

  // Lecture rapide du fichier pour enlever les crochets finaux et la virgule finale
  fs.readFile("list_user.json", "utf8", (err, data) => {
    // Vérification si le fichier contient uniquement un tableau vide "[]" s'il ne contient rien on rajoute seuleemnt l'utilisateur
    let trimmedData = data.trim();
    let newContent;
    if (trimmedData === "[]" || trimmedData === "[\n]") {
      newContent = `["${newUser}"]`;
    } else {
      // Sinon, on retire le crochet fermant
      trimmedData = trimmedData.slice(0, -1);

      // On ajoute une virgule, puis le nouvel utilisateur, suivi de la fermeture du tableau
      newContent = `${trimmedData}, "${newUser}"]`;
    }

    // Réécrire le fichier avec le nouvel utilisateur
    fs.writeFile("list_user.json", newContent, "utf8", (err) => {
      res.send("Utilisateur ajouté avec succès");
    });
    console.log(data);
  });
});

//PUT afin de modifier un utilisateur
app.put("/user/:index", (req, res) => {
  const index = req.params.index; // Index de l'utilisateur à mettre à jour
  const newUserName = req.body.nom; // Nouveau nom de l'utilisateur

  // Lecture du fichier JSON pour obtenir la liste des utilisateurs
  fs.readFile("list_user.json", "utf8", (err, data) => {
    // Convertir les données JSON en tableau
    let users = JSON.parse(data);

    // Vérifier si l'index existe dans la liste
    if (users[index]) {
      // Mise à jour de l'utilisateur à l'index donné
      users[index] = newUserName;

      // Réécriture du fichier avec les modifications
      fs.writeFile(
        "list_user.json",
        JSON.stringify(users, null, 2),
        "utf8",
        (err) => {
          res.send("Utilisateur mis à jour avec succès");
        }
      );
      console.log(data);
    }
  });
});

app.delete("/user", (req, res) => {
  const index = req.params.index;
  fs.readFile("list_user.json", "utf8", (err, data) => {
    fs.writeFile(
      "list_user.json",
      JSON.stringify([], null, 2),
      "utf8",
      (err) => {
        res.send("Utilisateur mis à jour avec succès");
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
