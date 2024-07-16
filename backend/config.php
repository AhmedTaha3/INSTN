<?php
// Paramètres de connexion à la base de données MySQL
$servername = "localhost";
$username = "root"; // Utilisateur MySQL
$password = "root"; // Mot de passe MySQL
$database = "laboratoire"; // Nom de votre base de données

// Créer une connexion à la base de données
$conn = new mysqli($servername, $username, $password, $database);

// Vérifier la connexion
if ($conn->connect_error) {
    die("La connexion à la base de données a échoué : " . $conn->connect_error);
}
?>
