import { Component,createSignal } from 'solid-js';
interface PaginationProps {
    onPageChange: (page?: number) => void;
  }
const Pagination:Component<PaginationProps> = (props)=> {
   // 状态管理
    const [currentPage, setCurrentPage] = createSignal(1);
    const [itemsPerPage, setItemsPerPage] = createSignal(10);
    const [totalItems] = createSignal(100); // 假设总数据量为100

    // 计算总页数
    const totalPages = () => Math.ceil(totalItems() / itemsPerPage());

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
            {/* 左侧：每页数量下拉框 */}
            {/* <div class="flex items-center gap-2">
          <span>每页显示：</span>
          <select
            value={itemsPerPage()}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // 重置到第一页
            }}
            class="border rounded px-2 py-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div> */}

            {/* 右侧：分页导航 */}
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