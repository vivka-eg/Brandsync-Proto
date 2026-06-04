// Some corpus/Strapi-authored components use emoji as stand-in icons. Swap
// them for Phosphor web-font glyphs so nav rows look native. Shared by the
// components drawer (preview render) and the kit assembly (so the stored kit
// html ships Phosphor markup, not emoji). Each entry handles both bare and
// VS16-suffixed (️) forms.
export const EMOJI_MAP = [
  ['🏠', 'house'],       ['🏡', 'house'],
  ['📦', 'package'],
  ['🎨', 'palette'],
  ['📖', 'book-open'],   ['📚', 'books'],
  ['❓', 'question'],     ['❔', 'question'],
  ['⚙️', 'gear'],         ['⚙', 'gear'],
  ['🔔', 'bell'],
  ['⭐', 'star'],         ['🌟', 'star'],
  ['✅', 'check-circle'], ['☑️', 'check-square'],
  ['❌', 'x'],            ['✖️', 'x'],
  ['📁', 'folder'],       ['📂', 'folder-open'],
  ['📄', 'file'],         ['📝', 'note-pencil'],
  ['🔍', 'magnifying-glass'],
  ['🔧', 'wrench'],
  ['👤', 'user'],         ['👥', 'users'],
  ['📊', 'chart-bar'],    ['📈', 'chart-line-up'], ['📉', 'chart-line-down'],
  ['💬', 'chat'],
  ['📧', 'envelope'],     ['✉️', 'envelope'],
  ['🔒', 'lock'],         ['🔓', 'lock-open'],
  ['🔑', 'key'],
  ['🛒', 'shopping-cart'],
  ['🏷️', 'tag'],
  ['📅', 'calendar'],     ['📆', 'calendar-dots'],
  ['🚀', 'rocket'],
  ['⚡', 'lightning'],
  ['💡', 'lightbulb'],
  ['🔥', 'fire'],
  ['📷', 'camera'],       ['📸', 'camera'],
  ['🎥', 'video-camera'],
  ['📱', 'device-mobile'],
  ['💻', 'laptop'],
  ['🌍', 'globe'],        ['🌎', 'globe'], ['🌐', 'globe'],
  ['🗑️', 'trash'],        ['🗑', 'trash'],
  ['🎁', 'gift'],
  ['🎯', 'target'],
  ['📍', 'map-pin'],
  ['✏️', 'pencil-simple'], ['✏', 'pencil-simple'],
  ['🖼️', 'image'],         ['🖼', 'image'],
  ['ℹ️', 'info'],           ['ℹ', 'info'],
  ['⚠️', 'warning'],        ['⚠', 'warning'],
  ['🏆', 'trophy'],
  ['💼', 'briefcase'],
  ['🎵', 'music-note'],   ['🎶', 'music-notes'],
  ['🔊', 'speaker-high'], ['🔇', 'speaker-x'],
  ['👍', 'thumbs-up'],    ['👎', 'thumbs-down'],
  ['❤️', 'heart'],         ['🤍', 'heart'],
  ['👁️', 'eye'],
  ['🔄', 'arrows-clockwise'],
  ['↩️', 'arrow-u-up-left'],
  ['➕', 'plus'],          ['➖', 'minus'],
  ['🏢', 'building'],
  ['☰', 'list'],          ['≡', 'list'],   // hamburger / menu glyphs
];

export function replaceEmojisWithPhosphor(html) {
  let out = String(html);
  for (const [emoji, name] of EMOJI_MAP) {
    if (!out.includes(emoji)) continue;
    const glyph = `<i class="ph ph-${name}" style="font-size:1.1em;line-height:1;display:inline-flex;vertical-align:middle"></i>`;
    out = out.split(emoji).join(glyph);
  }
  return out;
}
