import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import SubmitReview from "./pages/SubmitReview";
import Feed from './pages/Feed';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path="/submit" element={<SubmitReview />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
