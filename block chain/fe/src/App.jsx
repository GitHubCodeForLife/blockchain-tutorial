import "./App.css";
import Home from "./pages/Home";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RequireNotAuth from "./components/auth/RequireNotAuth";
import RequireAuth from "./components/auth/RequireAuth";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="sign-in" element={<h1>Sign In</h1>} />
          <Route
            path="/test/auth"
            element={
              <RequireAuth>
                <h1>Auth</h1>
              </RequireAuth>
            }
          />
          <Route
            path="/test/not-auth"
            element={
              <RequireNotAuth>
                <h1>Not Auth</h1>
              </RequireNotAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
