[**Orca API Documentation**](../README.md)

***

[Orca API Documentation](../modules.md) / Quick Start

# Introduction

The Orca Note plugin system is a powerful extension mechanism that allows developers to add new features, customize interface components, or integrate external services. Through plugins, you can:

- Add new block types and inline content renderers
- Register custom commands and shortcuts
- Extend the application user interface (such as adding toolbar buttons, menu items, etc.)
- Implement integration with external services
- Customize themes and styles
- Enhance existing features or add entirely new functionality

This guide will help you quickly get started with Orca Note plugin development, from setting up your environment to developing your first plugin.

<!-- Orca Note 插件系统是一个强大的扩展机制，允许开发者添加新功能、自定义界面组件或集成外部服务。通过插件，您可以：
- 添加新的块类型和内联内容渲染器
- 注册自定义命令和快捷键
- 扩展应用程序用户界面（如添加工具栏按钮、菜单项等）
- 实现与外部服务的集成
- 自定义主题和样式
- 增强现有功能或添加全新的功能

本指南将帮助您快速开始 Orca Note 插件开发，从环境设置到开发您的第一个插件。 -->

# Environment Requirements

To develop Orca Note plugins, you'll need the following environment and tools:

- **Node.js**: LTS version recommended
- **Editor**: Visual Studio Code recommended
- **Orca Note**: Latest version of Orca Note application installed

<!-- 开发 Orca Note 插件需要以下环境和工具：
- **Node.js**：推荐使用 LTS 版本
- **编辑器**：推荐使用 Visual Studio Code
- **Orca Note**：安装最新版本的 Orca Note 应用程序 -->

# File Structure

A typical Orca Note plugin project structure is as follows:

```
my-orca-plugin/
├── dist/                     # Compiled code
│   ├── index.js              # Compiled plugin file
├── src/
│   ├── main.ts               # Entry file, contains plugin registration and initialization logic
│   ├── orca.d.ts             # Plugin API type definition file
│   └── styles/               # CSS style files
├── icon.png                  # Plugin icon image
├── package.json              # Project configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.js            # Vite build configuration (if using Vite)
└── README.md                 # Plugin documentation
```

The plugin name is the name of its containing folder. To deploy a plugin, place the plugin folder containing the above files into the `orca/plugins` directory.

<!-- 典型的 Orca Note 插件项目结构如下所示。插件名称是其包含文件夹的名称。要部署插件，请将包含上述文件的插件文件夹放入 `orca/plugins` 目录中。 -->

## Minimum Required Files

The following files are the minimum required for a functional Orca Note plugin:

- `dist/index.js`: The compiled JavaScript file containing the plugin logic.
- `icon.png`: An icon representing the plugin in the Orca Note interface.

Ensure these files are present in your plugin folder before deployment.

<!-- 以下文件是功能性 Orca Note 插件的最低要求：
- `dist/index.js`：包含插件逻辑的编译后的 JavaScript 文件
- `icon.png`：在 Orca Note 界面中代表插件的图标

在部署之前，请确保这些文件存在于您的插件文件夹中。 -->

## Main File Descriptions

### package.json

```json
{
  "name": "my-orca-plugin",
  "version": "1.0.0",
  "description": "My Orca Note Plugin",
  "peerDependencies": {
    "react": "^18.2.0",
    "valtio": "^1.13.2"
  }
}
```

<!-- package.json 文件定义了插件的基本信息和依赖关系，包括插件名称、版本、描述以及 peer 依赖项。 -->

### Entry File (main.ts)

The entry file needs to expose the following functions:

- `load`: Called when the plugin is enabled
- `unload`: Called when the plugin is disabled

For example:

```typescript
export async function load(pluginName: string) {
  // Plugin enable logic
  console.log("Plugin enabled")
}

export async function unload() {
  // Plugin disable logic
  console.log("Plugin disabled")
}
```

<!-- 入口文件需要暴露以下函数：
- `load`：当插件启用时调用
- `unload`：当插件禁用时调用

入口文件是插件的核心，负责插件的初始化和清理工作。 -->

# Lifecycle

Orca Note plugins follow a simple and clear lifecycle pattern, mainly including the following phases:

<!-- Orca Note 插件遵循简单清晰的生命周期模式，主要包括以下阶段： -->

## Loading Phase

The plugin package is discovered and loaded into Orca Note but not yet enabled. Plugin metadata is parsed at this time.

<!-- 加载阶段：插件包被发现并加载到 Orca Note 中，但尚未启用。此时会解析插件元数据。 -->

## Enable Phase

When a user enables the plugin or the application automatically enables it at startup, the plugin's `load` function is called. This is the main entry point for plugin initialization, typically used to:

- Register commands, renderers, converters, etc.
- Set up event listeners
- Initialize plugin state
- Add UI elements (such as toolbar buttons, sidebars, etc.)

<!-- 启用阶段：当用户启用插件或应用程序在启动时自动启用它时，会调用插件的 `load` 函数。这是插件初始化的主要入口点，通常用于：
- 注册命令、渲染器、转换器等
- 设置事件监听器
- 初始化插件状态
- 添加 UI 元素（如工具栏按钮、侧边栏等） -->

```typescript
export async function load(pluginName: string) {
  // Register command
  orca.commands.registerCommand(
    `${pluginName}.helloWorld`,
    () => {
      orca.notify("info", "Hello from My Plugin!")
    },
    "Show welcome message",
  )

  // Register block renderer
  orca.renderers.registerBlock("myblock", false, MyCustomBlockRenderer)

  // Add toolbar button
  orca.toolbar.registerToolbarButton(`${pluginName}.toolbarButton`, {
    icon: "ti ti-star",
    tooltip: "My Tool Button",
    command: `${pluginName}.helloWorld`,
  })
}
```

<!-- 在启用阶段，插件会注册各种功能组件，如命令、渲染器和工具栏按钮。这些组件将在插件禁用时被清理。 -->

## Disable Phase

When a user disables the plugin or the application closes, the plugin's `unload` function is called. At this time, you should:

- Remove all registered commands, renderers, etc.
- Clean up event listeners
- Release resources
- Remove added UI elements

<!-- 禁用阶段：当用户禁用插件或应用程序关闭时，会调用插件的 `unload` 函数。此时，您应该：
- 移除所有注册的命令、渲染器等
- 清理事件监听器
- 释放资源
- 移除添加的 UI 元素 -->

```typescript
export async function unload() {
  // Unregister command
  orca.commands.unregisterCommand(`${pluginName}.helloWorld`)

  // Unregister block renderer
  orca.renderers.unregisterBlock("myblock")

  // Remove toolbar button
  orca.toolbar.unregisterToolbarButton(`${pluginName}.toolbarButton`)
}
```

<!-- 在禁用阶段，插件会清理所有注册的组件，确保不会留下任何残留的资源或功能。 -->

# Plugin Settings Management

Plugins can define their own settings and provide an UI interface for user configuration:

<!-- 插件可以定义自己的设置并为用户配置提供 UI 界面： -->

```typescript
// Define settings schema
const settingsSchema = {
  enableFeatureX: {
    label: "Enable Feature X",
    type: "boolean",
    defaultValue: true,
  },
  userName: {
    label: "Username",
    type: "string",
    defaultValue: "",
  },
}

export async function load(pluginName: string) {
  // Register settings schema
  await orca.plugins.setSettingsSchema(pluginName, settingsSchema)

  // Get settings value
  const settings = orca.state.plugins[pluginName]?.settings
  if (settings?.enableFeatureX) {
    // Execute related logic
  }
}
```

<!-- 插件设置管理允许插件定义配置选项，用户可以通过界面进行配置。设置模式定义了配置项的类型、标签和默认值。 -->

# Model Overview

The Orca Note plugin API provides rich functional interfaces. Here's an overview of the most commonly used models and APIs:

<!-- Orca Note 插件 API 提供了丰富的功能接口。以下是最常用模型和 API 的概述： -->

## Core Objects

### orca

The global object `orca` is the main entry point for the plugin system, providing access to all plugin functionality.

<!-- 全局对象 `orca` 是插件系统的主要入口点，提供对所有插件功能的访问。 -->

### state

`orca.state` contains the current state of the application, including current panels, block data, settings, etc.

<!-- `orca.state` 包含应用程序的当前状态，包括当前面板、块数据、设置等。 -->

```typescript
// Example: Get current language
const currentLocale = orca.state.locale

// Example: Get loaded block data
const currentBlock = orca.state.blocks[blockId]

// Example: Get application settings
const themeMode = orca.state.themeMode // "light" or "dark"
```

<!-- 状态对象提供了对应用程序当前状态的访问，包括语言设置、块数据和主题模式等。 -->

Orca Note uses the `valtio` library to manage application state (mounted to `window.Valtio`). You can listen to state changes using the `subscribe` function provided by `valtio` or other supported mechanisms.

<!-- Orca Note 使用 `valtio` 库来管理应用程序状态（挂载到 `window.Valtio`）。您可以使用 `valtio` 提供的 `subscribe` 函数或其他支持的机制来监听状态变化。 -->

## Main API Categories

### Command System

The command system is the most basic extension point for plugins, allowing registration of executable function units:

<!-- 命令系统是插件最基本的扩展点，允许注册可执行的函数单元： -->

```typescript
// Register normal command
orca.commands.registerCommand(
  "myplugin.command", // Command ID
  () => {
    /* Command logic */
  }, // Command function
  "Command Display Name", // Command label
)

// Register editor command (supports undo)
orca.commands.registerEditorCommand(
  "myplugin.editorCommand", // Command ID
  doFn, // Execute function
  undoFn, // Undo function
  { label: "Editor Command" }, // Configuration
)

// Execute command
await orca.commands.invokeCommand("core.toggleThemeMode")

// Execute editor command
await orca.commands.invokeEditorCommand("myplugin.editorCommand", cursor)
```

<!-- 命令系统允许插件注册可执行的命令，包括普通命令和编辑器命令。编辑器命令支持撤销功能。 -->

### Render System

Allows registration of custom block types and inline content renderers:

<!-- 允许注册自定义块类型和内联内容渲染器： -->

```typescript
// Register block renderer
orca.renderers.registerBlock(
  "myplugin.customBlock", // Block type
  true, // Is editable
  CustomBlockRenderer, // React component
  ["src"], // Fields that use assets (optional)
)

// Register inline content renderer
orca.renderers.registerInline(
  "myplugin.customInline", // Inline type
  true, // Is editable
  CustomInlineRenderer, // React component
)
```

<!-- 渲染系统允许插件注册自定义的块和内联内容渲染器，这些渲染器是 React 组件。 -->

Orca Note's UI is based on React 18 (mounted to `window.React`). If you need to develop custom UI components, you can use the globally exposed React directly without importing the React library separately.

<!-- Orca Note 的 UI 基于 React 18（挂载到 `window.React`）。如果您需要开发自定义 UI 组件，可以直接使用全局暴露的 React，而无需单独导入 React 库。 -->

### Converter System

Responsible for converting block content between different formats:

<!-- 负责在不同格式之间转换块内容： -->

```typescript
// Register block converter
orca.converters.registerBlock(
  "html", // Target format
  "myplugin.customBlock", // Block type
  (block, repr) => {
    // Convert function
    return `<div>${block.text}</div>`
  },
)

// Register inline content converter
orca.converters.registerInline(
  "plain", // Target format
  "myplugin.customInline", // Inline type
  (content) => {
    // Convert function
    return content.v.toString()
  },
)
```

<!-- 转换器系统负责将块内容在不同格式之间进行转换，如 HTML、纯文本等。 -->

### UI Extensions

Allows adding custom UI elements:

<!-- 允许添加自定义 UI 元素： -->

```typescript
// Add toolbar button
orca.toolbar.registerToolbarButton("myplugin.toolbarButton", {
  icon: "ti ti-star",
  tooltip: "My Tool Button",
  command: "myplugin.helloWorld",
})

// Add header bar button
orca.headbar.registerHeadbarButton("myplugin.headbarButton", () => (
  <MyHeadbarButtonComponent />
))
```

<!-- UI 扩展允许插件添加自定义的 UI 元素，如工具栏按钮和标题栏按钮。 -->

### Data Storage

Plugins can persistently store data:

<!-- 插件可以持久化存储数据： -->

```typescript
// Set plugin data
await orca.plugins.setData("myplugin", "key", "value")

// Get plugin data
const value = await orca.plugins.getData("myplugin", "key")

// Remove plugin data
await orca.plugins.removeData("myplugin", "key")
```

<!-- 数据存储允许插件持久化存储数据，这些数据在应用程序重启后仍然可用。 -->

### Notification System

Display notification messages:

<!-- 显示通知消息： -->

```typescript
orca.notify(
  "info", // Type: "info" | "success" | "warn" | "error"
  "This is a notification message", // Message content
  {
    // Optional configuration
    title: "Notification Title",
    action: () => {
      /* Execute when notification is clicked */
    },
  },
)
```

<!-- 通知系统允许插件显示各种类型的通知消息，包括信息、成功、警告和错误类型。 -->

## Main Data Models

### Block

Blocks are the basic structural units of Orca Note:

<!-- 块是 Orca Note 的基本结构单元： -->

```typescript
interface Block {
  id: DbId // Block ID
  content?: ContentFragment[] // Block content
  text?: string // Plain text content
  created: Date // Creation time
  modified: Date // Modification time
  parent?: DbId // Parent block ID
  left?: DbId // Left block ID
  children: DbId[] // Child block ID list
  aliases: string[] // Alias list
  properties: BlockProperty[] // Property list
  refs: BlockRef[] // Reference list
  backRefs: BlockRef[] // Back reference list
}
```

<!-- 块对象包含了块的所有信息，包括 ID、内容、创建时间、修改时间、父子关系等。 -->

### Panel

Panels are the main organizational units of the UI:

<!-- 面板是 UI 的主要组织单元： -->

```typescript
interface ViewPanel {
  id: string // Panel ID
  view: PanelView // View type ("journal" | "block")
  viewArgs: Record<string, any> // View parameters
  viewState: Record<string, any> // View state
  width?: number // Width
  height?: number // Height
  locked?: boolean // Is locked
  wide?: boolean // Is wide screen
}
```

<!-- 面板对象定义了 UI 面板的属性，包括 ID、视图类型、参数、状态等。 -->

# Conventions

When developing plugins for Orca Note, please adhere to the following conventions to ensure compatibility and maintainability:

<!-- 在开发 Orca Note 插件时，请遵循以下约定以确保兼容性和可维护性： -->

1. **Avoid Reserved Names**: Any name starting with an underscore (`_`) is reserved for system use. Plugin developers should not use such names for commands, renderers, settings, or any other identifiers.

2. **Use Unique Prefixes**: To avoid conflicts with other plugins, always include a unique prefix related to your plugin in the names of commands, renderers, and other identifiers. For example, if your plugin is named `myplugin`, use a prefix like `myplugin.` for all identifiers (e.g., `myplugin.commandName`, `myplugin.rendererName`).

3. **Follow Naming Standards**: Use descriptive and consistent naming conventions for all identifiers. This improves readability and helps other developers understand your code.

4. **Respect System Behavior**: Do not override or interfere with system-level commands, renderers, or UI elements unless explicitly allowed by the API.

<!-- 1. **避免保留名称**：任何以下划线（`_`）开头的名称都保留给系统使用。插件开发者不应将此类名称用于命令、渲染器、设置或任何其他标识符。

2. **使用唯一前缀**：为避免与其他插件冲突，始终在命令、渲染器和其他标识符的名称中包含与您的插件相关的唯一前缀。例如，如果您的插件名为 `myplugin`，请为所有标识符使用 `myplugin.` 前缀（例如 `myplugin.commandName`、`myplugin.rendererName`）。

3. **遵循命名标准**：为所有标识符使用描述性和一致的命名约定。这提高了可读性并帮助其他开发者理解您的代码。

4. **尊重系统行为**：除非 API 明确允许，否则不要覆盖或干扰系统级命令、渲染器或 UI 元素。 -->

By following these conventions, you can ensure that your plugin integrates seamlessly with Orca Note and coexists harmoniously with other plugins.

<!-- 通过遵循这些约定，您可以确保您的插件与 Orca Note 无缝集成，并与其他插件和谐共存。 -->

# Project Template

To quickly start development, you can use the following project template:

- [Plugin Template](https://github.com/sethyuan/orca-plugin-template) - Plugin template with documentation and l10n set up.

<!-- 要快速开始开发，您可以使用以下项目模板：
- [插件模板](https://github.com/sethyuan/orca-plugin-template) - 包含文档和本地化设置的插件模板。 -->

# Examples

Here are several common plugin development examples to help you quickly get started with Orca Note plugin development:

<!-- 以下是几个常见的插件开发示例，帮助您快速开始 Orca Note 插件开发： -->

## 1. Simple Command Plugin

This example shows how to create a simple command that inserts a new block with the current time after the current block:

<!-- 此示例展示了如何创建一个简单的命令，在当前块后插入一个包含当前时间的新块： -->

```tsx
// src/main.ts
export async function load(pluginName: string) {
  // Register command
  orca.commands.registerEditorCommand(
    "myplugin.insertTimeBlock",
    async ([_panelId, _rootBlockId, cursor]) => {
      if (!cursor || !cursor.anchor) return null

      const currentBlock = orca.state.blocks[cursor.anchor.blockId]
      if (!currentBlock) return null

      // Get current time
      const now = new Date()
      const timeStr = now.toLocaleTimeString()

      // Create new block content
      const content = [{ t: "t", v: `Current time is: ${timeStr}` }]

      // Call editor command to insert new block
      await orca.commands.invokeEditorCommand(
        "core.editor.insertBlock",
        null,
        currentBlock,
        "after",
        content,
      )

      return null
    },
    () => {},
    { label: "Insert Time Block" },
  )

  // Register slash command
  orca.slashCommands.registerSlashCommand("myplugin.insertTimeBlock", {
    icon: "ti ti-clock",
    group: "Utilities",
    title: "Insert Time Block",
    command: "myplugin.insertTimeBlock",
  })
}

export async function unload() {
  // Unregister command
  orca.commands.unregisterCommand("myplugin.insertTimeBlock")

  // Remove slash command
  orca.slashCommands.unregisterSlashCommand("myplugin.insertTimeBlock")
}
```

<!-- 这个示例展示了如何创建一个简单的命令插件，该插件可以插入包含当前时间的块，并通过斜杠命令触发。 -->

## 2. Custom Block Renderer

This example shows how to create a custom map block renderer:

<!-- 此示例展示了如何创建自定义地图块渲染器： -->

```tsx
// src/MapBlock.tsx
import type { Block, DbId } from "./orca.d.ts"

const { useRef, useMemo } = window.React
const { useSnapshot } = window.Valtio
const { BlockShell, BlockChildren } = orca.components

type Props = {
  panelId: string
  blockId: DbId
  rndId: string
  blockLevel: number
  indentLevel: number
  mirrorId?: DbId
  withBreadcrumb?: boolean
  initiallyCollapsed?: boolean
  renderingMode?: "normal" | "simple" | "simple-children" | "readonly"
  keyword: string // Prop to receive from _repr
}

export default function MapBlockRenderer({
  panelId,
  blockId,
  rndId,
  blockLevel,
  indentLevel,
  mirrorId,
  withBreadcrumb,
  initiallyCollapsed,
  renderingMode,
  keyword, // Received from _repr
}: Props) {
  const { blocks } = useSnapshot(orca.state)
  const block = blocks[mirrorId ?? blockId]

  const childrenBlocks = useMemo(
    () => (
      <BlockChildren
        block={block as Block}
        panelId={panelId}
        blockLevel={blockLevel}
        indentLevel={indentLevel}
        renderingMode={renderingMode}
      />
    ),
    [block?.children],
  )

  return (
    <BlockShell
      panelId={panelId}
      blockId={blockId}
      rndId={rndId}
      mirrorId={mirrorId}
      blockLevel={blockLevel}
      indentLevel={indentLevel}
      withBreadcrumb={withBreadcrumb}
      initiallyCollapsed={initiallyCollapsed}
      renderingMode={renderingMode}
      reprClassName="myplugin-repr-map" // Custom class for the block shell
      contentClassName="myplugin-repr-map-content" // Custom class for the content area
      contentAttrs={{ contentEditable: false }} // Prevent editing the iframe itself
      contentJsx={
        <iframe
          src={`https://ditu.amap.com/search?query=${encodeURIComponent(
            keyword,
          )}`}
          width="100%" // Example width
          height="400" // Example height
          style={{ border: 0 }} // Basic styling
          allow="geolocation" // Permissions for the iframe
        />
      }
      childrenJsx={childrenBlocks}
    />
  )
}

// src/main.ts
import MapBlockRenderer from "./MapBlock"

export async function load(pluginName: string) {
  // Register block renderer
  orca.renderers.registerBlock("myplugin.map", false, MapBlockRenderer)

  // Register block converter
  orca.converters.registerBlock("plain", "myplugin.map", (block, repr) => {
    return `Map of: ${repr.keyword}`
  })

  // Register editor command to insert the map block
  orca.commands.registerEditorCommand(
    "myplugin.insertMapBlockCommand",
    async ([_panelId, _rootBlockId, cursor]) => {
      if (!cursor || !cursor.anchor) return null
      const currentBlock = orca.state.blocks[cursor.anchor.blockId]
      if (!currentBlock) return null

      // Define the representation for the new map block
      const repr = { type: "myplugin.map", keyword: "Beijing" }

      // Insert the new map block after the current block using core.editor.insertBlock
      const newBlockId = await orca.commands.invokeEditorCommand(
        "core.editor.insertBlock",
        null, // No initial content needed
        currentBlock, // Reference block
        "after", // Position
        null, // No content fragments
        repr, // Representation object
      )

      return null // Indicate success
    },
    () => {},
    { label: "Insert Map Block" },
  )

  // Register slash command to trigger the map block insertion
  orca.slashCommands.registerSlashCommand("myplugin.insertMapBlock", {
    icon: "ti ti-map-pin", // Icon for the slash command
    group: "Insert", // Group in the slash command menu
    title: "Insert Map Block", // Title displayed in the menu
    command: "myplugin.insertMapBlockCommand", // The editor command to execute
  })
}

export async function unload() {
  // Unregister block renderer
  orca.renderers.unregisterBlock("myplugin.map")

  // Unregister block converter
  orca.converters.unregisterBlock("plain", "myplugin.map")

  // Unregister the editor command
  orca.commands.unregisterCommand("myplugin.insertMapBlockCommand")

  // Unregister the slash command
  orca.slashCommands.unregisterSlashCommand("myplugin.insertMapBlock")
}
```

<!-- 这个示例展示了如何创建一个自定义的地图块渲染器，该渲染器可以显示高德地图，并支持通过斜杠命令插入地图块。 -->

## 3. Theme Plugin

This example shows how to create a custom theme:

<!-- 此示例展示了如何创建自定义主题： -->

```typescript
// public/sand-yellow.css
@media (prefers-color-scheme: dark) {
  :root {
    /* Sand Yellow Dark Theme */
    --orca-color-bg-1: #3a3226; /* Dark sand/brown */
    --orca-color-bg-2: #4f4639; /* Slightly lighter sand/brown */
    --orca-color-text-1: #f0e6d6; /* Light sand/beige */
    --orca-color-text-2: #bfae90; /* Muted sand/light brown */
    --orca-color-primary-5: #d4ac0d; /* Golden yellow */
    --orca-color-dangerous-5: #e74c3c; /* Standard danger red, or adjust if needed */
    --orca-color-border: #6b5f4e; /* Mid-tone sand/brown */
    --orca-color-selection: oklch(from var(--orca-color-primary-5) l c h / 50%); /* Selection based on primary */
  }
}

// src/index.ts
export async function load(pluginName: string) {
  // Register custom theme
  orca.themes.register(
    "myplugin",           // Plugin name
    "sand-yellow",          // Theme name
    "sand-yellow.css"  // Theme CSS file path
  )
}

export async function unload() {
  // Unregister custom theme
  orca.themes.unregister("sand-yellow")
}
```

<!-- 这个示例展示了如何创建一个自定义主题插件，该插件定义了一个沙黄色主题，并在插件加载时注册该主题。 -->
