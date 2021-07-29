import { useState, useEffect, useRef } from 'react';
import React from 'react';

// import Prism from 'prismjs';
// import 'prismjs/themes/prism-tomorrow.css';

import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/javascript/javascript.js';

import './index.sass';

// const selection = window.getSelection();
// let restore = () => { };

// function getCaretPosition(codeNode, index) {
//   const treeWalker = document.createTreeWalker(codeNode, NodeFilter.SHOW_TEXT, {
//     acceptNode(node) {
//       if (index > node.textContent.length) {
//         index -= node.textContent.length;
//         return NodeFilter.FILTER_REJECT;
//       } else {
//         return NodeFilter.FILTER_ACCEPT;
//       }
//     }
//   });
//   const nextNode = treeWalker.nextNode();
//   return {
//     node: nextNode ? nextNode : codeNode,
//     position: index
//   };
// }

// function saveCaretPosition(codeNode) {
//   let range = selection.getRangeAt(0);
//   range.setStart(codeNode, 0);
//   let length = range.toString().length;

//   return function restore() {
//     const { node, position } = getCaretPosition(codeNode, length);
//     // console.log(node, position);
//     const range = new Range();
//     selection.removeAllRanges();
//     range.setStart(node, position);
//     selection.addRange(range);
//   };
// }

// function MyEditor2(props) {

//   useEffect(() => {
//     // Prism.highlightElement(codeRef.current);
//     restore();
//   });

//   const [content, setContent] = useState('');
//   const [rowNumber, setRowNumber] = useState(1);

//   const codeRef = useRef(null);

//   function handleInput(e) {
//     e.preventDefault();
//     setContent(e.target.textContent);
//     restore = saveCaretPosition(codeRef.current);
//     // codeRef.current.focus();
//     // console.log(content);
//   }

//   function handleFocus() {

//   }

//   function handleKeyDown(e) {
//     if (e.keyCode === 13) {  // enter
//       e.preventDefault();
//       setContent((prev) => prev + '\n');
//       // setContent(e.target.textContent);
//       const range = selection.getRangeAt(0);
//       range.setStart(range.startContainer, range.startContainer.textContent.length);
//       restore = saveCaretPosition(codeRef.current);
//     }
//   }

//   function handlePaste(e) {
//     // e.preventDefault();
//     console.log(e);
//     let paste = (e.nativeEvent.clipboardData || window.clipboardData).getData('text');
//     console.log(paste.toString());
//     console.log(paste.split('').map(val => val.charCodeAt(0)).join(', '));
//   }

//   return (
//     <div className="editor">
//       <div className="editor-header">
//         header
//       </div>
//       <pre
//         className="editor-content">
//         {/* <textarea
//           className="editor-input"></textarea> */}
//         <div
//           className={`editor-output ${props.codeType}`}
//           spellCheck="false"
//           ref={codeRef}
//           onInput={handleInput}
//           onFocus={handleFocus}
//           onKeyDown={handleKeyDown}
//           onPaste={handlePaste}
//           suppressContentEditableWarning={true}>
//           {
//             Array(rowNumber).fill(0).map((val, index) => (
//               <div key={index}>
//                 <pre
//                   className="CodeMirror-line"
//                   contentEditable></pre>
//               </div>
//             ))
//           }
//         </div>
//       </pre>
//     </div>
//   );
// }

const genHtml = (html, css, javascript) => {
  const retHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <title>codepen clone</title>

      <style>
        ${css}
      </style>
    </head>
  
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      ${html}

      <script>
        ${javascript}
      </script>
    </body>
  </html>
  `;

  return retHtml;
}

const resizeStickFlags = [false, false];
let startX = 0;
let rowResizerFlag = false;
let startY = 0;

function useSessionStorage(key, initValue) {
  const [value, setValue] = useState(() => {
    const v = sessionStorage.getItem(key);
    if (v === null) {
      return initValue;
    } else {
      return JSON.parse(v);
    }
  });

  return [value, (val) => {
    setValue(val);
    sessionStorage.setItem(key, JSON.stringify(val));
  }];
}

function SplitFlexWindow(props) {

  const { children } = props;
  let editors = null;

  const childrenRef = useRef([]);

  useEffect(() => {
    editors = childrenRef.current;
  });

  function handleMouseDown(e, index) {
    startX = e.clientX;
    resizeStickFlags[index] = true;
  }

  function handleMouseMove(e) {
    if (resizeStickFlags[0]) {
      const left = e.clientX - startX < 0;
      if (left && editors[0].clientWidth <= 80) {
        return;
      } else if (!left && editors[1].clientWidth <= 80) {
        return;
      }
      editors[0].style.width = `${editors[0].clientWidth + e.clientX - startX}px`;
      editors[1].style.width = `${editors[1].clientWidth + startX - e.clientX}px`;
      startX = e.clientX;
    } else if (resizeStickFlags[1]) {
      const left = e.clientX - startX < 0;
      if (left && editors[1].clientWidth <= 80) {
        return;
      } else if (!left && editors[2].clientWidth <= 80) {
        return;
      }
      editors[1].style.width = `${editors[1].clientWidth + e.clientX - startX}px`;
      editors[2].style.width = `${editors[2].clientWidth + startX - e.clientX}px`;
      startX = e.clientX;
    }
  }

  return (
    <div
      className="split-flex-window"
      onMouseMove={handleMouseMove}>
      {/* {
        props.children.slice(0, -1).map((val, index) => (
          <div key={index}>
            {val}
            <div className="resize-stick"></div>
          </div>
        ))
      }
      {props.children[props.children.length - 1]} */}

      <div className="resize-stick"></div>

      {
        React.cloneElement(children[0], {
          // ref: el => childrenRef.current[0] = el
          childrenRef: childrenRef,
          index: 0
        })
      }

      <div
        className="resize-stick"
        onMouseDown={e => handleMouseDown(e, 0)}></div>

      {
        React.cloneElement(children[1], {
          // ref: el => childrenRef.current[1] = el
          childrenRef: childrenRef,
          index: 1
        })
      }

      <div
        className="resize-stick"
        onMouseDown={e => handleMouseDown(e, 1)}></div>

      {
        React.cloneElement(children[2], {
          // ref: el => childrenRef.current[2] = el
          childrenRef: childrenRef,
          index: 2
        })
      }
    </div>
  );
}

function MyEditor(props) {

  const { childrenRef, index } = props;

  const dict = {
    'xml': 'html',
    'css': 'css',
    'javascript': 'js'
  };

  const [value, setValue] = useState(props.value);

  function handleBeforeChange(editor, data, value) {
    setValue(value);
    props.handleBeforeChange(value);
  }

  return (
    <div
      className="editor-container"
      ref={el => childrenRef.current[index] = el}>
      <div className="editor-header">
        <div className="type-name">{dict[props.codeType]}</div>
      </div>
      <CodeMirror
        value={value}
        options={{
          theme: "material",
          lineWrapping: true,
          lineNumbers: true,
          mode: props.codeType
        }}
        className="editor"
        onBeforeChange={handleBeforeChange} />
    </div>
  );
}

function MyPage() {

  useEffect(() => {
    // Prism.highlightAll();
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const [html, setHtml] = useSessionStorage('html', '');
  const [css, setCss] = useSessionStorage('css', '');
  const [javascript, setJavascript] = useSessionStorage('javascript', '');

  const [srcDoc, setSrcDoc] = useState(genHtml(html, css, javascript));

  const topRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(genHtml(html, css, javascript));
    }, 1000);
    return () => { clearTimeout(timeout); console.log(1) };
  }, [html, css, javascript]);

  function handleHtmlBeforeChange(newHtml) {
    setHtml(newHtml);
  }

  function handleCssBeforeChange(newCss) {
    setCss(newCss);
  }

  function handleJavascriptBeforeChange(newJavascript) {
    setJavascript(newJavascript);
  }

  function handleMouseUp() {
    resizeStickFlags[0] = false;
    resizeStickFlags[1] = false;
    rowResizerFlag = false;
  }

  function handleRowResizerMouseDown(e) {
    rowResizerFlag = true;
    startY = e.clientY;
  }

  function handleRowResizerMouseMove(e) {
    if (rowResizerFlag) {
      // console.log(topRef.current.clientHeight - startY + e.clientY);
      topRef.current.style.height = `${topRef.current.clientHeight - startY + e.clientY}px`;
      bottomRef.current.style.height = `${bottomRef.current.clientHeight + startY - e.clientY}px`;
      startY = e.clientY;
    }
  }

  return (
    <div
      className="codepen-clone"
      onMouseMove={handleRowResizerMouseMove}>
      <header className="codepen-clone-header">
        Codepen Clone
      </header>
      <div
        className="top-pane"
        ref={topRef}>
        <SplitFlexWindow>
          <MyEditor
            codeType="xml"
            handleBeforeChange={handleHtmlBeforeChange}
            value={html}></MyEditor>
          <MyEditor
            codeType="css"
            handleBeforeChange={handleCssBeforeChange}
            value={css}></MyEditor>
          <MyEditor
            codeType="javascript"
            handleBeforeChange={handleJavascriptBeforeChange}
            value={javascript}></MyEditor>
        </SplitFlexWindow>
      </div>
      <div
        className="row-resizer"
        onMouseDown={handleRowResizerMouseDown}></div>
      <div
        className="bottom-pane"
        ref={bottomRef}>
        <iframe
          className="iframe-box"
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          title="realtime html page">
          Your browser doesn't support the iframe element.
        </iframe>
      </div>
    </div>
  );
}

export default MyPage;
