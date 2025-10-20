# MULTISORE - Servicio de Autenticación (Registro e Inicio de Sesión)
Evidencia: AA5_EV01 / AA5_EV02
Autor: Ángel Moreno

## Descripción
Servicio web en Node.js + Express que permite registrar usuarios y autenticarlos mediante contraseña hasheada y JWT.

## Ejecutar localmente
1. `npm install`
2. Copiar `.env.example` a `.env` y ajustar SECRET 
3. `npm start`
4. Endpoints:
   - POST /api/auth/register  -> { username, password }
   - POST /api/auth/login     -> { username, password }
