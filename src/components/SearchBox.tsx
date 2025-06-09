import { Component } from 'solid-js';

interface SearchBoxProps {
  query: string;
  onInput: (value: string) => void;
  onSearch: () => void;
}

const SearchBox: Component<SearchBoxProps> = (props) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      props.onSearch();
    }
  };

  return (
    <div class="relative">
      <input
        type="text"
        value={props.query}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder="搜索扩展..."
        class="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
      <button
        onClick={props.onSearch}
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors"
      >
        搜索
      </button>
    </div>
  );
};

export default SearchBox;