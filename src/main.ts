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

// 字体名称映射表（中文名称到CSS字体名称）
const FONT_NAME_MAPPING: Record<string, string> = {
  "霞梧文楷": "LXGW Wenkai",
  "霞鹜文楷": "LXGW Wenkai",
  "文楷": "LXGW Wenkai",
  "LXGW Wenkai": "LXGW Wenkai",
  "LXGW WenKai": "LXGW Wenkai",
  "仓耳今楷": "TsangerJinKai03-W04",
  "今楷": "TsangerJinKai03-W04",
  "TsangerJinKai03-W04": "TsangerJinKai03-W04"
};

// 获取字体显示名称
function getFontDisplayName(fontKey: string): string {
  return t(`fontTheme.presetFonts.${fontKey}`) || fontKey;
}

// 保存自定义字体历史记录
function saveCustomFontHistory(fontName: string) {
  const history = getCustomFontHistory();
  // 移除已存在的相同字体
  const filteredHistory = history.filter(font => font !== fontName);
  // 将新字体添加到开头
  const newHistory = [fontName, ...filteredHistory].slice(0, 10); // 最多保存10个
  localStorage.setItem('orca-custom-font-history', JSON.stringify(newHistory));
}

  // 获取自定义字体历史记录
  function getCustomFontHistory(): string[] {
    try {
      const history = localStorage.getItem('orca-custom-font-history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  // 清除自定义字体历史记录
  function clearCustomFontHistory() {
    localStorage.removeItem('orca-custom-font-history');
  }

// 应用字体到页面
function applyFont(fontFamily: string, titleFontFamily?: string) {
  const style = document.createElement('style');
  style.id = 'orca-font-theme-style';
  
  // 处理字体名称，确保包含空格的字体名称被正确引用
  const processedFontFamily = fontFamily.includes(' ') && !fontFamily.startsWith("'") && !fontFamily.startsWith('"') 
    ? `'${fontFamily}'` 
    : fontFamily;
  
  const processedTitleFontFamily = titleFontFamily 
    ? (titleFontFamily.includes(' ') && !titleFontFamily.startsWith("'") && !titleFontFamily.startsWith('"') 
        ? `'${titleFontFamily}'` 
        : titleFontFamily)
    : processedFontFamily;
  
  style.textContent = `
    :root {
      --orca-fontfamily-fallback: ${processedFontFamily} !important;
    }
    
    /* 标题字体设置 */
    h1, h2, h3, h4, h5, h6,
    .orca-block-title,
    .orca-block-title *,
    [data-block-type="heading"] {
      font-family: ${processedTitleFontFamily} !important;
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

// 获取当前标题字体设置
function getCurrentTitleFont(): string {
  const savedTitleFont = localStorage.getItem('orca-title-font-theme');
  return savedTitleFont || getCurrentFont();
}

// 保存字体设置
function saveFont(fontKey: string, titleFontKey?: string) {
  localStorage.setItem('orca-font-theme', fontKey);
  if (titleFontKey) {
    localStorage.setItem('orca-title-font-theme', titleFontKey);
  }
  
  // 获取标题字体
  const savedTitleFont = titleFontKey || localStorage.getItem('orca-title-font-theme') || fontKey;
  
  // 检查是否是预设字体
  if (PRESET_FONTS[fontKey as keyof typeof PRESET_FONTS]) {
    const fontFamily = PRESET_FONTS[fontKey as keyof typeof PRESET_FONTS].family;
    const titleFontFamily = PRESET_FONTS[savedTitleFont as keyof typeof PRESET_FONTS]?.family || 
                           FONT_NAME_MAPPING[savedTitleFont] || savedTitleFont;
    applyFont(fontFamily, titleFontFamily);
  } else {
    // 检查字体名称映射
    const mappedFont = FONT_NAME_MAPPING[fontKey] || fontKey;
    const titleFontFamily = PRESET_FONTS[savedTitleFont as keyof typeof PRESET_FONTS]?.family || 
                           FONT_NAME_MAPPING[savedTitleFont] || savedTitleFont;
    applyFont(mappedFont, titleFontFamily);
  }
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
  const currentTitleFont = getCurrentTitleFont();
  
  content.innerHTML = `
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: bold; color: var(--orca-color-text-1);">
      ${t('fontTheme.title')}
    </h3>
    
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--orca-color-text-1);">
        ${t('fontTheme.bodyFont')}:
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
        ${t('fontTheme.titleFont')}:
      </label>
      <select id="title-font-select" style="
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--orca-color-border);
        border-radius: 4px;
        font-size: 14px;
        background-color: var(--orca-color-bg-1);
        color: var(--orca-color-text-1);
      ">
        ${Object.entries(PRESET_FONTS).map(([key, font]) => 
          `<option value="${key}" ${key === currentTitleFont ? 'selected' : ''}>${getFontDisplayName(key)}</option>`
        ).join('')}
      </select>
    </div>
    
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--orca-color-text-1);">
        ${t('fontTheme.customBodyFont')}:
      </label>
      <div style="display: flex; gap: 8px; position: relative;">
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
        <div
          id="custom-font-suggestions"
          style="
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--orca-color-bg-1);
            border: 1px solid var(--orca-color-border);
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 10001;
            display: none;
            margin-top: 4px;
          "
        ></div>
      </div>
    </div>
    
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--orca-color-text-1);">
        ${t('fontTheme.customTitleFont')}:
      </label>
      <div style="display: flex; gap: 8px; position: relative;">
        <input
          type="text"
          id="custom-title-font-input"
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
          id="apply-custom-title-font"
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
        <div
          id="custom-title-font-suggestions"
          style="
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--orca-color-bg-1);
            border: 1px solid var(--orca-color-border);
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 10001;
            display: none;
            margin-top: 4px;
          "
        ></div>
      </div>
    </div>
    
    <div style="font-size: 12px; color: var(--orca-color-text-2); margin-bottom: 16px;">
      ${t('tip')}
    </div>
    
    <div style="font-size: 11px; color: var(--orca-color-text-3); margin-bottom: 16px; padding: 8px; background: var(--orca-color-bg-2); border-radius: 4px;">
      ${t('fontTheme.commonFonts')}
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
  const titleFontSelect = content.querySelector('#title-font-select') as HTMLSelectElement;
  const customFontInput = content.querySelector('#custom-font-input') as HTMLInputElement;
  const customTitleFontInput = content.querySelector('#custom-title-font-input') as HTMLInputElement;
  const applyCustomFontBtn = content.querySelector('#apply-custom-font') as HTMLButtonElement;
  const applyCustomTitleFontBtn = content.querySelector('#apply-custom-title-font') as HTMLButtonElement;
  const closeBtn = content.querySelector('#close-dialog') as HTMLButtonElement;
  const suggestionsContainer = content.querySelector('#custom-font-suggestions') as HTMLDivElement;
  const titleSuggestionsContainer = content.querySelector('#custom-title-font-suggestions') as HTMLDivElement;

  // 显示候选菜单
  function showSuggestions(container: HTMLDivElement, isTitleFont: boolean = false) {
    const history = getCustomFontHistory();
    if (history.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = `
      <div style="
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 500;
        color: var(--orca-color-text-2);
        background: var(--orca-color-bg-2);
        border-bottom: 1px solid var(--orca-color-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <span>${t('fontTheme.recentFonts')}</span>
        <button
          class="clear-history-btn"
          style="
            background: none;
            border: none;
            color: var(--orca-color-text-3);
            cursor: pointer;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 3px;
            transition: background-color 0.2s;
          "
          title="清除历史记录"
          onmouseover="this.style.backgroundColor='var(--orca-color-bg-3)'"
          onmouseout="this.style.backgroundColor='transparent'"
        >
          ✕
        </button>
      </div>
      ${history.map(font => `
        <div
          class="suggestion-item"
          style="
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            color: var(--orca-color-text-1);
            border-bottom: 1px solid var(--orca-color-border);
            transition: background-color 0.2s;
          "
          data-font="${font}"
          onmouseover="this.style.backgroundColor='var(--orca-color-bg-2)'"
          onmouseout="this.style.backgroundColor='var(--orca-color-bg-1)'"
        >
          ${font}
        </div>
      `).join('')}
    `;

    container.style.display = 'block';
  }

  // 隐藏候选菜单
  function hideSuggestions() {
    suggestionsContainer.style.display = 'none';
  }

  // 选择候选字体
  function selectSuggestion(fontName: string, isTitleFont: boolean = false) {
    if (isTitleFont) {
      customTitleFontInput.value = fontName;
    } else {
      customFontInput.value = fontName;
    }
    hideSuggestions();
  }

  fontSelect.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    const fontKey = target.value;
    saveFont(fontKey);
    orca.notify('success', `${t('fontTheme.bodyFontChanged')}${getFontDisplayName(fontKey)}`);
  });

  titleFontSelect.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    const fontKey = target.value;
    saveFont(getCurrentFont(), fontKey);
    orca.notify('success', `${t('fontTheme.titleFontChanged')}${getFontDisplayName(fontKey)}`);
  });

  // 自定义字体输入框事件
  customFontInput.addEventListener('focus', () => {
    showSuggestions(suggestionsContainer);
  });

  customFontInput.addEventListener('blur', () => {
    // 延迟隐藏，以便点击候选项
    setTimeout(() => {
      hideSuggestions();
    }, 150);
  });

  // 自定义标题字体输入框事件
  customTitleFontInput.addEventListener('focus', () => {
    showSuggestions(titleSuggestionsContainer, true);
  });

  customTitleFontInput.addEventListener('blur', () => {
    // 延迟隐藏，以便点击候选项
    setTimeout(() => {
      hideSuggestions();
    }, 150);
  });

  // 候选菜单点击事件
  suggestionsContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('suggestion-item')) {
      const fontName = target.getAttribute('data-font');
      if (fontName) {
        selectSuggestion(fontName);
      }
    } else if (target.classList.contains('clear-history-btn')) {
      clearCustomFontHistory();
      hideSuggestions();
      orca.notify('info', t('fontTheme.historyCleared'));
    }
  });

  titleSuggestionsContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('suggestion-item')) {
      const fontName = target.getAttribute('data-font');
      if (fontName) {
        selectSuggestion(fontName, true);
      }
    } else if (target.classList.contains('clear-history-btn')) {
      clearCustomFontHistory();
      hideSuggestions();
      orca.notify('info', t('fontTheme.historyCleared'));
    }
  });

  applyCustomFontBtn.addEventListener('click', () => {
    const customFont = customFontInput.value.trim();
    if (customFont) {
      saveFont(customFont);
      saveCustomFontHistory(customFont); // 保存到历史记录
      orca.notify('success', `${t('fontTheme.customBodyFontApplied')}${customFont}`);
      customFontInput.value = '';
      hideSuggestions();
    }
  });

  applyCustomTitleFontBtn.addEventListener('click', () => {
    const customTitleFont = customTitleFontInput.value.trim();
    if (customTitleFont) {
      saveFont(getCurrentFont(), customTitleFont);
      saveCustomFontHistory(customTitleFont); // 保存到历史记录
      orca.notify('success', `${t('fontTheme.customTitleFontApplied')}${customTitleFont}`);
      customTitleFontInput.value = '';
      hideSuggestions();
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
  saveFont(savedFont); // 使用 saveFont 函数来确保字体映射正确应用

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
