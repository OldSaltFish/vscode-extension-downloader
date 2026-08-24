import { render } from 'solid-js/web';
import './main.css';
import App from './App';

// 初始化深色模式（在渲染前应用，避免闪烁）
const initTheme = () => {
  // 优先使用用户保存的设置，否则跟随系统主题
  const stored = localStorage.getItem('theme-preference');
  let shouldBeDark = false;
  
  if (stored === 'light') {
    shouldBeDark = false;
  } else if (stored === 'dark') {
    shouldBeDark = true;
  } else {
    // 未设置，使用系统主题
    shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  if (shouldBeDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
initTheme();

// 引入 Font Awesome
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
link.integrity = 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==';
link.crossOrigin = 'anonymous';
document.head.appendChild(link);

// 设置网站图标
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = './favicon.svg';
document.head.appendChild(favicon);

render(() => <App />, document.getElementById('root')!);