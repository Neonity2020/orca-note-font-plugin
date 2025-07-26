import { setupL10N, t } from "./libs/l10n";
import zhCN from "./translations/zhCN";

let pluginName: string;

// 预设字体选项
const PRESET_FONTS = {
  "system": {
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  },
  "serif": {
    family: "'Times New Roman', Times, serif"
  },
  "sans-serif": {
    family: "'TsangerYunHei-W03', Arial, Helvetica, sans-serif"
  },
  "monospace": {
    family: "'Courier New', Courier, monospace"
  },
  "chinese": {
    family: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif"
  },
  "elegant": {
    family: "'Georgia', 'Times New Roman', serif"
  },
  "modern": {
    family: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
  }
};

// 获取字体显示名称
function getFontDisplayName(fontKey: string): string {
  return t(`fontTheme.presetFonts.${fontKey}`) || fontKey;
}

// 应用字体到页面
function applyFont(fontFamily: string) {
  const style = document.createElement('style');
  style.id = 'orca-font-theme-style';
  style.textContent = `
    :root {
      --orca-fontfamily-fallback: ${fontFamily} !important;
    }
  `;
  
  // 移除旧的样式
  const oldStyle = document.getElementById('orca-font-theme-style');
  if (oldStyle) {
    oldStyle.remove();
  }
  
  document.head.appendChild(style);
}

// 获取当前字体设置
function getCurrentFont(): string {
  const savedFont = localStorage.getItem('orca-font-theme');
  return savedFont || 'system';
}

// 保存字体设置
function saveFont(fontKey: string) {
  localStorage.setItem('orca-font-theme', fontKey);
  const fontFamily = PRESET_FONTS[fontKey as keyof typeof PRESET_FONTS]?.family || fontKey;
  applyFont(fontFamily);
}

// 显示字体选择对话框
function showFontSelector() {
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: var(--orca-color-bg-1);
    border: 1px solid var(--orca-color-border);
    border-radius: 8px;
    padding: 20px;
    max-width: 400px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  `;

  const currentFont = getCurrentFont();
  
  content.innerHTML = `
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: bold; color: var(--orca-color-text-1);">
      ${t('fontTheme.title')}
    </h3>
    
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--orca-color-text-1);">
        ${t('fontTheme.presetFonts')}:
      </label>
      <select id="font-select" style="
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--orca-color-border);
        border-radius: 4px;
        font-size: 14px;
        background-color: var(--orca-color-bg-1);
        color: var(--orca-color-text-1);
      ">
        ${Object.entries(PRESET_FONTS).map(([key, font]) => 
          `<option value="${key}" ${key === currentFont ? 'selected' : ''}>${getFontDisplayName(key)}</option>`
        ).join('')}
      </select>
    </div>
    
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--orca-color-text-1);">
        ${t('fontTheme.customFont')}:
      </label>
      <div style="display: flex; gap: 8px;">
        <input
          type="text"
          id="custom-font-input"
          placeholder="${t('fontTheme.customFontPlaceholder')}"
          style="
            flex: 1;
            padding: 8px 12px;
            border: 1px solid var(--orca-color-border);
            border-radius: 4px;
            font-size: 14px;
            background-color: var(--orca-color-bg-1);
            color: var(--orca-color-text-1);
          "
        />
        <button
          id="apply-custom-font"
          style="
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background-color: var(--orca-color-primary-5);
            color: white;
            cursor: pointer;
            font-size: 14px;
          "
        >
          ${t('fontTheme.apply')}
        </button>
      </div>
    </div>
    
    <div style="font-size: 12px; color: var(--orca-color-text-2); margin-bottom: 16px;">
      ${t('tip')}
    </div>
    
    <div style="display: flex; gap: 8px; justify-content: flex-end;">
      <button
        id="close-dialog"
        style="
          padding: 8px 16px;
          border: 1px solid var(--orca-color-border);
          border-radius: 4px;
          background-color: var(--orca-color-bg-1);
          color: var(--orca-color-text-1);
          cursor: pointer;
          font-size: 14px;
        "
              >
          ${t('fontTheme.close')}
        </button>
    </div>
  `;

  dialog.appendChild(content);
  document.body.appendChild(dialog);

  // 事件处理
  const fontSelect = content.querySelector('#font-select') as HTMLSelectElement;
  const customFontInput = content.querySelector('#custom-font-input') as HTMLInputElement;
  const applyCustomFontBtn = content.querySelector('#apply-custom-font') as HTMLButtonElement;
  const closeBtn = content.querySelector('#close-dialog') as HTMLButtonElement;

  fontSelect.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    const fontKey = target.value;
    saveFont(fontKey);
    orca.notify('success', `${t('fontTheme.fontChanged')}${getFontDisplayName(fontKey)}`);
  });

  applyCustomFontBtn.addEventListener('click', () => {
    const customFont = customFontInput.value.trim();
    if (customFont) {
      saveFont(customFont);
      orca.notify('success', `${t('fontTheme.customFontApplied')}${customFont}`);
      customFontInput.value = '';
    }
  });

  closeBtn.addEventListener('click', () => {
    document.body.removeChild(dialog);
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      document.body.removeChild(dialog);
    }
  });
}

export async function load(_name: string) {
  pluginName = _name;

  setupL10N(orca.state.locale, { "zh-CN": zhCN });

  // 注册字体主题设置
  const settingsSchema = {
    enableFontTheme: {
      label: t('fontTheme.enable'),
      type: "boolean" as const,
      defaultValue: true,
    },
    defaultFont: {
      label: t('fontTheme.defaultFont'),
      type: "string" as const,
      defaultValue: "system",
    }
  };

  await orca.plugins.setSettingsSchema(pluginName, settingsSchema);

  // 应用保存的字体设置
  const savedFont = getCurrentFont();
  const fontFamily = PRESET_FONTS[savedFont as keyof typeof PRESET_FONTS]?.family || savedFont;
  applyFont(fontFamily);

  // 注册字体切换命令
  orca.commands.registerCommand(
    `${pluginName}.toggleFont`,
    () => {
      const currentFont = getCurrentFont();
      const fontKeys = Object.keys(PRESET_FONTS);
      const currentIndex = fontKeys.indexOf(currentFont);
      const nextIndex = (currentIndex + 1) % fontKeys.length;
      const nextFont = fontKeys[nextIndex];
      
      saveFont(nextFont);
      orca.notify('info', `${t('fontTheme.fontSwitchedTo')}${getFontDisplayName(nextFont)}`);
    },
    t('fontTheme.toggleFont')
  );

  // 注册字体选择器命令
  orca.commands.registerCommand(
    `${pluginName}.openFontSelector`,
    () => {
      showFontSelector();
    },
    t('fontTheme.openSelector')
  );





  console.log(`${pluginName} loaded.`);
}

export async function unload() {
  // 清理字体样式
  const fontStyle = document.getElementById('orca-font-theme-style');
  if (fontStyle) {
    fontStyle.remove();
  }

  // 取消注册命令
  orca.commands.unregisterCommand(`${pluginName}.toggleFont`);
  orca.commands.unregisterCommand(`${pluginName}.openFontSelector`);




}
