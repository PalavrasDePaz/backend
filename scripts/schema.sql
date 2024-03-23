-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: mysql.palavrasdepaz.org    Database: palavrasdepaz
-- ------------------------------------------------------
-- Server version	5.5.5-10.6.11-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Assin`
--
DROP DATABASE IF EXISTS `Palavrasdepaz`;

CREATE DATABASE `Palavrasdepaz`;

USE `Palavrasdepaz`;

DROP TABLE IF EXISTS `Assin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Assin` (
  `Submission Date` datetime DEFAULT NULL,
  `IDVOL` double NOT NULL,
  `Nome` varchar(255) DEFAULT NULL,
  `Sobrenome` varchar(255) DEFAULT NULL,
  `RG` double DEFAULT NULL,
  `CPF` double DEFAULT NULL,
  `E-mail` varchar(255) DEFAULT NULL,
  `Endereço completo` varchar(255) DEFAULT NULL,
  `Bairro` varchar(255) DEFAULT NULL,
  `Cidade` varchar(255) DEFAULT NULL,
  `Estado` varchar(255) DEFAULT NULL,
  `CEP` varchar(15) DEFAULT NULL,
  `País` varchar(255) DEFAULT NULL,
  `Nascimento` date DEFAULT NULL,
  `Atividades1` varchar(255) DEFAULT NULL,
  `Atividades2` varchar(255) DEFAULT NULL,
  `Atividades3` varchar(255) DEFAULT NULL,
  `Atividades4` varchar(255) DEFAULT NULL,
  `DiasHoras` varchar(255) DEFAULT NULL,
  `Terms` varchar(10) DEFAULT NULL,
  `Blank` varchar(255) DEFAULT NULL,
  `DocuSign` varchar(10) DEFAULT NULL,
  `Assinatura` varchar(255) DEFAULT NULL,
  `IP` varchar(20) DEFAULT NULL,
  `Submission ID` double DEFAULT NULL,
  PRIMARY KEY (`IDVOL`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Authorization`
--

DROP TABLE IF EXISTS `Authorization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Authorization` (
  `Name` varchar(255) DEFAULT NULL,
  `Mod Presenca` bit(1) DEFAULT b'0',
  `Mod Ger Vol` bit(1) DEFAULT b'0',
  `Mod Det Vol` bit(1) DEFAULT b'0',
  `Mod BO Redacao` bit(1) DEFAULT b'0',
  `Mod BO Cadernos` bit(1) DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Aval-Livro`
--

DROP TABLE IF EXISTS `Aval-Livro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Aval-Livro` (
  `IDAvLivro` int(11) NOT NULL AUTO_INCREMENT,
  `Carimbo de data/hora` datetime DEFAULT NULL,
  `IDVOL` double DEFAULT NULL,
  `NTURMA` double DEFAULT NULL,
  `MATRICULA` double DEFAULT NULL,
  `LEITOR` varchar(255) DEFAULT NULL,
  `ESTETICA` varchar(50) DEFAULT NULL,
  `DIGNIDADE` varchar(50) DEFAULT NULL,
  `CLAREZA` varchar(50) DEFAULT NULL,
  `PLAGIO` varchar(50) DEFAULT NULL,
  `OBSERV` mediumtext DEFAULT NULL,
  `CONCEITO` varchar(50) DEFAULT NULL,
  `DATA VALID` datetime DEFAULT NULL,
  `OPINIAO` varchar(50) DEFAULT NULL,
  `SOCIEDADE` varchar(50) DEFAULT NULL,
  `PLAGIOPARCIAL` varchar(50) DEFAULT NULL,
  `RELEVANTES` mediumtext DEFAULT NULL,
  `REDACAO` varchar(50) DEFAULT NULL,
  `PORTUG` varchar(50) DEFAULT NULL,
  `CPF` varchar(50) DEFAULT NULL,
  `RG` varchar(50) DEFAULT NULL,
  `ESCOLARIDADE` varchar(50) DEFAULT NULL,
  `NASCIMENTO` date DEFAULT NULL,
  `HIST-OBSERV` char(50) DEFAULT NULL,
  `HIST-RELAT` mediumtext DEFAULT NULL,
  PRIMARY KEY (`IDAvLivro`),
  KEY `IDVOL` (`IDVOL`)
) ENGINE=InnoDB AUTO_INCREMENT=10233 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Cadernos`
--

DROP TABLE IF EXISTS `Cadernos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cadernos` (
  `Carimbo de data/hora` datetime DEFAULT NULL,
  `NOME DO(A) ALUNO(A)` varchar(255) DEFAULT NULL,
  `NÚMERO DE MATRÍCULA DO(A) ALUNO(A)` varchar(50) DEFAULT NULL,
  `UNIDADE PRISIONAL DO(A) ALUNO(A)` varchar(255) DEFAULT NULL,
  `NAval` varchar(255) DEFAULT NULL,
  `IDVOL` int(11) DEFAULT NULL,
  `Endereço de e-mail` varchar(50) DEFAULT NULL,
  `TEMA 1` varchar(30) DEFAULT NULL,
  `TEMA 2` varchar(30) DEFAULT NULL,
  `TEMA 3` varchar(30) DEFAULT NULL,
  `TEMA 4` varchar(30) DEFAULT NULL,
  `TEMA 5` varchar(30) DEFAULT NULL,
  `TEMA 6` varchar(30) DEFAULT NULL,
  `TEMA 7` varchar(30) DEFAULT NULL,
  `TEMA 8` varchar(30) DEFAULT NULL,
  `TEMA 9` varchar(30) DEFAULT NULL,
  `TEMA 10` varchar(30) DEFAULT NULL,
  `CONTEÚDOS RELEVANTES` mediumtext DEFAULT NULL,
  `A1` varchar(255) DEFAULT NULL,
  `A2` mediumtext DEFAULT NULL,
  `A3` mediumtext DEFAULT NULL,
  `A4` mediumtext DEFAULT NULL,
  `A5` varchar(255) DEFAULT NULL,
  `A6` varchar(255) DEFAULT NULL,
  `A7` mediumtext DEFAULT NULL,
  `A8` varchar(255) DEFAULT NULL,
  `A9` varchar(255) DEFAULT NULL,
  `A10` varchar(255) DEFAULT NULL,
  `A11` varchar(255) DEFAULT NULL,
  `A12` varchar(255) DEFAULT NULL,
  `A13` varchar(255) DEFAULT NULL,
  `CONCLUSÃO DO AVALIADOR` mediumtext DEFAULT NULL,
  `EXCLUSÃO DE ARQUIVOS RECEBIDOS` varchar(255) DEFAULT NULL,
  `IDCAD` int(11) NOT NULL AUTO_INCREMENT,
  `IDPEP` int(11) DEFAULT NULL,
  `DATARESERVA` date DEFAULT NULL,
  `APROVADO` varchar(3) DEFAULT 'SIM',
  PRIMARY KEY (`IDCAD`),
  KEY `Carimbo de data/hora` (`Carimbo de data/hora`),
  KEY `IDVOL` (`IDVOL`),
  KEY `IDPEP` (`IDPEP`)
) ENGINE=InnoDB AUTO_INCREMENT=20905 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Hours`
--

DROP TABLE IF EXISTS `Hours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Hours` (
  `Submission Date` datetime DEFAULT NULL,
  `IDVOL` double DEFAULT NULL,
  `Manag` double DEFAULT NULL,
  `Comm` double DEFAULT NULL,
  `Tec` double DEFAULT NULL,
  `Event` double DEFAULT NULL,
  `Att` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Pep`
--

DROP TABLE IF EXISTS `Pep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pep` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `IDPlace` int(11) DEFAULT NULL,
  `Report Y/N` bit(1) DEFAULT NULL,
  `Ngroup` varchar(255) DEFAULT NULL,
  `DayReceived` date DEFAULT NULL,
  `DayReleased` date DEFAULT NULL,
  `Facil` varchar(255) DEFAULT NULL,
  `T1` date DEFAULT NULL,
  `T10` date DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `total cert` int(11) DEFAULT NULL,
  `DIRECTORY` varchar(255) DEFAULT NULL,
  `Mese` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=550 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Place`
--

DROP TABLE IF EXISTS `Place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Place` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `FullName` varchar(255) DEFAULT NULL,
  `Coord` varchar(50) DEFAULT NULL,
  `Mode` varchar(20) DEFAULT NULL,
  `Addr` varchar(255) DEFAULT NULL,
  `Sex` char(1) DEFAULT 'M',
  `Closed` bit(1) DEFAULT b'0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Presenca`
--

DROP TABLE IF EXISTS `Presenca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Presenca` (
  `Submission Date` datetime DEFAULT NULL,
  `IDVOL` int(11) NOT NULL,
  `NOME` varchar(255) DEFAULT NULL,
  `E-MAIL` varchar(255) DEFAULT NULL,
  `TEMA` varchar(255) DEFAULT NULL,
  `SUFF` varchar(255) DEFAULT NULL,
  `TEMPO APP` varchar(255) DEFAULT NULL,
  `APROVEITA` varchar(255) DEFAULT NULL,
  `MELHOR` mediumtext DEFAULT NULL,
  `ADQUIRIDOS` varchar(255) DEFAULT NULL,
  `DIFERENTE` mediumtext DEFAULT NULL,
  `DESAFIO` mediumtext DEFAULT NULL,
  `EXPRESSÕES` mediumtext DEFAULT NULL,
  `IDPRES` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`IDPRES`),
  KEY `IDVOL` (`IDVOL`),
  KEY `TEMA` (`TEMA`)
) ENGINE=InnoDB AUTO_INCREMENT=6022 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TurmasClubeLivro`
--

DROP TABLE IF EXISTS `TurmasClubeLivro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TurmasClubeLivro` (
  `IDTurma` int(11) NOT NULL DEFAULT 0,
  `Place` int(11) DEFAULT NULL,
  `DataRecebRelatorio` date DEFAULT NULL,
  `Emprestimo` date DEFAULT NULL,
  `Devolucao` date DEFAULT NULL,
  `DataElabRelatorio` date DEFAULT NULL,
  `Recebido` varchar(50) DEFAULT NULL,
  `SimLista` varchar(50) DEFAULT NULL,
  `ListaPresenca` int(11) DEFAULT NULL,
  `QRL` int(11) DEFAULT NULL,
  `DataInvioParec` date DEFAULT NULL,
  `PresSedex` varchar(50) DEFAULT NULL,
  `DataInvioFunap` date DEFAULT NULL,
  `PresSedex2` varchar(50) DEFAULT NULL,
  `DataFimAval` date DEFAULT NULL,
  `Parec` varchar(50) DEFAULT NULL,
  `IDVOL` int(11) DEFAULT NULL,
  `LinkPasta` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`IDTurma`) USING BTREE,
  KEY `IDVOL` (`IDVOL`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Volunteers`
--

DROP TABLE IF EXISTS `Volunteers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Volunteers` (
  `Submission Date` datetime DEFAULT NULL,
  `IDVOL` int(11) NOT NULL AUTO_INCREMENT,
  `IDPEP` int(11) DEFAULT NULL,
  `NOME` varchar(255) DEFAULT NULL,
  `CERT` bit(1) DEFAULT NULL,
  `HABIL-LEITURA` bit(1) DEFAULT NULL,
  `HABIL-LIVRO` bit(1) DEFAULT NULL,
  `Author` varchar(10) DEFAULT NULL,
  `NASCIMENTO` date DEFAULT NULL,
  `E-MAIL` varchar(255) DEFAULT NULL,
  `Telefone` varchar(255) DEFAULT NULL,
  `PAÍS` varchar(255) DEFAULT NULL,
  `ESTADO` varchar(255) DEFAULT NULL,
  `CIDADE` varchar(255) DEFAULT NULL,
  `ETNIA` varchar(255) DEFAULT NULL,
  `DEFIC` varchar(255) DEFAULT NULL,
  `QUAL` varchar(255) DEFAULT NULL,
  `GENERO` varchar(255) DEFAULT NULL,
  `SEXO` varchar(255) DEFAULT NULL,
  `NOME SOCIAL` varchar(255) DEFAULT NULL,
  `ONDESOUBE` varchar(255) DEFAULT NULL,
  `CONHECIMENTO PEP` varchar(255) DEFAULT NULL,
  `WORKSHOPS` varchar(255) DEFAULT NULL,
  `ESCOLARIDADE` varchar(255) DEFAULT NULL,
  `CURSO1` varchar(255) DEFAULT NULL,
  `CURSO2` varchar(255) DEFAULT NULL,
  `ESTUDOS` mediumtext DEFAULT NULL,
  `EXPERIÊNCIAS` mediumtext DEFAULT NULL,
  `SONHOS` mediumtext DEFAULT NULL,
  `OPORTUNIDADES` varchar(255) DEFAULT NULL,
  `TEMPO` double DEFAULT NULL,
  `DIA` varchar(255) DEFAULT NULL,
  `AJUDAR` varchar(255) DEFAULT NULL,
  `CONTRIBUIR` varchar(255) DEFAULT NULL,
  `DECLARAÇÃO` varchar(255) DEFAULT NULL,
  `SENHA` varchar(255) DEFAULT NULL,
  UNIQUE KEY `E-MAIL` (`E-MAIL`),
  KEY `NOME` (`NOME`),
  KEY `IDVOL` (`IDVOL`)
) ENGINE=InnoDB AUTO_INCREMENT=4584 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'palavrasdepaz'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-05 12:32:48