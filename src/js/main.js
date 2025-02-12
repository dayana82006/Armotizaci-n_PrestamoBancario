import { getcards, createcard, updatecard, deletecard } from "./api.js";
import "../components/cardComponent.js"; 
import '../styles/main.css'; // Asegúrate de que este archivo esté importado

const cardList = document.getElementById("card-list"); 
const form = document.getElementById("card-form"); 
const inputId = document.getElementById("card-id"); 
const inputName = document.getElementById("card-name"); 
const inputOrigen = document.getElementById("card-origen"); 
// Cargar datos al inicio
document.addEventListener("DOMContentLoaded", loadcards);

async function loadcards() {
  cardList.innerHTML = ""; 
  try {
    const cards = await getcards();
    cards.forEach((card) => addcardToDOM(card)); 
  } catch (error) {
    console.error("Error cargando las cards:", error);
  }
}

function addcardToDOM(card) {
  const cardElement = document.createElement("card-component");
  cardElement.setAttribute("data-id", card.id);
  cardElement.setAttribute("data-name", card.name);
  cardElement.setAttribute("data-historia", card.historia);
  cardElement.setAttribute("data-origen", card.origen);

  // Evento para editar el card
  cardElement.addEventListener("edit-card", (e) => {
    const { id, name, origen } = e.detail;
    inputId.value = id; 
    inputName.value = name; 
    inputOrigen.value = origen; 
    inputHistoria.value = historia; 
  });

  cardElement.addEventListener("delete-card", async (e) => {
    const { id } = e.detail;
    try {
      await deletecard(id); 
      loadcards();
    } catch (error) {
      console.error("Error eliminando el card:", error);
    }
  });

  cardList.appendChild(cardElement); 
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const card = {
    name: inputName.value,
    origen: inputOrigen.value,
    historia: inputHistoria.value,
  };

  try {
    if (inputId.value) {
     
      await updatecard(inputId.value, card);
    } else {
      
      await createcard(card);
    }

    form.reset(); 
    loadcards(); 
  } catch (error) {
    console.error("Error guardando el card:", error);
  }
});