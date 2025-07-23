import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import MeetingRoomsList from './pages/meeting-room/MeetingRoomsList';
import MeetingRoomForm from './pages/meeting-room/MeetingRoomForm';
import BookingsList from './pages/booking/BookingsList';
import BookingForm from './pages/booking/BookingForm';
import RoomUsersManagement from './pages/room-users/RoomUsersManagement';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meeting-rooms"
            element={
              <ProtectedRoute>
                <MeetingRoomsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting-rooms/new"
            element={
              <ProtectedRoute>
                <MeetingRoomForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting-rooms/:roomId/edit"
            element={
              <ProtectedRoute>
                <MeetingRoomForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meeting-rooms/:roomId/bookings"
            element={
              <ProtectedRoute>
                <BookingsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting-rooms/:roomId/bookings/new"
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting-rooms/:roomId/bookings/:bookingId/edit"
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meeting-rooms/:roomId/users"
            element={
              <ProtectedRoute>
                <RoomUsersManagement />
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </div>
  );
}
