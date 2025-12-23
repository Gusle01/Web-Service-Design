import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Write from "./pages/Write";
import Read from "./pages/Read";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import UnauthenticatedLayout from "./layouts/UnauthenticatedLayout";

function App() {
  return (
    <BrowserRouter>
      {/* 공통 Header */}
      <Header />

      {/* 페이지 라우팅 영역 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<UnauthenticatedLayout />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/write" element={<Write />} />
        </Route>
        <Route path="/posts/:id" element={<Read />} />
        <Route path="/read/:id" element={<Read />} />
      </Routes>

      {/* 공통 Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
