import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

const Home = () => (
  <div className="flex-1 flex items-center justify-center flex-col p-8 text-center bg-zinc-950">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 -z-10"></div>
    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">
      Radical Transparency <br/> <span className="text-zinc-500">in Recruiting.</span>
    </h1>
    <p className="text-zinc-400 max-w-xl text-lg font-medium leading-relaxed mb-8">
      Welcome to the prototype. The backend architecture is secured. 
      Click "Request Invite" in the top right to test the AWS authentication connection.
    </p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
