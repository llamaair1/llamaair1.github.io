const form = document.querySelector('form');
const input = document.querySelector('#icao');
const metar = document.querySelector('#metar');
const weather = document.querySelector('#weather');

form.addEventListener('submit-meter', e => {
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
      metar.textContent = 'Invalid ICAO code';
      weather.textContent = '';
    } else {
      const metarText = data.data[0].raw_text;
      metar.textContent = metarText;

      // Extract temperature, wind speed, and direction from the METAR data
      const temperatureMatch = metarText.match(/^(?:METAR|SPECI).+? (M?\d{1,2})\/(M?\d{1,2}) /);
      const temperatureCelsius = temperatureMatch ? temperatureToCelsius(temperatureMatch[1]) : '';
      const temperature = temperatureCelsius ? `${temperatureCelsius}°C` : 'N/A';
      const windMatch = metarText.match(/(?:^| )(\d{3}|VRB)(\d{2,3})(?:G(\d{2,3}))?(?:KT|MPS)/);
      const windDirection = windMatch ? windMatch[1] : '';
      const windSpeedKnots = windMatch ? parseInt(windMatch[2], 10) : '';
      const windSpeedMph = windSpeedKnots ? knotsToMph(windSpeedKnots) : '';
      const windSpeedKph = windSpeedKnots ? knotsToKph(windSpeedKnots) : '';
      const barometerMatch = metarText.match(/Q(\d{4})/);
      const barometer = barometerMatch ? `${barometerMatch[1].slice(0, 2)}.${barometerMatch[1].slice(2)} hPa` : 'N/A';

      // Display the temperature, wind speed, and direction in the weather paragraph
      weather.innerHTML = `Temperature: ${temperature}°C<br>Wind Direction: ${windDirection}°<br>Wind Speed: ${windSpeedKnots} knots / ${windSpeedMph} mph / ${windSpeedKph} km/h<br>Barometer: ${barometer}`;
    }
  })
  .catch(error => {
    metar.textContent = 'Error retrieving METAR data';
    weather.textContent = '';
    console.error(error);
  });
});

function temperatureToCelsius(temperature) {
  const temperatureCelsius = parseInt(temperature, 10) * 0.1;
  return temperatureCelsius.toFixed(1);
}

function temperatureToFahrenheit(temperature) {
  const temperatureFahrenheit = temperatureToCelsius(temperature) * 1.8 + 32;
  return temperatureFahrenheit.toFixed(1);
}

function knotsToMph(knots) {
  const mph = knots * 1.15078;
  return mph.toFixed(1);
}

function knotsToKph(knots) {
  const kph = knots * 1.852;
  return kph.toFixed(1);
}
