import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Catalog from "./pages/Catalog";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import WineDetail from "./pages/WineDetail";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import B2B from "./pages/B2B";
import Quiz from "./pages/Quiz";
import WineLab from "./pages/WineLab";
import ReversePairing from "./pages/ReversePairing";
import Premium from "./pages/Premium";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<Results />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/wine-lab" element={<WineLab />} />
              <Route path="/reverse" element={<ReversePairing />} />
              <Route path="/b2b" element={<B2B />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/wine/:id" element={<WineDetail />} />
              <Route path="/account" element={<Account />} />
              <Route path="/dashboard" element={<RestaurantDashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
