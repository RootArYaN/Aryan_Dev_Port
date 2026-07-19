import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";

const HomePage = lazy(() => import("@/pages/HomePage").then((module) => ({ default: module.HomePage })));
const WorkPage = lazy(() => import("@/pages/WorkPage").then((module) => ({ default: module.WorkPage })));
const ProjectDetailPage = lazy(() => import("@/pages/ProjectDetailPage").then((module) => ({ default: module.ProjectDetailPage })));
const JourneyPage = lazy(() => import("@/pages/JourneyPage").then((module) => ({ default: module.JourneyPage })));
const ExpertisePage = lazy(() => import("@/pages/ExpertisePage").then((module) => ({ default: module.ExpertisePage })));
const LabPage = lazy(() => import("@/pages/LabPage").then((module) => ({ default: module.LabPage })));
const ContactPage = lazy(() => import("@/pages/ContactPage").then((module) => ({ default: module.ContactPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage").then((module) => ({ default: module.AdminLoginPage })));
const AdminPage = lazy(() => import("@/pages/AdminPage").then((module) => ({ default: module.AdminPage })));

function RouteFallback() {
  return (
    <div className="grid min-h-[72vh] place-items-center px-5 pt-28" aria-label="Loading page">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-200" />
        Loading system view
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/expertise" element={<ExpertisePage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
