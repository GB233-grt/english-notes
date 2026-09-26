const INDEX = 'data/index.json';
let notes = [];

// 备用 Markdown 解析器（如果 CDN 被拦截则启用）
function parseMarkdown(text) {
  if (typeof marked !== 'undefined') {
    return marked.parse(text);
  }
  // 简单粗暴的备用转换，保证笔记内容至少能看
  return text
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

async function init() {
  const res = await fetch(INDEX);
  if (!res.ok) {
    document.getElementById('list').innerHTML = '<p>加载索引失败，请稍后刷新页面</p>';
    return;
  }
  notes = (await res.json()).notes;
  render(notes);
}

// 核心修复：将 id 强制转换为字符串，确保能匹配到 JSON 里的 "0001"
function render(list) {
  document.getElementById('note').hidden = true;
  document.getElementById('list').hidden = false;
  document.getElementById('count').textContent = list.length + ' 条';
  document.getElementById('list').innerHTML = list.map(n =>
    `<div class="card" data-id="${n.id}" onclick="show('${n.id}')">
       <h2>${n.title}</h2>
       <small>${n.id} · ${n.updated}</small>
       <p>${n.summary}</p>
     </div>`
  ).join('') || '<p>无结果</p>';
}

async function show(id) {
  const n = notes.find(x => x.id === id);
  if (!n) return;
  
  document.getElementById('list').hidden = true;
  const art = document.getElementById('note');
  art.hidden = false;
  
  try {
    const md = await fetch(`notes/${id}.md`).then(r => r.text());
    // 使用解析器处理 markdown 内容
    art.innerHTML = `<button onclick="back()">← 返回</button><h1>${n.title}</h1>${parseMarkdown(md)}`;
  } catch {
    art.innerHTML = `<button onclick="back()">← 返回</button><h1>${n.title}</h1><p>笔记内容加载失败，请检查控制台（F12）报错信息。</p>`;
  }
}

function back() {
  document.getElementById('note').hidden = true;
  document.getElementById('list').hidden = false;
}

document.getElementById('q').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  render(q ? notes.filter(n => (n.title + n.summary).toLowerCase().includes(q)) : notes);
});

init();