class ItemComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const description = this.getAttribute("data-description");
  
      this.shadowRoot.innerHTML = `
        <style>
          .item {
            border: 1px solid #ddd;
            padding: 10px;
            margin: 5px;
            display: flex;
            justify-content: space-between;
          }
          button {
            margin-left: 5px;
          }
        </style>
        <div class="item">
          <div>
            <strong>${name}</strong>: ${description}
          </div>
          <div>
            <button class="edit">Editar</button>
            <button class="delete">Eliminar</button>
          </div>
        </div>
      `;
  
      this.shadowRoot.querySelector(".edit").addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("edit-item", { detail: { id, name, description } })
        );
      });
  
      this.shadowRoot.querySelector(".delete").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("delete-item", { detail: { id } }));
      });
    }
  }
  
  customElements.define("item-component", ItemComponent);
  