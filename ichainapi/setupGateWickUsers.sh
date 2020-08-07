#!/usr/bin/env bash

echo "Creating the admin user, and the users for BA, LHR, MIA, GVA"

rm -rf wallet/admin
node bootstrap/enrollAdmin.js
node bootstrap/registerUser.js FlightChainLGW LGW
