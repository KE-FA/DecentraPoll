import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home"
import Login from "../src/pages/Login";
// import StudentDashboard from "../src/pages/StudentDashboard";
// import AdminDashboard from "../src/pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/student" element={<StudentDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} /> */}
    </Routes>
  );
}

export default App;