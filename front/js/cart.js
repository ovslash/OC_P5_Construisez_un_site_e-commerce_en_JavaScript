// recupération du contenu du localStorage
let panierRecup = JSON.parse(localStorage.getItem("contenuPanier"));
console.log("CONTENU DU PANIER DU LOCALSTORAGE =");
console.table(panierRecup);

// tri du panier
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

// Recherche des articles présent dans l'API ----------- TEST
function rechercheArticlesTEST() {
  fetch("http://localhost:3000/api/products")
    .then((reponse) => reponse.json())
    .catch(function (error) {
      console.log("Erreur lors de la communication avec l'API");
      console.log(error);
    });
}

// ------------------------------------------------------------------------------------------------------------------------

// creation du contenu de la page
async function creationPanier() {
  fetch("http://localhost:3000/api/products")
    .then(function (reponseAPI) {
      return reponseAPI.json();
    })
    .then(function (ArticleAPI) {
      console.log("Contenu de l'API =");
      console.table(ArticleAPI);
      let idArticlesAPI = ArticleAPI.map((el) => el._id);
      // -------------------

      // -------------------

      for (let articles of panierRecup) {
        let id = articles["id"];
        let indexId = idArticlesAPI.indexOf(id);
        let prix = ArticleAPI[indexId].price;
        let couleur = articles["couleur"];
        let url = ArticleAPI[indexId].imageUrl;
        let txtAlt = ArticleAPI[indexId].altTxt;
        let nom = ArticleAPI[indexId].name;
        let quantite = articles["quantite"];
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
        bDivDetailsDescription.classList.add(
          "cart__item__content__description"
        );

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
      prixTotal();
    })
    .catch(function (error) {
      console.log("Erreur lors de la communication avec l'API");
      console.log(error);
    });
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
  prixTotal();
}

// ---------------------------------------------------------------------------

// fonction pour modifier la quantité d'un article
function articleModifQuantite() {
  // gestion modification quantite
  let quantiteModif = document.getElementsByClassName("itemQuantity");
  for (let i = 0; i < quantiteModif.length; i++) {
    quantiteModif[i].addEventListener("change", function () {
      quantiteNouvelle = quantiteModif[i].value;
      panierRecup[i].quantite = quantiteNouvelle;
      localStorage.setItem("contenuPanier", JSON.stringify(panierRecup));
      calculNombreArticle();
      quantiteTotaleAffichage();
      prixTotal();
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
function prixTotal() {
  let prixTotal = 0;

  fetch("http://localhost:3000/api/products")
    .then(function (reponseAPI) {
      return reponseAPI.json();
    })
    .then(function (ArticleAPI) {
      let idArticlesAPI = ArticleAPI.map((el) => el._id);
      for (let articles of panierRecup) {
        let quantite = articles["quantite"];
        let id = articles["id"];
        let indexId = idArticlesAPI.indexOf(id);
        let prix = ArticleAPI[indexId].price;
        let prixTotalArticle = quantite * prix;
        prixTotal += prixTotalArticle;
      }
      return prixTotal;
    })

    .then(function (prixtotal) {
      let prixTotalAffiche = document.getElementById("totalPrice");
      prixTotalAffiche.innerText = prixtotal;
    })

    .catch(function (error) {
      console.log("Erreur lors de la communication avec l'API");
      console.log(error);
    });
}

// ------------------------------------------------------------------------------------------------------------------------

// formulaire

function formulaire() {
  let donnéesFormulaire = document.querySelector(".cart__order__form");

  // creation des RegExp
  let lettresRegExp = new RegExp("^[a-zA-Z ,.'-]+$");

  let addresseRegExp = new RegExp("[^A-Za-z0-9]");

  let mailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );

  // modification du prénom
  donnéesFormulaire.firstName.addEventListener("change", function () {
    prenomVerification(this);
  });
  // validation du prénom
  const prenomVerification = function (prenom) {
    let prenomMessageErreur = prenom.nextElementSibling;
    if (lettresRegExp.test(prenom.value)) {
      prenomMessageErreur.innerHTML = "";
    } else {
      prenomMessageErreur.innerHTML = "Veuillez renseigner votre prénom";
    }
  };

  // modification du nom de famille
  donnéesFormulaire.lastName.addEventListener("change", function () {
    nomVerification(this);
  });
  // validation du nom
  const nomVerification = function (nom) {
    let nomMessageErreur = nom.nextElementSibling;
    if (lettresRegExp.test(nom.value)) {
      nomMessageErreur.innerHTML = "";
    } else {
      nomMessageErreur.innerHTML = "Veuillez renseigner votre nom";
    }
  };

  // modification de l'adresse
  donnéesFormulaire.address.addEventListener("change", function () {
    adresseVerification(this);
  });
  // validation de l'adresse
  const adresseVerification = function (adresse) {
    let adresseMessageErreur = adresse.nextElementSibling;
    if (addresseRegExp.test(adresse.value)) {
      adresseMessageErreur.innerHTML = "";
    } else {
      adresseMessageErreur.innerHTML = "Veuillez renseigner votre adresse";
    }
  };

  // modification de la ville
  donnéesFormulaire.city.addEventListener("change", function () {
    villeVerification(this);
  });
  // validation de la ville
  const villeVerification = function (ville) {
    villeMessageErreur = ville.nextElementSibling;

    if (lettresRegExp.test(ville.value)) {
      villeMessageErreur.innerHTML = "";
    } else {
      villeMessageErreur.innerHTML = "Veuillez renseigner votre ville";
    }
  };

  // modification du mail
  donnéesFormulaire.email.addEventListener("change", function () {
    mailVerification(this);
  });
  // validation de l'email
  const mailVerification = function (mail) {
    let mailMessageErreur = mail.nextElementSibling;
    if (mailRegExp.test(mail.value)) {
      mailMessageErreur.innerHTML = "";
    } else {
      mailMessageErreur.innerHTML = "Veuillez renseigner votre email.";
    }
  };
}
formulaire();

// ---------------------------------------------------------------------------------------------------

// fonction pour l'envoi du formulaire
function envoiFormulaire() {
  let boutonCommander = document.getElementById("order");

  // declencheur bouton commander
  boutonCommander.addEventListener("click", () => {
    // info du formulaire
    let prenom = document.getElementById("firstName");
    let nom = document.getElementById("lastName");
    let adresse = document.getElementById("address");
    let ville = document.getElementById("city");
    let mail = document.getElementById("email");

    //Construction d'un array depuis le local storage
    let idProducts = [];
    for (let i = 0; i < panierRecup.length; i++) {
      idProducts.push(panierRecup[i].id);
    }

    const order = {
      contact: {
        firstName: prenom.value,
        lastName: nom.value,
        address: adresse.value,
        city: ville.value,
        email: mail.value,
      },
      products: idProducts,
    };

    const envoi = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    fetch("http://localhost:3000/api/products/order", envoi)
      .then(function (reponseAPI) {
        return reponseAPI.json();
      })

      .then(function (reponseID) {
        localStorage.clear();
        localStorage.setItem("orderId", reponseID.orderId);
        window.location.href = "confirmation.html";
      })
      .catch(function (erreur) {
        console.log(erreur);
      });
  });
}
envoiFormulaire();
