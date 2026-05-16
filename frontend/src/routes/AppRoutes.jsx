import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { ROLES } from '../utils/constants';

import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

import Home from '../pages/home/Home';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import DoctorDashboard from '../pages/dashboard/DoctorDashboard';
import PatientDashboard from '../pages/dashboard/PatientDashboard';
import HospitalDashboard from '../pages/dashboard/HospitalDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';

import DoctorList from '../pages/doctors/DoctorList';
import DoctorProfile from '../pages/doctors/DoctorProfile';
import DoctorMyProfile from '../pages/doctors/MyProfile';

import PatientList from '../pages/patients/PatientList';
import PatientProfile from '../pages/patients/PatientProfile';
import PatientMyProfile from '../pages/patients/MyProfile';

import HospitalProfile from '../pages/hospitals/HospitalProfile';
import HospitalMyProfile from '../pages/hospitals/MyHospitalProfile';

import JobList from '../pages/jobs/JobList';
import JobDetails from '../pages/jobs/JobDetails';
import PostJob from '../pages/jobs/PostJob';
import MyJobs from '../pages/jobs/MyJobs';
import MyApplications from '../pages/jobs/MyApplications';

import AppointmentList from '../pages/appointments/AppointmentList';
import BookAppointment from '../pages/appointments/BookAppointment';
import AppointmentCalendar from '../pages/appointments/AppointmentCalendar';

import MedicalRecordsList from '../pages/medical/MedicalRecordsList';
import MedicalRecordDetail from '../pages/medical/MedicalRecordDetail';
import AddMedicalRecord from '../pages/medical/AddMedicalRecord';
import PrescriptionsList from '../pages/medical/PrescriptionsList';
import AddPrescription from '../pages/medical/AddPrescription';
import DrugCatalog from '../pages/medical/DrugCatalog';

import MessageList from '../pages/messages/MessageList';

import RecommendationsList from '../pages/recommendations/RecommendationsList';

import Feed from '../pages/social/Feed';
import PostDetail from '../pages/social/PostDetail';

import Settings from '../pages/profile/Settings';

const roleRoutes = {
  [ROLES.DOCTOR]: '/dashboard/doctor',
  [ROLES.PATIENT]: '/dashboard/patient',
  [ROLES.HOSPITAL]: '/dashboard/hospital',
  [ROLES.ADMIN]: '/dashboard/admin',
};

function DashboardRedirect() {
  const { user } = useAuth();
  const path = roleRoutes[user?.role] || '/dashboard/doctor';
  return <Navigate to={path} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        <Route path="doctor" element={<ProtectedRoute role={ROLES.DOCTOR}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="patient" element={<ProtectedRoute role={ROLES.PATIENT}><PatientDashboard /></ProtectedRoute>} />
        <Route path="hospital" element={<ProtectedRoute role={ROLES.HOSPITAL}><HospitalDashboard /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute role={ROLES.ADMIN}><AdminDashboard /></ProtectedRoute>} />
      </Route>

      <Route path="/doctors" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DoctorList />} />
        <Route path="me" element={<DoctorMyProfile />} />
        <Route path=":id" element={<DoctorProfile />} />
      </Route>

      <Route path="/patients" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<PatientList />} />
        <Route path="me" element={<PatientMyProfile />} />
        <Route path=":id" element={<PatientProfile />} />
      </Route>

      <Route path="/hospitals" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="me" element={<HospitalMyProfile />} />
        <Route path=":id" element={<HospitalProfile />} />
      </Route>

      <Route path="/jobs" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<JobList />} />
        <Route path="post" element={<PostJob />} />
        <Route path="my" element={<MyJobs />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path=":id" element={<JobDetails />} />
        <Route path=":id/edit" element={<PostJob />} />
      </Route>

      <Route path="/appointments" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<AppointmentList />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="calendar" element={<AppointmentCalendar />} />
      </Route>

      <Route path="/medical-records" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<MedicalRecordsList />} />
        <Route path="add" element={<AddMedicalRecord />} />
        <Route path="prescriptions" element={<PrescriptionsList />} />
        <Route path="prescriptions/add" element={<AddPrescription />} />
        <Route path="drugs" element={<DrugCatalog />} />
        <Route path=":id" element={<MedicalRecordDetail />} />
        <Route path=":id/edit" element={<AddMedicalRecord />} />
      </Route>

      <Route path="/messages" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<MessageList />} />
      </Route>

      <Route path="/feed" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Feed />} />
        <Route path="post/:id" element={<PostDetail />} />
      </Route>

      <Route path="/recommendations" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<RecommendationsList />} />
      </Route>

      <Route path="/profile" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
