import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Abbinamenti from "./pages/Abbinamenti";
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
import PremiumCantina from "./pages/PremiumCantina";
import Admin from "./pages/Admin";
import About from "./pages/About";
import PrivateConsulting from "./pages/PrivateConsulting";
import QRMenu from "./pages/QRMenu";
import CustomerMenu from "./pages/CustomerMenu";
import Events from "./pages/Events";
import BusinessPlan from "./pages/BusinessPlan";
import WineryDirectory from "./pages/WineryDirectory";
import RFQ from "./pages/RFQ";
import WineMap from "./pages/WineMap";
import ExportProcess from "./pages/ExportProcess";
import WineTechSheet from "./pages/WineTechSheet";
import BBMaterials from "./pages/BBMaterials";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import WineryMatchPage from "./pages/WineryMatch";
import WineryPanel from "./pages/WineryPanel";
import ExportGuide from "./pages/ExportGuide";
import WineListBuilder from "./pages/WineListBuilder";
import VitigniGuide from "./pages/VitigniGuide";
import CantinaManagement from "./pages/CantinaManagement";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
      <Route path="/abbinamenti" element={<Abbinamenti />} />
              <Route path="/results" element={<Results />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/wine-lab" element={<WineLab />} />
              <Route path="/reverse" element={<ReversePairing />} />
              <Route path="/b2b" element={<B2B />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/premium-cantina" element={<PremiumCantina />} />
              <Route path="/wine/:id" element={<WineDetail />} />
              <Route path="/account" element={<Account />} />
              <Route path="/dashboard" element={<RestaurantDashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/consulenza-privata" element={<PrivateConsulting />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/qr-menu" element={<QRMenu />} />
              <Route path="/menu" element={<CustomerMenu />} />
              <Route path="/eventi" element={<Events />} />
              <Route path="/business-plan" element={<BusinessPlan />} />
              <Route path="/cantine" element={<WineryDirectory />} />
              <Route path="/rfq" element={<RFQ />} />
              <Route path="/mappa" element={<WineMap />} />
              <Route path="/export-process" element={<ExportProcess />} />
              <Route path="/wine-sheet/:id" element={<WineTechSheet />} />
              <Route path="/materiali-b2b" element={<BBMaterials />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/ai-matching" element={<WineryMatchPage />} />
              <Route path="/qr-cantina" element={<WineryPanel />} />
      <Route path="/export-guida" element={<ExportGuide />} />
      <Route path="/carta-ai" element={<WineListBuilder />} />
      <Route path="/vitigni" element={<VitigniGuide />} />
      <Route path="/gestione-cantina" element={<CantinaManagement />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
