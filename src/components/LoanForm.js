class LoanForm extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.shadowRoot.innerHTML = `
        <style>
          .form-container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          label {
            font-size: 16px;
            margin-bottom: 8px;
          }
          input, select {
            width: 100%;
            padding: 8px;
            margin: 8px 0;
            border-radius: 4px;
            border: 1px solid #ccc;
          }
          button {
            background-color: #007bff;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
        <div class="form-container">
          <h2>Generar Tabla de Amortización</h2>
          <form id="loan-form">
            <label for="clientName">Nombre del Cliente:</label>
            <input type="text" id="clientName" required>
  
            <label for="clientDocument">Documento de Identidad (único):</label>
            <input type="text" id="clientDocument" required>
  
            <label for="loanAmount">Monto del Préstamo ($):</label>
            <input type="number" id="loanAmount" required>
  
            <label for="interestRate">Tasa de Interés Anual (%):</label>
            <input type="number" id="interestRate" required>
  
            <label for="loanTerm">Plazo en Meses:</label>
            <input type="number" id="loanTerm" required>
  
            <label for="amortizationType">Tipo de Amortización:</label>
            <select id="amortizationType">
              <option value="frances">Francés</option>
              <option value="americano">Americano</option>
            </select>
  
            <button type="submit">Calcular</button>
          </form>
        </div>
      `;
  
      this.shadowRoot.querySelector("#loan-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = {
          clientName: this.shadowRoot.querySelector("#clientName").value,
          clientDocument: this.shadowRoot.querySelector("#clientDocument").value,
          loanAmount: parseFloat(this.shadowRoot.querySelector("#loanAmount").value),
          interestRate: parseFloat(this.shadowRoot.querySelector("#interestRate").value),
          loanTerm: parseInt(this.shadowRoot.querySelector("#loanTerm").value),
          amortizationType: this.shadowRoot.querySelector("#amortizationType").value
        };
  
        // Crear cliente y préstamo
        this.createClient(formData);
      });
    }
  
    async createClient(formData) {
      // Crear el cliente en la base de datos
      const clientResponse = await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.clientName,
          document: formData.clientDocument
        }),
      });
      const client = await clientResponse.json();
  
      // Crear el préstamo en la base de datos
      const loanResponse = await fetch('http://localhost:3000/prestamos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: client.id,
          loanAmount: formData.loanAmount,
          interestRate: formData.interestRate,
          loanTerm: formData.loanTerm,
          amortizationType: formData.amortizationType,
          tableData: this.generateAmortizationTable(formData)
        }),
      });
      const loan = await loanResponse.json();
      
      // Emitir evento con la simulación de la tabla
      this.dispatchEvent(new CustomEvent('loanCalculated', {
        detail: loan.tableData,
        bubbles: true,
        composed: true
      }));
    }
  
    generateAmortizationTable(formData) {
      const { loanAmount, interestRate, loanTerm, amortizationType } = formData;
      if (amortizationType === 'frances') {
        return this.calculateFrances(loanAmount, interestRate, loanTerm);
      } else {
        return this.calculateAmericano(loanAmount, interestRate, loanTerm);
      }
    }
  
    calculateFrances(loanAmount, interestRate, loanTerm) {
      const monthlyRate = interestRate / 12 / 100;
      const fixedMonthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
      let balance = loanAmount;
      const table = [];
  
      for (let i = 1; i <= loanTerm; i++) {
        const interest = balance * monthlyRate;
        const principal = fixedMonthlyPayment - interest;
        balance -= principal;
        table.push({
          month: i,
          initialBalance: balance + principal,
          monthlyPayment: fixedMonthlyPayment.toFixed(2),
          interest: interest.toFixed(2),
          principal: principal.toFixed(2),
          remainingBalance: balance.toFixed(2)
        });
      }
      return table;
    }
  
    calculateAmericano(loanAmount, interestRate, loanTerm) {
      const monthlyRate = interestRate / 12 / 100;
      const interestPayment = loanAmount * monthlyRate;
      const table = [];
  
      for (let i = 1; i <= loanTerm; i++) {
        table.push({
          month: i,
          initialBalance: loanAmount,
          monthlyPayment: interestPayment.toFixed(2),
          interest: interestPayment.toFixed(2),
          principal: i === loanTerm ? loanAmount.toFixed(2) : '0.00',
          remainingBalance: i === loanTerm ? '0.00' : loanAmount.toFixed(2)
        });
      }
      return table;
    }
  }
  
  customElements.define('loan-form', LoanForm);
  