import { Component } from 'solid-js';
import { ExtensionItem } from '../types/extensionItem';

interface ResultCardProps {
  item: ExtensionItem;
}

const ResultCard: Component<ResultCardProps> = (props) => {
  function formatDownloadCount(count:number) {
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
    if(!('statistics' in props.item)){
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
            <span class="text-gray-300">★</span>
          </span>
        );
      } else {
        // 空星
        stars.push(<span class="text-gray-300">★</span>);
      }
    }
    return stars;
  };
  const handleDownload = (item:ExtensionItem) => {
    // 执行搜索操作
    const url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${item.publisher.publisherName}/vsextensions/${item.extensionName}/${item.versions[0].version}/vspackage`;
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div class="p-4 flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">

      {/* <div class="flex items-center mb-3"> */}
      <div class="bg-gray-200 py-7px text-center border-2 border-dashed rounded-xl overflow-hidden" >
        <img src={props.item.versions[0].files[1]?.source||'https://marketplace.visualstudio.com/_static/tfs/M257_20250527.11/_content/Header/default_icon.png'} alt="" />
      </div>
      <div class="ml-4 flex-1">
        <h3 class="font-semibold text-lg">{props.item.displayName}</h3>
        <div class="flex items-center justify-between">
          <p class="flex-1 text-gray-500 text-sm">{props.item.publisher.displayName}</p>
          <button
            onClick={()=>handleDownload(props.item)}
            class="bg-blue-600 text-white py-8px rounded-md hover:bg-blue-700 transition-colors"
          >
            下载
          </button>
        </div>
      </div>
      <p class="text-gray-600 text-sm line-clamp-2">{props.item.shortDescription}</p>
      <div class="mt-3 flex items-center justify-between">
        <span class="text-yellow-500 flex items-center">
          {renderStars()}
        </span>
        <span class="text-sm text-gray-500">
          {downloadCount} 次下载
        </span>
      </div>

    </div>
  );
};

export default ResultCard;