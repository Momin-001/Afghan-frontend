import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./Layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/Users/ListUsers";
import CreateUserPage from "./pages/Users/CreateUserPage";
import ListBusinesses from "./pages/Businesses/ListBusinesses";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login"; 
import { AuthProvider } from "./contexts/AuthContext";
import CreateBusinessPage from "./pages/Businesses/CreateBussiness";
import ListEvents from "./pages/Events/ListEvents";
import EventDetail from "./pages/Events/EventDetail"
import CreateEvents from "./pages/Events/CreateEvents";
import Events from "./pages/Events/ListEvents";

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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/create" element={<CreateUserPage />} />
            <Route path="businesses" element={<ListBusinesses />} />
            <Route path="businesses/create" element={<CreateBusinessPage />} />
            <Route path="events" element={<ListEvents />} />
            <Route path="events/create" element={<CreateEvents />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;
