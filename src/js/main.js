document.addEventListener('DOMContentLoaded', () => {
  const loanForm = document.querySelector('loan-form');
  const amortizationTable = document.querySelector('amortization-table');

  loanForm.addEventListener('formSubmitted', (event) => {
    const formData = event.detail;
    const { loanAmount, interestRate, loanTerm, amortizationType } = formData;
    
    let tableData;
    if (amortizationType === 'frances') {
      tableData = calculateFrances(loanAmount, interestRate, loanTerm);
    } else {
      tableData = calculateAmericano(loanAmount, interestRate, loanTerm);
    }

    amortizationTable.renderTable(tableData);
  });
});

function calculateFrances(loanAmount, interestRate, loanTerm) {
  let table = [];
  const monthlyRate = interestRate / 12;
  const fixedMonthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  let balance = loanAmount;

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

function calculateAmericano(loanAmount, interestRate, loanTerm) {
  let table = [];
  const monthlyRate = interestRate / 12;
  const interestPayment = loanAmount * monthlyRate;

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
