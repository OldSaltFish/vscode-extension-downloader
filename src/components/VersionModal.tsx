import { createSignal, Show } from "solid-js";
import { ExtensionItem } from "../types/extensionItem";
import { execDownload } from "../utils";
import { createEffect } from "solid-js";
import { downloadTarget, setDownloadTarget } from "../store";

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
        const tempSet = new Set<string>();
        const extensionData: ExtensionItem = result.results[0].extensions[0];
        extensionData.versions.forEach(item => {
            if (!tempSet.has(item.version)) {
                tempSet.add(item.version);
            }
        })
        return Array.from(tempSet);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export default function VersionModal(props: { item: ExtensionItem, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const [inputValue, setInputValue] = createSignal("");
    const [selectedOption, setSelectedOption] = createSignal("");
    const [isDropdownOpen, setIsDropdownOpen] = createSignal(true);
    const [versionList, setVersionList] = createSignal<string[]>([]);
    const handleClose = () => {
        setInputValue("");
        setSelectedOption("");
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
    // 模糊匹配过滤
    const filteredOptions = () => {
        if (!inputValue()) return versionList();
        return versionList().filter(option =>
            option.toLowerCase().includes(inputValue().toLowerCase())
        );
    };

    return (
        <>
            {/* 模态框 */}
            <Show when={props.isOpen}>
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
                        {/* 头部 - 标题和关闭按钮 */}
                        <div class="flex justify-between items-center p-4 border-b">
                            <h3 class="text-lg font-semibold">请选择版本</h3>
                            <button
                                onClick={handleClose}
                                class="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 主体内容 */}
                        <div class="relative p-4 grid gap-2">
                            {/* 输入框 */}
                            <div class="flex items-center border rounded">
                                <input
                                    type="text"
                                    value={selectedOption()}
                                    onInput={(e) => {
                                        setInputValue(e.currentTarget.value);
                                        setSelectedOption(e.currentTarget.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen())}
                                    placeholder="搜索或选择..."
                                    class="flex-1 p-2 outline-none"
                                />
                                <button
                                    onClick={() => {
                                        setDownloadTarget({
                                            ...downloadTarget(),
                                            version: selectedOption(),
                                        })
                                        handleDownload()
                                    }}
                                    class="h-36px px-2 text-gray-500"
                                >
                                    下载
                                </button>
                                {/* 下拉选项 */}

                            </div>
                            <div class={`${isDropdownOpen() ? '' : 'hidden'} mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto`}>
                                {filteredOptions().length > 0 ? (
                                    filteredOptions().map(option => (
                                        <div
                                            onClick={() => {
                                                setSelectedOption(option);
                                                setInputValue("");
                                                setIsDropdownOpen(false);
                                            }}
                                            class="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {option}
                                        </div>
                                    ))
                                ) : (
                                    <div class="p-2 text-gray-500">无匹配结果</div>
                                )}
                            </div>
                            <Show when={props.item.versions.length > 1}>
                                <select class='w-full p-8px' value={downloadTarget()?.targetPlatform} onChange={e => {
                                    setDownloadTarget({
                                        ...downloadTarget(),
                                        targetPlatform: e.target.value
                                    })
                                }}>
                                    {props.item?.versions.map(item => {
                                        return (
                                            <option class="p-2" value={item.targetPlatform}>{item.targetPlatform}</option>
                                        )
                                    })}
                                </select>
                            </Show>
                        </div>


                        {/* 底部按钮 */}
                        <div class="flex justify-end p-4 border-t gap-2">
                            <button
                                onClick={handleClose}
                                class="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleClose}
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </>
    );
}