import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Index from "./pages/Index";
import ContactUs from "./pages/ContactUs";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import MyServices from "./pages/MyServices";
import BookingDetails from "./pages/BookingDetails";
import ServicesDemo from "./pages/ServicesDemo";
import VehicleDetails from "./pages/VehicleDetails";
import ExtraServices from "./pages/ExtraServices";
import NotFound from "./pages/NotFound";
import UserDetails from "./pages/UserDetails";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <WhatsAppFloat />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services-demo" element={<ProtectedRoute><ServicesDemo /></ProtectedRoute>} />
              {/* Redirect /login to landing page */}
              <Route path="/login" element={<Navigate to="/" replace state={{ showAuth: true }} />} />
              {/* Protected routes - require authentication */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/my-services" element={<ProtectedRoute><MyServices /></ProtectedRoute>} />
              <Route path="/extra-services" element={<ProtectedRoute><ExtraServices /></ProtectedRoute>} />
              <Route path="/booking/:bookingId" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
              <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetails /></ProtectedRoute>} />
              <Route path="/admin/user-details/:userId" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
