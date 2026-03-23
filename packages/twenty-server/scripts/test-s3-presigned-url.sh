#!/usr/bin/env bash
# Manual E2E test for S3 presigned URL redirect flow.
# Prerequisites:
#   1. MinIO running: docker compose -f packages/twenty-docker/docker-compose.dev.yml --profile s3 up -d
#   2. Server running with S3 config:
#        STORAGE_TYPE=S_3
#        STORAGE_S3_REGION=us-east-1
#        STORAGE_S3_NAME=twenty-storage
#        STORAGE_S3_ENDPOINT=http://localhost:9000
#        STORAGE_S3_ACCESS_KEY_ID=minioadmin
#        STORAGE_S3_SECRET_ACCESS_KEY=minioadmin
#        STORAGE_S3_PRESIGNED_URL_BASE=http://localhost:9000
#   3. Database seeded (npx nx database:reset twenty-server)

set -euo pipefail

API_URL="${API_URL:-http://localhost:3000}"

echo "=== S3 Presigned URL Redirect E2E Test ==="
echo "Server: $API_URL"
echo ""

# Step 1: Authenticate
echo "1. Authenticating..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api" \
  -H "Content-Type: application/json" \
  -d '{
    "operationName": "Challenge",
    "query": "mutation Challenge($email: String!, $password: String!) { challenge(email: $email, password: $password) { loginToken { token expiresAt } } }",
    "variables": {"email": "tim@apple.dev", "password": "Applecar2025"}
  }')

LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['challenge']['loginToken']['token'])" 2>/dev/null || true)

if [ -z "$LOGIN_TOKEN" ]; then
  echo "  FAIL: Could not get login token"
  echo "  Response: $LOGIN_RESPONSE"
  exit 1
fi

AUTH_RESPONSE=$(curl -s -X POST "$API_URL/api" \
  -H "Content-Type: application/json" \
  -d "{
    \"operationName\": \"Verify\",
    \"query\": \"mutation Verify(\$loginToken: String!) { verify(loginToken: \$loginToken) { tokens { accessToken { token } } } }\",
    \"variables\": {\"loginToken\": \"$LOGIN_TOKEN\"}
  }")

ACCESS_TOKEN=$(echo "$AUTH_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['verify']['tokens']['accessToken']['token'])" 2>/dev/null || true)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "  FAIL: Could not get access token"
  exit 1
fi
echo "  OK: Authenticated"

# Step 2: Upload a test PNG file
echo "2. Uploading test PNG file..."
# Create a minimal 1x1 PNG
PNG_FILE=$(mktemp /tmp/test-XXXX.png)
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82' > "$PNG_FILE"

UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/api" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "operationName": "UploadWorkflowFile",
    "query": "mutation UploadWorkflowFile($file: Upload!) { uploadWorkflowFile(file: $file) }",
    "variables": {"file": null}
  }')

# If upload mutation doesn't work, try using the REST endpoint
echo "  Note: If GraphQL upload is unavailable, test with an existing file."
echo "  Upload response: $UPLOAD_RESPONSE"

# Step 3: Test redirect (this requires knowing a file URL)
echo ""
echo "3. To test the redirect manually:"
echo "   curl -v -I '$API_URL/file/workflow/<file-id>?token=<jwt>' 2>&1 | grep -E '(HTTP|Location|Content-Type|Content-Disposition)'"
echo ""
echo "   Expected with STORAGE_S3_PRESIGNED_URL_BASE set:"
echo "     HTTP/1.1 302 Found"
echo "     Location: http://localhost:9000/twenty-storage/..."
echo ""
echo "   Expected without STORAGE_S3_PRESIGNED_URL_BASE:"
echo "     HTTP/1.1 200 OK"
echo "     Content-Type: image/png"
echo "     Content-Disposition: inline"

# Cleanup
rm -f "$PNG_FILE"

echo ""
echo "=== Done ==="
