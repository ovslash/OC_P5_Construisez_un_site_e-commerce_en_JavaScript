function confirmation() {
  const numConfirmation = document.getElementById("orderId");
  numConfirmation.innerText = localStorage.getItem("orderId");
  console.log("ID DE LA COMMANDE AVANT SUPPRESSION DU LOCALSTORAGE =");
  console.log(localStorage.getItem("orderId"));
  localStorage.clear();
}
confirmation();
