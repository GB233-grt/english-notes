const INDEX = 'data/index.json';
let notes = [];

// 备用 Markdown 解析器（如果 CDN 被拦截则启用）
function parseMarkdown(text) {
  // 先尝试使用 marked
  if (typeof marked !== 'undefined' && marked.parse) {
    try {
      return marked.parse(text);
    } catch (e) {
      console.warn('marked 解析失败，使用备用解析器', e);
    }
  }
  
  // 备用解析器（不需要外部库）
  return text
    .replace(/^---[\s\S]*?---\n?/, '')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

async function init() {
  try {
    const res = await fetch(INDEX);
    if (!res.ok) {
      document.getElementById('list').innerHTML = '<p>加载索引失败，请稍后刷新页面</p>';
      console.error('索引加载失败:', res.status, res.statusText);
      return;
    }
    const data = await res.json();
    notes = data.notes || [];
    console.log('加载到', notes.length, '条笔记');
    render(notes);
  } catch (e) {
    document.getElementById('list').innerHTML = '<p>加载索引失败，请稍后刷新页面</p>';
    console.error('索引加载异常:', e);
  }
}

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
  console.log('点击笔记 ID:', id);
  
  const n = notes.find(x => x.id === id);
  if (!n) {
    console.error('未找到笔记:', id);
    alert('未找到笔记: ' + id);
    return;
  }
  
  document.getElementById('list').hidden = true;
  const art = document.getElementById('note');
  art.hidden = false;
  
  // 尝试多个可能的文件名路径
  const possiblePaths = [
    `notes${id}.md`,                    // 标准路径: notes0001.md
    `notes${id}-are-grammar.md`,         // 实际文件名: notes0001-are-grammar.md
  ];
  
  let text = null;
  let successPath = '';
  
  for (const path of possiblePaths) {
    try {
      console.log('尝试加载:', path);
      const response = await fetch(path);
      if (response.ok) {
        text = await response.text();
        successPath = path;
        console.log('加载成功:', path, '内容长度:', text.length);
        break;
      } else {
        console.warn('路径失败:', path, '状态:', response.status);
      }
    } catch (e) {
      console.warn('路径异常:', path, e);
    }
  }
  
  if (!text) {
    console.error('所有路径都失败，笔记文件未找到');
    art.innerHTML = `<button onclick="back()">← 返回</button><h1>${n.title}</h1><p>笔记文件未找到。请检查 notes 文件夹中的文件名是否正确。</p>`;
    return;
  }
  
  // 删除 frontmatter（如果有的话）
  text = text.replace(/^---[\s\S]*?---\n?/, '');
  
  // 解析并显示内容
  art.innerHTML = `<button onclick="back()">← 返回</button><h1>${n.title}</h1>${parseMarkdown(text)}`;
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