#!/usr/bin/env bash

echo "Creating the admin user, and the users for BA, LHR, MIA, GVA"

rm -rf bootstrap/hfc-key-store
node bootstrap/enrollAdmin.js
node bootstrap/registerUser.js FlightChainBA BA
node bootstrap/registerUser.js FlightChainLHR LHR
node bootstrap/registerUser.js FlightChainMIA MIA
node bootstrap/registerUser.js FlightChainGVA GVA
