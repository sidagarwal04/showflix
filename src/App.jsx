import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Intro from './components/Intro'
import Layout from './components/Layout'
import Home from './pages/Home'
import GalleryOne from './pages/GalleryOne'
import GalleryTwo from './pages/GalleryTwo'
// import BonusContent from './pages/BonusContent' // enable when Bonus Content goes live

export default function App() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      {showIntro && <Intro onDone={() => setShowIntro(false)} />}
      {!showIntro && (
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/gallery-one" element={<GalleryOne />} />
              <Route path="/album-one" element={<Navigate to="/gallery-one" replace />} />
              <Route path="/gallery-two" element={<GalleryTwo />} />
              <Route path="/album-two" element={<Navigate to="/gallery-two" replace />} />
              {/* <Route path="/bonus-content" element={<BonusContent />} /> */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}
