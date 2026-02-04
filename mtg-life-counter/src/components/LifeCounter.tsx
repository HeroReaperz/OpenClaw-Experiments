import { useState } from 'react'
import PlayerCard from './PlayerCard'
import './LifeCounter.css'

interface Player {
  id: string
  name: string
  life: number
  poison: number
  commanderDamage: Record<string, number>
}

function LifeCounter() {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'You', life: 40, poison: 0, commanderDamage: {} },
    { id: '2', name: 'Player 2', life: 40, poison: 0, commanderDamage: {} },
    { id: '3', name: 'Player 3', life: 40, poison: 0, commanderDamage: {} },
    { id: '4', name: 'Player 4', life: 40, poison: 0, commanderDamage: {} },
  ])

  const updateLife = (playerId: string, delta: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, life: Math.max(0, p.life + delta) } : p
    ))
  }

  const updatePoison = (playerId: string, delta: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, poison: Math.max(0, p.poison + delta) } : p
    ))
  }

  const updateCommanderDamage = (targetId: string, sourceId: string, delta: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === sourceId) {
        const current = p.commanderDamage[targetId] || 0
        return { ...p, commanderDamage: { ...p.commanderDamage, [targetId]: Math.max(0, current + delta) } }
      }
      return p
    }))
  }

  const updatePlayerName = (playerId: string, name: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, name } : p
    ))
  }

  const resetAll = () => {
    setPlayers(prev => prev.map(p => ({ ...p, life: 40, poison: 0, commanderDamage: {} })))
  }

  return (
    <div className="life-counter">
      <div className="controls">
        <button onClick={resetAll} className="reset-btn">Reset All</button>
      </div>
      
      <div className="players-grid">
        {players.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            allPlayers={players}
            onLifeChange={(delta) => updateLife(player.id, delta)}
            onPoisonChange={(delta) => updatePoison(player.id, delta)}
            onCommanderDamage={(targetId, delta) => updateCommanderDamage(targetId, player.id, delta)}
            onNameChange={(name) => updatePlayerName(player.id, name)}
          />
        ))}
      </div>

      <div className="commander-legend">
        <h3>Commander Damage Tracker</h3>
        <p>Track who has dealt commander damage to whom</p>
      </div>
    </div>
  )
}

export default LifeCounter
