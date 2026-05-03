import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SEO } from './components/SEO';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Hero } from './components/Hero';
import { Collections } from './components/Collections';
import { Philosophy } from './components/Philosophy';
import { Products } from './pages/Products';
import { Footer } from './components/Footer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { LearnCalisthenics } from './pages/LearnCalisthenics';
import { LearnYoga } from './pages/LearnYoga';
import { AboutUs } from './pages/AboutUs';
import { Services } from './pages/Services';
import { Help } from './pages/Help';
import { MyTickets } from './pages/MyTickets';
import { Preloader } from './components/Preloader';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '814018488714-87d3t4dl34tanodc42jm558gqajfdp39.apps.googleusercontent.com';

function App() {
  const [isPreloading, setIsPreloading] = useState(true);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {isPreloading && <Preloader onComplete={() => setIsPreloading(false)} />}
      <div className={`min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary ${isPreloading ? 'h-screen overflow-hidden' : ''}`}>
        <Navbar />
        <main className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={
              <>
                <SEO canonical="/" />
                <Hero />
                <Collections />
                <Philosophy />
              </>
            } />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/learn/calisthenics" element={<LearnCalisthenics />} />
            <Route path="/learn/yoga" element={<LearnYoga />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/help" element={<Help />} />
            <Route path="/my-tickets" element={<MyTickets />} />
          </Routes>
        </main>
        <Footer />
        <MobileNav />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
