mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker()
.setLngLat(coordinates)
.setPopup(new mapboxgl.Popup({offset:25}).setHTML("<h4>This is your booked place</h4"))
.addTo(map);

