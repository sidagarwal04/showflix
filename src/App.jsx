import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Intro from './components/Intro'
import Layout from './components/Layout'
import Home from './pages/Home'
import GalleryOne from './pages/GalleryOne'
import GalleryTwo from './pages/GalleryTwo'
// import LittleMoments from './pages/LittleMoments' // enable when Little Moments goes live

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
              <Route path="/maternity" element={<Navigate to="/gallery-one" replace />} />
              <Route path="/gallery-two" element={<GalleryTwo />} />
              <Route path="/baby-shower" element={<Navigate to="/gallery-two" replace />} />
              {/* <Route path="/little-moments" element={<LittleMoments />} /> */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}
