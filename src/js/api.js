//url de la api
const API_URL = "http://localhost:3000/items";

// Obtener todos los ítems
export async function getItems() {
  const response = await fetch(API_URL);
  return response.json();
}

// Crear un nuevo ítem
export async function createItem(item) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return response.json();
}

// Actualizar un ítem existente
export async function updateItem(id, item) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return response.json();
}

// Eliminar un ítem
export async function deleteItem(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
