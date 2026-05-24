export const showToast = (msg, type = "success") => {
  const div = document.createElement("div");
  div.innerText = msg;
  div.className = `toast ${type}`;

  document.body.appendChild(div);

  setTimeout(() => {
    div.classList.add("fade-out");
  }, 2500);

  setTimeout(() => {
    div.remove();
  }, 3000);
};