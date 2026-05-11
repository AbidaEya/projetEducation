#!/bin/bash
# 🚀 SCRIPT POUR TESTER LES NOUVEAUX ENDPOINTS

# Configuration
BASE_URL="http://localhost:8081/api"

echo "=================================================="
echo "📝 TEST DES NOUVEAUX ENDPOINTS"
echo "=================================================="

# Groupes
echo -e "\n\n🔹 GROUPE - Create"
curl -X POST $BASE_URL/groupes/create \
  -H "Content-Type: application/json" \
  -d '{"nomGroupe":"Groupe Test","description":"Test","niveau":3}'

echo -e "\n\n🔹 GROUPE - GetAll"
curl -X GET $BASE_URL/groupes/all

# Matieres
echo -e "\n\n🔹 MATIERE - Create (nécessite un cours et enseignant existant)"
curl -X POST $BASE_URL/matieres/create \
  -H "Content-Type: application/json" \
  -d '{"nomMatiere":"Développement Java","credit":3}'

echo -e "\n\n🔹 MATIERE - GetAll"
curl -X GET $BASE_URL/matieres/all

# Notes
echo -e "\n\n🔹 NOTE - Create (nécessite un étudiant et matière existants)"
curl -X POST $BASE_URL/notes/create \
  -H "Content-Type: application/json" \
  -d '{"valeur":15.5,"observation":"Bon travail"}'

echo -e "\n\n🔹 NOTE - GetAll"
curl -X GET $BASE_URL/notes/all

# Justifications
echo -e "\n\n🔹 JUSTIFICATION - Create (nécessite une absence existante)"
curl -X POST $BASE_URL/justifications/create \
  -H "Content-Type: application/json" \
  -d '{"motif":"Maladie","statut":"EN_ATTENTE"}'

echo -e "\n\n🔹 JUSTIFICATION - GetPending"
curl -X GET $BASE_URL/justifications/pending

# Commentaires
echo -e "\n\n🔹 COMMENTAIRE - Create (nécessite un user existant)"
curl -X POST $BASE_URL/commentaires/create \
  -H "Content-Type: application/json" \
  -d '{"contenu":"Très bon cours!"}'

echo -e "\n\n🔹 COMMENTAIRE - GetActive"
curl -X GET $BASE_URL/commentaires/active

# Demandes Stage
echo -e "\n\n🔹 DEMANDE_STAGE - Create (nécessite un étudiant)"
curl -X POST $BASE_URL/demandes-stage/create \
  -H "Content-Type: application/json" \
  -d '{"description":"Stage chez Google","entreprise":"Google","statut":"EN_ATTENTE"}'

echo -e "\n\n🔹 DEMANDE_STAGE - GetPending"
curl -X GET $BASE_URL/demandes-stage/pending

# Reclamations
echo -e "\n\n🔹 RECLAMATION - Create (nécessite un étudiant)"
curl -X POST $BASE_URL/reclamations/create \
  -H "Content-Type: application/json" \
  -d '{"motif":"Erreur de notation","typeReclamation":"NOTE","statut":"EN_ATTENTE"}'

echo -e "\n\n🔹 RECLAMATION - GetPending"
curl -X GET $BASE_URL/reclamations/pending

echo -e "\n\n=================================================="
echo "✅ Tests terminés!"
echo "=================================================="
