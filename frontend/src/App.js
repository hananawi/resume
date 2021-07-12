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
        if (!flag) {
            catalog.classList.add('hidden');
            contentCover.classList.remove('active');
        }
        flag = false;
    });
    catalog.addEventListener('click', () => {
        flag = true;
    });

    // const observerCb = (entries) => {
    //     entries.forEach(val => {
    //         if(val.isIntersecting){
    //             console.log("The element is intersecting >");
    //             val.target.classList.add('active')
    //         }
    //     });
    // }
    // const observer = new IntersectionObserver(observerCb)
    // const animationItems = document.querySelectorAll('.animate')
    // animationItems.forEach(val => {
    //     observer.observe(val)
    // });

    document.addEventListener('scroll', () => {
        const animationItems = document.querySelectorAll('.animate');
        const els = document.querySelectorAll('.card-wrapper');
        els.forEach((val, index) => {
            const rect = val.getBoundingClientRect();
            if(rect.top < 0.7 * window.innerHeight) {
                animationItems[index].classList.add('active');
            } else {
                animationItems[index].classList.remove('active');
            }
        });
    });
}

export { f };
