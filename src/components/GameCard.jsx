export function GameCard({ game }) {
  return (
    <div className="game-card">
      <div className="game-icon">🎮</div>
      <h3>{game.spill_navn}</h3>
      <p className="status-tag">Eies av deg</p>
    </div>
  );
}