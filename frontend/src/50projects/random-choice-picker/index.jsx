import f from './index.js';
import './index.css';

import { useEffect } from 'react';

function MyPage() {
    useEffect(() => {
        f();
    }, []);
    return (
        <section className="random-choice-picker">
            {/* <h3>Enter all of the choices divided by a comma (','). Press enter when you're done</h3> */}
            <h3>输入若干个逗号(英文逗号)隔开的项目后按下回车键</h3>
            <textarea placeholder="例如：a, b, c, d"></textarea>
            <div className="tags"></div>
        </section>
    );
}

export default MyPage;
