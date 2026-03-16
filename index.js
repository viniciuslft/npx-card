const data = require("./data");

const ANSI = {
  reset: "\x1b[0m",
  boldOpen: "\x1b[1m",
  boldClose: "\x1b[22m",
  dimOpen: "\x1b[2m",
  dimClose: "\x1b[22m",
  italicOpen: "\x1b[3m",
  italicClose: "\x1b[23m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  violet: "\x1b[95m",
};

const color = (text, open, close = ANSI.reset) => `${open}${text}${close}`;
const bold = (text) => `${ANSI.boldOpen}${text}${ANSI.boldClose}`;
const dim = (text) => `${ANSI.dimOpen}${text}${ANSI.dimClose}`;
const italic = (text) => `${ANSI.italicOpen}${text}${ANSI.italicClose}`;

const stripAnsi = (text) =>
  String(text).replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "");

const visibleLength = (text) => stripAnsi(text).length;

const padRight = (text, width) => {
  const len = visibleLength(text);
  return text + " ".repeat(Math.max(0, width - len));
};

const wrapText = (text, width) => {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length <= width) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
};

const label = (text) => bold(color(text.padStart(10), ANSI.white));
const accent = (text) => bold(color(text, ANSI.violet));
const green = (text) => color(text, ANSI.green);
const blue = (text) => color(text, ANSI.blue);
const cyan = (text) => color(text, ANSI.cyan);
const magenta = (text) => color(text, ANSI.magenta);
const red = (text) => color(text, ANSI.red);
const gray = (text) => color(text, ANSI.gray);
const white = (text) => color(text, ANSI.white);

function makeBox(lines) {
  const contentWidth = Math.max(...lines.map((line) => visibleLength(line)), 56);

  const top = `┌${"─".repeat(contentWidth + 2)}┐`;
  const bottom = `└${"─".repeat(contentWidth + 2)}┘`;

  const body = lines.map((line) => `│ ${padRight(line, contentWidth)} │`);

  return [top, ...body, bottom].join("\n");
}

function buildInfoLines() {
  const lines = [];

  const nameLine = blue(data.name);
  const handleLine = data.handle ? dim(data.handle) : null;

  lines.push(nameLine);
  if (handleLine) lines.push(handleLine);

  lines.push("");

  if (data.role) {
    lines.push(`${label("Role:")}  ${white(data.role)}`);
  }

  if (data.stack?.length) {
    lines.push(`${label("Stack:")}  ${cyan(data.stack.join(", "))}`);
  }

  lines.push("");

  if (data.github) {
    lines.push(`${label("GitHub:")}  ${green(data.github)}`);
  }

  if (data.linkedin) {
    lines.push(`${label("LinkedIn:")}  ${blue(data.linkedin)}`);
  }

  if (data.portfolio) {
    lines.push(`${label("Web:")}  ${cyan(data.portfolio)}`);
  }

  if (data.email) {
    lines.push(`${label("Email:")}  ${magenta(data.email)}`);
  }

  if (data.card) {
    lines.push(`${label("Card:")}  ${red(data.card)}`);
  }

  lines.push("");

  const summaryText =
    data.summary ||
    "Frontend / Full Stack developer building clean, modern and thoughtful web experiences.";

  for (const line of wrapText(summaryText, 58)) {
    lines.push(italic(gray(line)));
  }

  if (data.status) {
    lines.push("");
    for (const line of wrapText(data.status, 58)) {
      lines.push(italic(white(line)));
    }
  }

  return lines;
}

function renderText() {
  const lines = buildInfoLines();
  const card = makeBox(lines);

  const tip = dim("Tip: use cmd/ctrl + click on the links above");

  return `${card}\n\n${tip}`;
}

function renderCard({ json = false } = {}) {
  if (json) {
    return JSON.stringify(data, null, 2);
  }

  return renderText();
}

module.exports = { renderCard };