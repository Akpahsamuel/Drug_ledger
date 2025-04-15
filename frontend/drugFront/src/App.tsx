import { ThemeProvider } from "./components/theme-provider";
import { LanguageProvider } from "./lib/i18n";
import { AvatarProvider } from "./lib/avatar-context";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import '@mysten/dapp-kit/dist/index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from "./components/layout";
import "./index.css";
import Home from "@/pages/home/Home";
import Login from "./pages/login/LoginPage";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ProtectedRoute } from "./components/protected-route";
import PublicDashboard from "./pages/public/dashboard/PublicDashboard";
import Verification from "./pages/public/verification/Verification";
import Issues from "./pages/public/issues/Issues";
import Report from "./pages/public/report/Report";
import Search from "./pages/public/search/Search";
import Settings from "./pages/public/settings/Settings";
import Unauthorized from "./pages/unauthorized";
import NotFound from "@/pages/not-found";
import { useSelector } from 'react-redux';
import { RootState } from "@/store/store";

// Create QueryClient instance
const queryClient = new QueryClient();

// Define networks config
const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

function App() {
  const { isAuthenticated, userRole } = useSelector((state: RootState) => state.auth);

  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider defaultTheme="dark">
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networks} defaultNetwork="devnet">
              <WalletProvider autoConnect>
                <LanguageProvider>
                  <AvatarProvider>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={
                        isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} replace /> : <Home />
                      } />
                      <Route path="/login" element={
                        isAuthenticated ? <Navigate to={`/${userRole}/dashboard`} replace /> : <Login />
                      } />
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      
                      {/* Public role routes */}
                      <Route path="/public/dashboard" element={
                        <ProtectedRoute allowedRoles={["public"]}>
                          <Layout>
                            <PublicDashboard />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/public/verification" element={
                        <ProtectedRoute allowedRoles={["public"]}>
                          <Layout>
                            <Verification />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/public/issues" element={
                        <ProtectedRoute allowedRoles={["public"]}>
                          <Layout>
                            <Issues />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/public/report" element={
                        <ProtectedRoute allowedRoles={["public"]}>
                          <Layout>
                            <Report />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/public/search" element={
                        <ProtectedRoute allowedRoles={["public"]}>
                          <Layout>
                            <Search />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/public/settings" element={
                        <ProtectedRoute allowedRoles={["public"]}>
                          <Layout>
                            <Settings />
                          </Layout>
                        </ProtectedRoute>
                      } />

                      {/* Protected routes with layout */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Layout>
                            <PublicDashboard />
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/drugs" element={
                        <ProtectedRoute allowedRoles={["admin", "manufacturer"]}>
                          <Layout>
                            <div>Drugs</div>
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/manufacturers" element={
                        <ProtectedRoute allowedRoles={["admin", "manufacturer"]}>
                          <Layout>
                            <div>Manufacturers</div>
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/issues" element={
                        <ProtectedRoute allowedRoles={["admin", "regulator", "public"]}>
                          <Layout>
                            <div>Issues</div>
                          </Layout>
                        </ProtectedRoute>
                      } />
                      
                      {/* Role-specific routes */}
                      <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <Layout>
                            <div>Admin Dashboard</div>
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/manufacturer/dashboard" element={
                        <ProtectedRoute allowedRoles={["manufacturer"]}>
                          <Layout>
                            <div>Manufacturer Dashboard</div>
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/regulator/dashboard" element={
                        <ProtectedRoute allowedRoles={["regulator"]}>
                          <Layout>
                            <div>Regulator Dashboard</div>
                          </Layout>
                        </ProtectedRoute>
                      } />
                      <Route path="/distributor/dashboard" element={
                        <ProtectedRoute allowedRoles={["distributor"]}>
                          <Layout>
                            <div>Distributor Dashboard</div>
                          </Layout>
                        </ProtectedRoute>
                      } />
                      
                      {/* Add more protected routes here */}
                      <Route
                        path="/products"
                        element={
                          <ProtectedRoute allowedRoles={["admin", "manufacturer"]}>
                            <Layout>
                              <div>Products Page</div>
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/shipments"
                        element={
                          <ProtectedRoute allowedRoles={["admin", "manufacturer", "distributor"]}>
                            <Layout>
                              <div>Shipments Page</div>
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/reports"
                        element={
                          <ProtectedRoute allowedRoles={["admin", "regulator"]}>
                            <Layout>
                              <div>Reports Page</div>
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/verification"
                        element={
                          <ProtectedRoute allowedRoles={["public"]}>
                            <Layout>
                              <div>Verification Page</div>
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/users"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <Layout>
                              <div>Users Page</div>
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute allowedRoles={["admin", "manufacturer", "regulator", "distributor", "public"]}>
                            <Layout>
                              <div>Settings Page</div>
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* 404 route - must be last */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AvatarProvider>
                </LanguageProvider>
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

export default App;