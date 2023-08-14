(function() {
    //UBICACION DE LIMA
    const lat = document.querySelector('#lat').value || -12.0596766;//se puede realizar con un ternario "?" tambien 
    const lng = document.querySelector('#lng').value || -77.0377486;
    //map('mapa') es el nombre de id del div donde se va a poner el mapa
    const mapa = L.map('mapa').setView([lat, lng ], 16);//zoom:16
    let marker;
    let coords;

    //Utilizar Provider y Geocoder
    const geocodeService= L.esri.Geocoding.geocodeService();//Podemos obtener en base a las coordenadas, el nombre de la calle.

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


    //El Pin
    marker = new L.marker([lat, lng],{
        draggable: true,//CON ESTO SE PUEDE MOVER EL PIN, EN ALGUNOS CASOS ES BUENO TENERLO EN FALSE para que muestre la ubicacion de un lugar y que no puedan mover el pin
        autoPan: true//CON ESTO SE PUEDE MOVER EL PIN JUNTO CON EL MAPA, es decir el mapa sigue al pin
    }).addTo(mapa);

    //Detectar el movimiento del pin
    marker.on('moveend', function(e){
        marker=e.target;
        //analiza la informacion del pin
        // console.log(marker);//DE ACA VIENE TODO
        // console.log(marker.dragging.moved());//para saber si el pin se mueve o no
        // console.log(marker._latlng);//SE PUEDE OBTENER LA POSICION DEL PIN CON ESTE VALOR TAMBIEN
        const posicion = marker.getLatLng();//Con esto obtenemos la posicion usuando una funcion del proto
        // console.log(posicion);
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));//CENTRAR EL PIN
        //Obtener la informacion de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion).run(function(error, resultado){
            // console.log(resultado);//visualizar la informacion de la direccion
            // marker.bindPopup(resultado.address.Match_addr).openPopup();//otra manera de obtener los datos
            marker.bindPopup(resultado.address.LongLabel).openPopup();

            //Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })

    });




        //CODIGO PARA OBTENER LA UBICACION DEL USUARIO CON O SIN HABILITAR LA UBICACION, solo debes comentar desde la linea 16
        //PARA UNA BUENA LOCALIZACION, DEBES ENVIAR LAS COORDENAS(LATITUD Y LONGITUD).
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
            
    //         let latitude = position.coords.latitude;
    //         let longitude = position.coords.longitude;
    //         coords={lat:latitude, lng:longitude};
    //         // console.log(coords);

    //         marker = new L.marker([latitude, longitude],{
    //             draggable: true,
    //             autoPan: true
    //         }).addTo(mapa);

    //         geocodeService.reverse().latlng(coords).run(function(error, resultado){
    //             marker.bindPopup(resultado.address.LongLabel).openPopup();
    //         })
    //         mapa.setView([latitude, longitude], 16);//MI longitud y latitud es: longitude, latitude

    //         marker.on('moveend', function(e){
    //             marker=e.target;
    //             const posicion = marker.getLatLng();
    //             console.log(posicion);
    //             mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));//CENTRAR EL PIN
    //             //MI longitud y latitud es: posicion.lat, posicion.lng

    //             geocodeService.reverse().latlng(posicion).run(function(error, resultado){
    //                 marker.bindPopup(resultado.address.LongLabel).openPopup();//otra manera de obtener los datos
    //             })
                
    //         })
            
    //     },
    //     function(error){
    //         if(error.code === error.PERMISSION_DENIED){
    //             marker = new L.marker([lat, lng],{
    //                 draggable: true,
    //                 autoPan: true
    //             }).addTo(mapa);

    //             coords={lat:lat, lng:lng};

    //             geocodeService.reverse().latlng(coords).run(function(error, resultado){
    //                 marker.bindPopup(resultado.address.LongLabel).openPopup();
    //             })
        
    //             marker.on('moveend', function(e){
    //                 marker=e.target;
    //                 const posicion = marker.getLatLng();
    //                 console.log(posicion);
    //                 mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));//CENTRAR EL PIN
    //                 //Obtener la informacion de las calles al soltar el pin
    //                 geocodeService.reverse().latlng(posicion).run(function(error, resultado){
    //                     marker.bindPopup(resultado.address.LongLabel).openPopup();
    //                 })
            
    //             })
    //         }
    //     }
    //     );
    // }

})()