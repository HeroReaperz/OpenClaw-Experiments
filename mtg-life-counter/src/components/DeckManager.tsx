import { useState, useRef } from 'react'
import './DeckManager.css'

interface DeckCard {
  name: string
  count: number
}

interface Deck {
  id: string
  name: string
  format: string
  cards: DeckCard[]
  createdAt: Date
}

function DeckManager() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [newDeckName, setNewDeckName] = useState('')
  const [newDeckFormat, setNewDeckFormat] = useState('commander')
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [newCardName, setNewCardName] = useState('')
  const [newCardCount, setNewCardCount] = useState(1)
  const printRef = useRef<HTMLDivElement>(null)

  const createDeck = () => {
    if (!newDeckName.trim()) return
    
    const deck: Deck = {
      id: Date.now().toString(),
      name: newDeckName.trim(),
      format: newDeckFormat,
      cards: [],
      createdAt: new Date(),
    }
    
    setDecks(prev => [...prev, deck])
    setNewDeckName('')
    setSelectedDeck(deck)
  }

  const deleteDeck = (deckId: string) => {
    setDecks(prev => prev.filter(d => d.id !== deckId))
    if (selectedDeck?.id === deckId) {
      setSelectedDeck(null)
    }
  }

  const addCard = () => {
    if (!selectedDeck || !newCardName.trim()) return
    
    setDecks(prev => prev.map(d => {
      if (d.id === selectedDeck.id) {
        const existingCard = d.cards.find(c => c.name.toLowerCase() === newCardName.toLowerCase())
        if (existingCard) {
          return {
            ...d,
            cards: d.cards.map(c => 
              c.name.toLowerCase() === newCardName.toLowerCase() 
                ? { ...c, count: c.count + newCardCount }
                : c
            )
          }
        }
        return {
          ...d,
          cards: [...d.cards, { name: newCardName.trim(), count: newCardCount }]
        }
      }
      return d
    }))
    
    setNewCardName('')
    setNewCardCount(1)
  }

  const updateCardCount = (cardName: string, delta: number) => {
    if (!selectedDeck) return
    
    setDecks(prev => prev.map(d => {
      if (d.id === selectedDeck.id) {
        return {
          ...d,
          cards: d.cards.map(c => 
            c.name === cardName 
              ? { ...c, count: Math.max(0, c.count + delta) }
              : c
          ).filter(c => c.count > 0)
        }
      }
      return d
    }))
  }

  const exportToText = (deck: Deck) => {
    const totalCards = deck.cards.reduce((sum, c) => sum + c.count, 0)
    const lines = [
      `${deck.name}`,
      `Format: ${deck.format}`,
      `${totalCards} cards`,
      '',
      ...deck.cards.map(c => `${c.count}x ${c.name}`),
    ]
    return lines.join('\n')
  }

  const printDeck = () => {
    if (!printRef.current) return
    const content = printRef.current.innerHTML
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedDeck?.name || 'Deck List'}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { margin-bottom: 5px; }
              .format { color: #666; margin-bottom: 20px; }
              .card-line { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #ccc; }
              .count { font-weight: bold; margin-right: 10px; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="deck-manager">
      <div className="deck-sidebar">
        <div className="create-deck">
          <h3>New Deck</h3>
          <input
            type="text"
            placeholder="Deck name..."
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
          />
          <select value={newDeckFormat} onChange={(e) => setNewDeckFormat(e.target.value)}>
            <option value="commander">Commander</option>
            <option value="standard">Standard</option>
            <option value="modern">Modern</option>
            <option value="legacy">Legacy</option>
            <option value="pauper">Pauper</option>
            <option value="other">Other</option>
          </select>
          <button onClick={createDeck}>Create Deck</button>
        </div>

        <div className="deck-list">
          <h3>Your Decks ({decks.length})</h3>
          {decks.map(deck => (
            <div 
              key={deck.id} 
              className={`deck-item ${selectedDeck?.id === deck.id ? 'selected' : ''}`}
              onClick={() => setSelectedDeck(deck)}
            >
              <span className="deck-name">{deck.name}</span>
              <span className="deck-format">{deck.format}</span>
              <button 
                className="delete-btn" 
                onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id) }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="deck-content">
        {selectedDeck ? (
          <>
            <div className="deck-header">
              <h2>{selectedDeck.name}</h2>
              <span className="deck-format-badge">{selectedDeck.format}</span>
              <div className="deck-actions">
                <button onClick={() => navigator.clipboard.writeText(exportToText(selectedDeck))}>
                  Copy Text
                </button>
                <button onClick={printDeck}>Print / PDF</button>
              </div>
            </div>

            <div className="add-card">
              <input
                type="text"
                placeholder="Card name..."
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCard()}
              />
              <input
                type="number"
                min="1"
                max="99"
                value={newCardCount}
                onChange={(e) => setNewCardCount(parseInt(e.target.value) || 1)}
              />
              <button onClick={addCard}>Add Card</button>
            </div>

            <div className="deck-cards" ref={printRef}>
              {selectedDeck.cards.length === 0 ? (
                <p className="empty-state">No cards yet. Add some!</p>
              ) : (
                <>
                  <p className="card-count">
                    {selectedDeck.cards.reduce((sum, c) => sum + c.count, 0)} cards total
                  </p>
                  {selectedDeck.cards
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(card => (
                      <div key={card.name} className="deck-card-line">
                        <span className="card-count">{card.count}x</span>
                        <span className="card-name">{card.name}</span>
                        <div className="card-controls">
                          <button onClick={() => updateCardCount(card.name, 1)}>+</button>
                          <button onClick={() => updateCardCount(card.name, -1)}>-</button>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="no-deck-selected">
            <p>Select a deck or create a new one</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeckManager
