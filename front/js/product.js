// recupération de l'id de l'article
function idArticle() {
  let url = new URL(document.location.href);
  let id = url.searchParams.get("id");
  return id;
}

// affichage de l'id de l'article
function affichageIdArticle() {
  let id = idArticle();
  console.log(id);
}
// affichageIdArticle();

// creation du contenu de la page
function creationFiche() {
  let id = idArticle();
  fetch("http://localhost:3000/api/products/" + id)
    .then(function (reponseAPI) {
      return reponseAPI.json();
    })

    .then(function (details) {
      // description de l'article
      let description = details["description"];
      document.getElementById("description").innerText = description;

      // image de l'article
      let img = document.createElement("img");
      let altTxt = details["altTxt"];
      let imageUrl = details["imageUrl"];
      document.querySelector(".item__img").appendChild(img).src = imageUrl;
      document.querySelector(".item__img").appendChild(img).alt = altTxt;

      // nom de l'article
      let name = details["name"];
      document.getElementById("title").innerText = name;

      // choix des couleurs
      let couleurs = details["colors"];
      for (let i in couleurs) {
        let option = document.createElement("option");
        document.getElementById("colors").appendChild(option).innerText =
          couleurs[i];
        document.getElementById("colors").appendChild(option).value =
          couleurs[i];
      }

      // prix de l'article
      let prix = details["price"];
      document.getElementById("price").innerText = prix;
    })

    .catch(function (erreur) {
      console.log(
        "Erreur lors de la communication avec l'API pour la creation de la page"
      );
      console.log(erreur);
    });
}
creationFiche();

// fonction pour l'ajout de l'article au panier
function ajoutPanier() {
  // recupération de la couleur choisie
  let choixCouleur = document.getElementById("colors");
  let couleur = choixCouleur.value;

  // recupération de la quantite choisie
  let choixQuantite = document.getElementById("quantity");
  let quantite = choixQuantite.value;

  // creation de l'objet qui ira dans localStorage
  let kanapVersPanier = {
    id: idArticle(),
    couleur: couleur,
    quantite: quantite,
  };

  // creation panier si panier vide
  let contenuPanier = JSON.parse(localStorage.getItem("contenuPanier"));
  if (Number(quantite) > 0 && Number(quantite) <= 100 && couleur) {
    if (contenuPanier === null) {
      contenuPanier = [];
    }

    // Recherche si id/couleur déjà présent dans le panier
    let dejaPresent = contenuPanier.find(
      (element) => element.id === idArticle() && element.couleur === couleur
    );

    // mise à jour du panier si id/couleur déjà présent dans le panier
    if (dejaPresent) {
      let quantiteAvant = Number(dejaPresent.quantite);
      let quantitePlus = Number(quantite);
      dejaPresent.quantite = quantiteAvant + quantitePlus;
      localStorage.setItem("contenuPanier", JSON.stringify(contenuPanier));
    } else {
      // mise à jour du panier si id/couleur non présent dans le panier
      contenuPanier.push(kanapVersPanier);
      localStorage.setItem("contenuPanier", JSON.stringify(contenuPanier));
    }
    alert("Votre article a bien été ajouté au panier.");
  } else {
    alert("Vueillez selectionner une couleur et une quantité entre 0 et 100.");
  }

  //-----------------------------------------------------------------------------------

  // affichage panier
  let panier = JSON.parse(localStorage.getItem("contenuPanier"));
  console.log("CONTENU DU PANIER =");
  console.table(panier);
  console.log(
    "================================================================="
  );
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

// déclencheur pour ajout panier
function conditionAjoutPanier() {
  let boutonAjoutPanier = document.getElementById("addToCart");
  boutonAjoutPanier.addEventListener("click", function () {
    ajoutPanier();
  });
}
conditionAjoutPanier();
