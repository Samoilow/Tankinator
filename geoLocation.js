// Geo-Location
// https://developer.mozilla.org/de/docs/Web/WebAPI/verwenden_von_geolocation

getPosition();

async function getPosition() {
  const position = await geoLocation();
  const { coords, timestamp } = position;
  const { latitude, longitude, accuracy } = coords;
  var lat = document.getElementById("lat");
  lat.innerHTML = latitude;
  var lng = document.getElementById("lng");
  lng.innerHTML = longitude;
  console.log(
    "latitude:",
    latitude,
    "longitude:",
    longitude,
    "accuracy:",
    accuracy,
    "timestamp:",
    timestamp
  );

  const data = await getTankerkoenigData(latitude, longitude);
  console.log(data);

  // Jetzt die Variablen weitergeben an die nächste Funktion, die Tankerkönig abfrägt
  // und diese Funktion abändern, dass sie zwei parameter annimmt
  // funktion mit werten aufrufen
}

function geoLocation() {
  var out = document.getElementById("out");
  if (!navigator.geolocation)
    out.innerHTML = "Geolokation wird von ihrem Browser nicht unterstützt.";
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
