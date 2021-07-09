import f from './index.js';
import './index.css';

import { useEffect } from 'react';

function MyPage() {
    useEffect(() => {
        f();
    }, []);
    return (
        <section className="random-choice-picker">
            <h3>Enter all of the choices divided by a comma (','). Press enter when you're done</h3>
            <textarea placeholder="enter choices here..."></textarea>
            <div className="tags"></div>
        </section>
    );
}

export default MyPage;
