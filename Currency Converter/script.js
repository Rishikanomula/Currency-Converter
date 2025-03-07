const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amount = document.getElementById("amount");
const convertBtn = document.getElementById("convert");
const swapBtn = document.getElementById("swap");
const result = document.getElementById("result");
const exchangeRateText = document.getElementById("exchange-rate");

const API_URL = "https://api.exchangerate-api.com/v4/latest/";

async function fetchRates() {
    try {
        const res = await fetch(API_URL + fromCurrency.value);
        const data = await res.json();
        const rate = data.rates[toCurrency.value];
        const convertedAmount = (amount.value * rate).toFixed(2);

        result.innerText = `${amount.value} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
        exchangeRateText.innerText = `Exchange Rate: 1 ${fromCurrency.value} = ${rate.toFixed(4)} ${toCurrency.value}`;
    } catch (error) {
        result.innerText = "Error fetching exchange rates!";
    }
}

async function populateDropdowns() {
    try {
        const res = await fetch(API_URL + "USD");
        const data = await res.json();
        const currencies = Object.keys(data.rates);

        fromCurrency.innerHTML = currencies.map(cur => `<option value="${cur}">${cur}</option>`).join("");
        toCurrency.innerHTML = currencies.map(cur => `<option value="${cur}">${cur}</option>`).join("");

        fromCurrency.value = "USD";
        toCurrency.value = "EUR";
    } catch (error) {
        result.innerText = "Error loading currencies!";
    }
}

convertBtn.addEventListener("click", () => {
    if (amount.value <= 0) {
        result.innerText = "Please enter a valid amount!";
        return;
    }
    fetchRates();
});

swapBtn.addEventListener("click", () => {
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
    fetchRates();
});

document.addEventListener("DOMContentLoaded", populateDropdowns);
