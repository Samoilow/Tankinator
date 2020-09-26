controller();

async function controller() {
  const position = await getPosition();
  const lat = 48.889259; //position.coords.latitude;
  const lng = 8.690944; //position.coords.longitude;

  const data = await getTankerkoenigData(lat, lng);

  renderTable(data.stations);
}

async function renderTable(stations) {
  const div = document.getElementById("out");
  // implementierung der besten Zeiten noch ausstehend
  let tabelle =
    "<table class='table'><tr><th>Name</th><th>€/l</th><th>Entfernung</th><th>gute Tankzeiten</th><th></th><th></th></tr>";

  for (let item of stations) {
    let data2 = await getVisData(item.id);
    tabelle += `<tr><td><b>${item.name}</b></td><td>${item.price}</td><td>${item.dist} km</td><td>${data2.text}</td><td><button class="btn btn-secondary" onclick="detailsAnzeigen('${item.id}')">Details</button></td><td><button class="btn btn-secondary" onclick="zuFavhinzu('${item.id}')">Favorit <i class="fa fa-star"></i></button></td></tr>`;
  }
  tabelle += "</table>";

  div.innerHTML = tabelle;
}

// ----------------------------------------------------------------
//Funktion zur Detailanzeige
async function detailsAnzeigen(id) {
  console.log(id);
  const url = new URL(
    "https://creativecommons.tankerkoenig.de/json/detail.php"
  );
  const params = url.searchParams;

  params.set("id", id);
  params.set("apikey", "7d3eae71-869a-f707-e8dc-df2f497ffa42");

  const data = await fetchData(url);
  console.log(data);

  const station = data.station;
  //Input für das Detailanzeigeformular
  const street = document.getElementById("street");
  street.value = station.street;
  const name = document.getElementById("name");
  name.value = station.name;
  // gleicher Code, aber weniger Zeilen:
  document.getElementById("postCode").value = station.postCode;
  document.getElementById("place").value = station.place;
  document.getElementById("diesel").value = station.diesel;
  document.getElementById("e5").value = station.e5;
  document.getElementById("e10").value = station.e10;
}
// ----------------------------------------------------------------
//Standortabfrage
async function getPosition() {
  const position = await geoLocation();

  return position;
}

function geoLocation() {
  var out = document.getElementById("out");
  if (!navigator.geolocation)
    out.innerHTML = "Geolokation wird von ihrem Browser nicht unterstützt.";
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
// ----------------------------------------------------------------
//Abfrage der Tankerkönig Daten und Input aus den Auswahlboxen
async function getTankerkoenigData(lat, lon) {
  //Input aus den Auswahlboxen einlesen
  const url = new URL("https://creativecommons.tankerkoenig.de/json/list.php");
  const params = url.searchParams;
  const selectBox_oil = document.getElementById("kraftstoffart");
  const kraftstoffart = selectBox_oil.value;
  const selectBox_dist = document.getElementById("entfernung");
  const entfernung = selectBox_dist.value;
  const selectBox_sort = document.getElementById("sortieren");
  const sortieren = selectBox_sort.value;

  params.set("lat", lat); // Breitengrad
  params.set("lng", lon); // Längengrad
  params.set("rad", entfernung); // Suchradius in km (max 25 km)
  params.set("type", kraftstoffart); // Spritsorte: 'e5', 'e10', 'diesel' oder 'all'
  params.set("sort", sortieren); // Sortierung: price, dist
  params.set("apikey", "7d3eae71-869a-f707-e8dc-df2f497ffa42"); //persönlicher Api-Key

  const tankerkoenigData = await fetchData(url);
  return tankerkoenigData;
}

// ----------------------------------------------------------------
// fetchData function
async function fetchData(url) {
  // fetch url
  const response = await fetch(url);
  // parse response body and return
  return await response.json();
}
// ----------------------------------------------------------------
// Vis-Api

getVisData();

async function getVisData(stationId) {
  // const stationId = "b4ed695f-2cfc-4688-8ecf-268b10cdb93e";
  const stationPath = stationId.split("-").join("/");

  const urlVisHead =
    "https://www.volzinnovation.com/fuel_price_variations_germany/data2/";
  const urlVisTail = "/e10.json";

  const visData = await fetchData(urlVisHead + stationPath + urlVisTail);
  console.log(visData);
  return visData;
  // Mit Daten weiterarbeiten...
}

// ----------------------------------------------------------------
