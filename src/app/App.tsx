import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../shared/ui/Navbar";
import Footer from "../shared/ui/Footer";
import { useScrollToTop } from "../shared/hooks/useScrollToTop";
import { AppProviders } from "./providers";
import { AppRoutes } from "./routes";

function ScrollToTop() {
  useScrollToTop();
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <ScrollToTop />
          <Navbar />
          <ToastContainer />
          <AppRoutes />
          <Footer />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}
