import { Routes, Route } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import AdminRoutes from './admin/AdminRoutes';

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<AppRoutes />} />
    </Routes>
  );
}

export default App;
