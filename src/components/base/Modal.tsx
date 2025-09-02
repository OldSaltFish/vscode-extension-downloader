import { type Component, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
}

const Modal: Component<ModalProps> = (props) => {
  // 点击遮罩层关闭
  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          onPointerDown={handleOverlayClick}
        >
          {/* 遮罩层 */}
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          {/* 对话框主体 */}
          <div class="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            {/* 标题栏 */}
            <Show when={props.title}>
              <div class="mb-4 text-lg font-bold border-b-2 border-black/25">
                {props.title}
              </div>
            </Show>

            {/* 内容区域 */}
            <div class="relative">{props.children}</div>

            {/* 关闭按钮 */}
            <button
              onClick={props.onClose}
              class="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <svg
                class="h-5 w-5"
                aria-label="关闭对话框"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;
