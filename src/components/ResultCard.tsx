import { Component } from 'solid-js';
import { ExtensionItem } from '../types/extensionItem';
import { execDownload } from '../utils';
import { downloadTarget, setDownloadTarget, setIsTargetPlatformModalOpen } from '../store';
import defaultIcon from '../assets/default_icon.png';
interface ResultCardProps {
  item: ExtensionItem;
  setCurrentItem: (item: ExtensionItem) => void; // 可选的回调函数
  setIsOpen: (isOpen: boolean) => void; // 可选的回调函数
}

const ResultCard: Component<ResultCardProps> = (props) => {

  const handleDownload = (item: ExtensionItem) => {
    setDownloadTarget({
      publisherName: item.publisher.publisherName,
      extensionName: item.extensionName,
      version: item.versions[0].version,
    })
    if (item.versions.length > 1) {
      props.setCurrentItem(item);
      setDownloadTarget({
        ...downloadTarget(),
        targetPlatform: 'win32-x64'
      })
      setIsTargetPlatformModalOpen(true);
      return;
    }
    // 执行下载
    execDownload(downloadTarget()!);
  }
  const handleVersion = () => {
    // 显示模态框，并传入item
    props.setCurrentItem(props.item);
    setDownloadTarget({
      publisherName: props.item.publisher.publisherName,
      extensionName: props.item.extensionName
    })
    props.setIsOpen(true);
  }
  function formatDownloadCount(count: number) {
    if (count >= 1000000) {
      // 转换为百万单位 (M)
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      // 转换为千单位 (K)
      return (count / 1000).toFixed(1) + 'K';
    }
    // 不足1000直接显示数字
    return count.toString();
  }
  // 部分插件获取不到statistics属性，以0次下载以及0星处理。  
  const installStat = props.item.statistics?.find((item) => item.statisticName === 'install');
  const downloadCount = formatDownloadCount(installStat?.value || 0);
  // 获取评分并向上取整到半星粒度
  const getRoundedRating = () => {
    if (!('statistics' in props.item)) {
      return 0;
    }
    const ratingStat = props.item.statistics.find(
      (item: { statisticName: string }) => item.statisticName === 'weightedRating'
    );
    if (!ratingStat) return 0;

    const rating = parseFloat(ratingStat.value.toString());
    // 向上取整到半星粒度（0-5分，半星为步长）
    return Math.ceil(rating * 2) / 2;
  };

  const roundedRating = getRoundedRating();

  // 生成 VSCode 市场页面 URL
  const getMarketplaceUrl = () => {
    const publisherName = props.item.publisher.publisherName;
    const extensionName = props.item.extensionName;
    return `https://marketplace.visualstudio.com/items?itemName=${publisherName}.${extensionName}`;
  };

  // 生成星级显示
  const renderStars = () => {
    const stars = [];
    // 生成5个星位
    for (let i = 1; i <= 5; i++) {
      if (roundedRating >= i) {
        // 满星
        stars.push(<span class="text-yellow-500">★</span>);
      } else if (roundedRating >= i - 0.5) {
        // 半星（使用特殊字符）
        stars.push(
          <span class="relative inline-block w-[1em]">
            <span class="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <span class="text-yellow-500">★</span>
            </span>
            <span class="text-gray-300 dark:text-zinc-600">★</span>
          </span>
        );
      } else {
        // 空星
        stars.push(<span class="text-gray-300 dark:text-zinc-600">★</span>);
      }
    }
    return stars;
  };
  return (
    <div class="p-4 flex bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow">
      {/* Logo 和评分下载量区域 */}
      <div class="flex-shrink-0 mr-4 flex flex-col items-center">
        <div class="w-72px h-72px flex items-center justify-center">
          <img class='w-72px h-72px object-contain' src={props.item.versions[0].files[1]?.source || defaultIcon} alt="" />
        </div>
        {/* 评分和下载量 */}
        <div class="mt-2 flex flex-col items-center gap-1">
          <span class="text-yellow-500 flex items-center">
            {renderStars()}
          </span>
          <span class="text-base text-gray-500 dark:text-zinc-400 flex items-center gap-1">
            <i class="bowtie-icon bowtie-install install-icon"></i>
            <span>{downloadCount}</span>
          </span>
        </div>
      </div>
      
      {/* 右侧内容区域 */}
      <div class="flex-1 flex flex-col">
        {/* 插件名称和作者 */}
        <div class="mb-0.5">
          <a 
            href={getMarketplaceUrl()}
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-lg text-black dark:text-white no-underline hover:underline hover:decoration-black dark:hover:decoration-white cursor-pointer transition-colors line-clamp-2"
            style={{ 'text-decoration': 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {props.item.displayName}
          </a>
          <p class="text-gray-500 dark:text-zinc-400 text-sm mt-1 mb-0.2">{props.item.publisher.displayName}</p>
        </div>
        
        {/* 描述 */}
        <p class="text-gray-600 dark:text-zinc-300 text-sm line-clamp-2 mb-2 mt-0.5">{props.item.shortDescription}</p>
        
        {/* 底部：按钮 */}
        <div class="mt-auto flex items-center justify-end gap-3">
          {/* 历史版本按钮 */}
          <button
            onClick={() => handleVersion()}
            class="bg-gray-50 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 py-8px px-4 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors border-none outline-none shadow-none"
            style={{ 'box-shadow': 'none', 'border': 'none' }}
          >
            历史版本
          </button>
          {/* 下载按钮 */}
          <button
            onClick={() => handleDownload(props.item)}
            class="bg-blue-600 dark:bg-blue-700 text-white py-8px px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors border-none outline-none shadow-none"
            style={{ 'box-shadow': 'none', 'border': 'none' }}
          >
            下载
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;