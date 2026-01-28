import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Activites from './pages/Activites';
import Billet from './pages/Billet';
import Membres from './pages/Membres';
import Quete from './pages/Quete';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import About from './pages/About';
import Depenses from './pages/Depenses';

function App() {
  

  return (
    <BrowserRouter>
      <div className="flex flex-row min-h-screen">
          <Sidebar />
        <main className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activites" element={<Activites />} />
            <Route path="/billet" element={<Billet />} />
            <Route path="/membres" element={<Membres />} />
            <Route path="/quete" element={<Quete />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/depenses" element={<Depenses />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
