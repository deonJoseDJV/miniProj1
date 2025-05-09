
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // optional: center map on the marker
    zoom: 4,
});



// Ensure coordinates is an array of two numbers

    const marker=new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25}).setHTML(
            `<h5>${listing.title}</h5><p>Exact location will be provided after booking</p>`
        ))
        .addTo(map);
