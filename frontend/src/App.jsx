import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import AdminLogin from './pages/AdminLogin'
import AdminSignup from './pages/AdminSignup'
import DashboardLayout from './components/DashboardLayout'

// Dashboard pages
import UlpinSearch from './pages/dashboard/UlpinSearch'
import GisMap from './pages/dashboard/GisMap'
import BuildingExplorer from './pages/dashboard/BuildingExplorer'
import UlpinDetails from './pages/dashboard/UlpinDetails'
import RegistryHistory from './pages/dashboard/RegistryHistory'
import ArVrView from './pages/dashboard/ArVrView'
import FlaggedProperties from './pages/dashboard/FlaggedProperties'
import ValidationPage from './pages/dashboard/ValidationPage'
import AuthorityDashboard from './pages/dashboard/AuthorityDashboard'

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/signup' element={<AdminSignup />} />

        {/* User dashboard routes */}
        <Route path='/dashboard/search' element={<DashboardLayout role="user"><UlpinSearch /></DashboardLayout>} />
        <Route path='/dashboard/map' element={<DashboardLayout role="user"><GisMap /></DashboardLayout>} />
        <Route path='/dashboard/buildings' element={<DashboardLayout role="user"><BuildingExplorer /></DashboardLayout>} />
        <Route path='/dashboard/details' element={<DashboardLayout role="user"><UlpinDetails /></DashboardLayout>} />
        <Route path='/dashboard/history' element={<DashboardLayout role="user"><RegistryHistory /></DashboardLayout>} />
        <Route path='/dashboard/arvr' element={<DashboardLayout role="user"><ArVrView /></DashboardLayout>} />

        {/* Admin dashboard routes */}
        <Route path='/dashboard/flagged' element={<DashboardLayout role="admin"><FlaggedProperties /></DashboardLayout>} />
        <Route path='/dashboard/validation' element={<DashboardLayout role="admin"><ValidationPage /></DashboardLayout>} />
        <Route path='/dashboard/authority' element={<DashboardLayout role="admin"><AuthorityDashboard /></DashboardLayout>} />
      </Routes>
    </div>
  )
}

export default App