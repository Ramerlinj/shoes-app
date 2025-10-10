import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './app/home/page'
import './index.css'
import Header from './components/header/header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Header/>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
    </Routes>

    </BrowserRouter>
  </StrictMode>,
)
