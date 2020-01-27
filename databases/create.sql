-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Počítač: 127.0.0.1:3306
-- Vytvořeno: Pon 27. led 2020, 20:39
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

-- --------------------------------------------------------

--
-- Struktura tabulky `games`
--

DROP TABLE IF EXISTS `games`;
CREATE TABLE IF NOT EXISTS `games` (
  `gameMode` varchar(50) COLLATE utf8_czech_ci NOT NULL,
  `correctCounter` int(255) NOT NULL,
  `mistakesCounter` int(255) NOT NULL,
  `ledTurnedOnDurationMiliseconds` int(255) NOT NULL,
  `mistakesCountTolerance` int(255) NOT NULL,
  `finalCountCorrect` int(255) NOT NULL,
  `gameTimeElapsed` varchar(20) COLLATE utf8_czech_ci NOT NULL,
  `id` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `playerId` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `removed` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_playerId` (`playerId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `players`
--

DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `id` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `nickname` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `removed` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
