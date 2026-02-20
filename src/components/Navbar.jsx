export function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h1>SpillBank v1</h1>
      <div className="nav-links">
        {user ? (
          <>
            <span>Hei, <strong>{user}</strong></span>
            <button onClick={onLogout} className="logout-btn">Logg ut</button>
          </>
        ) : (
          <span>Vennligst logg inn</span>
        )}
      </div>
    </nav>
  );
}