var lat;
var lng;
var mapa1;

function initAutocomplete() {

    var Coordenadas = new google.maps.LatLng(20.008535286566715,-98.82068317436814);
      var opcionesMapa1 = {
     zoom: 13,
     center: Coordenadas,
     mapTypeId: google.maps.MapTypeId.ROADMAP,
     mapTypeControl: 0
     }
   mapa1 = new google.maps.Map(document.getElementById('map-canvas'), opcionesMapa1);
   var marker1 = new google.maps.Marker({
     position: Coordenadas,
     map: mapa1,
     title: 'Origen'
     });

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


// aqui puedes detenerte los ctrl-z
// var VLugar = document.getElementById("pac-input").value;
var urlApiBusqueda = "https://www.inegi.org.mx/app/api/denue/v1/consulta/Buscar/#condicion/#latitud,#longitud/#metros/#token";
var urlApiBusqueda2 ="https://www.inegi.org.mx/app/api/denue/v1/consulta/Buscar/#condicion2/#latitud,#longitud/#metros/#token";
var urlApiFicha = "https://www.inegi.org.mx/sistemas/api/denue/v1/consulta/ficha/#idesta/#token";
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

              if (tipo === 'Escuela') {            
            document.getElementById("ToEscu").value = json.length;
        }
        if (tipo === 'motel') {
            document.getElementById("ToMoteles").value = json.length;
        }
          if (tipo === 'canchas') {
            document.getElementById("ToParques").value = json.length;
        }

          // if (condicion === Vcondicion {
          //   document.getElementById("ToLugar").value = json.length;
          //  }

    });
  }

function llamarApiDenueBus() {   
    document.getElementById("ToEscu").value = 0;
    document.getElementById("ToMoteles").value = 0;
    document.getElementById("ToLugar").value = 0;
     document.getElementById("ToParques").value = 0;
     document.getElementById("ToTotal").value = 0;
    document.getElementById("example").style.display = "none";
    var urlApiBusquedaTmp;
    var urlApiBusquedaTmp2;
    var condicion = $('#pac-input').val();
    var longitud = $('#lon').val();    
    var latitud = $('#lat').val();
    var metros = $('#mts').val();    
   

      if (document.getElementById('escu').checked) {         
              if ($('#pac-input').val().length === 0) {
            condicion = condicion + 'escuela';
        }
        else {
            condicion = condicion + ',escuela';             
        }        
    } 


    if (document.getElementById('mot').checked) {
         if ($('#pac-input').val().length === 0) {
            if (document.getElementById('escu').checked) {
                condicion = condicion + ',motel';
            }
            else {
                condicion = condicion + 'motel';
            }
        }
        else {
            condicion = condicion + ',motel';
        }
    } 

    if (document.getElementById('can').checked) { 
        if ($('#pac-input').val().length === 0) {
            if ((document.getElementById('escu').checked) || (document.getElementById('mot').checked)) {
                condicion = condicion + ',canchas';
            }
             else {
                condicion = condicion + 'canchas';
            }

        }
        else {
            condicion = condicion + ',canchas';
        }
        
    }  
   
    
    urlApiBusquedaTmp = urlApiBusqueda.replace('#condicion', condicion);
    urlApiBusquedaTmp = urlApiBusquedaTmp.replace('#latitud', latitud);
    urlApiBusquedaTmp = urlApiBusquedaTmp.replace('#longitud', longitud);
    urlApiBusquedaTmp = urlApiBusquedaTmp.replace('#metros', metros);
    urlApiBusquedaTmp = urlApiBusquedaTmp.replace('#token', token);
   
   var condicion2;

     if (document.getElementById('escu').checked) {
        condicion2 = 'escuela';        
   
        urlApiBusquedaTmp2 = urlApiBusqueda2.replace('#condicion', condicion2); 
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#latitud', latitud);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#longitud', longitud);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#metros', metros);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#token', token);
        CuentaEscuelas(urlApiBusquedaTmp2, 'Escuela');
    }

    if (document.getElementById('mot').checked) {
        condicion2 = 'motel';                    
        urlApiBusquedaTmp2 = urlApiBusqueda2.replace('#condicion', condicion2);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#latitud', latitud);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#longitud', longitud);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#metros', metros);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#token', token);
        CuentaEscuelas(urlApiBusquedaTmp2, 'motel');
    }

    if (document.getElementById('can').checked) {
        condicion2 = 'canchas';
        
        urlApiBusquedaTmp2 = urlApiBusqueda2.replace('#condicion', condicion2);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#latitud', latitud);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#longitud', longitud);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#metros', metros);
        urlApiBusquedaTmp2 = urlApiBusquedaTmp2.replace('#token', token);
        CuentaEscuelas(urlApiBusquedaTmp2, 'canchas');
    }

   // alert(urlApiBusquedaTmp);
    if (token.includes('AQUÍ')) {
    } else {
        
        $.getJSON(urlApiBusquedaTmp, function (json) {
             
             // alert(urlApiBusquedaTmp,condicion);
             console.log(json);
              document.getElementById("ToLugar").value = json.length;
            var TotalLugares = json.length;
            document.getElementById("ToTotal").value = TotalLugares;
            document.getElementById("example").style.display = "block"; 
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
//----------------------------------------------------------------------qui va la funcion del mapa-------------------------------------------------------------------------------------------

