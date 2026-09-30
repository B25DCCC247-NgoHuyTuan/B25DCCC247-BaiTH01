document.documentElement.classList.add("js");

/* 1. Menu hamburger */
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
hamburger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open);
  hamburger.textContent = open ? "✕" : "☰";
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
    hamburger.textContent = "☰";
  })
);

/* 2. Chế độ sáng/tối (nhớ lựa chọn bằng localStorage) */
const themeBtn = document.getElementById("themeToggle");
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
applyTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

/* 3. Smooth scroll: CSS lo phần cuộn, JS đánh dấu mục menu đang xem */
const links = document.querySelectorAll(".menu a");
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

/* 4. Hiệu ứng xuất hiện khi cuộn */
const revealer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

/* 5 + 6. Lọc theo tag và tìm kiếm dự án theo từ khóa */
const cards = document.querySelectorAll(".card");
const searchInput = document.getElementById("search");
const filters = document.getElementById("filters");
const emptyMsg = document.getElementById("empty");
let activeTag = "all";

function filterProjects() {
  const keyword = searchInput.value.trim().toLowerCase();
  let shown = 0;
  cards.forEach((card) => {
    const text = (card.dataset.title + " " + card.dataset.tags + " " + card.textContent).toLowerCase();
    const match = (activeTag === "all" || card.dataset.tags.split(" ").includes(activeTag)) && text.includes(keyword);
    card.classList.toggle("hide", !match);
    if (match) shown++;
  });
  emptyMsg.hidden = shown > 0;
}
searchInput.addEventListener("input", filterProjects);
filters.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  filters.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  activeTag = chip.dataset.tag;
  filterProjects();
});

/* 7. Đếm ký tự */
const message = document.getElementById("message");
const count = document.getElementById("count");
message.addEventListener("input", () => (count.textContent = message.value.length));

/* 8. Validate form (nhiều điều kiện) */
const form = document.getElementById("contactForm");
const success = document.getElementById("success");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

function setError(input, msg) {
  document.getElementById(input.id + "Err").textContent = msg;
  input.closest(".field").classList.toggle("invalid", Boolean(msg));
  return !msg;
}
function checkName() {
  const v = nameInput.value.trim();
  if (!v) return setError(nameInput, "Vui lòng nhập họ và tên.");
  if (v.length < 2) return setError(nameInput, "Họ và tên cần ít nhất 2 ký tự.");
  if (/\d/.test(v)) return setError(nameInput, "Họ và tên không được chứa chữ số.");
  return setError(nameInput, "");
}
function checkEmail() {
  const v = emailInput.value.trim();
  if (!v) return setError(emailInput, "Vui lòng nhập email.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setError(emailInput, "Email chưa đúng định dạng, ví dụ: ten@gmail.com.");
  return setError(emailInput, "");
}
function checkMessage() {
  const v = messageInput.value.trim();
  if (!v) return setError(messageInput, "Vui lòng nhập nội dung.");
  if (v.length < 10) return setError(messageInput, "Nội dung cần ít nhất 10 ký tự.");
  return setError(messageInput, "");
}
nameInput.addEventListener("blur", checkName);
emailInput.addEventListener("blur", checkEmail);
messageInput.addEventListener("blur", checkMessage);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  success.hidden = true;
  const ok = [checkName(), checkEmail(), checkMessage()].every(Boolean);
  if (!ok) return;
  success.hidden = false;
  form.reset();
  count.textContent = 0;
});

/* 9. Năm hiện tại ở footer */
document.getElementById("year").textContent = new Date().getFullYear();