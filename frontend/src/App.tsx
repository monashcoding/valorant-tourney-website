import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import ErrorBoundary from "./components/error/ErrorBoundary";
import Error from "./components/error/Error";
import React from "react";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/test" element={<div>test</div>} />
        <Route path="*" element={<Error type="404" />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
