class AmortizationTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .btn {
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          background-color: #656AA2; /* Azul */
          color: #FFA500; /* Naranja */
          border: none;
          font-weight: bold;
          transition: all 0.3s ease;
        }
      
        .btn:hover {
          background-color: #0056b3; /* Azul más oscuro */
          color: #FFD580; /* Naranja más claro */
        }
        .btn-primary { background-color: #656AA2; color: white; }
        .btn-danger { background-color: #dc3545; color: white; }
        .btn-info { background-color: #17a2b8; color: white; }
        .btn-success { background-color: #28a745; color: white; }
        table { width: 100%; margin-top: 20px; }
        th, td { padding: 8px 12px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
      <div class="container">
        <h2>Simulación de Amortización</h2>
        <form id="loan-form">
          <div>
            <label for="clienteId">ID del Cliente:</label>
            <input type="text" id="clienteId" required>
          </div>
          <div>
            <label for="monto">Monto del Préstamo ($):</label>
            <input type="number" id="monto" required>
          </div>
          <div>
            <label for="interes">Tasa de Interés Anual (%):</label>
            <input type="number" id="interes" required>
          </div>
          <div>
            <label for="plazo">Plazo (meses):</label>
            <input type="number" id="plazo" required>
          </div>
          <div>
            <label for="tipoAmortizacion">Tipo de Amortización:</label>
            <select id="tipoAmortizacion" required>
              <option value="Frances">Francés</option>
              <option value="Americano">Americano</option>
            </select>
          </div>
          <button type="submit" class="btn">Calcular</button>
        </form>
        <div id="amortization-table-container"></div>
      </div>
    `;

    this.shadowRoot.querySelector("#loan-form").addEventListener("submit", this.handleFormSubmit.bind(this));
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    const clienteId = this.shadowRoot.querySelector("#clienteId").value;
    const monto = parseFloat(this.shadowRoot.querySelector("#monto").value);
    const interes = parseFloat(this.shadowRoot.querySelector("#interes").value);
    const plazo = parseInt(this.shadowRoot.querySelector("#plazo").value);
    const tipoAmortizacion = this.shadowRoot.querySelector("#tipoAmortizacion").value;

    // Lógica para calcular la amortización
    let tablaAmortizacion = [];
    if (tipoAmortizacion === "Francés") {
      tablaAmortizacion = this.calculateFrenchAmortization(monto, interes, plazo);
    } else {
      tablaAmortizacion = this.calculateAmericanAmortization(monto, interes, plazo);
    }

    this.renderAmortizationTable(tablaAmortizacion);
  }

  // Calcular la tabla de amortización del tipo Francés
  calculateFrenchAmortization(monto, interes, plazo) {
    const cuotaMensual = (monto * (interes / 100) / 12) / (1 - Math.pow(1 + interes / 100 / 12, -plazo));
    let saldoRestante = monto;
    let tabla = [];
    for (let i = 1; i <= plazo; i++) {
      const intereses = saldoRestante * interes / 100 / 12;
      const amortizacionCapital = cuotaMensual - intereses;
      saldoRestante -= amortizacionCapital;
      tabla.push({
        numeroCuota: i,
        saldoInicial: saldoRestante + amortizacionCapital,
        cuotaMensual: cuotaMensual.toFixed(2),
        intereses: intereses.toFixed(2),
        amortizacionCapital: amortizacionCapital.toFixed(2),
        saldoRestante: saldoRestante.toFixed(2)
      });
    }
    return tabla;
  }

  // Calcular la tabla de amortización del tipo Americano
  calculateAmericanAmortization(monto, interes, plazo) {
    const interesMensual = (monto * interes / 100) / 12;
    const tabla = [];
    let saldoRestante = monto;
    for (let i = 1; i <= plazo; i++) {
      tabla.push({
        numeroCuota: i,
        saldoInicial: saldoRestante,
        cuotaMensual: interesMensual.toFixed(2),
        intereses: interesMensual.toFixed(2),
        amortizacionCapital: i === plazo ? saldoRestante.toFixed(2) : '0.00',
        saldoRestante: i === plazo ? '0.00' : saldoRestante.toFixed(2)
      });
      saldoRestante -= saldoRestante;
    }
    return tabla;
  }

  // Renderizar la tabla de amortización calculada
  renderAmortizationTable(tabla) {
    const container = this.shadowRoot.querySelector("#amortization-table-container");
    container.innerHTML = `
      <h3>Tabla de Amortización</h3>
      <table>
        <thead>
          <tr>
            <th>Cuota</th>
            <th>Saldo Inicial</th>
            <th>Cuota Mensual</th>
            <th>Intereses</th>
            <th>Amortización</th>
            <th>Saldo Restante</th>
          </tr>
        </thead>
        <tbody>
          ${tabla.map(row => `
            <tr>
              <td>${row.numeroCuota}</td>
              <td>$${row.saldoInicial}</td>
              <td>$${row.cuotaMensual}</td>
              <td>$${row.intereses}</td>
              <td>$${row.amortizacionCapital}</td>
              <td>$${row.saldoRestante}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

customElements.define('amortization-table', AmortizationTable);
