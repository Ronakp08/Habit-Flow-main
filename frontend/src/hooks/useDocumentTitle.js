import { useEffect } from "react";

export function useDocumentTitle(settings, pageId) {
  useEffect(() => {
    const pageTitle = settings.pages?.[pageId]?.title;
    const separator = settings.documentTitleSeparator || "|";
    document.title = pageTitle
      ? `${pageTitle} ${separator} ${settings.appName}`
      : settings.appName;
  }, [settings, pageId]);
}
