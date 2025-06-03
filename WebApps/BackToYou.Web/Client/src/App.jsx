import "./styles/GlobalStyle.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Contact from "./pages/Contact";
import SearchPage from "./pages/SearchPage";
import Homepage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import Detail from "./pages/Detail";
import { Toaster } from "react-hot-toast";
import AiSearchPage from "./pages/AiSearchPage";
import ListingPage from "./pages/ListingPage";
import ProtectedRoute from "./ui/ProtectedRoute";
import AccountPage from "./pages/AccountPage";
import UpdateInfoForm from "./features/account/UpdateInfoForm";
import ChangePasswordForm from "./features/account/ChangePasswordForm";
import AuthPage from "./pages/AuthPage";
import LoginForm from "./features/authentication/LoginForm";
import RegisterForm from "./features/authentication/RegisterForm";
import ForgotPasswordForm from "./features/authentication/ForgotPasswordForm";
import ResetPasswordForm from "./features/authentication/ResetPasswordForm";
import Payment from "./features/payment/Payment";
import PostHistory from "./features/posts/PostHistory";
import PageNotFound from "./pages/PageNotFound";
import FollowedPosts from "./features/posts/FollowedPosts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Homepage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="ai-search" element={<AiSearchPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="contact" element={<Contact />} />
            <Route
              path="listing/create"
              element={
                <ProtectedRoute>
                  <ListingPage mode="create" />
                </ProtectedRoute>
              }
            />

            <Route
              path="listing/edit/:slug"
              element={
                <ProtectedRoute>
                  <ListingPage mode="edit" />
                </ProtectedRoute>
              }
            />

            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<UpdateInfoForm />} />
              <Route path="change-password" element={<ChangePasswordForm />} />
              <Route path="history" element={<PostHistory />} />
              <Route path="following" element={<FollowedPosts />} />
              <Route path="payment" element={<Payment />} />
            </Route>

            <Route path="/:slug" element={<Detail />} />
          </Route>

          <Route path="/" element={<AuthPage />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path="forgot-password" element={<ForgotPasswordForm />} />
            <Route path="reset-password" element={<ResetPasswordForm />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
export default App;
