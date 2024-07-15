const BASE_URL = "https://api.currencyapi.com/v3/latest?apikey=cur_live_trf1pZtBulYepK7SLfMqCLo19t5sOG0xmQpbXQ0a";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate the dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "INR") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "USD") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  
  // Construct the correct API URL
  const URL = `${BASE_URL}&currencies=${toCurr.value}&base_currency=${fromCurr.value}`;
  
  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let data = await response.json();
    console.log("Data in JSON format:", data);
    
    // Check the structure of the response data
    if (data.data && data.data[toCurr.value]) {
      let rate = data.data[toCurr.value].value;
      console.log(`Exchange rate from ${fromCurr.value} to ${toCurr.value}: ${rate}`);
      
      if (rate) {
        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
      } else {
        msg.innerText = "Error: Exchange rate not found.";
      }
    } else {
      msg.innerText = "Error: Unexpected response format.";
    }
  } catch (error) {
    console.error('Fetch error:', error);
    msg.innerText = "Error fetching exchange rate. Please try again.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
