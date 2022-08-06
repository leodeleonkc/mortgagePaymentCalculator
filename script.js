"use strict";

const resizeOps = () => {
  document.documentElement.style.setProperty(
    "--vh",
    window.innerHeight * 0.01 + "px"
  );
};

resizeOps();
window.addEventListener("resize", resizeOps);

// Input DOM elements
const chartScript = document.getElementById("theChart");
const housePrice = document.getElementById("house-price");
const downPayment = document.getElementById("down-payment");
const loanTerm = document.getElementById("term");
const mRate = document.getElementById("mpr");
const paymentFigure = document.getElementById("payment-figure");
const totalInterestDom = document.getElementById("total-interest");
const totalCostDom = document.getElementById("total-cost");

const afterCalculate = document.getElementById("after-calculate");
const footerFirst = document.querySelector(".directions");
const footerAfter = document.getElementById("footer-after");
const twentyPercent = document.getElementById("20-percent");

const calculateBtn = document.getElementById("calculate-btn");

// Add Event Listener

calculateBtn.addEventListener("click", function () {
  if (
    housePrice.value.length === 0 ||
    downPayment.value.length === 0 ||
    loanTerm.value.length === 0 ||
    mRate.value.length === 0
  ) {
    calculateBtn.textContent = "Missing info";
    calculateBtn.classList.add("red-alert");

    setTimeout(resetBtn, 3000);
  } else {
    mortgageCalc();
  }
});

function resetBtn() {
  calculateBtn.textContent = "Calculate";
  calculateBtn.classList.remove("red-alert");
}

// LOGIC START //////////////////////////////////
let payment = 0;

// Logic to calculate:
// 1. Poperty tax based on national average
// 2. Total monthly payment basaed on provided parameters
// 3. Total mortgage cost at the end of the mortgage term
// 4. Total of interest paid through the duration of the term

function mortgageCalc() {
  // Remove hidden class

  afterCalculate.classList.remove("hidden");
  footerFirst.classList.add("hidden");
  footerAfter.classList.remove("hidden");

  // Initial Values

  const term = loanTerm.value;
  const down = downPayment.value;
  const loanMain = housePrice.value;
  const apr = mRate.value;

  const termMonths = term * 12;
  const anualRate = (apr * 0.01) / 12 + 1;
  const powerCalc = Math.pow(anualRate, termMonths);
  const loan = loanMain - down;

  // Calculate property tax based on national average of 1.11%

  const taxAmount = (loan * 0.011) / 12;
  const totalTax = taxAmount * termMonths;

  // Tax for the Chart
  const taxChart = Math.ceil(taxAmount);

  // Calculate if payment will include PMI or not

  const pmiRequired = (down / loan) * 100;

  if (pmiRequired >= 20) {
    // Calculate total monthly payment
    payment =
      (loan * ((anualRate - 1) * powerCalc)) / (powerCalc - 1) + taxAmount;
    paymentFigure.textContent = payment.toLocaleString(`en-US`, {
      style: "currency",
      currency: "USD",
    });

    // Principal for the Chart

    const principalChart = Math.ceil(loan / termMonths);

    // Calculate total mortgage cost

    const totalCost = termMonths * payment;
    totalCostDom.textContent = totalCost.toLocaleString(`en-US`, {
      style: "currency",
      currency: "USD",
    });

    // Calculate interest paid

    const totalInterest = totalCost - loan - totalTax;
    totalInterestDom.textContent = totalInterest.toLocaleString(`en-US`, {
      style: "currency",
      currency: "USD",
    });

    // Interest for the Chart

    const interestChart = Math.ceil(totalInterest / termMonths);

    let g = document.createElement("script");
    let s = document.getElementsByTagName("script")[0];
    g.text = `
var xValues = ["Principal", "Interest", "Tax"];
var yValues = [${principalChart}, ${interestChart}, ${taxChart}];
var barColors = [
  "#76B5BC",
  "#EC755D",
  "#382515",

];

new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    plugins: {

  }
}});`;
    s.parentNode.insertBefore(g, s);
  } else {
    // Calculate PMI
    const pmiAmount = (loan * 0.0136) / 12;

    // Calculate total monthly payment
    payment =
      (loan * ((anualRate - 1) * powerCalc)) / (powerCalc - 1) +
      taxAmount +
      pmiAmount;
    paymentFigure.textContent = payment.toLocaleString(`en-US`, {
      style: "currency",
      currency: "USD",
    });

    // Principal for the Chart

    const principalChart = Math.ceil(loan / termMonths);

    // PMI for the Chart

    const pmiChart = Math.ceil(pmiAmount);

    // Calculate total mortgage cost

    const totalCost = termMonths * payment;
    totalCostDom.textContent = totalCost.toLocaleString(`en-US`, {
      style: "currency",
      currency: "USD",
    });

    // Calculate interest paid

    const totalInterest = totalCost - loan - totalTax;
    totalInterestDom.textContent = totalInterest.toLocaleString(`en-US`, {
      style: "currency",
      currency: "USD",
    });

    // Interest for the Chart

    const interestChart = Math.ceil(totalInterest / termMonths);

    let g = document.createElement("script");
    let s = document.getElementsByTagName("script")[0];
    g.text = `
  var xValues = ["Principal", "Interest", "Tax", "PMI"];
  var yValues = [${principalChart}, ${interestChart}, ${taxChart}, ${pmiChart}];
  var barColors = [
    "#76B5BC",
    "#EC755D",
    "#382515",
    "#705060",
  
  ];
  
  new Chart("myChart", {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      plugins: {
  
    }
  }});`;
    s.parentNode.insertBefore(g, s);

    twentyPercent.classList.remove("hidden");
  }
}
