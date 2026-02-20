import { useState } from "react";

export function RegisterPage({ goToLogin }) {
    const [formData, setFormData] = useState({ brukernavn: "", alder: "", passord: "", rolle: "bruker" });
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/api/v1/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setMsg("Bruker opprettet! Du kan nå logge inn.");
                setTimeout(goToLogin, 2000);
            }
        } catch (err) { setMsg("Feil ved registrering"); }
    };

    return (
        <div className="auth-card">
            <h2>Registrer Ny Bruker</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Brukernavn" onChange={(e) => setFormData({...formData, brukernavn: e.target.value})} required />
                <input type="date" placeholder="Fødselsdato" onChange={(e) => setFormData({...formData, alder: e.target.value})} required />
                <input type="password" placeholder="Passord" onChange={(e) => setFormData({...formData, passord: e.target.value})} required />
                <button type="submit">Opprett Konto</button>
            </form>
            {msg && <p>{msg}</p>}
        </div>
    );
}