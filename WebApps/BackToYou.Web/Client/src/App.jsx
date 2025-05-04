import "./GlobalStyle.css"
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Contact from "./pages/Contact";
import SearchPage from "./pages/SearchPage";
import Homepage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import UpsertListingPage from "./pages/UpsertListingPage";
import AiSearchPage from "./pages/AiSearchPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
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
            <Route path="listing" element={<UpsertListingPage />} />
            <Route path="/:slug" element={<Detail />} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* <Route path="*" element={<PageNotFound />} /> */}
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
