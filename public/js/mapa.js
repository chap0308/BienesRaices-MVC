/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    //UBICACION DE LIMA\r\n    const lat = document.querySelector('#lat').value || -12.0596766;//se puede realizar con un ternario \"?\" tambien \r\n    const lng = document.querySelector('#lng').value || -77.0377486;\r\n    //map('mapa') es el nombre de id del div donde se va a poner el mapa\r\n    const mapa = L.map('mapa').setView([lat, lng ], 16);//zoom:16\r\n    let marker;\r\n    let coords;\r\n\r\n    //Utilizar Provider y Geocoder\r\n    const geocodeService= L.esri.Geocoding.geocodeService();//Podemos obtener en base a las coordenadas, el nombre de la calle.\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n\r\n    //El Pin\r\n    marker = new L.marker([lat, lng],{\r\n        draggable: true,//CON ESTO SE PUEDE MOVER EL PIN, EN ALGUNOS CASOS ES BUENO TENERLO EN FALSE para que muestre la ubicacion de un lugar y que no puedan mover el pin\r\n        autoPan: true//CON ESTO SE PUEDE MOVER EL PIN JUNTO CON EL MAPA, es decir el mapa sigue al pin\r\n    }).addTo(mapa);\r\n\r\n    //Detectar el movimiento del pin\r\n    marker.on('moveend', function(e){\r\n        marker=e.target;\r\n        //analiza la informacion del pin\r\n        // console.log(marker);//DE ACA VIENE TODO\r\n        // console.log(marker.dragging.moved());//para saber si el pin se mueve o no\r\n        // console.log(marker._latlng);//SE PUEDE OBTENER LA POSICION DEL PIN CON ESTE VALOR TAMBIEN\r\n        const posicion = marker.getLatLng();//Con esto obtenemos la posicion usuando una funcion del proto\r\n        // console.log(posicion);\r\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));//CENTRAR EL PIN\r\n        //Obtener la informacion de las calles al soltar el pin\r\n        geocodeService.reverse().latlng(posicion).run(function(error, resultado){\r\n            // console.log(resultado);//visualizar la informacion de la direccion\r\n            // marker.bindPopup(resultado.address.Match_addr).openPopup();//otra manera de obtener los datos\r\n            marker.bindPopup(resultado.address.LongLabel).openPopup();\r\n\r\n            //Llenar los campos\r\n            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';\r\n            document.querySelector('#calle').value = resultado?.address?.Address ?? '';\r\n            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';\r\n            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';\r\n        })\r\n\r\n    });\r\n\r\n\r\n\r\n\r\n        //CODIGO PARA OBTENER LA UBICACION DEL USUARIO CON O SIN HABILITAR LA UBICACION, solo debes comentar desde la linea 16\r\n        //PARA UNA BUENA LOCALIZACION, DEBES ENVIAR LAS COORDENAS(LATITUD Y LONGITUD).\r\n    // if (navigator.geolocation) {\r\n    //     navigator.geolocation.getCurrentPosition(function(position) {\r\n            \r\n    //         let latitude = position.coords.latitude;\r\n    //         let longitude = position.coords.longitude;\r\n    //         coords={lat:latitude, lng:longitude};\r\n    //         // console.log(coords);\r\n\r\n    //         marker = new L.marker([latitude, longitude],{\r\n    //             draggable: true,\r\n    //             autoPan: true\r\n    //         }).addTo(mapa);\r\n\r\n    //         geocodeService.reverse().latlng(coords).run(function(error, resultado){\r\n    //             marker.bindPopup(resultado.address.LongLabel).openPopup();\r\n    //         })\r\n    //         mapa.setView([latitude, longitude], 16);//MI longitud y latitud es: longitude, latitude\r\n\r\n    //         marker.on('moveend', function(e){\r\n    //             marker=e.target;\r\n    //             const posicion = marker.getLatLng();\r\n    //             console.log(posicion);\r\n    //             mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));//CENTRAR EL PIN\r\n    //             //MI longitud y latitud es: posicion.lat, posicion.lng\r\n\r\n    //             geocodeService.reverse().latlng(posicion).run(function(error, resultado){\r\n    //                 marker.bindPopup(resultado.address.LongLabel).openPopup();//otra manera de obtener los datos\r\n    //             })\r\n                \r\n    //         })\r\n            \r\n    //     },\r\n    //     function(error){\r\n    //         if(error.code === error.PERMISSION_DENIED){\r\n    //             marker = new L.marker([lat, lng],{\r\n    //                 draggable: true,\r\n    //                 autoPan: true\r\n    //             }).addTo(mapa);\r\n\r\n    //             coords={lat:lat, lng:lng};\r\n\r\n    //             geocodeService.reverse().latlng(coords).run(function(error, resultado){\r\n    //                 marker.bindPopup(resultado.address.LongLabel).openPopup();\r\n    //             })\r\n        \r\n    //             marker.on('moveend', function(e){\r\n    //                 marker=e.target;\r\n    //                 const posicion = marker.getLatLng();\r\n    //                 console.log(posicion);\r\n    //                 mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));//CENTRAR EL PIN\r\n    //                 //Obtener la informacion de las calles al soltar el pin\r\n    //                 geocodeService.reverse().latlng(posicion).run(function(error, resultado){\r\n    //                     marker.bindPopup(resultado.address.LongLabel).openPopup();\r\n    //                 })\r\n            \r\n    //             })\r\n    //         }\r\n    //     }\r\n    //     );\r\n    // }\r\n\r\n})()\n\n//# sourceURL=webpack://bienes_raicesmvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;