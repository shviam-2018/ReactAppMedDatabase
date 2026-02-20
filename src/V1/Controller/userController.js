const db = require("../Data/DB"); // Husk at denne må bruke mysql2/promise
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- AUTH & USER MANAGEMENT ---

const registerUser = async (req, res) => {
    try {
        const { brukernavn, alder, passord, rolle } = req.body;
        if (!brukernavn || !passord) return res.status(400).json({ success: false, error: "Mangler data" });

        const hashedPass = await bcrypt.hash(passord, 10);
        const [result] = await db.query(
            "INSERT INTO Brukere (brukernavn, alder, passord, is_verified, rolle) VALUES (?, ?, ?, 0, ?)",
            [brukernavn, alder, hashedPass, rolle || 'bruker']
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { brukernavn, passord } = req.body;
        const [rows] = await db.query("SELECT * FROM Brukere WHERE brukernavn = ?", [brukernavn]);
        const user = rows[0];

        if (user && await bcrypt.compare(passord, user.passord)) {
            // Her genereres tokenet!
            const token = jwt.sign(
                { id: user.bruker_id, rolle: user.rolle }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );
            res.status(200).json({ success: true, token });
        } else {
            res.status(401).json({ success: false, error: "Feil brukernavn eller passord" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- DINE SQL-SPØRRINGER FRA OPPGAVEN ---

// 1. Hent alle brukere (Kun Admin)
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT bruker_id, brukernavn, is_verified FROM Brukere");
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Økonomisk statistikk (SUM/AVG)
const getBankStats = async (req, res) => {
    try {
        const [stats] = await db.query("SELECT SUM(saldo) AS total_kapital, AVG(saldo) AS snitt_saldo FROM Bank");
        res.status(200).json({ success: true, data: stats[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Se personlig spillbibliotek (JOIN)
const getMyGames = async (req, res) => {
    try {
        const [games] = await db.query(
            "SELECT S.spill_navn FROM has_spill HS JOIN Spill S ON HS.spill_id = S.spill_id WHERE HS.bruker_id = ?",
            [req.user.id] // Fra JWT
        );
        res.status(200).json({ success: true, data: games });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 7. Trekk fra saldo (UPDATE)
const updateBalance = async (req, res) => {
    try {
        const { belop } = req.body;
        await db.query("UPDATE Bank SET saldo = saldo - ? WHERE bruker_id = ?", [belop, req.user.id]);
        res.status(200).json({ success: true, message: "Beløp trukket fra saldo" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 9. Slett transaksjon (DELETE)
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM Transaksjoner WHERE transaksjon_id = ?", [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Transaksjon slettet" });
        } else {
            res.status(404).json({ success: false, error: "Transaksjon ikke funnet" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getBankStats,
    getMyGames,
    updateBalance,
    deleteTransaction
};