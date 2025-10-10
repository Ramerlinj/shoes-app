import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './app/home/page'
import './index.css'
import Header from './components/header/header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductsPage from './app/products/page'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Header/>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/products' element={<ProductsPage/>}/>
    </Routes>

    </BrowserRouter>
  </StrictMode>,
)
