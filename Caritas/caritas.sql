-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 10-06-2024 a las 20:03:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `caritas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `filial`
--

CREATE TABLE `filial` (
  `id` int(11) NOT NULL,
  `nombre` varchar(15) NOT NULL,
  `fk_idUsuarioVoluntario` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `filial`
--

INSERT INTO `filial` (`id`, `nombre`, `fk_idUsuarioVoluntario`) VALUES
(1, 'FilialNro1', '3'),
(2, 'FilialNro2', '2'),
(3, 'FilialNro3', '3'),
(4, 'FilialNro4', '4'),
(9, 'peeeee', 'ddg@fggff.com'),
(10, 'tresArroyos', 'lolaConstante@gmail.com'),
(11, 'centro caritas_', 'laloConstante@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `id` int(11) NOT NULL,
  `fechaHora` datetime NOT NULL,
  `fk_IdFilial` int(11) NOT NULL,
  `estado` enum('disponible','ocupado') DEFAULT 'disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`id`, `fechaHora`, `fk_IdFilial`, `estado`) VALUES
(1, '2024-05-30 20:30:00', 9, 'disponible'),
(2, '2024-05-05 21:30:00', 9, 'disponible'),
(3, '2024-05-15 10:15:00', 9, 'ocupado'),
(4, '2024-05-30 13:29:00', 9, 'disponible'),
(5, '2024-05-01 13:50:00', 10, 'ocupado'),
(6, '2024-06-30 10:50:00', 10, 'disponible'),
(7, '2024-06-10 15:40:00', 10, 'disponible'),
(8, '2024-12-12 12:00:00', 11, 'ocupado'),
(9, '2024-12-12 17:00:00', 4, 'ocupado'),
(10, '2024-05-01 08:00:00', 1, 'disponible'),
(11, '2024-05-01 08:30:00', 1, 'disponible'),
(12, '2024-05-01 13:50:00', 1, 'disponible'),
(13, '2024-05-01 13:50:00', 1, 'disponible'),
(14, '2024-05-01 13:50:00', 1, 'disponible'),
(15, '2024-05-01 13:50:00', 1, 'disponible'),
(16, '2024-05-01 13:50:00', 1, 'disponible'),
(17, '2024-05-01 08:00:00', 1, 'disponible'),
(18, '2024-05-01 08:30:00', 1, 'ocupado'),
(19, '2024-05-01 09:00:00', 1, 'disponible'),
(20, '2024-05-01 09:30:00', 1, 'disponible'),
(21, '2024-05-01 10:00:00', 1, 'disponible'),
(22, '2024-05-01 10:30:00', 1, 'disponible'),
(23, '2024-05-01 11:00:00', 1, 'disponible'),
(24, '2024-05-01 11:30:00', 1, 'disponible'),
(25, '2024-05-01 12:00:00', 1, 'disponible'),
(26, '2024-05-01 12:30:00', 1, 'disponible'),
(27, '2024-05-01 13:00:00', 1, 'disponible'),
(28, '2024-05-01 13:30:00', 1, 'disponible'),
(29, '2024-05-01 14:00:00', 1, 'disponible'),
(30, '2024-05-01 14:30:00', 1, 'disponible'),
(31, '2024-05-01 15:00:00', 1, 'disponible'),
(32, '2024-05-01 15:30:00', 1, 'disponible'),
(33, '2024-05-01 16:00:00', 1, 'disponible'),
(34, '2024-05-01 16:30:00', 1, 'disponible'),
(35, '2024-05-01 08:00:00', 2, 'disponible'),
(36, '2024-05-01 08:30:00', 2, 'disponible'),
(37, '2024-05-01 09:00:00', 2, 'disponible'),
(38, '2024-05-01 09:30:00', 2, 'disponible'),
(39, '2024-05-01 10:00:00', 2, 'disponible'),
(40, '2024-05-01 10:30:00', 2, 'disponible'),
(41, '2024-05-01 11:00:00', 2, 'disponible'),
(42, '2024-05-01 11:30:00', 2, 'disponible'),
(43, '2024-05-01 12:00:00', 2, 'disponible'),
(44, '2024-05-01 12:30:00', 2, 'disponible'),
(45, '2024-05-01 13:00:00', 2, 'disponible'),
(46, '2024-05-01 13:30:00', 2, 'disponible'),
(47, '2024-05-01 14:00:00', 2, 'disponible'),
(48, '2024-05-01 14:30:00', 2, 'disponible'),
(49, '2024-05-01 15:00:00', 2, 'disponible'),
(50, '2024-05-01 15:30:00', 2, 'disponible'),
(51, '2024-05-01 16:00:00', 2, 'disponible'),
(52, '2024-05-01 16:30:00', 2, 'disponible'),
(53, '2024-05-01 08:00:00', 3, 'disponible'),
(54, '2024-05-01 08:30:00', 3, 'disponible'),
(55, '2024-05-01 09:00:00', 3, 'disponible'),
(56, '2024-05-01 09:30:00', 3, 'disponible'),
(57, '2024-05-01 10:00:00', 3, 'disponible'),
(58, '2024-05-01 10:30:00', 3, 'disponible'),
(59, '2024-05-01 11:00:00', 3, 'disponible'),
(60, '2024-05-01 11:30:00', 3, 'disponible'),
(61, '2024-05-01 12:00:00', 3, 'disponible'),
(62, '2024-05-01 12:30:00', 3, 'disponible'),
(63, '2024-05-01 13:00:00', 3, 'disponible'),
(64, '2024-05-01 13:30:00', 3, 'disponible'),
(65, '2024-05-01 14:00:00', 3, 'disponible'),
(66, '2024-05-01 14:30:00', 3, 'disponible'),
(67, '2024-05-01 15:00:00', 3, 'disponible'),
(68, '2024-05-01 15:30:00', 3, 'disponible'),
(69, '2024-05-01 16:00:00', 3, 'disponible'),
(70, '2024-05-01 16:30:00', 3, 'disponible'),
(71, '2024-05-01 08:00:00', 4, 'disponible'),
(72, '2024-05-01 08:30:00', 4, 'disponible'),
(73, '2024-05-01 09:00:00', 4, 'disponible'),
(74, '2024-05-01 09:30:00', 4, 'disponible'),
(75, '2024-05-01 10:00:00', 4, 'disponible'),
(76, '2024-05-01 10:30:00', 4, 'disponible'),
(77, '2024-05-01 11:00:00', 4, 'disponible'),
(78, '2024-05-01 11:30:00', 4, 'disponible'),
(79, '2024-05-01 12:00:00', 4, 'disponible'),
(80, '2024-05-01 12:30:00', 4, 'disponible'),
(81, '2024-05-01 13:00:00', 4, 'disponible'),
(82, '2024-05-01 13:30:00', 4, 'disponible'),
(83, '2024-05-01 14:00:00', 4, 'disponible'),
(84, '2024-05-01 14:30:00', 4, 'disponible'),
(85, '2024-05-01 15:00:00', 4, 'disponible'),
(86, '2024-05-01 15:30:00', 4, 'disponible'),
(87, '2024-05-01 16:00:00', 4, 'disponible'),
(88, '2024-05-01 16:30:00', 4, 'disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas`
--

CREATE TABLE `ofertas` (
  `id` int(12) NOT NULL,
  `dni_ofertante` int(10) NOT NULL,
  `nombre_ofertante` varchar(12) NOT NULL,
  `dni_receptor` int(10) NOT NULL,
  `nombre_receptor` varchar(12) NOT NULL,
  `id_producto_ofertante` int(10) NOT NULL,
  `id_producto_receptor` int(10) NOT NULL,
  `id_filial` int(10) NOT NULL,
  `estado` enum('esperando','rechazado','aceptado') NOT NULL,
  `fecha_intercambio` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ofertas`
--

INSERT INTO `ofertas` (`id`, `dni_ofertante`, `nombre_ofertante`, `dni_receptor`, `nombre_receptor`, `id_producto_ofertante`, `id_producto_receptor`, `id_filial`, `estado`, `fecha_intercambio`) VALUES
(40, 2147483647, 'lolito', 12345678, 'Gabriela', 25, 23, 1, 'esperando', '2024-05-30 22:08:33'),
(41, 898989898, 'maria', 12345678, 'Gabriela', 31, 28, 1, 'esperando', '2024-06-01 14:54:46'),
(42, 1234, 'Lalo', 2147483647, 'lolito', 32, 22, 1, 'esperando', '2024-06-09 13:53:35'),
(43, 1234, 'lalo', 2147483647, 'lolito', 21, 22, 1, 'esperando', '2024-06-09 14:03:20'),
(44, 1234, 'lalo', 1234, 'lolito', 21, 22, 1, 'esperando', '2024-06-09 17:34:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicacion`
--

CREATE TABLE `publicacion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagenes` text DEFAULT NULL,
  `estado` enum('Nuevo','Usado') NOT NULL,
  `categoria` enum('Productos de limpieza','Indumentaria','Utiles escolares','Alimentos') DEFAULT NULL,
  `fk_usuario_correo` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `publicacion`
--

INSERT INTO `publicacion` (`id`, `nombre`, `descripcion`, `imagenes`, `estado`, `categoria`, `fk_usuario_correo`) VALUES
(21, 'Cafe', 'asdasd', 'https://rincongaucho.net/wp-content/uploads/2023/01/Cafe-molido-intenso-La-Morenita.gif', 'Usado', 'Alimentos', 'lalo2@gmail.com'),
(22, 'Leche', 'Leche, la serenisima', 'https://acdn.mitiendanube.com/stores/093/780/products/serenisima-clasica-751-95fea92d1a27f8e9ab15710914346750-1024-1024.webp', 'Nuevo', 'Alimentos', 'laloConstante@gmail.com'),
(23, 'Carpeta', 'Carpeta', 'https://acdn.mitiendanube.com/stores/209/340/products/imagen171-16252a150f8291655516453217697924-1024-1024.webp', 'Nuevo', 'Utiles escolares', 'gabrielabamba1@gmail.com'),
(24, 'Mochila', 'mochila', 'https://samsonite.com.ar/cdn/shop/files/5074fa49ba8b0d74bf97bab7dba7afca8512704381bef09467f30f450ad98a37_2000x.png?v=1698937491', 'Nuevo', 'Utiles escolares', 'laloConstante@gmail.com'),
(25, 'Cuaderno', 'Cuaderno', 'https://www.centrolavalle.com.ar/images/000000000CTP-00764833Cuadernos-Tapa-dura--2-.jpg', 'Nuevo', 'Utiles escolares', 'laloConstante@gmail.com'),
(27, 'Zapatillas', 'Zapatillas Nike', 'https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw539a8906/products/NIFD9082-101/NIFD9082-101-4.JPG', 'Usado', 'Indumentaria', 'laloConstante@gmail.com'),
(28, 'Jabon', 'Javon en polvo', 'https://www.skip.com.ar/images/h0nadbhvm6m4/38KjcF07LIl04lvfZpScne/eff03b07e91262993e3b3e8e9a400355/VW50aXRsZWQtMy5wbmc/1080w-1080h/jab%C3%B3n-en-polvo-skip-bio-enzimas.avif', 'Nuevo', 'Productos de limpieza', 'gabrielabamba1@gmail.com'),
(29, 'Lapices de colores', 'Lapices de colores, faber castelli', 'https://www.libreriaascorti.com.ar/575-large_default/lapices-de-colores-faber-castell-x24-caras-colores.jpg', 'Usado', 'Utiles escolares', 'maria1@gmail.com'),
(31, 'Lavandina', 'Lavandina, Ayudin', 'https://acdn.mitiendanube.com/stores/002/275/253/products/lavandina-para-ropa-ayudin-quitamanchas-ropa-blanca-2-lts-a1-264490dcdfb3bdb21716589802724031-1024-1024.webp', 'Usado', 'Productos de limpieza', 'maria1@gmail.com'),
(34, 'Cacao', 'sad', 'https://delvergel.cl/wp-content/uploads/2021/01/CACAOPOLVO1-scaled.jpg', 'Usado', 'Alimentos', 'lalo@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Correo` varchar(30) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Usuario` varchar(15) NOT NULL,
  `Nombre` varchar(15) NOT NULL,
  `apellido` varchar(15) NOT NULL,
  `DNI` int(10) NOT NULL,
  `nacimiento` date NOT NULL,
  `Telefono` int(10) NOT NULL,
  `rol` enum('comun','administrador','voluntario') NOT NULL DEFAULT 'comun'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Clientes, voluntarios y administradores';

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Usuario`, `Nombre`, `apellido`, `DNI`, `nacimiento`, `Telefono`, `rol`) VALUES
('gabrielabamba1@gmail.com', '$2a$10$/GFigfcFzc4TsRge1BsTW.LG8TCw2T1G20FW6O7Kv2lV6AdpdPOrS', 'Gabriela', 'Gabriela', 'Bamba', 12345678, '1999-07-09', 99999999, 'comun'),
('lalo2@gmail.com', '$2a$10$9puN5phOJisM6p/OFnFDNO1gWpeUcFWaY1VGa4fTZAzjSLfPwgqh.', 'lalo', 'lalo', 'landa', 1234, '1998-12-12', 1234, 'comun'),
('lalo@gmail.com', '$2a$10$G9rHwvulqQsZFHAWcW8vc.Gti.qDhD4ebKM0P1Mwyn95RMcWIObJu', 'Lalo', 'Lalo', 'Landa', 1234, '1998-12-12', 1234, 'comun'),
('laloConstante@gmail.com', '$2a$10$uMP2r48.k0q/UmonrM7OWunLag5krfmM6x.4oB.UnuAq1tTS0H/Ae', 'lolito', 'lolito', 'landa', 1234, '1998-12-12', 1234, 'comun'),
('maria1@gmail.com', '$2a$10$RaHrHxKCFIituX5SAPk58OVXflfzkJjFBYPLmYCAKotp5JVd1qP/y', 'marii', 'maria', 'Aguirre', 898989898, '2000-12-12', 345667788, 'comun');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_horarios_predeterminados`
--

CREATE TABLE `usuarios_horarios_predeterminados` (
  `id` int(11) NOT NULL,
  `fk_usuario_correo` varchar(30) NOT NULL,
  `fk_horario_id` int(11) NOT NULL,
  `fk_filial_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios_horarios_predeterminados`
--

INSERT INTO `usuarios_horarios_predeterminados` (`id`, `fk_usuario_correo`, `fk_horario_id`, `fk_filial_id`) VALUES
(1, 'lalo@gmail.com', 8, 11),
(2, 'lalo@gmail.com', 8, 11),
(3, 'lalo2@gmail.com', 8, 11),
(4, 'lalo@gmail.com', 2, 9),
(5, 'lalo2@gmail.com', 9, 4),
(6, 'lalo@gmail.com', 88, 4),
(7, 'laloConstante@gmail.com', 10, 1),
(8, 'laloConstante@gmail.com', 12, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `filial`
--
ALTER TABLE `filial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_idUsuarioVoluntario` (`fk_idUsuarioVoluntario`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_IdFilial` (`fk_IdFilial`);

--
-- Indices de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Correo`);

--
-- Indices de la tabla `usuarios_horarios_predeterminados`
--
ALTER TABLE `usuarios_horarios_predeterminados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario_correo` (`fk_usuario_correo`),
  ADD KEY `fk_horario_id` (`fk_horario_id`),
  ADD KEY `fk_filial_id` (`fk_filial_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `filial`
--
ALTER TABLE `filial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `horario`
--
ALTER TABLE `horario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `usuarios_horarios_predeterminados`
--
ALTER TABLE `usuarios_horarios_predeterminados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuarios_horarios_predeterminados`
--
ALTER TABLE `usuarios_horarios_predeterminados`
  ADD CONSTRAINT `usuarios_horarios_predeterminados_ibfk_1` FOREIGN KEY (`fk_usuario_correo`) REFERENCES `usuarios` (`Correo`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuarios_horarios_predeterminados_ibfk_2` FOREIGN KEY (`fk_horario_id`) REFERENCES `horario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuarios_horarios_predeterminados_ibfk_3` FOREIGN KEY (`fk_filial_id`) REFERENCES `filial` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
