const CARD_VALUES = { neutral: 20, forbidden: 20, monster: 80 };
const COST_TABLE = [0, 0, 10, 30, 50, 70];

document.addEventListener("DOMContentLoaded", () => {
  const calcBtn = document.getElementById("calculateBtn") as HTMLButtonElement;
  calcBtn.addEventListener("click", calculateTotal);

  ["copies", "removals"].forEach(id => {
    const input = document.getElementById(id) as HTMLInputElement;
    input.addEventListener("input", () => {
      const val = parseInt(input.value) || 1;
      const clamped = clamp(val, 1, 5);
      if (val !== clamped) input.value = clamped.toString();
    });
  });
});

function calculateTotal(): void {
  console.log("Calculate button pressed");
  
  const tier = parseInt((document.getElementById("tier") as HTMLSelectElement).value);
  if (isNaN(tier)) {
    console.log("Error: No tier selected");
    showResult("⚠️ Please select a tier", "#f0f0f0");
    return;
  }

  const neutral = getNumber("neutral");
  const forbidden = getNumber("forbidden");
  const monster = getNumber("monster");
  const epiphany = getNumber("epiphany");
  const divine = getNumber("divine");
  const copies = clamp(getNumber("copies"), 1, 5);
  const removals = clamp(getNumber("removals"), 1, 5);
  const conversion = getNumber("conversion");

  const saveCap = 30 + 10 * (tier - 1);
  const baseTotal = neutral * CARD_VALUES.neutral + forbidden * CARD_VALUES.forbidden + monster * CARD_VALUES.monster;
  const totalValue = baseTotal + epiphany * 10 + divine * 10 + conversion * 10 + COST_TABLE[copies] + COST_TABLE[removals];

  const isWithinCap = totalValue <= saveCap;
  const difference = isWithinCap ? saveCap - totalValue : totalValue - saveCap;
  
  console.log(`Tier: ${tier}, Save Cap: ${saveCap}, Total Value: ${totalValue}, Within Cap: ${isWithinCap}`);
  
  const bgColor = isWithinCap ? "#d4edda" : "#f8d7da";
  const statusText = isWithinCap 
    ? `✅ Within cap by ${difference}` 
    : `❌ Over cap by ${difference}`;

  const resultHTML = `
    <p><strong>Total Deck Value: ${totalValue}</strong></p>
    <p>Save Cap (Tier ${tier}): ${saveCap}</p>
    <p>${statusText}</p>
  `;

  showResult(resultHTML, bgColor);
}

function getNumber(id: string): number {
  return parseInt((document.getElementById(id) as HTMLInputElement).value) || 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function showResult(html: string, bgColor: string): void {
  const resultDiv = document.getElementById("result");
  if (resultDiv) {
    resultDiv.innerHTML = html;
    resultDiv.style.backgroundColor = bgColor;
    resultDiv.classList.add("show");
  }
}