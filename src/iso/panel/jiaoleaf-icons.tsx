/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SJTU OVERLEAF AI ICONS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * SVG icon library for the JiaoLeaf AI panel.
 * Icons are intentionally line-based to sit quietly beside Overleaf controls.
 *
 * Usage:
 *   import { SettingsIcon, SendIcon } from './jiaoleaf-icons';
 *   <SettingsIcon class="jiaoleaf-toolbar-icon" />
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { h } from 'preact';

interface IconProps {
  class?: string;
  style?: any;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT MARK
   ═══════════════════════════════════════════════════════════════════════════ */

export const ProductMarkIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Compact academic assistant mark. */}
    <defs>
      <linearGradient id="jiaoleaf-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4dd4a4" />
        <stop offset="100%" stop-color="#39b98a" />
      </linearGradient>
    </defs>

    {/* Main triangle */}
    <path
      d="M16 4L28 28H4L16 4Z"
      fill="url(#jiaoleaf-logo-gradient)"
      stroke="#2a9970"
      stroke-width="1.5"
      stroke-linejoin="round"
    />

    {/* Horizontal bar */}
    <rect
      x="10"
      y="18"
      width="12"
      height="2.5"
      rx="1.25"
      fill="#0a0e0c"
    />

    {/* Accent dot */}
    <circle cx="16" cy="10" r="1.5" fill="#4dd4a4" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   THEME ICONS (LIGHT / DARK TOGGLE)
   ═══════════════════════════════════════════════════════════════════════════ */

export const SunIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <circle cx="10" cy="10" r="4.5" fill="currentColor" stroke="none" />
    <path d="M10 1.5v2.5M10 16v2.5M1.5 10h2.5M16 10h2.5M4 4l1.5 1.5M14.5 14.5l1.5 1.5M4 16l1.5-1.5M14.5 5.5l1.5-1.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

export const MoonIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    stroke="none"
  >
    <path d="M15.5 13.5A7.5 7.5 0 116.5 2.5a6.5 6.5 0 009 11z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   TOOLBAR ICONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const SettingsIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <circle cx="10" cy="10" r="2.4" stroke-width="1.6" />
    <path
      d="M10 2.5v2M10 15.5v2M16.5 10h-2M5.5 10h-2M14.6 5.4l-1.4 1.4M6.8 13.2l-1.4 1.4M14.6 14.6l-1.4-1.4M6.8 6.8L5.4 5.4"
      stroke-width="1.6"
      stroke-linecap="round"
    />
  </svg>
);

export const NewChatIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10 8v4M8 10h4"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const ConversationsIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M3 6a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H7l-4 3V6z"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7 8h6M7 11h4"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const AttachIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M16.5 10.5v5a3 3 0 01-3 3h-7a3 3 0 01-3-3v-10a2 2 0 012-2h8a2 2 0 012 2v9a1 1 0 01-1 1h-6a1 1 0 01-1-1V7"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const CollapseIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M13 7l-3 3-3-3M7 13l3-3 3 3"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION ICONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const SendIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M18 2L9 11M18 2l-5 16-4-7-7-4 16-5z"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const CopyIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <rect
      x="6.5"
      y="3.5"
      width="10"
      height="13"
      rx="1.5"
      stroke-width="1.5"
    />
    <path
      d="M3.5 6.5h2v10a2 2 0 002 2h7v2a2 2 0 01-2 2h-7a2 2 0 01-2-2v-12a2 2 0 012-2z"
      stroke-width="1.5"
    />
  </svg>
);

export const CheckIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M16 6L8.5 13.5 4 9"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const ExpandIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M13 7l-3 3-3-3"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const CloseIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M14 6L6 14M6 6l8 8"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const ScrollDownIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M10 4v12M10 16l-4-4M10 16l4-4"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS ICONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const ThinkingIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
    <circle cx="7" cy="9" r="1.5" fill="currentColor" />
    <circle cx="13" cy="9" r="1.5" fill="currentColor" />
    <path
      d="M7 13c.5 1 1.5 2 3 2s2.5-1 3-2"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
);

export const ToolIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M15.5 3.5l1 1M11 8l2.5 2.5M3 17l3-3M7.5 12.5l-2-2a2 2 0 010-2.83l3.83-3.83a2 2 0 012.83 0l2 2a2 2 0 010 2.83l-3.83 3.83a2 2 0 01-2.83 0z"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const SpinnerIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={{ ...style, animation: 'spin 1s linear infinite' }}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="10"
      cy="10"
      r="7"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-dasharray="32"
      stroke-dashoffset="8"
      opacity="0.25"
    />
    <circle
      cx="10"
      cy="10"
      r="7"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-dasharray="8 32"
    />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   PROVIDER ICONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const ClaudeIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.1" />
    <path
      d="M10 6v8M6 10h8"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
);

export const CodexIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M7 7l-3 3 3 3M13 7l3 3-3 3M11 5l-2 10"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   TOOLBAR ACTION ICONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const RewriteIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path d="M4 14.5h7M4 10.5h10M4 6.5h6" stroke-width="1.6" stroke-linecap="round" />
    <path d="M13.5 5.5l2 2-5.5 5.5-2.5.5.5-2.5 5.5-5.5z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

export const AttachFilesIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path d="M6.5 10.4l4.8-4.8a3 3 0 114.2 4.2l-6 6a4 4 0 01-5.7-5.7l5.2-5.2" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9 13l5.1-5.1" stroke-width="1.6" stroke-linecap="round" />
  </svg>
);

export const NewChatIconAlt = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path d="M4.5 4.5h11v8h-4.2L7.5 15.5v-3h-3z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 6.8v3.4M8.3 8.5h3.4" stroke-width="1.6" stroke-linecap="round" />
  </svg>
);

export const CloseSessionIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path d="M5.5 4.5h7a2 2 0 012 2v7a2 2 0 01-2 2h-7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9.5 7.5L7 10l2.5 2.5M7 10h9" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

export const ClearChatIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path d="M5.5 6.5h9M8 6.5v-2h4v2M7 8.8v6.7h6V8.8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9 10.5v3M11 10.5v3" stroke-width="1.6" stroke-linecap="round" />
  </svg>
);

export const CheckReferencesIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path d="M5 3.5h7.5l2.5 2.5v10.5H5z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12.5 3.5V6H15M7.5 8h5M7.5 11h3" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M11.5 14l1.4 1.4 2.9-3.2" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

export const NotationCheckIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path d="M8.5 5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7z" stroke-width="1.6" />
    <path d="M11.7 11.7L15.5 15.5" stroke-width="1.6" stroke-linecap="round" />
    <path d="M7.1 7.1h3.1L8 9l2.2 1.3H7.1" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

export const NotationDraftIcon = ({ class: className, style }: IconProps) => (
  <svg
    class={className}
    style={style}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path
      d="M4 3.5h7.5a2 2 0 012 2V14a2 2 0 01-2 2H4.5a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5z"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.5 7.5h4.5M6.5 10h3"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M12.5 13.5l3-3 1.5 1.5-3 3H12.5v-1.5z"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   EXPORT ALL
   ═══════════════════════════════════════════════════════════════════════════ */

export const Icons = {
  ProductMarkIcon,
  SettingsIcon,
  NewChatIcon,
  ConversationsIcon,
  AttachIcon,
  CollapseIcon,
  SendIcon,
  CopyIcon,
  CheckIcon,
  ExpandIcon,
  CloseIcon,
  ScrollDownIcon,
  ThinkingIcon,
  ToolIcon,
  SpinnerIcon,
  ClaudeIcon,
  CodexIcon,
  // Toolbar actions
  RewriteIcon,
  CheckReferencesIcon,
  NotationCheckIcon,
  NotationDraftIcon,
  AttachFilesIcon,
  NewChatIconAlt,
  CloseSessionIcon,
  ClearChatIcon,
  SunIcon,
  MoonIcon,
};

export default Icons;
