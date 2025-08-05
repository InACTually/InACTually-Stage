@echo off
wait-on http://localhost:3000 && yarn electron ./.output/electron/main.js