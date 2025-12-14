#!/bin/sh

set -e

DOMAIN="automex.in"
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"

# Check if the certificate exists
if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
    echo "Certificate not found for $DOMAIN. Generating a self-signed certificate..."
    
    # Create directory if it doesn't exist
    mkdir -p "$CERT_DIR"
    
    # Generate a self-signed certificate (valid for 1 day)
    # This allows Nginx to start so it can serve the ACME challenge
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$CERT_DIR/privkey.pem" \
        -out "$CERT_DIR/fullchain.pem" \
        -subj "/CN=automex.in"
        
    echo "Self-signed certificate generated."
else
    echo "Certificate found for $DOMAIN."
fi

# Execute the passed command
exec "$@"
