import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Intro from './components/Intro'
import { INTRO_STORAGE_KEY } from './constants/introStorage'
import Layout from './components/Layout'
import Home from './pages/Home'
import BumpEra from './pages/BumpEra'
import SprinkleSeason from './pages/SprinkleSeason'
// import LittleMoments from './pages/LittleMoments' // enable when Little Moments goes live

function shouldPlayIntro() {
  try {
    return localStorage.getItem(INTRO_STORAGE_KEY) !== '1'
  } catch {
    return false
  }
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => shouldPlayIntro())

  return (
    <>
      {showIntro && <Intro onDone={() => setShowIntro(false)} />}
      {!showIntro && (
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/bump-era" element={<BumpEra />} />
              <Route path="/maternity" element={<Navigate to="/bump-era" replace />} />
              <Route path="/sprinkle-season" element={<SprinkleSeason />} />
              <Route path="/baby-shower" element={<Navigate to="/sprinkle-season" replace />} />
              {/* <Route path="/little-moments" element={<LittleMoments />} /> */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}
