function geoFindMe() {

    var output = document.getElementById("geocode");

    if (!navigator.geolocation){
        output.value = "Geolocation is not supported by your browser";
        return;
    }

    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        output.value = latitude+','+longitude;


    };

    function error() {
        output.value = "Unable to retrieve your location";
    };

    output.value = "Locating…";

    navigator.geolocation.getCurrentPosition(success, error);
}