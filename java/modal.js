const openModalButton= document.querySelector("#openModal");
const closeModalButton= document.querySelector("#closeModal");
const modal= document.querySelector("#modal");
const fade= document.querySelector("#fadee");


openModal.addEventListener("click", () => {
  modal.classList.remove("hide");
  fade.classList.remove("hide");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hide");
  fade.classList.add("hide");
});

// permite fechar clicando fora do modal
fade.addEventListener("click", () => {
  modal.classList.add("hide");
  fade.classList.add("hide");
});