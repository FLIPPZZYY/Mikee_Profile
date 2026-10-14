(function () {
  var btn = document.querySelector("button.row.link"),
    gal = document.getElementById("gal");
  btn.addEventListener("click", function () {
    var o = gal.classList.toggle("open");
    btn.setAttribute("aria-expanded", o);
  });
  var imgs = [].slice.call(gal.querySelectorAll("img")),
    lb = document.getElementById("lb"),
    li = document.getElementById("lbimg"),
    lc = document.getElementById("lbcap"),
    cur = 0,
    opener = null;
  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    li.src = imgs[cur].src;
    li.alt = imgs[cur].alt;
    lc.textContent =
      imgs[cur].dataset.cap + " (" + (cur + 1) + " of " + imgs.length + ")";
  }
  function open(i) {
    opener = document.activeElement;
    show(i);
    lb.classList.add("open");
    document.getElementById("lbclose").focus();
  }
  function close() {
    lb.classList.remove("open");
    if (opener) opener.focus();
  }
  imgs.forEach(function (im, i) {
    im.tabIndex = 0;
    im.setAttribute("role", "button");
    im.addEventListener("click", function () {
      open(i);
    });
    im.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(i);
      }
    });
  });
  document.getElementById("lbprev").onclick = function () {
    show(cur - 1);
  };
  document.getElementById("lbnext").onclick = function () {
    show(cur + 1);
  };
  document.getElementById("lbclose").onclick = close;
  lb.addEventListener("click", function (e) {
    if (e.target === lb) close();
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
})();

document.documentElement.classList.add("js");
var els = document.querySelectorAll(".work h2,.row,.cta h2,.cta .btn");
els.forEach(function (e, i) {
  e.classList.add("rv");
  e.style.transitionDelay =
    (e.classList.contains("row") ? (i - 1) * 90 : 0) + "ms";
});
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(
    function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) {
          x.target.classList.add("in");
          io.unobserve(x.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  els.forEach(function (e) {
    io.observe(e);
  });
} else {
  els.forEach(function (e) {
    e.classList.add("in");
  });
}

(function () {
  var f = document.getElementById("contactform");
  if (!f) return;
  var s = document.getElementById("formstatus"),
    b = f.querySelector("button");
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    b.disabled = true;
    s.textContent = "Sending\u2026";
    fetch(f.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(f),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d.success) {
          f.reset();
          s.textContent = "Message sent. Thanks, I'll reply soon.";
        } else {
          throw new Error("fail");
        }
      })
      .catch(function () {
        s.textContent =
          "Couldn't send your message. Try again, or email me directly.";
      })
      .then(function () {
        b.disabled = false;
      });
  });
})();
