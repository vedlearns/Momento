import { Route, Routes } from "react-router-dom";
import { ToastProvider } from "../shared/components/ui/Toast";
import LandingPage from "../features/landing/LandingPage";
import HomePage from "../features/home/HomePage";
import PlaceholderPage from "../shared/pages/PlaceholderPage";
import NotFoundPage from "../shared/pages/NotFoundPage";
function App() {
  return (
       <ToastProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/login"
          element={<PlaceholderPage title="Log in" description="The login page is coming with the authentication phase." showDemoLink />}
        />
        <Route
          path="/register"
          element={
            <PlaceholderPage title="Create your library" description="Registration is coming with the authentication phase." showDemoLink />
          }
        />
        <Route
          path="/privacy"
          element={<PlaceholderPage title="Privacy policy" description="Our privacy policy will be published before launch." />}
        />
        <Route
          path="/terms"
          element={<PlaceholderPage title="Terms of service" description="Our terms will be published before launch." />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
