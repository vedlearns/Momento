import HomePage from "../../features/home/HomePage";
// import LandingPage from "../../features/landing/LandingPage";
import { Footer } from "./Footer";
import { Header } from "./Header";

// Defines the order of the components to be shown on the page
export function PageLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        {/* HomePage will be replaced by a Outlet tag for routing , once backend starts */}
        <HomePage />
        {/* <LandingPage/> */}
      </main>
      <Footer />
    </div>
  );
}
