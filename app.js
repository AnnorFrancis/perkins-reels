/* One-Tap Post Calendar engine, Perkins edition (from the Builder's Book v1 engine, 2 Oct 2026).
   Reads window.CAL and window.POSTS (format in ../make-phone.py) and shows one day at a time.
   Each platform button copies that platform's caption, then opens the phone's share menu with the
   right picture(s) or video already attached: tap the app, paste, post. Ticks stay on this phone only.
   Difference from v1: media.feed and media.story may be arrays, so a carousel shares all its slides at once. */
(function () {
  "use strict";
  var CAL = window.CAL || {}, POSTS = window.POSTS || [];
  var ICON = {"instagram":"M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077","whatsapp":"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z","tiktok":"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z","snapchat":"M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z","facebook":"M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"};
  var LINK_NOTE = CAL.link ? CAL.link.replace(/^https?:\/\//, "") : "";

  // Platform rules: which picture each one wants, whether the caption can ride along, and what to tell the user.
  var PLAT = {
    instagram: { cls: "ig", name: "Instagram", sub: ["Feed post", "Reel", "Carousel"], file: "feed", text: false,
      hint: function (v, n) { return "<b>Caption copied.</b> Tap Instagram, choose " + (v ? "Reels" : "Feed") + (n > 1 ? " (all " + n + " slides are attached, in order)" : "") + ", then paste the caption."; } },
    whatsapp: { cls: "wa", name: "WhatsApp", sub: ["Status", "Status video", "Status, " + "slides"], file: "story", text: true,
      hint: function (v, n) { return "Tap <b>WhatsApp</b>, then <b>My status</b> at the top." + (n > 1 ? " Each slide becomes its own status." : "") + " The caption is filled in (if the box is empty, paste)."; } },
    tiktok: { cls: "tt", name: "TikTok", sub: ["Photo post", "Video", "Photo carousel"], file: "story", text: false,
      hint: function (v) { return "<b>Caption copied.</b> Tap TikTok, then paste the caption. TikTok not in the menu? Open <b>More</b> below, save the " + (v ? "video" : "tall picture") + ", and pick it in TikTok."; } },
    snapchat: { cls: "sc", name: "Snapchat", sub: ["Story", "Story video", "Story, slides"], file: "story", text: false,
      hint: function () { return "<b>Caption copied.</b> Tap Snapchat, send to <b>My Story</b>, and paste the caption."; } },
    facebook: { cls: "fb", name: "Facebook", sub: ["Page post", "Page reel", "Album post"], file: "feed", text: false,
      hint: function (v) { return "<b>Caption copied.</b> Tap Facebook, post " + (v ? "the reel " : "") + "on your " + (CAL.brand || "business") + " page, then paste the caption."; } }
  };
  function subOf(P, p) { var v = p.media.kind === "video"; return P.sub[v ? 1 : (count(p) > 1 ? 2 : 0)]; }
  function count(p) { var f = p.media.feed; return Array.isArray(f) ? f.length : 1; }
  var ORDER = (CAL.platforms || Object.keys(PLAT)).filter(function (k) { return PLAT[k]; });

  var KEY = "otpc:" + (CAL.id || "cal") + ":done", NKEY = "otpc:" + (CAL.id || "cal") + ":note";
  var done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { done = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} }

  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function dt(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function svg(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[k] + '"/></svg>'; }
  var TICK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  var days = [], byDay = {};
  POSTS.forEach(function (p) { if (!byDay[p.date]) { byDay[p.date] = []; days.push(p.date); } byDay[p.date].push(p); });
  days.sort();
  Object.keys(byDay).forEach(function (d) { byDay[d].sort(function (a, b) { return a.slot < b.slot ? -1 : 1; }); });
  var today = iso(new Date());
  function startDay() { if (byDay[today]) return today; if (today < days[0]) return days[0]; return days[days.length - 1]; }
  var cur = startDay();

  function dayDone(d) {
    var n = 0, t = 0;
    (byDay[d] || []).forEach(function (p) { ORDER.forEach(function (k) { t++; if (done[p.id + ":" + k]) n++; }); });
    return { n: n, t: t };
  }

  // ---------- files: fetched ahead of the tap, because the share menu must open inside the tap itself ----------
  // Every picture is fetched as-is (the exact bytes on the server), so nothing is resized or re-compressed on the phone.
  var files = {};
  function srcs(p, which) {
    var m = p.media;
    if (m.kind === "video") return [m.video];
    var s = which === "feed" ? m.feed : m.story;
    return Array.isArray(s) ? s : [s];
  }
  function fname(p, which, i, n) {
    var base = (CAL.id || "post") + "-" + p.date + "-" + p.slot.toLowerCase();
    if (p.media.kind === "video") return base + "-video.mp4";
    return base + (which === "feed" ? "-post" : "-tall") + (n > 1 ? "-" + (i + 1) : "") + ".jpg";
  }
  function loadOne(p, which, url, i, n) {
    if (files[url]) return files[url].promise;
    var rec = { file: null };
    rec.promise = fetch(url).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.blob(); }).then(function (b) {
      var type = p.media.kind === "video" ? "video/mp4" : "image/jpeg";
      rec.file = new File([b], fname(p, which, i, n), { type: type });
      return rec.file;
    }).catch(function (e) { delete files[url]; throw e; });
    files[url] = rec;
    return rec.promise;
  }
  function load(p, which) {
    var u = srcs(p, which);
    return Promise.all(u.map(function (url, i) { return loadOne(p, which, url, i, u.length); }));
  }
  function ready(p, which) {
    var out = srcs(p, which).map(function (url) { var r = files[url]; return r && r.file; });
    return out.every(Boolean) ? out : null;
  }

  // ---------- copy: the old synchronous way first, so the tap is still "fresh" for the share menu ----------
  function copyText(t) {
    var ok = false, ta = document.createElement("textarea");
    ta.value = t; ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { ta.setSelectionRange(0, t.length); } catch (e) {}
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (!ok && navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).catch(function () {}); ok = true; }
    return ok;
  }

  var toastTimer = 0;
  function toast(html, ms) {
    var t = $("toast");
    t.innerHTML = html; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, ms || 7000);
  }
  $("toast").addEventListener("click", function () { this.hidden = true; });

  function saveFile(fs) {
    if (!Array.isArray(fs)) fs = [fs];
    var isVid = fs[0].type.indexOf("video") === 0;
    if (isIOS && navigator.canShare && navigator.canShare({ files: fs })) {
      navigator.share({ files: fs }).catch(function () {});
      toast("Tap <b>" + (isVid ? "Save Video" : fs.length > 1 ? "Save " + fs.length + " Images" : "Save Image") + "</b> in the menu. It goes to your Photos.");
      return;
    }
    fs.forEach(function (f, i) {
      setTimeout(function () {
        var a = document.createElement("a"), u = URL.createObjectURL(f);
        a.href = u; a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
      }, i * 400);
    });
    toast("Saved to your phone (Downloads). " + (fs.length > 1 ? "All " + fs.length + " show" : "It shows") + " in your gallery.");
  }

  function share(p, k, btn) {
    var P = PLAT[k], v = p.media.kind === "video", which = P.file;
    var f = ready(p, which);
    if (!f) { toast("Still getting the " + (v ? "video" : "pictures") + " ready. Try again in a second."); load(p, which).then(function () { btn.classList.remove("wait"); }); return; }
    var text = p.cap[k] || "";
    var copied = copyText(text);
    var data = { files: f };
    if (P.text) data.text = text;
    if (navigator.canShare && navigator.canShare(data)) {
      toast(P.hint(v, f.length), 9000);
      navigator.share(data).then(function () {
        done[p.id + ":" + k] = 1; save(); render(false);
        toast("<b>" + P.name + " ticked.</b> " + (P.text ? "" : "The caption is still copied if you need it. ") + "Undo under More.", 5000);
      }).catch(function (e) {
        if (e && e.name === "AbortError") toast("Closed. Nothing was shared.", 3000);
        else { saveFile(f); }
      });
    } else {
      saveFile(f);
      toast("This browser cannot open the share menu, so the " + (v ? "video" : "picture") + " was saved" + (copied ? " and the caption copied" : "") + ". Open " + P.name + " and pick it from your gallery.", 9000);
    }
  }

  // ---------- drawing ----------
  function render(scroll) {
    var i = days.indexOf(cur), d = dt(cur), st = dayDone(cur);
    $("brand").textContent = CAL.title || "Posts";
    $("dayname").textContent = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    $("daysub").textContent = "Day " + (i + 1) + " of " + days.length + (cur === today ? ", today" : "") + ". " + st.n + " of " + st.t + " shared.";
    $("prev").disabled = i <= 0; $("next").disabled = i >= days.length - 1;
    $("today").hidden = cur === startDay();

    var strip = $("strip");
    if (!strip.childElementCount) {
      days.forEach(function (day) {
        var b = document.createElement("button"); b.type = "button"; b.className = "dchip"; b.dataset.d = day;
        var x = dt(day);
        b.innerHTML = "<small>" + x.toLocaleDateString("en-GB", { weekday: "short" }) + "</small><b>" + x.getDate() + "</b><i></i>";
        b.setAttribute("aria-label", x.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }));
        b.addEventListener("click", function () { go(day); });
        strip.appendChild(b);
      });
    }
    Array.prototype.forEach.call(strip.children, function (b) {
      var s = dayDone(b.dataset.d), dot = b.querySelector("i");
      b.classList.toggle("on", b.dataset.d === cur);
      b.classList.toggle("today", b.dataset.d === today);
      dot.className = s.n === 0 ? "" : s.n >= s.t ? "all" : "some";
    });
    if (scroll) { var on = strip.querySelector(".on"); if (on) on.scrollIntoView({ block: "nearest", inline: "center" }); }

    var main = $("main"); main.innerHTML = "";
    var note = null;
    try { note = localStorage.getItem(NKEY); } catch (e) {}
    if (!note) {
      var n = document.createElement("div"); n.className = "note";
      n.innerHTML = "<span><b>How it works:</b> tap a button, the share menu opens with the video ready, tap the app, paste, post. The tick appears by itself.</span>" +
        (standalone ? "" : "<span><b>Put it on your home screen:</b> " + (isIOS ? "tap Share, then Add to Home Screen." : "tap the three dots at the top right, then Add to Home screen.") + "</span>") +
        (LINK_NOTE ? "<span><b>Once:</b> put " + esc(LINK_NOTE) + " in your Instagram and TikTok bio.</span>" : "") +
        "<span><b>Sound:</b> the reels are silent on purpose. Add a trending sound inside TikTok or Instagram before you post, it helps reach.</span>" +
        '<button class="x" type="button">Got it</button>';
      n.querySelector(".x").addEventListener("click", function () { try { localStorage.setItem(NKEY, "1"); } catch (e) {} n.remove(); });
      main.appendChild(n);
    }
    if (today < days[0] && cur === days[0]) {
      var pre = document.createElement("div"); pre.className = "note";
      pre.innerHTML = "<span><b>Posting starts " + esc(dt(days[0]).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })) + ".</b> You can practise on this day now: share to yourself on WhatsApp, then tap a tick to undo it.</span>";
      main.appendChild(pre);
    }
    if (st.t && st.n >= st.t) { var dd = document.createElement("div"); dd.className = "doneday"; dd.textContent = "Done for the day. See you tomorrow."; main.appendChild(dd); }

    (byDay[cur] || []).forEach(function (p) { main.appendChild(card(p)); });
  }

  function card(p) {
    var v = p.media.kind === "video", el = document.createElement("article"); el.className = "post";
    var n = ORDER.filter(function (k) { return done[p.id + ":" + k]; }).length;
    var feeds = srcs(p, "feed"), when = p.slot === "AM" ? "morning" : "evening";
    var media = v
      ? '<video src="' + esc(p.media.video) + '" poster="' + esc(p.media.poster) + '" controls playsinline preload="none"></video>'
      : feeds.map(function (u, i) { return '<img src="' + esc(u) + '" alt="' + esc(p.label) + ' post, ' + when + (feeds.length > 1 ? ", slide " + (i + 1) + " of " + feeds.length : "") + '" decoding="async">'; }).join("");
    el.innerHTML =
      '<div class="phead"><span class="slot">' + (p.slotName || (p.slot === "AM" ? "Morning" : "Evening")) + (p.when ? " · " + esc(p.when) : "") + '</span><span class="label">' + esc(p.label) + '</span><span class="pcount' + (n === ORDER.length ? " all" : "") + '">' + n + " of " + ORDER.length + " shared</span></div>" +
      (p.title ? '<p class="ptitle">' + esc(p.title) + "</p>" : "") +
      (p.note ? '<p class="pnote">' + esc(p.note) + "</p>" : "") +
      '<div class="media' + (feeds.length > 1 && !v ? " multi" : "") + '">' + media + "</div>" +
      '<div class="plats"></div>' +
      '<details class="more"><summary>More: captions and saving</summary><div class="caps"></div></details>';

    var plats = el.querySelector(".plats");
    ORDER.forEach(function (k, i) {
      var P = PLAT[k], key = p.id + ":" + k, b = document.createElement("button");
      b.type = "button";
      b.className = "plat " + P.cls + (done[key] ? " done" : "") + (ORDER.length % 2 && i === ORDER.length - 1 ? " wide" : "") + (ready(p, P.file) ? "" : " wait");
      b.innerHTML = '<span class="ic">' + svg(k) + '</span><span class="tx"><b>' + P.name + "</b><small>" + subOf(P, p) + (p.times && p.times[k] ? " · " + p.times[k] : "") + '</small></span><span class="tick">' + TICK + "</span>";
      b.setAttribute("aria-label", P.name + (done[key] ? ", shared" : ""));
      b.addEventListener("click", function () { share(p, k, b); });
      plats.appendChild(b);
    });

    var caps = el.querySelector(".caps");
    ORDER.forEach(function (k) {
      var P = PLAT[k], key = p.id + ":" + k, c = document.createElement("div"); c.className = "cap";
      c.innerHTML = "<h3><span>" + P.name + '</span><span><button class="mini cp" type="button">Copy</button> <button class="mini tk" type="button">' + (done[key] ? "Untick" : "Tick") + "</button></span></h3><pre></pre>";
      c.querySelector("pre").textContent = p.cap[k] || "";
      c.querySelector(".cp").addEventListener("click", function () { var ok = copyText(p.cap[k] || ""); this.textContent = ok ? "Copied" : "Select it"; var t = this; setTimeout(function () { t.textContent = "Copy"; }, 1400); });
      c.querySelector(".tk").addEventListener("click", function () { if (done[key]) delete done[key]; else done[key] = 1; save(); render(false); });
      caps.appendChild(c);
    });
    var saves = document.createElement("div"); saves.className = "saves";
    var many = feeds.length > 1;
    (v ? [["video", "Save the video"]] : [["feed", many ? "Save the 4:5 slides" : "Save the 4:5 picture"], ["story", many ? "Save the tall slides" : "Save the tall picture"]]).forEach(function (s) {
      var b = document.createElement("button"); b.type = "button"; b.className = "mini"; b.textContent = s[1];
      b.addEventListener("click", function () { var f = ready(p, s[0] === "video" ? "feed" : s[0]); if (f) saveFile(f); else { toast("Still loading. Try again in a second."); load(p, s[0]); } });
      saves.appendChild(b);
    });
    caps.appendChild(saves);

    // fetch both versions now so the buttons work on the first tap
    var need = v ? ["feed"] : ["feed", "story"];
    need.forEach(function (w) {
      load(p, w).then(function () {
        Array.prototype.forEach.call(plats.children, function (b, i) { if (PLAT[ORDER[i]].file === w || v) b.classList.remove("wait"); });
      }).catch(function () { toast("Could not load a picture. Check your internet, then pull down to refresh."); });
    });
    return el;
  }

  function go(day) { if (!byDay[day]) return; cur = day; render(true); window.scrollTo(0, 0); }
  $("prev").addEventListener("click", function () { var i = days.indexOf(cur); if (i > 0) go(days[i - 1]); });
  $("next").addEventListener("click", function () { var i = days.indexOf(cur); if (i < days.length - 1) go(days[i + 1]); });
  $("today").addEventListener("click", function () { go(startDay()); });
  // posting-times sheet: the schedule picture, press and hold to save it
  if (CAL.times) {
    var sheet = $("sheet"); $("timesimg").src = CAL.times; $("timesbtn").hidden = false;
    $("timesbtn").addEventListener("click", function () { sheet.hidden = false; });
    $("sheetx").addEventListener("click", function () { sheet.hidden = true; });
    sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.hidden = true; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") sheet.hidden = true; });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") { var t = iso(new Date()); if (t !== today) { today = t; go(startDay()); } else render(false); }
  });

  if (!days.length) { $("main").innerHTML = '<p class="note">No posts yet.</p>'; return; }
  render(true);
  if ("serviceWorker" in navigator) { window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); }); }
})();
