import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import SubmitReview from "./pages/SubmitReview";

const Home = () => <div className="p-8 text-center"><h1>Radical Transparency</h1></div>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/submit" element={<SubmitReview />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
