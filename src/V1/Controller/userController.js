const userRepository = require("../Repository/userRepository");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- AUTH & USER MANAGEMENT ---

/*Tar imot brukernavn, alder, passord og rolle fra brukeren. 
Passordet krypteres med bcrypt før det lagres, så selv om databasen hackes, 
ses ikke angriperen passordet. Deretter lagres brukeren i databasen.*/
const registerUser = async (req, res) => {
    try {
        const { brukernavn, alder, passord, rolle } = req.body;
        if (!brukernavn || !passord) return res.status(400).json({ success: false, error: "Mangler data" });

        const hashedPass = await bcrypt.hash(passord, 10);
        const createdUser = await userRepository.createUser({ brukernavn, alder, hashedPass, rolle });
        res.status(201).json({ success: true, id: createdUser.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*Sjekker om brukernavnet finnes, og om passordet stemmer (bcrypt sammenligner det krypterte). 
Hvis alt er riktig, utstedes et JWT token som varer i 1 time. 
Dette tokenet er brukerens "billett" for å bruke resten av API-et.*/
const loginUser = async (req, res) => {
    try {
        const { brukernavn, passord } = req.body;
        const user = await userRepository.findByUsername(brukernavn);

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
        const users = await userRepository.findAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Økonomisk statistikk (SUM/AVG)
const getBankStats = async (req, res) => {
    try {
        const stats = await userRepository.getBankStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Se personlig spillbibliotek (JOIN)
const getMyGames = async (req, res) => {
    try {
        const games = await userRepository.getGamesByUserId(req.user.id);
        res.status(200).json({ success: true, data: games });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 7. Trekk fra saldo (UPDATE)
const updateBalance = async (req, res) => {
    try {
        const { belop } = req.body;
        await userRepository.decreaseBalanceByUserId({ belop, userId: req.user.id });
        res.status(200).json({ success: true, message: "Beløp trukket fra saldo" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 9. Slett transaksjon (DELETE)
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await userRepository.deleteTransactionById(id);
        if (affectedRows > 0) {
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