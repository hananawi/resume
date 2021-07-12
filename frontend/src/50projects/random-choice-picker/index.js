function f() {
    const tags = document.querySelector('.tags');
    const textarea = document.querySelector('textarea');
    textarea.addEventListener('keyup', (e) => {
        createChoice(e.target.value);
        if (e.key !== 'Enter') {
            return;
        }
        e.target.value = e.target.value.slice(0, e.target.value.length - 1);
        randomSelect();
    });

    function createChoice(input) {
        if(!input.endsWith(',')) {
            input = input + ',';
        }
        input = input.split(',')
            .filter((val) => val.trim() !== '')
            .map((val) => val.trim());
        tags.innerHTML = '';
        input.forEach((val) => {
            const tag = document.createElement('span');
            tag.innerText = val;
            tag.classList.add('tag');
            tags.appendChild(tag);
        })
    }

    function randomSelect() {
        let times = 30;
        setTimeout(function run(n) {
            times--;
            if(times <= 0) {
                return;
            }
            const length = tags.children.length;
            tags.children[n].classList.remove('active');
            n = Math.floor(Math.random() * length);
            tags.children[n].classList.add('active');
            setTimeout(run, 200, n);
        }, 200, 0);
    }
}

export default f;
