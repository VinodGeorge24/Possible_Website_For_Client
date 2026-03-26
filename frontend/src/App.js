import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// Import components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.replace('#', ''));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow px-4 pb-16 pt-6 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/booking', element: <Booking /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/contact', element: <Contact /> },
      { path: '/faq', element: <FAQ /> },
    ],
  },
];

export default App;
