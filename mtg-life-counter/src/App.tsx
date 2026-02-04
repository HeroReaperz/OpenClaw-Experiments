import { useState } from 'react'
import LifeCounter from './components/LifeCounter'
import DeckManager from './components/DeckManager'
import './App.css'

type Tab = 'life' | 'decks'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('life')

  return (
    <div className="app">
      <header className="app-header">
        <h1>MTG Life Counter</h1>
      </header>
      
      <nav className="tab-nav">
        <button 
          className={activeTab === 'life' ? 'active' : ''} 
          onClick={() => setActiveTab('life')}
        >
          Life Counter
        </button>
        <button 
          className={activeTab === 'decks' ? 'active' : ''} 
          onClick={() => setActiveTab('decks')}
        >
          Deck Vault
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'life' && <LifeCounter />}
        {activeTab === 'decks' && <DeckManager />}
      </main>
    </div>
  )
}

export default App
