var lat;
var lng;
function initAutocomplete() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20.008535286566715, lng: -98.82068317436814 },
        zoom: 13,
        mapTypeId: "roadmap"
    });

    // saca cordenadas con click derecho
    google.maps.event.addListener(map, "rightclick", function (event) {
        lat = event.latLng.lat();
        lng = event.latLng.lng();
        // escribe la latitud y longitud en los inputs
        document.getElementById("DestinoLa").value = lat;
        document.getElementById("DestinoLo").value = lng;

        // rutas estaticas
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        const request = {
            origin: new google.maps.LatLng(20.008535286566715, -98.82068317436814),
            destination: new google.maps.LatLng(lat, lng),
            travelMode: "DRIVING"
        };
        directionsService.route(request, (response) => {
            directionsRenderer.setDirections(response);
        });

    });
            
    const input3 = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input3);

    
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
        $('#example').DataTable().destroy();
        document.getElementById("example").style.display = "none";
        llamarApiDenueBus();
        const places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }

            const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };



            // Create a marker for each place.
            markers.push(
                new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location,
                })
            );
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    //Drawing Routes
    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE,

            ],
        },
        markerOptions: {
            icon: "https://img.icons8.com/external-bearicons-blue-bearicons/20/000000/external-push-pin-graphic-design-bearicons-blue-bearicons.png"
        }
    });

    drawingManager.setMap(map);

}



function borrar() {
    // var table = document.getElementById('example');
    // table.innerHTML = '';
    alert("Aun no meto rutas");
}

var urlApiBusqueda = "https://www.inegi.org.mx/app/api/denue/v1/consulta/Buscar/#condicion/#latitud,#longitud/#metros/#token";
var urlApiBusqueda2 = "https://www.inegi.org.mx/app/api/denue/v1/consulta/Buscar/#condicion/#latitud,#longitud/#metros/#token";
var token = '59393c7a-c402-4942-8096-5002d742a841';
var vecNombres = [
    'id de establecimiento',
    'Nombre de la unidad econ&oacute;mica:',
    'Raz&oacute;n social:',
    'Nombre de la clase de actividad:',
    'Personal ocupado (estrato):',
    'Tipo de vialidad:',
    'Nombre de la vialidad:',
    'N&uacute;mero exterior o km:',
    'N&uacute;mero o letra interior:',
    'Nombre del asentamiento humano:',
    'C&oacute;digo postal:',
    'Entidad,Municipio,Localidad:',
    'N&uacute;mero de tel&eacute;fono:',
    'Correo electr&oacute;nico:',
    'Sitio en Internet:',
    'Tipo de unidad econ&oacute;mica:',
    'Latitud:',
    'Longitud:',
    'Centro comercial:',
    'Tipo de centro comercial:',
    'N&uacute;mero de local:'];

 function CuentaEscuelas(condicion2, tipo) {
     $.getJSON(condicion2, function (json) {
         console.log(tipo + ' '+json.length);
       });
   }

function llamarApiDenueBus() {   
    document.getElementById("example").style.display = "none";
    var urlApiBusquedaTmp;
    var urlApiBusquedaTmp2;
    var condicion = $('#pac-input').val();
    var longitud = $("#lon").val();    
    var latitud = $('#lat').val();
    var metros = $('#mts').val();    
   
      if (document.getElementById('escu').checked) {
        var condicionEscue = ',escuela';         
        condicion = condicion + condicionEscue;             
        alert("aqui entra el IFF ESCUELAS");
    } 
    if (document.getElementById('mot').checked) {
        var condicionMot = ',motel';
        condicion = condicion + condicionMot;
        alert("aqui entra el if motel");
    } 
   
    
    urlApiBusquedaTmp = urlApiBusqueda.replace('#condicion', condicion);
    urlApiBusquedaTmp = urlApiBusquedaTmp.replace('#latitud', latitud);
    urlApiBusquedaTmp = urlApiBusquedaTmp.replace('#longitud', longitud);
    urlApiBusquedaTmp = urlApiBusquedaTmp.replace('#metros', metros);
    urlApiBusquedaTmp = urlApiBusquedaTmp.replace('#token', token);
 
        // aquui te detienes para borrar este es el inicio
     if (document.getElementById('escu').checked) {
         var condicion2 =  'escuela'; 
         urlApiBusquedaTmp2 = urlApiBusqueda2.replace('#condicion', condicion2);
         urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#latitud', latitud);
         urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#longitud', longitud);
         urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#metros', metros);
         urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#token', token);
       
         CuentaEscuelas(urlApiBusquedaTmp2);
     }
    

   // alert(urlApiBusquedaTmp);
    if (token.includes('AQUÍ')) {
        // alert("Debes ingresar tu token en el archivo apiDenue.js");
    } else {
        
        $.getJSON(urlApiBusquedaTmp, function (json) {

            var TotalLugares = json.length;
            document.getElementById("ToLugares").value = TotalLugares;
                  
            //console.log(json);
            var codHtml = '';
            
            $('#tabDenue').html(codHtml);
            var jsonString = JSON.stringify(json);
            $('#example').DataTable({
                "pageLength": 10,
                "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, 'Todos']],  
                "destroy": true,
                "data": json,
                "columns": [

                    { "data": "Nombre" },
                    { "data": "Razon_social" },
                    { "data": "Clase_actividad" },
                    { "data": "Estrato" },
                    { "data": "Ubicacion" },
                    { "data": "Colonia" },
                    { "data": "Calle" },
                    { "data": "CP" },
                    { "data": "Num_Exterior" },
                    { "data": "Tipo_vialidad" },
                    { "data": "Sitio_internet" },
                    { "data": "Correo_e" },
                    { "data": "Telefono" },
                    { "data": "Tipo" },
                    { "data": "Latitud" },
                    { "data": "Longitud" }
                ],
                "language":
                {
                    "lengthMenu": "_MENU_ registros por página",
                    "info": "Pagina _PAGE_ de _PAGES_",
                    "infoEmpty": "No hay registros disponibles",
                    "infoFiltered": "(filtrada de _MAX_ registros)",
                    "loadingRecords": "Cargando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "zeroRecords": "No se encontraron registros coincidentes",
                    "paginate":
                    {
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                }
            });

        });




    }
}

