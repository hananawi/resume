function f(params) {
  document.addEventListener('click', () => {
    params.loginForm.classList.remove('active');
  });
  document.addEventListener('click', () => {
    params.sendForm.classList.remove('active');
  })
}

function fLogin(params) {
  // console.log(params.labels);
  params.labels.forEach((label) => {
    label.innerHTML = label.innerHTML.split('').map((letter, idx) => {
      return `<span style="transition-delay: ${0.05 * idx}s;">${letter}</span>`;
    }).join('');
  });
}

export { f, fLogin };
