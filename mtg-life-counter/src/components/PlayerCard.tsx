import './PlayerCard.css'

interface Player {
  id: string
  name: string
  life: number
  poison: number
  commanderDamage: Record<string, number>
}

interface PlayerCardProps {
  player: Player
  allPlayers: Player[]
  onLifeChange: (delta: number) => void
  onPoisonChange: (delta: number) => void
  onCommanderDamage: (targetId: string, delta: number) => void
  onNameChange: (name: string) => void
}

function PlayerCard({ 
  player, 
  allPlayers,
  onLifeChange, 
  onPoisonChange, 
  onCommanderDamage,
  onNameChange 
}: PlayerCardProps) {
  const isCritical = player.life <= 10
  const hasPoison = player.poison > 0

  return (
    <div className={`player-card ${isCritical ? 'critical' : ''} ${hasPoison ? 'poison' : ''}`}>
      <input
        type="text"
        className="player-name"
        value={player.name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Name"
      />

      <div className="life-section">
        <div className="life-display">
          <span className="life-value">{player.life}</span>
          <span className="life-label">Life</span>
        </div>
        <div className="life-controls">
          <button onClick={() => onLifeChange(-1)}>-1</button>
          <button onClick={() => onLifeChange(-5)}>-5</button>
          <button onClick={() => onLifeChange(5)}>+5</button>
          <button onClick={() => onLifeChange(1)}>+1</button>
        </div>
      </div>

      <div className="poison-section">
        <div className={`poison-display ${player.poison >= 10 ? 'critical' : ''}`}>
          <span className="poison-value">{player.poison}</span>
          <span className="poison-label">Poison</span>
        </div>
        <div className="poison-controls">
          <button onClick={() => onPoisonChange(1)}>+1</button>
          <button onClick={() => onPoisonChange(-1)}>-1</button>
        </div>
      </div>

      <div className="commander-section">
        <h4>Commander Damage Taken</h4>
        <div className="commander-trackers">
          {allPlayers.filter(p => p.id !== player.id).map(target => {
            const damage = player.commanderDamage[target.id] || 0
            const isDead = damage >= 21
            return (
              <div key={target.id} className={`commander-tracker ${isDead ? 'dead' : ''}`}>
                <span className="commander-source">{target.name}</span>
                <div className="commander-controls">
                  <button onClick={() => onCommanderDamage(target.id, 1)}>+1</button>
                  <span className="commander-damage">{damage}</span>
                  <button onClick={() => onCommanderDamage(target.id, -1)}>-1</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
