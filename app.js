const INDEX = 'data/index.json';
let notes = [];

async function init() {
  const res = await fetch(INDEX);
  if (!res.ok) return document.getElementById('list').innerHTML = '<p>加载失败</p>';
  notes = (await res.json()).notes;
  render(notes);
}

function render(list) {
  document.getElementById('note').hidden = true;
  document.getElementById('list').hidden = false;
  document.getElementById('count').textContent = list.length + ' 条';
  document.getElementById('list').innerHTML = list.map(n =>
    `<div class="card" data-id="${n.id}" onclick="show(${n.id})">
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
    art.innerHTML = `<button onclick="back()">← 返回</button><h1>${n.title}</h1>${marked.parse(md.replace(/^---[\s\S]*?---\n/, ''))}`;
  } catch {
    art.innerHTML = `<button onclick="back()">← 返回</button><h1>${n.title}</h1><p>${n.summary}</p>`;
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