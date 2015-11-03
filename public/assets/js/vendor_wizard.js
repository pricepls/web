$(document).ready(function() {

    //Load Wizards
    $('#basicwizard').stepy();
    $('#wizard').stepy({finishButton: true, titleClick: true, block: true, validate: true});

    //Add Wizard Compability - see docs
    $('.stepy-navigator').wrapInner('<div class="pull-right"></div>');

    //Make Validation Compability - see docs
    $('#wizard').validate({
        errorClass: "help-block",
        validClass: "help-block",
        highlight: function(element, errorClass,validClass) {
            $(element).closest('.form-group').addClass("has-error");
        },
        unhighlight: function(element, errorClass,validClass) {
            $(element).closest('.form-group').removeClass("has-error");
        }
    });

});

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


$("#sub_type").chained("#category");

