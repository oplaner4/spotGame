-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Počítač: 127.0.0.1:3306
-- Vytvořeno: Ned 29. led 2023, 17:11
-- Verze serveru: 10.4.10-MariaDB
-- Verze PHP: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `spotgame`
--

DROP DATABASE IF EXISTS `spotgame`;
CREATE DATABASE `spotgame` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `spotgame`;

-- --------------------------------------------------------

--
-- Struktura tabulky `games`
--

DROP TABLE IF EXISTS `games`;
CREATE TABLE IF NOT EXISTS `games` (
  `gameMode` varchar(50) COLLATE utf8_czech_ci NOT NULL,
  `correctCounter` int(255) NOT NULL,
  `mistakesCounter` int(255) NOT NULL,
  `id` varchar(20) COLLATE utf8_czech_ci NOT NULL,
  `playerId` varchar(20) COLLATE utf8_czech_ci NOT NULL,
  `removed` tinyint(1) NOT NULL,
  `missedCounter` int(255) NOT NULL,
  `correctDelayMillisCounter` bigint(20) NOT NULL,
  `totalTimeMillis` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_playerId` (`playerId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `players`
--

DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `id` varchar(20) COLLATE utf8_czech_ci NOT NULL,
  `nickname` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `removed` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
