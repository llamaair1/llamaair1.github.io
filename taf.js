const form = document.querySelector('form');
const input = document.querySelector('#icao');
const taf = document.querySelector('#taf');

form.addEventListener('submit-taf', e => {
  e.preventDefault();
  const icao = input.value.trim().toUpperCase();
  const url = `https://api.checkwx.com/taf/${icao}/decoded`;

  fetch(url, {
    headers: {
      'X-API-Key': '2dbd3171e1894be5b82c535013'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.results === 0) {
      taf.textContent = 'Invalid ICAO code';
      weather.textContent = '';
    } else {
      const tafText = data.data[0].raw_text;
      taf.textContent = tafText;

    }
  })
  .catch(error => {
    metar.textContent = 'Error retrieving METAR data';
    weather.textContent = '';
    console.error(error);
  });
});