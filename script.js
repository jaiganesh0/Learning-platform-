// Online learning platform - vanilla JS. Progress is saved in localStorage.
const COURSES = [
 {id:1,t:'HTML & CSS Basics',c:'Web',l:12,lv:'Beginner',col:'#e4572e'},{id:2,t:'JavaScript Essentials',c:'Web',l:20,lv:'Beginner',col:'#d4a017'},
 {id:3,t:'Java for Beginners',c:'Programming',l:24,lv:'Beginner',col:'#2a6f97'},{id:4,t:'Python Basics',c:'Programming',l:18,lv:'Beginner',col:'#3a7d44'},
 {id:5,t:'Networking Fundamentals',c:'Cloud & Networking',l:16,lv:'Intermediate',col:'#6a4c93'},{id:6,t:'Linux Command Line',c:'Cloud & Networking',l:14,lv:'Beginner',col:'#34495e'},
 {id:7,t:'Intro to Cloud Computing',c:'Cloud & Networking',l:15,lv:'Beginner',col:'#17a8cf'},{id:8,t:'Data Structures',c:'Programming',l:22,lv:'Intermediate',col:'#b5179e'}];
let prog = {}; try { prog = JSON.parse(localStorage.getItem('skillhub') || '{}'); } catch {}
const save = () => { try { localStorage.setItem('skillhub', JSON.stringify(prog)); } catch {} };
const state = { q: '', cat: 'All' }, $ = id => document.getElementById(id);
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function render() {
  const q = state.q.toLowerCase();
  const list = COURSES.filter(c => (state.cat === 'All' || c.c === state.cat) && c.t.toLowerCase().includes(q));
  $('courses').innerHTML = list.map(c => `<article class="course"><div class="banner" style="background:${c.col}">${c.t[0]}</div><div class="body">
    <h3>${esc(c.t)}</h3><p class="meta">${c.c} · ${c.lv} · ${c.l} lessons</p>
    <button class="enroll ${c.id in prog ? 'done' : ''}" data-id="${c.id}" ${c.id in prog ? 'disabled' : ''}>${c.id in prog ? 'Enrolled' : 'Enroll now'}</button></div></article>`).join('');
  $('none').hidden = list.length > 0;
  const mine = COURSES.filter(c => c.id in prog); $('count').textContent = mine.length ? `(${mine.length} enrolled)` : '';
  $('mine').innerHTML = mine.map(c => { const p = prog[c.id], pct = Math.round(p / c.l * 100); return `<article class="mine-item"><div class="body">
    <h3>${esc(c.t)}</h3><p class="meta">${p} of ${c.l} lessons done (${pct}%)</p><div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
    <button class="learn-btn" data-id="${c.id}" ${p >= c.l ? 'disabled' : ''}>${p >= c.l ? 'Completed' : 'Complete next lesson'}</button></div></article>`; }).join('');
}
$('cats').innerHTML = ['All', ...new Set(COURSES.map(c => c.c))].map(c => `<button type="button" class="chip" data-c="${c}" aria-pressed="${c === 'All'}">${c}</button>`).join('');
$('cats').onclick = e => { const b = e.target.closest('.chip'); if (!b) return; state.cat = b.dataset.c; [...$('cats').children].forEach(x => x.setAttribute('aria-pressed', x === b)); render(); };
$('q').oninput = e => { state.q = e.target.value; render(); };
$('courses').onclick = e => { const b = e.target.closest('.enroll'); if (!b) return; prog[b.dataset.id] = 0; save(); render(); };
$('mine').onclick = e => { const b = e.target.closest('.learn-btn'); if (!b) return; const c = COURSES.find(x => x.id == b.dataset.id); prog[c.id] = Math.min(c.l, prog[c.id] + 1); save(); render(); };
render();
