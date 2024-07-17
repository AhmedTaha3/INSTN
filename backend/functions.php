<?php
// Fonctions réutilisables
// Exemple de fonction pour nettoyer les données entrées par l'utilisateur
function cleanInput($input) {
    // Utiliser les fonctions de nettoyage nécessaires (éviter les injections SQL, etc.)
    return htmlspecialchars(strip_tags(trim($input)));
}
?>
