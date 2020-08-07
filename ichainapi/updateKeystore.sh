#!/bin/bash

echo 'printing keystore for Birtishairways'

ORG_1_KEYSTORE=$(ls ../flight-network/crypto-config/peerOrganizations/birtishairways.ibs.aero/users/Admin\@birtishairways.ibs.aero/msp/keystore/)
ORG_2_KEYSTORE=$(ls ../flight-network/crypto-config/peerOrganizations/gatewick.ibs.aero/users/Admin\@gatewick.ibs.aero/msp/keystore/)

ORG_1_PATH_TO_KEYSTORE="Admin@birtishairways.ibs.aero/msp/keystore/"
ORG_2_PATH_TO_KEYSTORE="Admin@gatewick.ibs.aero/msp/keystore/"

UPDATED_KEYSTORE_ORG_1="$ORG_1_PATH_TO_KEYSTORE$ORG_1_KEYSTORE"
UPDATED_KEYSTORE_ORG_2="$ORG_2_PATH_TO_KEYSTORE$ORG_2_KEYSTORE"

echo $UPDATED_KEYSTORE_ORG_1

# sed -i "s|keystore/.*|${UPDATED_KEYSTORE}|g" connection.yaml
# .* is regex-ese for "any character followed by zero or more of any character(s)"

echo 'updating connection.yaml Birtishairways adminPrivateKey path with' ${UPDATED_KEYSTORE_ORG_1}

sed -i -e "s|Admin@birtishairways.ibs.aero/msp/keystore/.*|$UPDATED_KEYSTORE_ORG_1|g" connection.yaml

echo 'updating connection.yaml Gatewick adminPrivateKey path with' ${UPDATED_KEYSTORE_ORG_2}

sed -i -e "s|Admin@gatewick.ibs.aero/msp/keystore/.*|$UPDATED_KEYSTORE_ORG_2|g" connection.yaml
