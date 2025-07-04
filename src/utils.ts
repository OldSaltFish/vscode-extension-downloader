import { ExtensionItem } from "./types/extensionItem";

export const execDownload = (publisherName: string, extensionName: string, version: string) => {
  const url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisherName}/vsextensions/${extensionName}/${version}/vspackage`;
  const a = document.createElement("a");
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
