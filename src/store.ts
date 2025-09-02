import { createSignal } from "solid-js";
import { DownloadTarget } from "./types/downloadTarget";

export const [isTargetPlatformModalOpen, setIsTargetPlatformModalOpen] = createSignal(false);
export const [downloadTarget,setDownloadTarget] = createSignal<Partial<DownloadTarget>|null>(null);