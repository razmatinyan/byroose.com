export interface ProjectSettings {
   seoDescription: string;
   keywords: string;
}

export function createProjectSettings(): ProjectSettings {
   return { seoDescription: "", keywords: "" };
}
