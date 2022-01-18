// recupération du contenu du localStorage
let panierRecup = JSON.parse(localStorage.getItem("contenuPanier"));
console.log("CONTENU DU PANIER DU LOCALSTORAGE =");
console.table(panierRecup);
panierRecup.sort(function compare(a, b) {
  if (a.nom < b.nom) return -1;
  if (a.nom > b.nom) return 1;
  return 0;
});

// Recherche des articles présent dans l'API
async function rechercheArticles() {
  let articlesTrouves = await fetch("http://localhost:3000/api/products");
  return await articlesTrouves.json();
}

// ------------------------------------------------------------------------------------------------------------------------

// creation du contenu de la page
async function creationPanier() {
  let ArticleAPI = await rechercheArticles();
  const idArticlesAPI = await ArticleAPI.map((el) => el._id);
  // -------------------

  // -------------------

  for (let articles of panierRecup) {
    let id = articles["id"];

    let indexId = await idArticlesAPI.indexOf(id);
    let prix = await ArticleAPI[indexId].price;
    let couleur = articles["couleur"];
    let url = articles["url de l'image"];
    let txtAlt = articles["texte Alternatif"];
    let nom = articles["nom"];
    // let prix = articles["prix"];
    let quantite = articles["quantité"];

    // creation balise article
    let baliseArticle = document.createElement("article");
    let bArticle = document
      .getElementById("cart__items")
      .appendChild(baliseArticle);
    bArticle.classList.add("cart__item");
    bArticle.setAttribute("data-id", id);
    bArticle.setAttribute("data-color", couleur);

    // creation de la balise div pour l'image de l'article
    let baliseDivImg = document.createElement("div");
    let bDivImg = bArticle.appendChild(baliseDivImg);
    bDivImg.classList.add("cart__item__img");

    // creation de la balise pour l'image de l'article
    let baliseImg = document.createElement("img");
    let bImg = bDivImg.appendChild(baliseImg);
    bImg.src = url;
    bImg.alt = txtAlt;

    // creation de la balise div pour les details de l'article
    let baliseDivDetails = document.createElement("div");
    let bDivDetails = bArticle.appendChild(baliseDivDetails);
    bDivDetails.classList.add("cart__item__content");

    // creation de la balise div pour la description de l'article
    let baliseDivDetailsDescription = document.createElement("div");
    let bDivDetailsDescription = bDivImg.nextElementSibling.appendChild(
      baliseDivDetailsDescription
    );
    bDivDetailsDescription.classList.add("cart__item__content__description");

    // creation des balises h2 p p pour la description de l'article
    let baliseDivDetailsDescriptionH2 = document.createElement("h2");
    let baliseDivDetailsDescriptionP1 = document.createElement("p");
    let baliseDivDetailsDescriptionP2 = document.createElement("p");
    bDivDetailsDescription.appendChild(
      baliseDivDetailsDescriptionH2
    ).innerText = nom;
    bDivDetailsDescription.appendChild(
      baliseDivDetailsDescriptionP1
    ).innerText = couleur;
    bDivDetailsDescription.appendChild(
      baliseDivDetailsDescriptionP2
    ).innerText = prix + " €";

    // creation div pour modifier les details
    let baliseDivModifDetails = document.createElement("div");
    let bDivModifdetails = bDivDetails.appendChild(baliseDivModifDetails);
    bDivModifdetails.classList.add("cart__item__content__settings");

    // creation div pour modifier les quantités
    let baliseDivModifDetailsQuantite = document.createElement("div");
    let bDivModifDetailsQuantite = bDivModifdetails.appendChild(
      baliseDivModifDetailsQuantite
    );
    bDivModifDetailsQuantite.classList.add(
      "cart__item__content__settings__quantity"
    );

    // creation de la balise p et input pour modifier les quantités
    let balisePModifDetailsQuantite = document.createElement("div");
    let baliseInputModifDetailsQuantite = document.createElement("input");
    bDivModifDetailsQuantite.appendChild(
      balisePModifDetailsQuantite
    ).innerText = "Quantité : ";
    let bInputModifDetailsQuantite = bDivModifDetailsQuantite.appendChild(
      baliseInputModifDetailsQuantite
    );
    bInputModifDetailsQuantite.setAttribute("input", "number");
    bInputModifDetailsQuantite.setAttribute("name", "itemQuantity");
    bInputModifDetailsQuantite.setAttribute("min", 1);
    bInputModifDetailsQuantite.setAttribute("max", 100);
    bInputModifDetailsQuantite.setAttribute("value", quantite);
    bInputModifDetailsQuantite.classList.add("itemQuantity");

    // creation de la div pour supprimer l'article
    let baliseDivSupprimer = document.createElement("div");
    let bDivSupprimer = bDivModifdetails.appendChild(baliseDivSupprimer);
    bDivSupprimer.classList.add("cart__item__content__settings__delete");

    // creation de la balise p pour supprimer l'article
    let balisePSupprimer = document.createElement("p");
    let bPSupprimer = bDivSupprimer.appendChild(balisePSupprimer);
    bPSupprimer.classList.add("deleteItem");
    bPSupprimer.innerText = "supprimer";
  }
  articleSuppression();
  articleModifQuantite();
  calculNombreArticle();
  quantiteTotaleAffichage();
  calculPrixTotal();
  prixTotalAffichage();
}
creationPanier();

// ---------------------------------------------------------------------------

// fonction suppression d'article du panier
function articleSuppression() {
  // gestion du bouton supprimer
  let boutonSupprimer = document.getElementsByClassName("deleteItem");
  // boucle avec une itération par article
  for (let i = 0; i < boutonSupprimer.length; i++) {
    boutonSupprimer[i].addEventListener("click", function () {
      // modification de localStorage
      panierRecup.splice(i, 1);
      console.table(panierRecup);
      localStorage.setItem("contenuPanier", JSON.stringify(panierRecup));
      location.reload(); // MOCHE MAIS BON ...
    });
  }
  quantiteTotaleAffichage();
  calculPrixTotal();
  prixTotalAffichage();
}

// ---------------------------------------------------------------------------

// fonction pour modifier la quantité d'un article
function articleModifQuantite() {
  // gestion modification quantite
  let quantiteModif = document.getElementsByClassName("itemQuantity");
  for (let i = 0; i < quantiteModif.length; i++) {
    quantiteModif[i].addEventListener("change", function () {
      quantiteNouvelle = quantiteModif[i].value;
      panierRecup[i].quantité = quantiteNouvelle;
      localStorage.setItem("contenuPanier", JSON.stringify(panierRecup));
      calculNombreArticle();
      quantiteTotaleAffichage();
      calculPrixTotal();
      prixTotalAffichage();
    });
  }
}

// ---------------------------------------------------------------------------

// calcul du nombre total d'article
function calculNombreArticle() {
  let quantiteParArticle = document.getElementsByClassName("itemQuantity");
  let total = 0;
  for (let i = 0; i < quantiteParArticle.length; i++) {
    q = quantiteParArticle[i].value;
    qNumber = parseInt(q, 10);
    total += qNumber;
  }
  return total;
}

// affichage du nombre total d'article
function quantiteTotaleAffichage() {
  let totalQuantiteAffiche = document.getElementById("totalQuantity");
  let totalQuantitePanier = calculNombreArticle();
  totalQuantiteAffiche.innerText = totalQuantitePanier;
}

// ---------------------------------------------------------------------------

// calcul du prix total du panier
async function calculPrixTotal() {
  let prixTotal = 0;
  let ArticleAPI = await rechercheArticles();
  const idArticlesAPI = await ArticleAPI.map((el) => el._id);

  for (let articles of panierRecup) {
    let quantite = articles["quantité"];
    let id = articles["id"];
    let indexId = idArticlesAPI.indexOf(id);
    let prix = ArticleAPI[indexId].price;
    let prixTotalArticle = quantite * prix;
    prixTotal += prixTotalArticle;
  }
  return prixTotal;
}

// affichage du prix total du panier
async function prixTotalAffichage() {
  let prixTotalAffiche = document.getElementById("totalPrice");
  let prixTotalPanier = await calculPrixTotal();
  prixTotalAffiche.innerText = prixTotalPanier;
}
