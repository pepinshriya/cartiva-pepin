import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
