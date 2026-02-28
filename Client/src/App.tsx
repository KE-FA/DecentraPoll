import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home"
import Login from "../src/pages/Login";
import "./App.css"
import StudentDashboard from "../src/pages/student/StudentDashboard";
// import AdminDashboard from "../src/pages/AdminDashboard";
import Protected from "./components/Protected";


function App() {
  return (


    <Routes>
      {/* Public route */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* User-only route */}
      <Route
              path="/student"
              element={
                <Protected requireRole="STUDENT">
                  <StudentDashboard />
                </Protected>
              }
            />

      {/* Admin-only route */}
      {/* <Route path="/admin" element={<AdminLogin />} /> */}
      {/* <Route
              path="/admin"
              element={
                <Protected requireRole="ADMIN">
                  <AdminDashboard />
                </Protected>
              }
            /> */}
    </Routes>

  );
}

export default App;