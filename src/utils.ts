import { showToast } from "./components/base/Toast";
import { DownloadTarget } from "./types/downloadTarget";

export const execDownload = (downloadTarget: Partial<DownloadTarget>) => {
  if (!downloadTarget.extensionName) {
    showToast({ message: "未获取扩展名称" });
    return;
  } else if (!downloadTarget.publisherName) {
    showToast({ message: "未获取扩展作者" });
    return;
  } else if (!downloadTarget.version) {
    showToast({ message: "未获取扩展版本" });
    return;
  }
  let url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${downloadTarget.publisherName}/vsextensions/${downloadTarget.extensionName}/${downloadTarget.version}/vspackage`;
  if (downloadTarget.targetPlatform) {
    url += `?targetPlatform=${downloadTarget.targetPlatform}`;
  }
  const a = document.createElement("a");
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
