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
