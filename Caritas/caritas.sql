-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 11-05-2024 a las 15:04:05
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
-- Estructura de tabla para la tabla `publicacion`
--

CREATE TABLE `publicacion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagenes` text DEFAULT NULL,
  `estado` enum('Nuevo','Usado') NOT NULL,
  `categoria` enum('Productos de limpieza','Indumentaria','Utiles escolares','Alimentos') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `publicacion`
--

INSERT INTO `publicacion` (`id`, `nombre`, `descripcion`, `imagenes`, `estado`, `categoria`) VALUES
(5, 'Lapices', 'Lápices de 12 colores Fabercastell', 'https://papeleradelonce.com.ar/wp-content/uploads/2020/11/1321.jpg', 'Nuevo', 'Utiles escolares'),
(6, 'Lavandina', '3 listros Ayudin', 'https://www.alloffice.com.py/12114-large_default/lavandina-concentrada-pino-triple-accion-bb-5-litros.jpg', 'Nuevo', 'Productos de limpieza'),
(7, 'Zapatillas', 'Nike color azul', 'urlImagen3', 'Usado', 'Indumentaria'),
(8, 'Campera', 'Adidas del CABJ', 'urlImagen1', 'Nuevo', 'Indumentaria'),
(9, 'Arroz', 'Prueba 1 de edicion de datos', 'imagenDeArroz', 'Nuevo', 'Alimentos'),
(10, 'Arroz', 'Prueba 2 creando publicacion', 'imagenDeArroz', 'Nuevo', 'Alimentos');

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
  `Telefono` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Clientes, voluntarios y administradores';

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Usuario`, `Nombre`, `apellido`, `DNI`, `nacimiento`, `Telefono`) VALUES
('jose@g.com', '$2a$10$E.JJsrVuIJ795pyfVA1rp.JAvSWkxCIvwk9in2yZuUMmxVTu/ojwa', 'tulio', 'tman', 'oman', 456, '1221-01-02', 789),
('lalo2@gmail.com', '$2a$10$k30xmBPPD9YdPFarjpD3Te3T0AZvVHLpf6Qs3YFFsUoq0.gStRBHO', 'lalo', 'lalo', 'landa', 1234, '1998-12-12', 1234),
('lalo@gmail.com', '$2a$10$ZN./G8VufSTxjWLOLaAtKO.9ZCLvN753SHS.VEEvtJbyecGdm05oq', 'lalo', 'lalo', 'landa', 1234, '1998-12-12', 1234);

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
