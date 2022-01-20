// Recherche des articles présent dans l'API
async function rechercheArticles() {
  let articlesTrouves = await fetch("http://localhost:3000/api/products");
  return await articlesTrouves.json();
}

// affichage articles dans l'API sous forme de tableau
async function affichageArticles() {
  let articles = await rechercheArticles();
  console.table(articles);
}
affichageArticles();

// fonction creation des vignettes
async function lesVignettes() {
  await rechercheArticles()
    .then(function (articles) {
      // mise en place boucle pour création vignette pour chaque articles
      for (let article of articles) {
        // création balise <a>
        let id = article["_id"];
        let baliseA = document.createElement("a");
        document.getElementById("items").appendChild(baliseA);
        baliseA.href = "./product.html?id=" + id;

        // création balise <article>
        let baliseArticle = document.createElement("article");
        baliseA.appendChild(baliseArticle);

        // création balise <img>
        let altTxt = article["altTxt"];
        let imageUrl = article["imageUrl"];
        let baliseImg = document.createElement("img");
        baliseArticle.appendChild(baliseImg).src = imageUrl;
        baliseArticle.appendChild(baliseImg).alt = altTxt;

        // création balise <h3>
        let name = article["name"];
        let baliseH3 = document.createElement("h3");
        baliseArticle.appendChild(baliseH3).innerText = name;
        baliseH3.classList.add("productName");

        // création balise <p>
        let description = article["description"];
        let baliseP = document.createElement("p");
        baliseArticle.appendChild(baliseP).innerText = description;
        baliseP.classList.add("productDescription");
      }
    })
    .catch(function (erreur) {
      console.log(erreur);
    });
}
lesVignettes();
