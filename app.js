const form = document.querySelector('form');
const input = document.querySelector('#icao');
const metarRaw = document.querySelector('#metar-raw');
const metarDecoded = document.querySelector('#metar-decoded');

form.addEventListener('submit', e => {
  e.preventDefault();
  const icao = input.value.trim().toUpperCase();
  const url = `https://api.checkwx.com/metar/${icao}/decoded`;

  fetch(url, {
    headers: {
      'X-API-Key': '2dbd3171e1894be5b82c535013'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.results === 0) {
      metarRaw.textContent = 'Invalid ICAO code';
      metarDecoded.textContent = '';
    } else {
      metarRaw.textContent = data.data[0].raw_text;
      metarDecoded.textContent = JSON.stringify(parseMETAR(data.data[0].raw_text), null, 2);
    }
  })
  .catch(error => {
    metarRaw.textContent = 'Error retrieving METAR data';
    metarDecoded.textContent = '';
    console.error(error);
  });
});
