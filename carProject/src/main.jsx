import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import Home from './Home.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import AllCarsList from './components/AllCarsList.jsx'
import SingleProductPage from './components/SingleProductPage.jsx'
import Layout from './components/Admin/Dashboard/layout.jsx'
import AddCars from './components/Admin/AddCars.jsx'
import FormsCollection from './components/Admin/FormsCollection.jsx'
import Dashboard from './components/Admin/Dashboard.jsx'
import BuyNewCar from './components/Form/BuyNewCar.jsx'
import SaleForm from './components/Form/SaleForm.jsx'
import CarValuation from './components/Form/CarValuation.jsx'
import TestDrive from './components/Form/TestDrive.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/AllCarLists',
    element: <AllCarsList />
  },
  {
    path: '/SingleProductPage',
    element: <SingleProductPage />
  },
  {
    path: '/SaleForm',
    element: <SaleForm />
  },
  {
    path: '/CarValuation',
    element: <CarValuation />
  },
  {
    path: '/BuyNewCar',
    element: <BuyNewCar/>
  },
  // {
  //   path: '/testDriveForm',
  //   element: <TestDrive/>
  // },
  {
    path: "admin",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "AddCars", element: <AddCars /> },
      { path: "FormsCollection", element: <FormsCollection /> },
    ],
  },
])

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
      <RouterProvider router={router} />
    </ClerkProvider>


)
