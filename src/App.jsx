import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./Layout/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import CreateUserPage from "./pages/CreateUserPage";

import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login"; 
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/create" element={<CreateUserPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route index element={<DashboardPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;
