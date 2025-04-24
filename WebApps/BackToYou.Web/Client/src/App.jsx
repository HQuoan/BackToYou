import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Contact from "./pages/Contact";
import SearchPage from "./pages/SearchPage";
import Homepage from "./pages/HomePage";
import MapPage from "./pages/MapPage";

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
            <Route path="ai-search" element={<MapPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
