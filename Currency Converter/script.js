const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amount = document.getElementById("amount");
const convertBtn = document.getElementById("convert");
const swapBtn = document.getElementById("swap");
const result = document.getElementById("result");
const exchangeRateText = document.getElementById("exchange-rate");
const loading = document.getElementById("loading");
const errorText = document.getElementById("error");

const API_URL = "https://api.exchangerate-api.com/v4/latest/";

async function fetchRates() {
    // Show loading message
    loading.style.display = "block";

    try {
        const res = await fetch(API_URL + fromCurrency.value);
        const data = await res.json();

        if (!data.rates[toCurrency.value]) {
            throw new Error("Invalid currency");
        }

        const rate = data.rates[toCurrency.value];
        const convertedAmount = (amount.value * rate).toFixed(2);

        result.innerText = `${amount.value} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
        exchangeRateText.innerText = `Exchange Rate: 1 ${fromCurrency.value} = ${rate.toFixed(4)} ${toCurrency.value}`;
        errorText.innerText = "";

        // Store the last used currencies and amount in local storage
        localStorage.setItem("fromCurrency", fromCurrency.value);
        localStorage.setItem("toCurrency", toCurrency.value);
        localStorage.setItem("amount", amount.value);
    } catch (error) {
        result.innerText = "Error fetching exchange rates!";
        errorText.innerText = error.message;
    } finally {
        // Hide loading message
        loading.style.display = "none";
    }
}

async function populateDropdowns() {
    // Populate dropdowns
    try {
        const res = await fetch(API_URL + "USD");
        const data = await res.json();
        const currencies = Object.keys(data.rates);

        fromCurrency.innerHTML = currencies.map(cur => `<option value="${cur}">${cur}</option>`).join("");
        toCurrency.innerHTML = currencies.map(cur => `<option value="${cur}">${cur}</option>`).join("");

        // Retrieve stored preferences from local storage
        const lastFrom = localStorage.getItem("fromCurrency");
        const lastTo = localStorage.getItem("toCurrency");
        const lastAmount = localStorage.getItem("amount");

        if (lastFrom) fromCurrency.value = lastFrom;
        if (lastTo) toCurrency.value = lastTo;
        if (lastAmount) amount.value = lastAmount;

        if (!lastFrom || !lastTo) {
            fromCurrency.value = "USD";
            toCurrency.value = "EUR";
        }
    } catch (error) {
        result.innerText = "Error loading currencies!";
    }
}

convertBtn.addEventListener("click", () => {
    if (amount.value <= 0 || isNaN(amount.value)) {
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
