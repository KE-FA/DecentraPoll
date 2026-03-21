import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home"
import Login from "./pages/Student/Login";
import "./App.css"
import StudentDashboard from "./pages/Student/StudentDashboard";
import Profile from "../src/pages/Student/Profile";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminDashboard from "../src/pages/Admin/AdminDashboard";
import Protected from "./components/Protected";
// import { Toaster } from "react-hot-toast";



function App() {
  return (
    <>
      {/* <Toaster position="top-center" /> */}

      <Routes>
        {/* Public route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* User-only route */}
        <Route
          path="/studentDashboard"
          element={
            <Protected requireRole="STUDENT">
              <StudentDashboard />
            </Protected>
          }
        />
        
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        {/* Admin-only route */}
        <Route path="/admin" element={<AdminLogin />} /> 
         <Route
              path="/adminDashboard"
              element={
                <Protected requireRole="ADMIN">
                  <AdminDashboard />
                </Protected>
              }
            />
            <Route
              path="/adminProfile"
              element={
                <Protected requireRole="ADMIN">
                  <AdminProfile />
                </Protected>
              }
            />
      </Routes>

    </>



  );
}

export default App;