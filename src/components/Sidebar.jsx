export function Sidebar({ balance, onUpdate }) {
  return (
    <aside className="sidebar">
      <div className="balance-box">
        <h4>Din Saldo</h4>
        <p className="amount">{balance},- kr</p>
      </div>
      <button onClick={onUpdate} className="action-btn">
        Fyll på saldo
      </button>
    </aside>
  );
}