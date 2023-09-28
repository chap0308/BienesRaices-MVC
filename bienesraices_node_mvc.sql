/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `mensajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mensaje` varchar(200) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `propiedadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `usuarioId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `propiedadId` (`propiedadId`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`propiedadId`) REFERENCES `propiedades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `precios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `propiedades` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `habitaciones` int NOT NULL,
  `estacionamiento` int NOT NULL,
  `wc` int NOT NULL,
  `calle` varchar(60) NOT NULL,
  `lat` varchar(255) NOT NULL,
  `lng` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `precioId` int DEFAULT NULL,
  `categoriaId` int DEFAULT NULL,
  `usuarioId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `precioId` (`precioId`),
  KEY `categoriaId` (`categoriaId`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `propiedades_ibfk_1` FOREIGN KEY (`precioId`) REFERENCES `precios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `propiedades_ibfk_2` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `propiedades_ibfk_3` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `confirmado` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, 'Casa', '2023-07-07 05:35:02', '2023-07-07 05:35:02');
INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(2, 'Departamento', '2023-07-07 05:35:02', '2023-07-07 05:35:02');
INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(3, 'Bodega', '2023-07-07 05:35:02', '2023-07-07 05:35:02');
INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(4, 'Terreno', '2023-07-07 05:35:02', '2023-07-07 05:35:02'),
(5, 'Cabaña', '2023-07-07 05:35:02', '2023-07-07 05:35:02');

INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(1, 'Me gustaria comprar esta casa, llame al 988782928', '2023-07-11 00:01:48', '2023-07-11 00:01:48', 'c6b160af-46b8-4a99-9fcf-4e08b31ff2c3', 2);
INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(2, 'Estoy interesado, llame al 9879312', '2023-07-11 00:04:31', '2023-07-11 00:04:31', '10d7e41b-fafd-468e-9392-94d714efda48', 2);
INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(3, 'Estoy interesado, contacteme 2131231233', '2023-07-11 03:05:02', '2023-07-11 03:05:02', '405bc892-f01e-4778-92f1-8163412e64a9', 2);
INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(4, 'Buenas noches, me gustaría contactarme con usted, puede llamarme al 987789876', '2023-07-12 04:29:32', '2023-07-12 04:29:32', 'f1f858ce-b0ba-4acd-91bc-84f2e9748411', 1);

INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, '0 - $10,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02');
INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(2, '$10,000 - $30,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02');
INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(3, '$30,000 - $50,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02');
INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(4, '$50,000 - $75,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02'),
(5, '$75,000 - $100,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02'),
(6, '$100,000 - $150,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02'),
(7, '$150,000 - $200,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02'),
(8, '$200,000 - $300,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02'),
(9, '$300,000 - $500,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02'),
(10, '+ $500,000 USD', '2023-07-07 05:35:02', '2023-07-07 05:35:02');

INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `precioId`, `categoriaId`, `usuarioId`) VALUES
('10d7e41b-fafd-468e-9392-94d714efda48', 'Casa de playa (Actualizado)', 'La mejor oferta de casa de playa!!', 2, 3, 1, 'Avenida Brasil 147', '-12.061004155485833', '-77.04193574306846', 'h1q766alpc81h4pn0i4t.jpg', 0, '2023-07-07 08:06:26', '2023-07-15 10:54:31', 5, 1, 1);
INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `precioId`, `categoriaId`, `usuarioId`) VALUES
('405bc892-f01e-4778-92f1-8163412e64a9', 'Departamento en el sol', 'Departamento en el so lDepartamento en el sol Departamento en el sol', 2, 2, 3, 'Avenida Rafael Escardó', '-12.071842097231217', '-77.09196736572429', 'u0o7ger97ug1h527mgb6.jpg', 1, '2023-07-10 00:39:46', '2023-07-12 04:32:11', 3, 2, 1);
INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `precioId`, `categoriaId`, `usuarioId`) VALUES
('649328ad-c8b0-4895-b874-c2ed3e10e4c7', 'Nueva casaaa en Miraflores', 'Nueva casaaa en Miraflores Nueva casaaa en Miraflores Nueva casaaa en Miraflores', 2, 3, 1, 'Avenida Ernesto Diez Canseco 351', '-12.122249999999951', '-77.02700999999996', 'us19khdbgj81h52aulno.jpg', 1, '2023-07-11 10:54:02', '2023-07-12 04:32:12', 6, 1, 1);
INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `precioId`, `categoriaId`, `usuarioId`) VALUES
('81d7d5fd-13b3-41d9-b60e-b32fed44529b', 'Casa de playa en el Callao', 'Casa de playa en el Callao, oferta especial!!', 2, 2, 3, 'Jirón Larco 199', '-12.0730399908838', '-77.1623400026757', 'nol7a1jt9cg1h52bcgbb.jpg', 1, '2023-07-11 11:27:45', '2023-07-12 04:32:13', 4, 1, 1),
('c6b160af-46b8-4a99-9fcf-4e08b31ff2c3', 'Casa de invierno', 'La mejor casa de inverno para este 2023!!', 2, 2, 4, 'Avenida La Paz', '-12.074911634815493', '-77.11696746452213', 'mqqmspv94g81h4s3lh43.jpg', 1, '2023-07-09 01:18:33', '2023-07-12 04:32:14', 6, 2, 1),
('f1f858ce-b0ba-4acd-91bc-84f2e9748411', 'Cabaña en Chorrillos', 'Cabaña en Chorrillos, unica oportunidad', 2, 2, 4, 'Avenida Alejandro Iglesias 808', '-12.169645212379303', '-77.02728794674543', 'jc7chq3kf381h53u2c73.jpg', 1, '2023-07-12 02:14:20', '2023-07-12 04:30:22', 4, 5, 2),
('f900c6f9-c9ca-4f12-bc53-620df3fb8746', 'Casa de playa 6', 'Casa de playa 6 Casa de playa 6 Casa de playa 6 Casa de playa 6 Casa de playa 6 ', 2, 1, 3, 'Calle Enrique López Albújar 341', '-12.066880004511631', '-77.10670998185255', 'o990gce4521h4uk4c1v.jpg', 1, '2023-07-10 00:44:06', '2023-07-12 04:32:15', 4, 3, 1),
('fb09cdef-2a18-4030-8bf7-8a00bbfe78a2', 'Cabaña fuera de la ciudad', 'Cabaña fuera de la ciudad para acampar un fin de semana!', 2, 3, 4, 'Jirón Río Chancay 472', '-11.975647329308273', '-76.9978004545067', 'esnanr3g6f81h4uk7i22.jpg', 1, '2023-07-10 00:46:20', '2023-07-12 04:32:16', 7, 5, 1);

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `token`, `confirmado`, `createdAt`, `updatedAt`) VALUES
(1, 'Juan', 'juan@correo.com', '123456', NULL, 1, '2023-07-07 05:35:02', '2023-07-07 05:35:02');
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `token`, `confirmado`, `createdAt`, `updatedAt`) VALUES
(2, 'Maria', 'maria@gmail.com', '123456', NULL, 1, '2023-07-11 00:00:29', '2023-07-11 00:00:43');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;