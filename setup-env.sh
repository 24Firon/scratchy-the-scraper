#!/bin/bash
set -e

echo "========================================="
echo "Scratchy Setup: Platzhalter ersetzen"
echo "========================================="
echo ""

echo "n8n Webhook-URL (z. B. http://100.64.0.3:5678/webhook/scratchy):"
read -r N8N_URL

echo ""
echo "Airtable API-Key:"
read -r AIRTABLE_KEY

echo ""
echo "Airtable Base-ID:"
read -r AIRTABLE_BASE

echo ""
echo "Supabase URL:"
read -r SUPABASE_URL

echo ""
echo "Supabase Service Key:"
read -r SUPABASE_KEY

echo ""
echo "Ersetze Platzhalter..."

cp .env.template .env
sed -i "s|{{SCRATCHY_N8N_WEBHOOK_URL}}|$N8N_URL|g" .env
sed -i "s|{{SCRATCHY_AIRTABLE_API_KEY}}|$AIRTABLE_KEY|g" .env
sed -i "s|{{SCRATCHY_AIRTABLE_BASE_ID}}|$AIRTABLE_BASE|g" .env
sed -i "s|{{SCRATCHY_SUPABASE_URL}}|$SUPABASE_URL|g" .env
sed -i "s|{{SCRATCHY_SUPABASE_SERVICE_KEY}}|$SUPABASE_KEY|g" .env

sed -i "s|{{SCRATCHY_N8N_WEBHOOK_URL}}|$N8N_URL|g" docker-compose.yml
sed -i "s|{{SCRATCHY_AIRTABLE_API_KEY}}|$AIRTABLE_KEY|g" docker-compose.yml
sed -i "s|{{SCRATCHY_AIRTABLE_BASE_ID}}|$AIRTABLE_BASE|g" docker-compose.yml
sed -i "s|{{SCRATCHY_SUPABASE_URL}}|$SUPABASE_URL|g" docker-compose.yml
sed -i "s|{{SCRATCHY_SUPABASE_SERVICE_KEY}}|$SUPABASE_KEY|g" docker-compose.yml

echo ""
echo "✅ Platzhalter ersetzt!"
echo "Nächster Schritt: docker compose up -d"
