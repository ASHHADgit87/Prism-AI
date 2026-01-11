import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Project } from "../types";
import {
  ArrowBigDownDashIcon,
  EyeIcon,
  EyeOffIcon,
  FullscreenIcon,
  LaptopIcon,
  Loader2Icon,
  MessageSquareIcon,
  SaveIcon,
  SmartphoneIcon,
  TabletIcon,
  XIcon,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import ProjectPreview from "../components/ProjectPreview";
import type { ProjectPreviewRef } from "../components/ProjectPreview";
import api from "@/configs/axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const Projects = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [device, setDevice] = useState<"phone" | "tablet" | "desktop">(
    "desktop"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<ProjectPreviewRef>(null);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`);
      setProject(data.project);
      setIsGenerating(data.project.current_code ? false : true);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  const saveProject = async () => {
    if (!previewRef.current) return;
    const code = previewRef.current.getCode();
    if (!code) return;
    setIsSaving(true);
    try {
      const { data } = await api.put(`/api/project/save/${projectId}`, {
        code,
      });
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadCode = async () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) return;
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "index.html";
    document.body.appendChild(element);
    element.click();
  };

  const togglePublish = async () => {
    try {
      const { data } = await api.get(`/api/user/publish-toggle/${projectId}`);
      toast.success(data.message);
      setProject((prev) =>
        prev ? { ...prev, isPublished: !prev.isPublished } : null
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (session?.user) fetchProject();
    else if (!isPending && !session?.user) {
      navigate("/");
      toast("Please Log In To View Your Projects.");
    }
  }, [session?.user]);

  useEffect(() => {
    if (project && !project.current_code) {
      const intervalId = setInterval(fetchProject, 10000);
      return () => clearInterval(intervalId);
    }
  }, [project?.id, project?.current_code]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "#004d1a" }}
      >
        <Loader2Icon className="size-8 animate-spin text-[#00bfa5]" />
      </div>
    );
  }

  return project ? (
    <div
      className="flex flex-col h-screen w-full text-white"
      style={{ backgroundColor: "#004d1a" }}
    >
      {/* Top Bar */}
      <div className="flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 border-b border-[#00331a] bg-[#003f16]">
        {/* Left */}
        <div className="flex items-center gap-2 sm:min-w-[90px]">
          <img
            src="/favicon.svg"
            alt="logo"
            className="h-6 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <div>
            <p className="text-sm font-medium truncate">{project.name}</p>
            <p className="text-xs text-[#9fd9c3]">
              Previewing Last Saved Version
            </p>
          </div>
          <div className="sm:hidden flex-1 flex justify-end">
            {isMenuOpen ? (
              <MessageSquareIcon
                onClick={() => setIsMenuOpen(false)}
                className="size-6 cursor-pointer"
              />
            ) : (
              <XIcon
                onClick={() => setIsMenuOpen(true)}
                className="size-6 cursor-pointer"
              />
            )}
          </div>
        </div>

        {/* Device Switch */}
        <div className="hidden sm:flex gap-2 bg-[#002b12] p-1.5 rounded-md border border-[#00331a]">
          <SmartphoneIcon
            onClick={() => setDevice("phone")}
            className={`size-6 p-1 rounded cursor-pointer ${device === "phone" ? "bg-[#005c2a]" : ""}`}
          />
          <TabletIcon
            onClick={() => setDevice("tablet")}
            className={`size-6 p-1 rounded cursor-pointer ${device === "tablet" ? "bg-[#005c2a]" : ""}`}
          />
          <LaptopIcon
            onClick={() => setDevice("desktop")}
            className={`size-6 p-1 rounded cursor-pointer ${device === "desktop" ? "bg-[#005c2a]" : ""}`}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm">
          <button
            onClick={saveProject}
            disabled={isSaving}
            className="bg-[#00331a] hover:bg-[#004d1a] px-3.5 py-1 flex items-center gap-2 rounded border border-[#005c2a]"
          >
            {isSaving ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <SaveIcon size={16} />
            )}
            Save
          </button>

          <Link
            className="flex items-center gap-2 px-4 py-1 rounded border border-[#005c2a] hover:bg-[#00331a]"
            target="_blank"
            to={`/preview/${projectId}`}
          >
            <FullscreenIcon size={16} /> Preview
          </Link>

          <button
            onClick={downloadCode}
            className="bg-[#005c2a] hover:bg-[#007a3d] px-3.5 py-1 flex items-center gap-2 rounded"
          >
            <ArrowBigDownDashIcon size={16} /> Download
          </button>

          <button
            onClick={togglePublish}
            className="bg-[#005c2a] hover:bg-[#007a3d]
    px-3.5 py-1 flex items-center gap-2
    rounded border border-[#00331a]
    transition-colors"
          >
            {project.isPublished ? (
              <EyeOffIcon size={16} />
            ) : (
              <EyeIcon size={16} />
            )}
            {project.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex overflow-auto">
        <Sidebar
          isMenuOpen={isMenuOpen}
          project={project}
          setProject={(p) => setProject(p)}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
        <div className="flex-1 p-2 pl-0 bg-[#00331a]">
          <ProjectPreview
            ref={previewRef}
            project={project}
            device={device}
            isGenerating
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-[#004d1a]">
      <p className="text-2xl font-medium text-[#ccefe3]">
        Unable to load project!
      </p>
    </div>
  );
};

export default Projects;
