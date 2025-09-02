import { type Component, createSignal, For } from 'solid-js';

interface ToastProps {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

// 创建全局toast管理器
const createToastManager = () => {
  const [toasts, setToasts] = createSignal<ToastProps[]>([]);

  const addToast = (toast: ToastProps): void => {
    setToasts((prev) => [...prev, toast]);

    // 自动关闭
    setTimeout(() => {
      removeToast(toast);
      toast.onClose?.();
    }, toast.duration || 3000);
  };

  const removeToast = (toast: ToastProps): void => {
    setToasts((prev) => prev.filter((t) => t !== toast));
  };

  return { toasts, addToast, removeToast };
};

const toastManager = createToastManager();

// 导出全局调用方法
export const showToast = (props: ToastProps): void => {
  toastManager.addToast(props);
};

// Toast容器组件
const ToastContainer: Component = () => {
  const getToastTypeStyles = (type: ToastProps['type'] = 'info'): string => {
    const styles = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-gray-500',
      warning: 'bg-yellow-500',
    };
    return styles[type];
  };

  return (
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 z-[9999]">
      <For each={toastManager.toasts()}>
        {(toast) => (
          <div
            class={`
              min-w-[200px] px-6 py-3 rounded text-white text-sm text-center cursor-pointer
              animate-[fadeIn_0.3s_ease]
              ${getToastTypeStyles(toast.type)}
            `}
            onClick={() => toastManager.removeToast(toast)}
          >
            {toast.message}
          </div>
        )}
      </For>
    </div>
  );
};

export default ToastContainer;
