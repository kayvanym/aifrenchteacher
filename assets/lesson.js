/* Shared logic for all lesson pages. Change here → all pages change.
   Each page defines `const LESSON = {...}` and then loads this file. */
document.body.insertAdjacentHTML("afterbegin", "<header class=\"top\">\n  <div class=\"wrap\">\n    <a href=\"../index.html\">\u2190 Toutes les le\u00e7ons / All lessons</a>\n    <h1 id=\"title\">\u2026</h1>\n    <div class=\"sub\" id=\"subtitle\"></div>\n    <div class=\"settings\">\n      <label>Translation:\n        <select id=\"lang\">\n          <option value=\"en\">English</option>\n          <option value=\"sv\">Svenska</option>\n          <option value=\"fa\">\u0641\u0627\u0631\u0633\u06cc</option>\n          <option value=\"none\">\u2014 none \u2014</option>\n        </select>\n      </label>\n      <label>Speed \ud83d\udd0a <input type=\"range\" id=\"rate\" min=\"0.5\" max=\"1.1\" step=\"0.05\" value=\"0.85\"></label>\n      <span id=\"voice-info\" class=\"muted\" style=\"color:#dbe4ff\"></span>\n    </div>\n  </div>\n</header>\n\n<nav class=\"sections\"><div class=\"wrap\">\n  <a href=\"#words\">\ud83d\udcda Mots</a>\n  <a href=\"#reading\">\ud83d\udcd6 Lecture</a>\n  <a href=\"#conversation\">\ud83d\udcac Conversation</a>\n  <a href=\"#numbers\">\ud83d\udd22 Nombres</a>\n  <a href=\"#drill\">\ud83c\udccf Entra\u00eenement</a>\n  <a href=\"#quiz\">\u2705 Quiz du jour</a>\n</div></nav>\n\n<main class=\"wrap\">\n\n  <section id=\"words\">\n    <h2>\ud83d\udcda Les mots du jour</h2>\n    <p class=\"hint\">Click \ud83d\udd0a to listen. Turn on \"Test myself\" to hide the translations \u2014 click a card to check.</p>\n    <label class=\"toggle\"><input type=\"checkbox\" id=\"hide-tr\"> Test myself (hide translations)</label>\n    <div class=\"grid\" id=\"word-grid\"></div>\n  </section>\n\n  <section id=\"tip-section\" class=\"tip\" hidden>\n    <h2>\ud83d\udca1 Astuce</h2>\n    <div id=\"tip\"></div>\n  </section>\n\n  <section id=\"reading\">\n    <h2 id=\"reading-title\">\ud83d\udcd6 Lecture</h2>\n    <p class=\"hint\">Read each line aloud first, then listen and compare. Change the translation language at the top.</p>\n    <button class=\"btn ghost\" type=\"button\" id=\"read-all\">\ud83d\udd0a Listen to the whole text</button>\n    <div id=\"reading-lines\" style=\"margin-top:10px\"></div>\n  </section>\n\n  <section id=\"conversation\">\n    <h2 id=\"conv-title\">\ud83d\udcac Conversation</h2>\n    <p class=\"hint\" id=\"conv-situation\"></p>\n    <button class=\"btn ghost\" type=\"button\" id=\"conv-all\">\ud83d\udd0a Listen to the conversation</button>\n    <div id=\"conv-lines\" style=\"margin-top:10px\"></div>\n  </section>\n\n  <section id=\"numbers\">\n    <h2>\ud83d\udd22 Les nombres</h2>\n    <p class=\"hint\">Click a number to hear it. Then try the listening game.</p>\n    <div class=\"numgrid\" id=\"num-grid\"></div>\n    <div class=\"quizbox\">\n      <strong>\ud83c\udfa7 Listening game:</strong> press play, listen, and choose the number you hear.\n      <div style=\"margin-top:10px\"><button class=\"btn\" type=\"button\" id=\"num-play\">\u25b6 Play a number</button>\n        <button class=\"btn ghost\" type=\"button\" id=\"num-repeat\" hidden>\ud83d\udd01 Repeat</button></div>\n      <div class=\"opts\" id=\"num-opts\"></div>\n      <div class=\"feedback\" id=\"num-feedback\"></div>\n      <div class=\"muted\" id=\"num-score\">Score: 0 / 0</div>\n    </div>\n  </section>\n\n  <section id=\"drill\">\n    <h2>\ud83c\udccf Entra\u00eenement des mots</h2>\n    <p class=\"hint\">Quick word drill: choose the right translation (in the language selected at the top).</p>\n    <div id=\"quiz-area\"></div>\n  </section>\n\n  <section id=\"quiz\">\n    <h2>\u2705 Quiz du jour</h2>\n    <p class=\"hint\">Mixed questions on today's words, grammar, reading text, conversation and numbers. Read the explanation after each answer.</p>\n    <div class=\"progress\"><div id=\"dq-bar\"></div></div>\n    <div id=\"dq-area\"></div>\n    <div class=\"quizbox\" style=\"margin-top:18px\">\n      <strong>\ud83d\udccb Send your results to your teacher</strong>\n      <p class=\"muted\" style=\"margin:4px 0 8px\">Copy the text and paste it into <code>progress/feedback.md</code> on GitHub, or into the chat with your teacher.</p>\n      <button class=\"btn\" type=\"button\" id=\"copy-results\">Copy my results</button>\n      <textarea id=\"results-text\" readonly hidden></textarea>\n    </div>\n  </section>\n\n</main>\n<footer id=\"footer\"></footer>");
/* ============================ PAGE LOGIC ============================ */
(function(){
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
  function say(text){
    if (!hasSpeech) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[«»]/g, ""));
    u.lang = "fr-FR"; if (frVoice) u.voice = frVoice; u.rate = rate;
    speechSynthesis.speak(u);
  }
  function sayList(texts){
    if (!hasSpeech) return;
    speechSynthesis.cancel();
    texts.forEach(t => { const u = new SpeechSynthesisUtterance(t.replace(/[«»]/g, "")); u.lang = "fr-FR"; if (frVoice) u.voice = frVoice; u.rate = rate; speechSynthesis.speak(u); });
  }
  const speakBtn = (text) => el("button", { class: "speak", type: "button", title: "Listen", "aria-label": "Listen", onclick: (ev) => { ev.stopPropagation(); say(text); } }, "🔊");

  const rateInput = $("#rate");
  rateInput.value = rate;
  rateInput.addEventListener("input", () => { rate = parseFloat(rateInput.value); store.set("fr-rate", rate); });

  /* ---------- language ---------- */
  let lang = store.get("fr-lang", "en");
  const langSel = $("#lang");
  langSel.value = lang;
  langSel.addEventListener("change", () => { lang = langSel.value; store.set("fr-lang", lang); renderReading(); renderConversation(); renderQuiz(); });
  const quizLang = () => (lang === "none" ? "en" : lang);
  function trNode(o){
    if (lang === "none") return null;
    return el("div", { class: "trline" + (lang === "fa" ? " fa" : ""), dir: lang === "fa" ? "rtl" : "ltr", lang: lang }, o[lang]);
  }

  /* ---------- header ---------- */
  const L = LESSON;
  document.title = `Jour ${L.day} — ${L.theme.fr}`;
  $("#title").textContent = `Jour ${L.day} · ${L.theme.fr}`;
  $("#subtitle").textContent = `${L.theme.en} — Week ${L.week} — ${new Date(L.date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`;

  /* ---------- words ---------- */
  function renderWords(){
    const grid = $("#word-grid");
    grid.innerHTML = "";
    L.words.forEach(w => {
      const tr = el("div", { class: "tr", onclick: (ev) => ev.currentTarget.classList.toggle("revealed") },
        el("div", {}, el("b", {}, "EN"), el("span", {}, w.en)),
        el("div", {}, el("b", {}, "SV"), el("span", {}, w.sv)),
        el("div", { class: "fa", lang: "fa" }, el("span", {}, w.fa), el("b", {}, "FA")));
      grid.append(el("div", { class: "card" + (w.review ? " review" : "") },
        w.review ? el("span", { class: "badge" }, "Révision") : null,
        el("div", { class: "fr-row" }, speakBtn(w.fr), el("span", { class: "fr-word", lang: "fr" }, w.fr)),
        tr,
        w.example ? el("div", { class: "ex" },
          el("div", { class: "fr-row", style: "margin:0" }, speakBtn(w.example), el("span", { lang: "fr" }, w.example)),
          w.example_en ? el("div", { class: "muted" }, w.example_en) : null) : null));
    });
  }
  $("#hide-tr").addEventListener("change", (e) => {
    $("#word-grid").classList.toggle("hide-tr", e.target.checked);
    document.querySelectorAll("#word-grid .tr").forEach(t => t.classList.remove("revealed"));
  });

  /* ---------- tip ---------- */
  if (L.tip){
    $("#tip-section").hidden = false;
    $("#tip").append(
      L.tip.title ? el("p", {}, el("strong", { lang: "fr" }, L.tip.title)) : null,
      el("p", {}, el("b", {}, "EN: "), L.tip.en),
      el("p", {}, el("b", {}, "SV: "), L.tip.sv),
      el("p", { class: "fa", dir: "rtl", lang: "fa" }, L.tip.fa));
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
          trNode(l))));
    });
  }
  $("#read-all").addEventListener("click", () => sayList(L.reading.lines.map(l => l.fr)));

  /* ---------- conversation ---------- */
  function renderConversation(){
    $("#conv-title").textContent = "💬 Conversation : " + L.conversation.title;
    $("#conv-situation").textContent = L.conversation.situation || "";
    const first = L.conversation.lines[0] && L.conversation.lines[0].speaker;
    const box = $("#conv-lines");
    box.innerHTML = "";
    L.conversation.lines.forEach(l => {
      box.append(el("div", { class: "bubble-row" + (l.speaker === first ? "" : " right") },
        el("div", { class: "bubble" },
          el("div", { class: "who" }, l.speaker),
          el("div", { class: "fr-line" }, el("span", { lang: "fr" }, l.fr), speakBtn(l.fr)),
          trNode(l))));
    });
  }
  $("#conv-all").addEventListener("click", () => sayList(L.conversation.lines.map(l => l.fr)));

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
      fb.textContent = `✘ It was ${currentNum.n} = ${currentNum.fr}`; fb.className = "feedback bad";
    }
    $("#num-score").textContent = `Score: ${numStats.correct} / ${numStats.asked}`;
  }
  $("#num-play").addEventListener("click", playNumber);
  $("#num-repeat").addEventListener("click", () => currentNum && say(currentNum.fr));

  /* ---------- word quiz ---------- */
  const quiz = { order: shuffle(L.words), i: 0, correct: 0, missed: [], answered: false, done: false };
  function renderQuiz(){
    const area = $("#quiz-area");
    area.innerHTML = "";
    const ql = quizLang();
    if (quiz.done){
      area.append(
        el("p", { class: "qword" }, `🎉 ${quiz.correct} / ${quiz.order.length}`),
        quiz.missed.length ? el("p", {}, "To review: ", el("strong", { lang: "fr" }, quiz.missed.join(", "))) : el("p", {}, "Parfait ! No mistakes."),
        el("button", { class: "btn ghost", type: "button", onclick: () => { Object.assign(quiz, { order: shuffle(L.words), i: 0, correct: 0, missed: [], answered: false, done: false }); renderQuiz(); } }, "Try again"));
      return;
    }
    const w = quiz.order[quiz.i];
    const others = shuffle(L.words.filter(x => x !== w)).slice(0, 3);
    const opts = el("div", { class: "opts" });
    shuffle([w, ...others]).forEach(o => {
      opts.append(el("button", { class: "opt" + (ql === "fa" ? " fa" : ""), type: "button", dir: ql === "fa" ? "rtl" : "ltr",
        onclick: (ev) => answerQuiz(o === w, ev.currentTarget, opts, w) }, o[ql]));
    });
    area.append(
      el("p", { class: "muted" }, `Question ${quiz.i + 1} / ${quiz.order.length} · Score ${quiz.correct}`),
      el("div", { class: "qword" }, speakBtn(w.fr), el("span", { lang: "fr" }, w.fr)),
      opts,
      el("div", { class: "feedback", id: "quiz-feedback" }),
      el("button", { class: "btn", type: "button", id: "quiz-next", hidden: "hidden", onclick: () => { quiz.i++; if (quiz.i >= quiz.order.length) quiz.done = true; renderQuiz(); } }, "Next →"));
  }
  function answerQuiz(ok, btn, opts, w){
    opts.querySelectorAll(".opt").forEach(b => b.disabled = true);
    const fb = $("#quiz-feedback");
    if (ok){ quiz.correct++; btn.classList.add("ok"); fb.textContent = "✔ Très bien !"; fb.className = "feedback ok"; }
    else {
      btn.classList.add("bad");
      opts.querySelectorAll(".opt").forEach(b => { if (b.textContent === w[quizLang()]) b.classList.add("ok"); });
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
      const msg = pct >= 90 ? "Excellent ! 🌟" : pct >= 70 ? "Très bien ! 👍" : pct >= 50 ? "Pas mal — review the mistakes. 💪" : "Keep going — read the explanations again. 📚";
      put(
        el("p", { class: "qword" }, `🎉 ${dq.correct} / ${DQ.length} (${pct}%)`),
        el("p", {}, msg),
        dq.missed.length ? el("div", {}, el("strong", {}, "Questions to review:"),
          el("ul", { class: "missed-list" }, dq.missed.map(k => el("li", {}, `Q${k + 1} (${TYPE_LABEL[DQ[k].type] || DQ[k].type}): ${DQ[k].q}` + (DQ[k].fr && !DQ[k].listen ? ` « ${DQ[k].fr} »` : "") + " → ", el("strong", {}, DQ[k].options[DQ[k].answer]))))) : null,
        el("button", { class: "btn ghost", type: "button", onclick: dqReset }, "Try again"));
      return;
    }
    const item = DQ[dq.i];
    const order = shuffle(item.options.map((t, k) => k));
    const opts = el("div", { class: "dq-opts" });
    order.forEach(k => opts.append(el("button", { class: "opt", type: "button", "data-k": k,
      onclick: (ev) => answerDQ(k, ev.currentTarget, opts, item) }, item.options[k])));
    put(
      el("p", { class: "muted", style: "margin:0" }, `Question ${dq.i + 1} / ${DQ.length} · Score ${dq.correct}`),
      el("span", { class: "dq-type" }, TYPE_LABEL[item.type] || item.type),
      el("div", { class: "dq-q" }, item.q),
      item.fr ? el("div", { class: "dq-fr" }, speakBtn(item.fr), item.listen ? el("span", { class: "muted" }, "🎧 Listen (press 🔊)") : el("span", { lang: "fr" }, item.fr)) : null,
      opts,
      el("div", { class: "feedback", id: "dq-feedback" }),
      el("div", { class: "explain", id: "dq-explain", hidden: "hidden" }),
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
    if (item.explain || item.listen){ ex.hidden = false; ex.textContent = (item.listen ? `« ${item.fr} » — ` : "") + (item.explain || ""); }
    $("#dq-bar").style.width = (100 * dq.answered / DQ.length) + "%";
    $("#dq-next").hidden = false;
  }

  /* ---------- results ---------- */
  $("#copy-results").addEventListener("click", () => {
    const answeredWords = quiz.done ? quiz.order.length : quiz.i + (document.querySelector("#quiz-next:not([hidden])") ? 1 : 0);
    const text =
      `${L.date} — Day ${L.day} (${L.theme.fr}): ` +
      `daily quiz ${dq.correct}/${dq.answered}` + (dq.done ? "" : ` (answered ${dq.answered} of ${DQ.length})`) +
      `; missed questions: ${dq.missed.length ? dq.missed.map(k => `Q${k + 1} ${DQ[k].type}`).join(", ") : "none"}` +
      `; word drill ${quiz.correct}/${answeredWords}` + (quiz.done ? "" : " (not finished)") +
      `; missed words: ${quiz.missed.length ? quiz.missed.join(", ") : "none"}` +
      `; numbers ${numStats.correct}/${numStats.asked}` +
      `; missed numbers: ${numStats.missed.length ? numStats.missed.join(", ") : "none"}.`;
    const ta = $("#results-text");
    ta.hidden = false; ta.value = text; ta.select();
    const done = () => { $("#copy-results").textContent = "✔ Copied!"; setTimeout(() => $("#copy-results").textContent = "Copy my results", 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done, () => { try { document.execCommand("copy"); done(); } catch(e){} }); }
    else { try { document.execCommand("copy"); done(); } catch(e){} }
  });

  $("#footer").textContent = `Jour ${L.day} · ${L.date} · Made by your French teacher 🇫🇷`;

  renderWords(); renderReading(); renderConversation(); renderNumbers(); renderQuiz(); renderDQ();
})();
