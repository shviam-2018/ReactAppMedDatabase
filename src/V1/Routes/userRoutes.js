const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { verifyToken, checkRole } = require('../Middleware/auth');

// --- POST (Opprette/Sende sensitive data) ---
router.post('/register', userController.registerUser); // Oppretter ny ressurs
router.post('/login', userController.loginUser);       // Sender data for å generere token

// --- GET (Hente/Lese data) ---
router.get('/profile', verifyToken, userController.getMyGames); // Henter spillene dine
router.get('/admin/stats', verifyToken, checkRole('admin'), userController.getBankStats); // Henter statistikk

// --- PUT (Oppdatere/Endre data) ---
router.put('/update-balance', verifyToken, userController.updateBalance); // Endrer eksisterende saldo

// --- DELETE (Fjerne data) ---
router.delete('/admin/transaction/:id', verifyToken, checkRole('admin'), userController.deleteTransaction); // Sletter transaksjon

module.exports = router;