function f() {
    const menuIcon = document.querySelector('.menu-icon');
    const catalog = document.querySelector('.catalog');
    const contentCover = document.querySelector('.content-cover');
    menuIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        catalog.classList.toggle('hidden');
        contentCover.classList.toggle('active');
    });

    let flag = false;
    document.body.addEventListener('click', () => {
        // console.log('body', flag);
        if(!flag) {
            catalog.classList.add('hidden');
            contentCover.classList.remove('active');
        }
        flag = false;
    });
    catalog.addEventListener('click', () => {
        flag = true;
    });
}

export { f };
