import { createSignal, Show, createMemo } from "solid-js";
import { ExtensionItem, Version } from "../types/extensionItem";
import { execDownload } from "../utils";
import { createEffect } from "solid-js";
import { downloadTarget, setDownloadTarget, isDarkMode } from "../store";
// 外部传递ID进行查询，并选择，最终将选择的版本返回给调用者

async function fetchExtensionVersions(id: string = "WallabyJs.console-ninja") {
    try {
        const response = await fetch("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", {
            method: 'POST',
            headers: {
                'accept': 'application/json;api-version=7.2-preview.1;excludeUrls=true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                assetTypes: null,
                filters: [{
                    criteria: [{
                        filterType: 7,
                        value: id
                    }],
                    direction: 2,
                    pageSize: 100,
                    pageNumber: 1,
                    sortBy: 0,
                    sortOrder: 0,
                    pagingToken: null
                }],
                flags: 2151
            })
        });

        const result = await response.json();
        const extensionData: ExtensionItem = result.results[0].extensions[0];
        // extensionData.versions.forEach(item => {
        //     if (!tempSet.has(item.version)) {
        //         tempSet.add(item.version);
        //         const dateObject = new Date(item.lastUpdated);
        //         // 使用 UTC 方法提取
        //         const year = dateObject.getUTCFullYear();
        //         const month = dateObject.getUTCMonth() + 1; // getUTCMonth() 返回 0-11，需要 +1
        //         const day = dateObject.getUTCDate();

        //         // 格式化输出
        //         const yearStr = String(year);
        //         const monthStr = String(month).padStart(2, '0'); // 确保月份是两位数
        //         const dayStr = String(day).padStart(2, '0');     // 确保日期是两位数

        //         const date = `${yearStr}-${monthStr}-${dayStr}`;
        //         tempList.push(date);
        //     }
        // })
        // return Array.from(tempSet);
        return extensionData.versions;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function timeMap(dateString: string) {
    const dateObject = new Date(dateString);
    // 使用 UTC 方法提取
    const year = dateObject.getUTCFullYear();
    const month = dateObject.getUTCMonth() + 1; // getUTCMonth() 返回 0-11，需要 +1
    const day = dateObject.getUTCDate();

    // 格式化输出
    const yearStr = String(year);
    const monthStr = String(month).padStart(2, '0'); // 确保月份是两位数
    const dayStr = String(day).padStart(2, '0');     // 确保日期是两位数

    return `${yearStr}-${monthStr}-${dayStr}`;
}

function versionDisplayMap(version: Version) {
    return `${version.version} [${timeMap(version.lastUpdated)} Released]${version.targetPlatform ? ` [${version.targetPlatform}]` : ''}`;
}

export default function VersionModal(props: { item: ExtensionItem, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const [inputValue, setInputValue] = createSignal("");
    const [selectedVersion, setSelectedVersion] = createSignal<Version>();
    const [isDropdownOpen, setIsDropdownOpen] = createSignal(true);
    const [versionList, setVersionList] = createSignal<Version[]>([]);
    let modalRef: HTMLDivElement | undefined;

    const handleClose = () => {
        setInputValue("");
        setSelectedVersion();
        props.setIsOpen(false);
    }
    const handleDownload = () => {
        const version = downloadTarget()?.version;
        if (version) {
            execDownload(downloadTarget()!);
        } else {
            alert("请选择一个版本进行下载");
        }
    }

    createEffect(() => {
        if (props.isOpen) {
            fetchExtensionVersions(`${props.item!.publisher.publisherName}.${props.item!.extensionName}`).then(versions => {
                setVersionList(versions);
            })
            setIsDropdownOpen(true);
        }
    });

    // 根据深色模式计算背景样式
    const backgroundStyle = createMemo(() => {
        const isDark = isDarkMode();
        
        if (isDark) {
            return `
                linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%),
                rgba(39, 39, 42, 0.8)
            `;
        } else {
            return `
                linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%),
                rgba(255, 255, 255, 0.8)
            `;
        }
    });

    const backgroundColor = createMemo(() => {
        return isDarkMode() ? 'rgba(39, 39, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    });

    // 模糊匹配过滤
    const filteredOptions = () => {
        let result = versionList();
        if (downloadTarget()?.targetPlatform && downloadTarget()?.targetPlatform !== 'undefined') {
            result = result.filter(v => v.targetPlatform === downloadTarget()?.targetPlatform)
        }
        if (!inputValue()) return result;
        return result.filter(option => {
            return versionDisplayMap(option).toLowerCase().includes(inputValue().toLowerCase());
        });
    };

    return (
        <>
            {/* 模态框 */}
            <Show when={props.isOpen}>
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div 
                        ref={modalRef}
                        class="backdrop-blur-md rounded-lg w-full max-w-2xl transition-colors relative overflow-visible" 
                        style={{
                            'box-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                            'backdrop-filter': 'blur(8px) saturate(150%)',
                            '-webkit-backdrop-filter': 'blur(8px) saturate(150%)',
                            'background': backgroundStyle(),
                            'background-color': backgroundColor()
                        }}
                    >
                        {/* 头部 - 标题和关闭按钮 */}
                        <div class="flex justify-between items-start py-2 px-4 border-b border-gray-200 dark:border-zinc-700">
                            <div class="flex flex-col">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-0 mt-1">请选择版本</h3>
                                <p class="text-sm text-gray-500 dark:text-zinc-400 mt-1 mb-0">{props.item.displayName}</p>
                            </div>
                            <button
                                onClick={handleClose}
                                class="text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors border-none outline-none bg-transparent cursor-pointer mt-1"
                                style={{ 'box-shadow': 'none', 'border': 'none', 'padding': '0'}}
                            >
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor">
                                    <path d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z"></path>
                                </svg>
                            </button>
                        </div>

                        {/* 主体内容 */}
                        <div class="relative p-4 grid gap-2">
                            <div class="grid gap-0">
                            {/* 搜索和选择区域 */}
                            <div class="relative">
                                <input
                                    type="text"
                                    value={selectedVersion() ? versionDisplayMap(selectedVersion()!) : inputValue()}
                                    onInput={(e) => {
                                        setInputValue(e.currentTarget.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen())}
                                    placeholder="搜索或选择插件版本"
                                    class={`w-full p-8px outline-none bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-gray-400 box-border border border-gray-300 dark:border-zinc-600 rounded-md`}
                                />
                                {/* 下拉选项 */}
                                <Show when={isDropdownOpen()}>
                                    <div 
                                        class="absolute left-0 right-0 top-full z-10 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-b-md max-h-60 overflow-auto shadow-lg"
                                    >
                                        {filteredOptions().length > 0 ? (
                                            filteredOptions().map(option => (
                                                <div
                                                    onClick={() => {
                                                        setSelectedVersion(option);
                                                        if (option.targetPlatform) {
                                                            setDownloadTarget({
                                                                ...downloadTarget(),
                                                                targetPlatform: option.targetPlatform
                                                            })
                                                        }
                                                        setInputValue("");
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    class="p-8px hover:bg-gray-100 dark:hover:bg-zinc-600 cursor-pointer text-gray-900 dark:text-zinc-100 transition-colors text-xs"
                                                >
                                                    {versionDisplayMap(option)}
                                                </div>
                                            ))
                                        ) : (
                                            <div 
                                                class="w-full p-8px bg-white dark:bg-zinc-700 text-gray-500 dark:text-zinc-400 border-0 box-border text-xs"
                                            >无匹配结果</div>
                                        )}
                                    </div>
                                </Show>
                            </div>
                            <Show when={props.item.versions.length > 1}>
                                <select 
                                    class='w-full p-8px bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 border border-gray-300 dark:border-zinc-600 rounded-md box-border outline-none focus:outline-none' 
                                    value={downloadTarget()?.targetPlatform || ''} 
                                    onChange={e => {
                                        setDownloadTarget({
                                            ...downloadTarget(),
                                            targetPlatform: e.target.value || undefined
                                        })
                                    }}
                                    style={{ 'outline': 'none' }}
                                    onFocus={(e) => e.currentTarget.style.outline = 'none'}
                                    onBlur={(e) => e.currentTarget.style.outline = 'none'}
                                >
                                    <option value="">选择插件平台/架构</option>
                                    {props.item?.versions.map(item => {
                                        return (
                                            <option class="p-2" value={item.targetPlatform}>{item.targetPlatform}</option>
                                        )
                                    })}
                                </select>
                            </Show>
                        </div>
                    </div>


                    {/* 底部按钮 */}
                    <div class="flex justify-end p-4 border-t border-gray-200 dark:border-zinc-700 gap-2">
                            <button
                                onClick={handleClose}
                                class="bg-white dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 py-8px px-4 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-600 transition-colors border-none outline-none shadow-none"
                                style={{ 'box-shadow': 'none', 'border': 'none' }}
                            >
                                取消
                            </button>
                            <button
                                onClick={() => {
                                    setDownloadTarget({
                                        ...downloadTarget(),
                                        version: selectedVersion()?.version,
                                    })
                                    handleDownload()
                                }}
                                class="bg-blue-600 dark:bg-blue-700 text-white py-8px px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors border-none outline-none shadow-none"
                                style={{ 'box-shadow': 'none', 'border': 'none' }}
                            >
                                下载
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </>
    );
}