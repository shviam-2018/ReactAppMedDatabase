import { useState } from "react";

export function LoginPage({ onLoginSuccess, goToRegister }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:3000/api/v1/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ brukernavn: username, passord: password })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem("token", data.token); // Lagrer JWT
            localStorage.setItem("userRole", data.rolle);
            onLoginSuccess();
        } else {
            alert("Feil brukernavn/passord");
        }
    };

    return (
        <div className="auth-card">
            <h2>Logg Inn</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Brukernavn" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Passord" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Logg inn</button>
            </form>
            <p>Har du ikke konto?</p>
            <button type="button" onClick={goToRegister}>Registrer deg her</button>
        </div>
    );
}