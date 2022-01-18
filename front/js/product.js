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

// Recherche des details de l'article venant de l'API
async function rechercheDetailsArticle() {
  let id = idArticle();
  let detailstrouves = await fetch("http://localhost:3000/api/products/" + id);
  return await detailstrouves.json();
}

// affichage des details trouvés
async function affichageDetails() {
  let details = rechercheDetailsArticle();
  console.log(details);
}
//affichageDetails();

// -----------------------------------------------------------------------------------

// creation du contenu de la page
async function creationFiche() {
  let details = await rechercheDetailsArticle();

  // description de l'article
  let description = await details["description"];
  document.getElementById("description").innerText = await description;

  // image de l'article
  let img = document.createElement("img");
  let altTxt = await details["altTxt"];
  let imageUrl = await details["imageUrl"];
  document.querySelector(".item__img").appendChild(img).src = await imageUrl;
  document.querySelector(".item__img").appendChild(img).alt = await altTxt;

  // nom de l'article
  let name = await details["name"];
  document.getElementById("title").innerText = await name;

  // choix des couleurs
  let couleurs = await details["colors"];
  for (let i in couleurs) {
    let option = document.createElement("option");
    document.getElementById("colors").appendChild(option).innerText =
      await couleurs[i];
    document.getElementById("colors").appendChild(option).value =
      await couleurs[i];
  }

  // prix de l'article
  let prix = details["price"];
  document.getElementById("price").innerText = await prix;
}
creationFiche();

// -----------------------------------------------------------------------------------

async function ajoutPanier() {
  let details = await rechercheDetailsArticle();
  let nom = await details["name"];
  let prix = await details["price"];
  let altTxt = await details["altTxt"];
  let imageUrl = await details["imageUrl"];

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
    quantité: quantite,
    nom: nom,
    "texte Alternatif": altTxt,
    "url de l'image": imageUrl,
  };

  //-----------------------------------------------------------------------------------

  // creation panier si panier vide
  let contenuPanier = JSON.parse(localStorage.getItem("contenuPanier"));
  if (contenuPanier === null) {
    contenuPanier = [];
  }

  // Recherche si id/couleur déjà présent dans le panier
  let dejaPresent = contenuPanier.find(
    (element) => element.id === idArticle() && element.couleur === couleur
  );

  // mise à jour du panier si id/couleur déjà présent dans le panier
  if (dejaPresent) {
    let quantiteAvant = Number(dejaPresent.quantité);
    let quantitePlus = Number(quantite);
    dejaPresent.quantité = quantiteAvant + quantitePlus;
    localStorage.setItem("contenuPanier", JSON.stringify(contenuPanier));
  } else {
    // mise à jour du panier si id/couleur non présent dans le panier
    contenuPanier.push(kanapVersPanier);
    localStorage.setItem("contenuPanier", JSON.stringify(contenuPanier));
  }

  //-----------------------------------------------------------------------------------

  // affichage panier
  let panier = JSON.parse(localStorage.getItem("contenuPanier"));
  console.log("CONTENU DU PANIER =");
  console.table(panier);
  console.log(
    "================================================================================================================================================"
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
