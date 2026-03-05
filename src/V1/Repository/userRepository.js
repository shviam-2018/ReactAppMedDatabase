const db = require("../Data/DB");

const createUser = async ({ brukernavn, alder, hashedPass, rolle }) => {
    const [result] = await db.query(
        "INSERT INTO Brukere (brukernavn, alder, passord, is_verified, rolle) VALUES (?, ?, ?, 0, ?)",
        [brukernavn, alder, hashedPass, rolle || "bruker"]
    );

    return { id: result.insertId };
};

const findByUsername = async (brukernavn) => {
    const [rows] = await db.query("SELECT * FROM Brukere WHERE brukernavn = ?", [brukernavn]);
    return rows[0] || null;
};

const findAllUsers = async () => {
    const [rows] = await db.query("SELECT bruker_id, brukernavn, is_verified FROM Brukere");
    return rows;
};

const getBankStats = async () => {
    const [rows] = await db.query("SELECT SUM(saldo) AS total_kapital, AVG(saldo) AS snitt_saldo FROM Bank");
    return rows[0] || null;
};

const getGamesByUserId = async (userId) => {
    const [rows] = await db.query(
        "SELECT S.spill_navn FROM has_spill HS JOIN Spill S ON HS.spill_id = S.spill_id WHERE HS.bruker_id = ?",
        [userId]
    );
    return rows;
};

const decreaseBalanceByUserId = async ({ belop, userId }) => {
    await db.query("UPDATE Bank SET saldo = saldo - ? WHERE bruker_id = ?", [belop, userId]);
};

const deleteTransactionById = async (id) => {
    const [result] = await db.query("DELETE FROM Transaksjoner WHERE transaksjon_id = ?", [id]);
    return result.affectedRows;
};

module.exports = {
    createUser,
    findByUsername,
    findAllUsers,
    getBankStats,
    getGamesByUserId,
    decreaseBalanceByUserId,
    deleteTransactionById
};
