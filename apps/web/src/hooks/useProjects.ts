import { useEffect, useState } from "react";
import { fallbackProjects } from "@/data/profile";
import { api, type Project } from "@/lib/api";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(api.isConfigured);

  useEffect(() => {
    if (!api.isConfigured) return;

    let active = true;
    api.projects()
      .then((items) => {
        if (active && items.length > 0) setProjects(items);
      })
      .catch(() => {
        if (active) setProjects(fallbackProjects);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { projects, loading };
}
