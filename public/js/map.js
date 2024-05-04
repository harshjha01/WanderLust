mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFyc2hqaGEwMSIsImEiOiJjbHZxd3R0MXQwZGU4MmtudjZvNGdkcmpwIn0.uMl8nV0EZec2PUXasKPqAg";
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
console.log(coordinates);
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .addTo(map);
