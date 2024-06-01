import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import Login from './components/Login.jsx'
import ActiveSalesOrder from './components/ActiveSalesOrder.jsx'
import CompleteSalesOrder from './components/CompleteOrder.jsx'
import { MyProvider } from './context/context.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children:[
      {
        path:"/complete-order",
        element:<ProtectedRoute><CompleteSalesOrder /></ProtectedRoute>
      },
      {
        path:"/",
        element:<ProtectedRoute ><ActiveSalesOrder /></ProtectedRoute>
      }
    ]
  },
  {
    path:"/login",
    element:<Login />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
      <MyProvider>
      <RouterProvider router={router} />
      </MyProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
