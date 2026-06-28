import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import SubmitReview from "./pages/SubmitReview";
import Feed from './pages/Feed';
import ReviewDetail from './pages/ReviewDetail';
import EmployerWaitlist from "./pages/EmployerWaitlist";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path="/submit" element={<SubmitReview />} />
            <Route path="/reviews/:id" element={<ReviewDetail />} />
            <Route path="/employer-waitlist" element={<EmployerWaitlist />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
