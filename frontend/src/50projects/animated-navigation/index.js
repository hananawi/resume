function f() {
    const button = document.querySelector('.animated-button');
    button.addEventListener('click', () => {
        const nav = document.querySelector('section nav');
        nav.classList.toggle('active');
    });
}

export default f;
