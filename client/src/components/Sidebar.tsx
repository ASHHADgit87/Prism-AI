import React, { useEffect, useRef, useState } from "react";
import type { Message, Project, Version } from "../types";
import {
  BotIcon,
  EyeIcon,
  Loader2Icon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "@/configs/axios";
import { toast } from "sonner";
interface SidebarProps {
  isMenuOpen: boolean;
  project: Project;
  setProject: (project: Project) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}
const Sidebar = ({
  isMenuOpen,
  project,
  setProject,
  isGenerating,
  setIsGenerating,
}: SidebarProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/api/user/project/${project.id}`);
      setProject(data.project);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  const handleRollBack = async (versionId: string) => {
    try {
      const confirm = window.confirm(
        "Are You Sure You Want To Rollback To This Version?"
      );
      if (!confirm) return;
      setIsGenerating(true);
      const { data } = await api.get(
        `/api/project/rollback/${project.id}/${versionId}`
      );
      const { data: data2 } = await api.get(`/api/user/project/${project.id}`);
      toast.success(data.message);
      setProject(data2.project);
      setIsGenerating(false);
    } catch (error: any) {
      setIsGenerating(false);
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  const handleRevisions = async (e: React.FormEvent) => {
    e.preventDefault();
    let interval: number | undefined;
    try {
      setIsGenerating(true);
      interval = setInterval(() => {
        fetchProject();
      }, 10000);
      const { data } = await api.post(`/api/project/revision/${project.id}`, {
        message: input,
      });
      fetchProject();
      toast.success(data.message);
      setInput("");
      clearInterval(interval);
      setIsGenerating(false);
    } catch (error: any) {
      setIsGenerating(false);
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
      clearInterval(interval);
    }
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [project.conversation.length, isGenerating]);

  return (
    <div
      className={`h-full sm:max-w-sm rounded-xl transition-all ${isMenuOpen ? "max-sm:w-0 overflow-hidden" : "w-full"}`}
      style={{ backgroundColor: "#004d1a", border: "1px solid #005c2a" }}
    >
      <div className="flex flex-col h-full">
        {/* Message Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4">
          {[...project.conversation, ...project.versions]
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            )
            .map((message) => {
              const isMessage = "content" in message;

              if (isMessage) {
                const msg = message as Message;
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(to bottom, #005c2a, #000000)",
                        }}
                      >
                        <BotIcon className="size-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm text-sm mt-5 leading-relaxed break-words ${
                        isUser
                          ? "text-white rounded-tr-none"
                          : "rounded-tl-none text-white"
                      }`}
                      style={{
                        backgroundColor: isUser ? "#006633" : "#00331a",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {msg.content}
                    </div>
                    {isUser && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#000000" }}
                      >
                        <UserIcon className="size-5 text-white" />
                      </div>
                    )}
                  </div>
                );
              } else {
                const ver = message as Version;
                return (
                  <div
                    key={ver.id}
                    className="w-4/5 mx-auto my-2 p-3 rounded-xl shadow flex flex-col gap-2"
                    style={{ backgroundColor: "#00331a", color: "white" }}
                  >
                    <div className="text-xs font-medium">
                      Code Updated <br />{" "}
                      <span className="text-gray-400 text-xs font-normal">
                        {new Date(ver.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      {project.current_version_index === ver.id ? (
                        <button
                          className="px-3 py-1 rounded-md text-xs"
                          style={{ backgroundColor: "#004d1a", color: "white" }}
                        >
                          Current Version
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRollBack(ver.id)}
                          className="px-3 py-1 rounded-md text-xs"
                          style={{ backgroundColor: "#006633", color: "white" }}
                        >
                          Roll Back To This Version
                        </button>
                      )}
                      <Link
                        target="_blank"
                        to={`/preview/${project.id}/${ver.id}`}
                      >
                        <EyeIcon
                          className="size-6 p-1 rounded transition-colors"
                          style={{ backgroundColor: "#004d1a", color: "white" }}
                        />
                      </Link>
                    </div>
                  </div>
                );
              }
            })}
          {isGenerating && (
            <div className="flex items-start gap-3 justify-start">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(to bottom, #005c2a, #004d1a)",
                }}
              >
                <BotIcon className="size-5 text-white" />
              </div>
              <div className="flex gap-1.5 h-full items-end">
                <span
                  className="size-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "#00331a", animationDelay: "0s" }}
                />
                <span
                  className="size-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "#00331a", animationDelay: "0.2s" }}
                />
                <span
                  className="size-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "#00331a", animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}
          <div ref={messageRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleRevisions} className="m-3 relative">
          <div className="flex items-center gap-2">
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              rows={4}
              placeholder="Describe Your Website or Request changes..."
              className="flex-1 p-3 rounded-xl resize-none text-sm outline-none transition-all"
              style={{
                backgroundColor: "#00331a",
                color: "white",
                border: "1px solid #005c2a",
              }}
              disabled={isGenerating}
            />
            <button
              disabled={isGenerating || !input.trim()}
              className="absolute bottom-2.5 right-2.5 rounded-full text-white transition-colors"
              style={{
                backgroundColor: "#006633",
                border: "1px solid #004d1a",
              }}
            >
              {isGenerating ? (
                <Loader2Icon className="size-7 p-1.5 animate-spin text-white" />
              ) : (
                <SendIcon className="size-7 p-1.5 text-white" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
