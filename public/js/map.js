mapboxgl.accessToken = mapToken;
console.log(mapToken)
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: JSON.parse( coordinates), // starting position [lng, lat]
    zoom: 9  // starting zoom
});

// console.log(coordinates);

const marker = new mapboxgl.Marker({color : "red"})
        .setLngLat(JSON.parse(coordinates)) //listing.geometry.coordinates
        .setPopup(
            new mapboxgl.Popup({offset: 25}).setHTML(`<p> exact location provided after booking </p>`)
        )
        .addTo(map);

