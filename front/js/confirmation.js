function confirmation() {
  const numConfirmation = document.getElementById("orderId");
  numConfirmation.innerText = localStorage.getItem("orderId");
  console.log(localStorage.getItem("orderId"));
  localStorage.clear();
}

confirmation();
