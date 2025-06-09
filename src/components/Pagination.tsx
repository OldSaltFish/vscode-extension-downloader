import { Component, createSignal } from 'solid-js';
interface PaginationProps {
    itemCount: number;
    onPageChange: (page?: number) => void;
}
const Pagination: Component<PaginationProps> = (props) => {
    // 状态管理
    const [currentPage, setCurrentPage] = createSignal(1);
    console.log('items',props.itemCount);
    
    // 计算总页数(固定15条每页)
    const totalPages = () => Math.ceil(props.itemCount/ 15);
    console.log('总页数',totalPages());
    
    // 生成页码按钮范围（当前页前后各2页）
    const getPageRange = () => {
        const range = [];
        const start = Math.max(1, currentPage() - 2);
        const end = Math.min(totalPages(), currentPage() + 2);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };

    // 切换页码
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages()) {
            setCurrentPage(page);
        }
        props.onPageChange(page);
    };

    return (
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center justify-center gap-8px py-4">
                {/* 第一页按钮 */}
                <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage() === 1}
                    class="flex items-center justify-center w-24px h-16px rounded-8px"
                    title="第一页"
                >
                    &laquo;
                </button>

                {/* 上一页按钮 */}
                <button
                    onClick={() => goToPage(currentPage() - 1)}
                    disabled={currentPage() === 1}
                    class="flex items-center justify-center w-24px h-16px rounded-8px"
                    title="上一页"
                >
                    &lt;
                </button>

                {/* 页码按钮 */}
                {getPageRange().map((page) =>
                    page === currentPage() ? (
                        // 当前页（不可点击）
                        <span class="flex items-center justify-center w-24px h-16px rounded-8px">
                            {page}
                        </span>
                    ) : (
                        // 其他页
                        <button
                            onClick={() => goToPage(page)}
                            class="flex items-center justify-center w-24px h-16px rounded-8px"
                        >
                            {page}
                        </button>
                    )
                )}

                {/* 下一页按钮 */}
                <button
                    onClick={() => goToPage(currentPage() + 1)}
                    disabled={currentPage() === totalPages()}
                    class="flex items-center justify-center w-24px h-16px rounded-8px"
                    title="下一页"
                >
                    &gt;
                </button>

                {/* 最后一页按钮 */}
                <button
                    onClick={() => goToPage(totalPages())}
                    disabled={currentPage() === totalPages()}
                    class="flex items-center justify-center w-24px h-16px rounded-8px"
                    title="最后一页"
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
}

export default Pagination;