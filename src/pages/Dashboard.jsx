import { useEffect, useState } from "react";

export function Dashboard() {
    const [games, setGames] = useState([]);
    const [balance, setBalance] = useState(0);
    const token = localStorage.getItem("token");

    // 1. Hent data (GET)
    const fetchData = async () => {
        const res = await fetch("http://localhost:3000/api/v1/user/my-games", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setGames(data.data);
    };

    // 2. Oppdater saldo (PUT)
    const handleUpdateBalance = async () => {
        await fetch("http://localhost:3000/api/v1/user/update-balance", {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ belop: 50 })
        });
        fetchData(); // Oppdaterer visningen
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="dashboard">
            <h1>Ditt Spillbibliotek</h1>
            <button onClick={handleUpdateBalance}>Kjøp poeng (Trekk 50,-)</button>
            
            <div className="game-list">
                {games.map(g => (
                    <div key={g.spill_id} className="game-card">
                        <h3>{g.spill_navn}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}