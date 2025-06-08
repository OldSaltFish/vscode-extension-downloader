import { createSignal, For } from 'solid-js';
import SearchBox from './components/SearchBox';
import ResultCard from './components/ResultCard';
import Pagination from './components/Pagination';
import { ExtensionItem } from './types/extensionItem';


export default function App() {
  const [query, setQuery] = createSignal('');
  const [platform, setPlatform] = createSignal("Microsoft.VisualStudio.Code");
  const [isSearching, setIsSearching] = createSignal(false);
  const [results, setResults] = createSignal<ExtensionItem[]>([]);

  // 顶部导航链接
  const navLinks = [
    { name: "GitHub", url: "https://github.com/your-repo" },
  ];

  // 执行搜索
  const performSearch = async (param?:number|Event) => {
    const page = (param instanceof Event||param===undefined)?1:param;
    if (!query()) return;    
    setIsSearching(true);

    try {
      const response = await fetch("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", {
        method: "POST",
        headers: {
          "authority": "marketplace.visualstudio.com",
          "content-type": "application/json",
          "x-requested-with": "XMLHttpRequest",
        },
        body: JSON.stringify({
          "assetTypes": [
            "Microsoft.VisualStudio.Services.Icons.Default",
            "Microsoft.VisualStudio.Services.Icons.Branding",
            "Microsoft.VisualStudio.Services.Icons.Small"
          ],
          "filters": [
            {
              "criteria": [
                { "filterType": 8, "value": platform() },
                {
                  "filterType": 10, "value": query()
                },
                { "filterType": 12, "value": "37888" }
              ],
              "direction": 2,
              "pageSize": 15,
              "pageNumber": page,
              "sortBy": 0,
              "sortOrder": 0,
              "pagingToken": null
            }
          ],
          "flags": 870
        })
      });

      const data = await response.json();
      setResults(data.results[0].extensions || []);
    } catch (error) {
      console.error("搜索失败:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
      scrollTo(0, 0);
    }
  };


  return (
    <div class="min-h-screen flex flex-col bg-gray-50">
      {/* 顶部导航 */}
      <header class="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div class="flex space-x-4">
          {navLinks.map(link => (
            <a
              href={link.url}
              target="_blank"
              class="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {isSearching() && <div class="text-sm text-gray-500">搜索中...</div>}
      </header>

      {/* 主要内容区 */}
      <main class="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div class="w-full max-w-2xl transition-all duration-300">
          <SearchBox
            query={query()}
            onInput={setQuery}
            onSearch={performSearch}
          />

        </div>

        {/* 搜索结果列表 */}
        {results().length > 0 && (
          <div class="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={results()}>
              {(item) => <ResultCard item={item} />}
            </For>
          </div>
        )}
        {/* 分页 */}
        {results().length > 0 && (
          <div class="mt-8">
            <Pagination onPageChange={performSearch}/>
          </div>
        )}
      </main>

      {/* 底部信息 */}
      <footer class="bg-white py-6 px-4 border-t border-gray-200">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div class="text-gray-500 text-sm">
            © 2025 vscode插件在线下载.
          </div>
          <div class="mt-4 md:mt-0">
            <a href="mailto:dreamsoul23@qq.com" class="text-blue-600 hover:text-blue-800">
              dreamsoul23@qq.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}