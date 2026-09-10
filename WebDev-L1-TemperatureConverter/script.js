const form = document.getElementById('converterForm');
const input = document.getElementById('tempInput');
const unitSelect = document.getElementById('unitSelect');
const errorMsg = document.getElementById('errorMsg');
const outC = document.getElementById('outC');
const outF = document.getElementById('outF');
const outK = document.getElementById('outK');
const thermoFill = document.getElementById('thermoFill');
const thermoBulb = document.getElementById('thermoBulb');

function toCelsius(value, unit) {
    if (unit === 'C') return value;
    if (unit === 'F') return (value - 32) * (5 / 9);
    if (unit === 'K') return value - 273.15;
}

function fromCelsius(celsius, unit) {
    if (unit === 'C') return celsius;
    if (unit === 'F') return celsius * (9 / 5) + 32;
    if (unit === 'K') return celsius + 273.15;
}

function formatValue(value) {
    return Math.round(value * 100) / 100;
}

function heatColor(celsius) {
    const t = Math.min(1, Math.max(0, (celsius + 20) / 60));
    const cold = [79, 209, 197];
    const hot = [255, 107, 74];
    const mixed = cold.map((c, i) => Math.round(c + (hot[i] - c) * t));
    return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}

function clearResults() {
    outC.textContent = '—';
    outF.textContent = '—';
    outK.textContent = '—';
}

function updateThermometer(celsius) {
    const clamped = Math.min(1, Math.max(0, (celsius + 40) / 140));
    thermoFill.style.height = `${8 + clamped * 84}%`;
    const color = heatColor(celsius);
    thermoFill.style.background = color;
    thermoBulb.style.background = color;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const raw = input.value.trim();
    errorMsg.textContent = '';

    if (raw === '' || isNaN(raw)) {
        errorMsg.textContent = 'Please enter a valid number.';
        clearResults();
        return;
    }

    const value = parseFloat(raw);
    const unit = unitSelect.value;
    const celsius = toCelsius(value, unit);

    if (celsius < -273.15) {
        errorMsg.textContent = 'That is below absolute zero (-273.15°C) — not physically possible.';
        clearResults();
        return;
    }

    outC.textContent = `${formatValue(fromCelsius(celsius, 'C'))}°C`;
    outF.textContent = `${formatValue(fromCelsius(celsius, 'F'))}°F`;
    outK.textContent = `${formatValue(fromCelsius(celsius, 'K'))} K`;

    updateThermometer(celsius);
});
