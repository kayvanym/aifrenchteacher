/* Shared logic for all lesson pages. Change here → all pages change.
   Each page defines `const LESSON = {...}` and then loads this file.

   Help language: new pages set LESSON.lang ("en" | "sv" | "fa") and give ONE translation
   per item in the field `tr`. Older pages that have en/sv/fa on every item still work:
   they show a language selector instead. */

document.body.insertAdjacentHTML("afterbegin", `
<header class="top">
  <div class="wrap">
    <a href="../index.html">← Toutes les leçons / All lessons</a>
    <h1 id="title">…</h1>
    <div class="sub" id="subtitle"></div>
    <div class="settings">
      <label id="lang-wrap" hidden>Help language:
        <select id="lang">
          <option value="en">English</option>
          <option value="sv">Svenska</option>
          <option value="fa">فارسی</option>
        </select>
      </label>
      <span id="lang-badge" class="lang-badge" hidden></span>
      <label><input type="checkbox" id="show-tr" checked> Show translations</label>
      <label>Speed 🔊 <input type="range" id="rate" min="0.5" max="1.1" step="0.05" value="0.85"></label>
      <span id="voice-info" class="muted" style="color:#dbe4ff"></span>
    </div>
  </div>
</header>

<nav class="sections"><div class="wrap">
  <a href="#words">📚 Mots</a>
  <a href="#grammar" id="nav-grammar">📐 Grammaire</a>
  <a href="#reading">📖 Lecture</a>
  <a href="#comprehension" id="nav-comp">📝 Compréhension</a>
  <a href="#conversation">💬 Conversation</a>
  <a href="#news" id="nav-news">📰 Actualités</a>
  <a href="#numbers">🔢 Nombres</a>
  <a href="#drill">🃏 Entraînement</a>
  <a href="#quiz">✅ Quiz du jour</a>
</div></nav>

<main class="wrap">

  <section id="words">
    <h2>📚 Les mots du jour</h2>
    <p class="hint">Click 🔊 to listen. Turn on "Test myself" to hide the translations — click a card to check.</p>
    <label class="toggle"><input type="checkbox" id="hide-tr"> Test myself (hide translations)</label>
    <div class="grid" id="word-grid"></div>
  </section>

  <section id="grammar" class="grammar" hidden>
    <h2>📐 Grammaire</h2>
    <div id="grammar-body"></div>
  </section>

  <section id="tip-section" class="tip" hidden>
    <h2>💡 Astuce</h2>
    <div id="tip"></div>
  </section>

  <section id="reading">
    <h2 id="reading-title">📖 Lecture</h2>
    <p class="hint">Read each line aloud first, then listen and compare.</p>
    <button class="btn ghost" type="button" id="read-all">🔊 Listen to the whole text</button>
    <div id="reading-lines" style="margin-top:10px"></div>
  </section>

  <section id="comprehension" class="comp" hidden>
    <h2 id="comp-title">📝 Compréhension écrite</h2>
    <p class="hint">Read the text (listen if you want), then answer the questions. Try without the translation first!</p>
    <div id="comp-body"></div>
  </section>

  <section id="conversation">
    <h2 id="conv-title">💬 Conversation</h2>
    <p class="hint" id="conv-situation" dir="auto"></p>
    <button class="btn ghost" type="button" id="conv-all">🔊 Listen to the conversation</button>
    <div id="conv-lines" style="margin-top:10px"></div>
  </section>

  <section id="news" class="news" hidden>
    <h2>📰 Actualités</h2>
    <p class="hint">Real news from France and the Côte d'Azur, written in simple French.</p>
    <div id="news-body"></div>
  </section>

  <section id="numbers">
    <h2>🔢 Les nombres</h2>
    <p class="hint">Click a number to hear it. Then try the listening game.</p>
    <div class="numgrid" id="num-grid"></div>
    <div class="quizbox">
      <strong>🎧 Listening game:</strong> press play, listen, and choose the number you hear.
      <div style="margin-top:10px"><button class="btn" type="button" id="num-play">▶ Play a number</button>
        <button class="btn ghost" type="button" id="num-repeat" hidden>🔁 Repeat</button></div>
      <div class="opts" id="num-opts"></div>
      <div class="feedback" id="num-feedback"></div>
      <div class="muted" id="num-score">Score: 0 / 0</div>
    </div>
  </section>

  <section id="drill">
    <h2>🃏 Entraînement des mots</h2>
    <p class="hint">Quick word drill: choose the right translation.</p>
    <div id="quiz-area"></div>
  </section>

  <section id="quiz">
    <h2>✅ Quiz du jour</h2>
    <p class="hint">Mixed questions on today's words, grammar, reading text, conversation and numbers. Read the explanation after each answer.</p>
    <div class="progress"><div id="dq-bar"></div></div>
    <div id="dq-area"></div>
    <div class="quizbox" style="margin-top:18px">
      <strong>📋 Send your results to your teacher</strong>
      <p class="muted" style="margin:4px 0 8px">When you are done, press <b>Send to my teacher</b>. GitHub opens with your results already written — just press <b>Submit</b> (or <b>Create</b>). Your teacher reads it the next morning.</p>
      <textarea id="comment" placeholder="Optional comment for your teacher (e.g. too easy, more words about the apartment…)" style="min-height:50px;font-family:inherit"></textarea>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
        <button class="btn" type="button" id="send-results">📨 Send to my teacher</button>
        <button class="btn ghost" type="button" id="copy-results">Copy my results</button>
      </div>
      <textarea id="results-text" readonly hidden></textarea>
    </div>
  </section>

</main>
<footer id="footer"></footer>`);

(function(){
  const L = LESSON;
  const $ = (s) => document.querySelector(s);
  function el(tag, attrs, ...kids){
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})){
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (const kid of kids.flat()){
      if (kid == null || kid === false) continue;
      e.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return e;
  }
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const store = {
    get(k, d){ try { const v = localStorage.getItem(k); return v === null ? d : v; } catch(e){ return d; } },
    set(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
  };

  /* ---------- help language ---------- */
  const LANG_NAMES = { en: "English", sv: "Svenska", fa: "فارسی" };
  const firstWord = (L.words && L.words[0]) || {};
  const multi = firstWord.tr === undefined;            // old page: en/sv/fa on every item
  let lang = multi ? (store.get("fr-lang", L.lang || "en")) : (L.lang || "en");
  if (!LANG_NAMES[lang]) lang = "en";
  let showTr = store.get("fr-show-tr", "1") === "1";
  /* translation of an item: new pages use `tr`, old pages use en/sv/fa */
  const getTr = (o) => (o == null ? "" : (o.tr !== undefined ? o.tr : (o[lang] !== undefined ? o[lang] : o.en)));
  /* text that may be a plain string or an {en,sv,fa} object */
  const tx = (v) => (v == null ? "" : (typeof v === "object" ? (v[lang] !== undefined ? v[lang] : v.en) : v));
  /* an element for help-language text (handles right-to-left for Persian) */
  const trEl = (tag, cls, text) => el(tag, { class: cls, dir: "auto", lang: lang }, text);

  if (multi){
    $("#lang-wrap").hidden = false;
    $("#lang").value = lang;
    $("#lang").addEventListener("change", (e) => { lang = e.target.value; store.set("fr-lang", lang); renderAll(); });
  } else {
    $("#lang-badge").hidden = false;
    $("#lang-badge").textContent = "Help language: " + LANG_NAMES[lang];
  }
  $("#show-tr").checked = showTr;
  $("#show-tr").addEventListener("change", (e) => { showTr = e.target.checked; store.set("fr-show-tr", showTr ? "1" : "0"); renderReading(); renderConversation(); renderGrammar(); renderNews(); });

  /* ---------- speech ---------- */
  const hasSpeech = "speechSynthesis" in window;
  let frVoice = null;
  let rate = parseFloat(store.get("fr-rate", "0.85")) || 0.85;
  function pickVoice(){
    const vs = speechSynthesis.getVoices();
    frVoice = vs.find(v => v.lang === "fr-FR") || vs.find(v => (v.lang || "").toLowerCase().startsWith("fr")) || null;
    $("#voice-info").textContent = frVoice ? "" : (vs.length ? "No French voice found on this device." : "");
  }
  if (hasSpeech){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  else { $("#voice-info").textContent = "Audio not supported in this browser."; }
  const clean = (t) => String(t).replace(/[«»]/g, "").replace(/\((?:e|s|es|e\)\(s|m|f)\)/g, "").replace(/___/g, "…");
  function utter(t){ const u = new SpeechSynthesisUtterance(clean(t)); u.lang = "fr-FR"; if (frVoice) u.voice = frVoice; u.rate = rate; return u; }
  function say(text){ if (!hasSpeech) return; speechSynthesis.cancel(); speechSynthesis.speak(utter(text)); }
  function sayList(texts){ if (!hasSpeech) return; speechSynthesis.cancel(); texts.forEach(t => speechSynthesis.speak(utter(t))); }
  const speakBtn = (text) => el("button", { class: "speak", type: "button", title: "Listen", "aria-label": "Listen", onclick: (ev) => { ev.stopPropagation(); say(text); } }, "🔊");

  const rateInput = $("#rate");
  rateInput.value = rate;
  rateInput.addEventListener("input", () => { rate = parseFloat(rateInput.value); store.set("fr-rate", rate); });

  /* ---------- header ---------- */
  document.title = `Jour ${L.day} — ${L.theme.fr}`;
  $("#title").textContent = `Jour ${L.day} · ${L.theme.fr}`;
  const themeTr = L.theme.tr !== undefined ? L.theme.tr : (L.theme[lang] || L.theme.en || "");
  $("#subtitle").textContent = `${themeTr} — Week ${L.week} — ${new Date(L.date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`;

  /* ---------- words ---------- */
  function renderWords(){
    const grid = $("#word-grid");
    grid.innerHTML = "";
    L.words.forEach(w => {
      const exTr = w.example_tr !== undefined ? w.example_tr : w.example_en;
      grid.append(el("div", { class: "card" + (w.review ? " review" : "") },
        w.review ? el("span", { class: "badge" }, "Révision") : null,
        el("div", { class: "fr-row" }, speakBtn(w.fr), el("span", { class: "fr-word", lang: "fr" }, w.fr)),
        el("div", { class: "tr", onclick: (ev) => ev.currentTarget.classList.toggle("revealed") }, trEl("div", "tr-main", getTr(w))),
        w.example ? el("div", { class: "ex" },
          el("div", { class: "fr-row", style: "margin:0" }, speakBtn(w.example), el("span", { lang: "fr" }, w.example)),
          exTr ? trEl("div", "muted", exTr) : null) : null));
    });
  }
  $("#hide-tr").addEventListener("change", (e) => {
    $("#word-grid").classList.toggle("hide-tr", e.target.checked);
    document.querySelectorAll("#word-grid .tr").forEach(t => t.classList.remove("revealed"));
  });

  /* ---------- grammar ----------
     grammar: { title, intro, rules: [..], table?: {caption?, headers, rows}, examples: [{fr, tr, note?}],
                watch_out?: {wrong, right, why} }  — texts in the help language (or {en,sv,fa}) */
  function renderGrammar(){
    const g = L.grammar;
    if (!g){ $("#grammar").hidden = true; $("#nav-grammar").hidden = !L.tip; if (L.tip) $("#nav-grammar").href = "#tip-section"; return; }
    $("#grammar").hidden = false;
    const box = $("#grammar-body");
    box.innerHTML = "";
    box.append(el("h3", { class: "g-title", lang: "fr" }, g.title));
    if (g.intro) box.append(trEl("p", "g-intro", tx(g.intro)));
    if (g.rules && g.rules.length){
      box.append(el("ol", { class: "g-rules", dir: "auto" }, g.rules.map(r => trEl("li", "", tx(r)))));
    }
    if (g.table && g.table.rows){
      const t = g.table;
      box.append(el("div", { class: "g-table-wrap" },
        el("table", { class: "g-table", lang: "fr" },
          t.caption ? trEl("caption", "", tx(t.caption)) : null,
          t.headers ? el("thead", {}, el("tr", {}, t.headers.map(h => el("th", {}, h)))) : null,
          el("tbody", {}, t.rows.map(r => el("tr", {}, r.map((c, k) => el(k === 0 ? "th" : "td", {}, c))))))));
    }
    if (g.examples && g.examples.length){
      box.append(el("h4", {}, "Exemples"),
        el("div", { class: "g-examples" }, g.examples.map(x => el("div", { class: "g-ex" },
          el("div", { class: "fr-line" }, el("span", { lang: "fr" }, x.fr), speakBtn(x.fr)),
          showTr && getTr(x) ? trEl("div", "trline", getTr(x)) : null,
          x.note ? trEl("div", "g-note", tx(x.note)) : null))));
    }
    if (g.watch_out){
      const w = g.watch_out;
      box.append(el("div", { class: "g-watch" },
        el("div", { class: "g-watch-title" }, "⚠️ Attention !"),
        el("div", { class: "g-wrong", lang: "fr" }, "✘ ", el("s", {}, w.wrong)),
        el("div", { class: "g-right", lang: "fr" }, "✔ ", w.right, " ", speakBtn(w.right)),
        w.why ? trEl("div", "g-why", tx(w.why)) : null));
    }
  }

  /* ---------- old-style tip (older pages only) ---------- */
  function renderTip(){
    if (!L.tip || L.grammar){ $("#tip-section").hidden = true; return; }
    $("#tip-section").hidden = false;
    const t = $("#tip");
    t.innerHTML = "";
    t.append(L.tip.title ? el("p", {}, el("strong", { lang: "fr" }, L.tip.title)) : null,
      trEl("p", "", tx(L.tip)));
  }

  /* ---------- reading ---------- */
  function renderReading(){
    $("#reading-title").textContent = "📖 Lecture : " + L.reading.title;
    const box = $("#reading-lines");
    box.innerHTML = "";
    L.reading.lines.forEach((l, i) => {
      box.append(el("div", { class: "line" },
        el("span", { class: "num" }, i + 1),
        el("div", { class: "line-body" },
          el("div", { class: "fr-line" }, el("span", { lang: "fr" }, l.fr), speakBtn(l.fr)),
          showTr ? trEl("div", "trline", getTr(l)) : null)));
    });
  }
  $("#read-all").addEventListener("click", () => sayList(L.reading.lines.map(l => l.fr)));

  /* ---------- conversation ---------- */
  function renderConversation(){
    $("#conv-title").textContent = "💬 Conversation : " + L.conversation.title;
    $("#conv-situation").textContent = tx(L.conversation.situation);
    const first = L.conversation.lines[0] && L.conversation.lines[0].speaker;
    const box = $("#conv-lines");
    box.innerHTML = "";
    L.conversation.lines.forEach(l => {
      box.append(el("div", { class: "bubble-row" + (l.speaker === first ? "" : " right") },
        el("div", { class: "bubble" },
          el("div", { class: "who" }, l.speaker),
          el("div", { class: "fr-line" }, el("span", { lang: "fr" }, l.fr), speakBtn(l.fr)),
          showTr ? trEl("div", "trline", getTr(l)) : null)));
    });
  }
  $("#conv-all").addEventListener("click", () => sayList(L.conversation.lines.map(l => l.fr)));

  /* ---------- reading comprehension ----------
     comprehension: { title, kind?, text: [String fr sentences] | String, text_tr: String,
                      questions: [ { q, options, answer, explain } ] } */
  const comp = { answered: 0, correct: 0, missed: [] };
  function renderComprehension(){
    const c = L.comprehension;
    if (!c){ $("#comprehension").hidden = true; $("#nav-comp").hidden = true; return; }
    $("#comprehension").hidden = false;
    $("#comp-title").textContent = "📝 Compréhension écrite : " + c.title;
    const text = Array.isArray(c.text) ? c.text.join(" ") : c.text;
    const box = $("#comp-body");
    box.innerHTML = "";
    Object.assign(comp, { answered: 0, correct: 0, missed: [] });
    const trBox = trEl("div", "comp-tr", tx(c.text_tr));
    trBox.hidden = true;
    const score = el("div", { class: "muted comp-score" }, `Score: 0 / ${c.questions.length}`);
    const add = (...kids) => box.append(...kids.filter(k => k != null));
    add(
      c.kind ? el("span", { class: "dq-type" }, c.kind) : null,
      el("div", { class: "comp-text", lang: "fr" }, text),
      el("div", { class: "comp-actions" },
        el("button", { class: "btn ghost", type: "button", onclick: () => say(text) }, "🔊 Listen"),
        c.text_tr ? el("button", { class: "btn ghost", type: "button", onclick: (ev) => { trBox.hidden = !trBox.hidden; ev.currentTarget.textContent = trBox.hidden ? "Show translation" : "Hide translation"; } }, "Show translation") : null),
      trBox,
      el("h4", { class: "comp-qh" }, "Questions"),
      ...c.questions.map((q, qi) => {
        const fb = el("div", { class: "feedback" });
        const ex = el("div", { class: "explain", dir: "auto", hidden: "hidden" });
        const opts = el("div", { class: "dq-opts" });
        shuffle(q.options.map((t, k) => k)).forEach(k => opts.append(el("button", { class: "opt", type: "button", dir: "auto", "data-k": k,
          onclick: (ev) => {
            opts.querySelectorAll(".opt").forEach(b => b.disabled = true);
            comp.answered++;
            if (k === q.answer){ comp.correct++; ev.currentTarget.classList.add("ok"); fb.textContent = "✔ Correct !"; fb.className = "feedback ok"; }
            else {
              ev.currentTarget.classList.add("bad");
              opts.querySelectorAll(".opt").forEach(b => { if (Number(b.getAttribute("data-k")) === q.answer) b.classList.add("ok"); });
              comp.missed.push(qi + 1);
              fb.textContent = "✘ Pas tout à fait."; fb.className = "feedback bad";
            }
            if (q.explain){ ex.hidden = false; ex.textContent = tx(q.explain); }
            score.textContent = `Score: ${comp.correct} / ${c.questions.length}`;
          } }, tx(q.options[k]))));
        return el("div", { class: "comp-q" }, el("div", { class: "dq-q", dir: "auto" }, `${qi + 1}. `, tx(q.q)), opts, fb, ex);
      }),
      score);
  }

  /* ---------- news ----------
     news: [ { title, title_tr, place?, date?, lines: [ {fr, tr} ], source: {name, url} } ]  (1–3 items) */
  function renderNews(){
    const N = L.news || [];
    if (!N.length){ $("#news").hidden = true; $("#nav-news").hidden = true; return; }
    $("#news").hidden = false;
    const box = $("#news-body");
    box.innerHTML = "";
    N.forEach(n => {
      const meta = [n.place, n.date ? new Date(n.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : null].filter(Boolean).join(" · ");
      box.append(el("article", { class: "news-card" },
        meta ? el("div", { class: "news-meta" }, "📍 " + meta) : null,
        el("div", { class: "fr-line news-title" }, el("span", { lang: "fr" }, n.title), speakBtn(n.title)),
        showTr && n.title_tr ? trEl("div", "trline", n.title_tr) : null,
        el("div", { class: "news-lines" }, (n.lines || []).map(l => el("div", { class: "news-line" },
          el("div", { class: "fr-line" }, el("span", { lang: "fr" }, l.fr), speakBtn(l.fr)),
          showTr ? trEl("div", "trline", getTr(l)) : null))),
        n.source && n.source.url ? el("div", { class: "news-src" }, "Source : ",
          el("a", { href: n.source.url, target: "_blank", rel: "noopener" }, (n.source.name || "link") + " ↗")) : null));
    });
  }

  /* ---------- numbers ---------- */
  const numStats = { asked: 0, correct: 0, missed: [] };
  let currentNum = null;
  function renderNumbers(){
    const grid = $("#num-grid");
    grid.innerHTML = "";
    L.numbers.forEach(x => grid.append(
      el("button", { class: "numtile", type: "button", onclick: () => say(x.fr) },
        el("div", { class: "n" }, x.n),
        el("div", { class: "w", lang: "fr" }, x.fr),
        el("div", { class: "h" }, x.hint || ""))));
  }
  function playNumber(){
    currentNum = L.numbers[Math.floor(Math.random() * L.numbers.length)];
    say(currentNum.fr);
    $("#num-repeat").hidden = false;
    $("#num-feedback").textContent = ""; $("#num-feedback").className = "feedback";
    const others = shuffle(L.numbers.filter(x => x.n !== currentNum.n)).slice(0, 3);
    const opts = $("#num-opts");
    opts.innerHTML = "";
    shuffle([currentNum, ...others]).forEach(o => {
      opts.append(el("button", { class: "opt", type: "button", onclick: (ev) => answerNumber(o, ev.currentTarget) }, o.n));
    });
  }
  function answerNumber(o, btn){
    const opts = document.querySelectorAll("#num-opts .opt");
    opts.forEach(b => b.disabled = true);
    numStats.asked++;
    const fb = $("#num-feedback");
    if (o.n === currentNum.n){
      numStats.correct++; btn.classList.add("ok");
      fb.textContent = `✔ Bravo ! ${currentNum.n} = ${currentNum.fr}`; fb.className = "feedback ok";
    } else {
      btn.classList.add("bad");
      opts.forEach(b => { if (Number(b.textContent) === currentNum.n) b.classList.add("ok"); });
      if (!numStats.missed.includes(currentNum.n)) numStats.missed.push(currentNum.n);
      fb.textContent = `✘ ${currentNum.n} = ${currentNum.fr}`; fb.className = "feedback bad";
    }
    $("#num-score").textContent = `Score: ${numStats.correct} / ${numStats.asked}`;
  }
  $("#num-play").addEventListener("click", playNumber);
  $("#num-repeat").addEventListener("click", () => currentNum && say(currentNum.fr));

  /* ---------- word drill ---------- */
  const quiz = { order: shuffle(L.words), i: 0, correct: 0, missed: [], done: false };
  function renderDrill(){
    const area = $("#quiz-area");
    area.innerHTML = "";
    if (quiz.done){
      area.append(
        el("p", { class: "qword" }, `🎉 ${quiz.correct} / ${quiz.order.length}`),
        quiz.missed.length ? el("p", {}, "To review: ", el("strong", { lang: "fr" }, quiz.missed.join(", "))) : el("p", {}, "Parfait !"),
        el("button", { class: "btn ghost", type: "button", onclick: () => { Object.assign(quiz, { order: shuffle(L.words), i: 0, correct: 0, missed: [], done: false }); renderDrill(); } }, "Try again"));
      return;
    }
    const w = quiz.order[quiz.i];
    const others = shuffle(L.words.filter(x => x !== w)).slice(0, 3);
    const opts = el("div", { class: "opts" });
    shuffle([w, ...others]).forEach(o => {
      opts.append(el("button", { class: "opt", type: "button", dir: "auto", "data-ok": o === w ? "1" : "0",
        onclick: (ev) => answerDrill(o === w, ev.currentTarget, opts, w) }, getTr(o)));
    });
    area.append(
      el("p", { class: "muted" }, `Question ${quiz.i + 1} / ${quiz.order.length} · Score ${quiz.correct}`),
      el("div", { class: "qword" }, speakBtn(w.fr), el("span", { lang: "fr" }, w.fr)),
      opts,
      el("div", { class: "feedback", id: "quiz-feedback" }),
      el("button", { class: "btn", type: "button", id: "quiz-next", hidden: "hidden", onclick: () => { quiz.i++; if (quiz.i >= quiz.order.length) quiz.done = true; renderDrill(); } }, "Next →"));
  }
  function answerDrill(ok, btn, opts, w){
    opts.querySelectorAll(".opt").forEach(b => b.disabled = true);
    const fb = $("#quiz-feedback");
    if (ok){ quiz.correct++; btn.classList.add("ok"); fb.textContent = "✔ Très bien !"; fb.className = "feedback ok"; }
    else {
      btn.classList.add("bad");
      opts.querySelectorAll('.opt[data-ok="1"]').forEach(b => b.classList.add("ok"));
      if (!quiz.missed.includes(w.fr)) quiz.missed.push(w.fr);
      fb.textContent = "✘ Pas tout à fait."; fb.className = "feedback bad";
    }
    $("#quiz-next").hidden = false;
  }

  /* ---------- daily quiz (10–20 mixed questions) ---------- */
  const DQ = L.quiz || [];
  const TYPE_LABEL = { vocab: "Vocabulaire", grammar: "Grammaire", reading: "Lecture", conversation: "Conversation", numbers: "Nombres" };
  const dq = { i: 0, correct: 0, answered: 0, missed: [], done: false };
  function dqReset(){ Object.assign(dq, { i: 0, correct: 0, answered: 0, missed: [], done: false }); renderDQ(); }
  function renderDQ(){
    const area = $("#dq-area");
    area.innerHTML = "";
    const put = (...kids) => area.append(...kids.filter(k => k != null));
    if (!DQ.length){ $("#quiz").hidden = true; return; }
    $("#dq-bar").style.width = (100 * dq.answered / DQ.length) + "%";
    if (dq.done){
      const pct = Math.round(100 * dq.correct / DQ.length);
      const msg = pct >= 90 ? "Excellent ! 🌟" : pct >= 70 ? "Très bien ! 👍" : pct >= 50 ? "Pas mal ! 💪" : "Courage ! 📚";
      put(
        el("p", { class: "qword" }, `🎉 ${dq.correct} / ${DQ.length} (${pct}%)`),
        el("p", {}, msg),
        dq.missed.length ? el("div", {}, el("strong", {}, "Questions to review:"),
          el("ul", { class: "missed-list", dir: "auto" }, dq.missed.map(k => el("li", { dir: "auto" },
            `Q${k + 1} (${TYPE_LABEL[DQ[k].type] || DQ[k].type}): ${tx(DQ[k].q)}` + (DQ[k].fr && !DQ[k].listen ? ` « ${DQ[k].fr} »` : "") + " → ",
            el("strong", {}, tx(DQ[k].options[DQ[k].answer])))))) : null,
        el("button", { class: "btn ghost", type: "button", onclick: dqReset }, "Try again"));
      return;
    }
    const item = DQ[dq.i];
    const order = shuffle(item.options.map((t, k) => k));
    const opts = el("div", { class: "dq-opts" });
    order.forEach(k => opts.append(el("button", { class: "opt", type: "button", dir: "auto", "data-k": k,
      onclick: (ev) => answerDQ(k, ev.currentTarget, opts, item) }, tx(item.options[k]))));
    put(
      el("p", { class: "muted", style: "margin:0" }, `Question ${dq.i + 1} / ${DQ.length} · Score ${dq.correct}`),
      el("span", { class: "dq-type" }, TYPE_LABEL[item.type] || item.type),
      trEl("div", "dq-q", tx(item.q)),
      item.fr ? el("div", { class: "dq-fr" }, speakBtn(item.fr), item.listen ? el("span", { class: "muted" }, "🎧 Listen (press 🔊)") : el("span", { lang: "fr" }, item.fr)) : null,
      opts,
      el("div", { class: "feedback", id: "dq-feedback" }),
      el("div", { class: "explain", id: "dq-explain", dir: "auto", hidden: "hidden" }),
      el("button", { class: "btn", type: "button", id: "dq-next", hidden: "hidden",
        onclick: () => { dq.i++; if (dq.i >= DQ.length) dq.done = true; renderDQ(); } }, dq.i + 1 >= DQ.length ? "See my result →" : "Next →"));
    if (item.listen && item.fr) setTimeout(() => say(item.fr), 300);
  }
  function answerDQ(k, btn, opts, item){
    opts.querySelectorAll(".opt").forEach(b => b.disabled = true);
    dq.answered++;
    const fb = $("#dq-feedback");
    if (k === item.answer){ dq.correct++; btn.classList.add("ok"); fb.textContent = "✔ Correct !"; fb.className = "feedback ok"; }
    else {
      btn.classList.add("bad");
      opts.querySelectorAll(".opt").forEach(b => { if (Number(b.getAttribute("data-k")) === item.answer) b.classList.add("ok"); });
      dq.missed.push(dq.i);
      fb.textContent = "✘ Pas tout à fait."; fb.className = "feedback bad";
    }
    const ex = $("#dq-explain");
    const explain = tx(item.explain);
    if (explain || item.listen){ ex.hidden = false; ex.textContent = (item.listen ? `« ${item.fr} » — ` : "") + explain; }
    $("#dq-bar").style.width = (100 * dq.answered / DQ.length) + "%";
    $("#dq-next").hidden = false;
  }

  /* ---------- results ---------- */
  const REPO = "kayvanym/aifrenchteacher";   // GitHub repository that receives the feedback
  function resultsText(){
    const answeredWords = quiz.done ? quiz.order.length : quiz.i + (document.querySelector("#quiz-next:not([hidden])") ? 1 : 0);
    const text =
      `${L.date} — Day ${L.day} (${L.theme.fr}): ` +
      `daily quiz ${dq.correct}/${dq.answered}` + (dq.done ? "" : ` (answered ${dq.answered} of ${DQ.length})`) +
      `; missed questions: ${dq.missed.length ? dq.missed.map(k => `Q${k + 1} ${DQ[k].type}`).join(", ") : "none"}` +
      (L.comprehension ? `; reading comprehension ${comp.correct}/${L.comprehension.questions.length}` + (comp.missed.length ? ` (missed Q${comp.missed.join(", Q")})` : "") : "") +
      `; word drill ${quiz.correct}/${answeredWords}` + (quiz.done ? "" : " (not finished)") +
      `; missed words: ${quiz.missed.length ? quiz.missed.join(", ") : "none"}` +
      `; numbers ${numStats.correct}/${numStats.asked}` +
      `; missed numbers: ${numStats.missed.length ? numStats.missed.join(", ") : "none"}.`;
    const c = ($("#comment").value || "").trim();
    return c ? text + "\nComment: " + c : text;
  }
  $("#send-results").addEventListener("click", () => {
    const title = `Feedback: Day ${L.day} (${L.date})`;
    const url = `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(resultsText())}`;
    window.open(url, "_blank", "noopener");
  });
  $("#copy-results").addEventListener("click", () => {
    const text = resultsText();
    const ta = $("#results-text");
    ta.hidden = false; ta.value = text; ta.select();
    const done = () => { $("#copy-results").textContent = "✔ Copied!"; setTimeout(() => $("#copy-results").textContent = "Copy my results", 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done, () => { try { document.execCommand("copy"); done(); } catch(e){} }); }
    else { try { document.execCommand("copy"); done(); } catch(e){} }
  });

  $("#footer").textContent = `Jour ${L.day} · ${L.date} · Made by your French teacher 🇫🇷`;

  function renderAll(){ renderWords(); renderGrammar(); renderTip(); renderReading(); renderComprehension(); renderConversation(); renderNews(); renderDrill(); renderDQ(); }
  renderAll(); renderNumbers();
})();
