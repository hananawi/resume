import { useEffect, useRef, useState } from "react";

import './index.scss';
// import tmp from './response.json';

function AnimatedLetters(props) {

  const lettersRef = useRef([]);
  const chars = useRef('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split(''));
  const charsLength = useRef(chars.current.length);
  const duration = useRef(Math.ceil(60 / props.string.length));  // frame, 60frame per second
  const count = useRef(0);
  const frameId = useRef(0);
  const timeoutId = useRef(0);
  const done = useRef(0);

  useEffect(() => {
    render();
    return () => {
      window.cancelAnimationFrame(frameId.current);
      clearTimeout(timeoutId.current);
    }
  }, []);

  console.log(11111);

  function render() {
    if (done.current < props.string.length) {
      // lettersRef.current.forEach((val, index) => {
      for (let i = done.current; i < props.string.length; i++) {
        const val = lettersRef.current[i];
        if (count.current < duration.current * (i + 1)) {
          val.textContent = chars.current[Math.floor(Math.random() * charsLength.current)];
        } else {
          val.textContent = props.string[i];
          done.current++;
          val.classList.add('done');
        }
      }
      count.current++;
      frameId.current = window.requestAnimationFrame(render);
    } else {
      timeoutId.current = setTimeout(function () {
        done.current = 0;
        count.current = 0;
        lettersRef.current.forEach(val => {
          val.classList.remove('done');
        });
        frameId.current = window.requestAnimationFrame(render);
      }, 750);
    }
  }

  return (
    <div className="animated-loading">
      {
        props.string.split('').map((val, index) => (
          <span ref={ref => lettersRef.current[index] = ref} key={index}></span>
        ))
      }
    </div>
  );
}

function MyPage(props) {

  const [resultJson, setResultJson] = useState(null);
  const [textFlag, setTextFlag] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const hasMutipliedRatio = useRef(false);
  const divBoxes = useRef([]);

  useEffect(() => {
    window.onresize = function () {
      draw(resultJson);
    }
  }, [resultJson]);

  function resize(elRef) {
    const containerWidth = elRef.current.parentElement.clientWidth;
    const width = containerWidth;
    const height = 150 * width / 300;
    console.log(containerWidth, width, height);
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    return { width, height };
  }

  function drawBoxes(ctx, coords) {
    ctx.strokeStyle = '#000';
    coords.forEach(vertices => {
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    });
  }

  function draw(json) {
    if (!json) {
      return;
    }
    const ctx = canvasRef.current.getContext('2d');
    // ctx.clearRect(0, 0)

    const coords = json.responses[0].textAnnotations.map(val => val.boundingPoly.vertices);

    const img = new Image();
    img.src = imageUrl;
    img.onload = function (e) {
      URL.revokeObjectURL(img.src);
      const { width, height } = resize(canvasRef);
      ctx.drawImage(img, 0, 0, width, height);
      if (!hasMutipliedRatio.current) {
        const ratioWidth = width / img.width;
        const ratioHeight = height / img.height;
        coords.forEach(vertices => {
          vertices.forEach(coord => {
            coord.x *= ratioWidth;
            coord.y *= ratioHeight;
          });
        });
        hasMutipliedRatio.current = true;
      }
      drawBoxes(ctx, coords);
      drawText(json);
    }
  }

  function drawText(json) {
    const offsetX = canvasRef.current.offsetLeft;
    const offsetY = canvasRef.current.offsetTop;
    for (let i = 0; i < json.responses[0].textAnnotations.length; i++) {
      const val = json.responses[0].textAnnotations[i];
      if (val.description.includes('\n')) {
        continue;
      }
      genDivBox(
        val.description,
        val.boundingPoly.vertices[0].x,
        val.boundingPoly.vertices[0].y,
        Math.abs(val.boundingPoly.vertices[1].x - val.boundingPoly.vertices[0].x),  // width
        Math.abs(val.boundingPoly.vertices[2].y - val.boundingPoly.vertices[1].y),  // height
        offsetX,
        offsetY,
        Math.abs(val.boundingPoly.vertices[1].y - val.boundingPoly.vertices[2].y)
      );
    }
  }

  function genDivBox(content, x, y, width, height, canvasOffsetX, canvasOffsetY, fontSize) {
    const div = document.createElement('div');
    div.textContent = content;
    div.style.width = `${width}px`;
    div.style.height = `${height}px`;
    div.style.border = '1px red solid';
    div.style.position = 'absolute';
    div.style.top = `${y + canvasOffsetY}px`;
    div.style.left = `${x + canvasOffsetX}px`;
    div.style.fontSize = `${Math.ceil(fontSize)}px`;
    div.style.lineHeight = `${Math.ceil((fontSize) / 2)}px`;
    div.style.backgroundColor = '#fff';
    div.style.color = '#000';
    div.style.display = 'none';

    canvasRef.current.parentElement.appendChild(div);
    divBoxes.current.push(div);
  }

  function handleSubmitClick(e) {
    if (!imageUrl) {
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(fileInputRef.current.files[0]);
    reader.onload = function (e) {
      const imgBase64 = reader.result.slice(reader.result.indexOf(',') + 1);
      const url = 'https://vision.googleapis.com/v1/images:annotate';
      const apiKey = 'AIzaSyCs7a3C69UMSf8Sy2rPWNJzIF9uqX90jvg';  // replace with your own apiKey
      const requestBody = {
        "requests": [
          {
            "image": {
              "content": imgBase64
            },
            "features": [
              {
                "type": "TEXT_DETECTION"
              }
            ]
          }
        ]
      };
      fetch(`${url}?key=${apiKey}`, {
        method: 'post',
        body: JSON.stringify(requestBody)
      })
        // new Promise((resolve, reject) => {
        //   setTimeout(resolve, 1000, { json() { return tmp; } });
        // })
        .then(res => {
          return res.json();
        })
        .then(json => {
          console.log(json);
          draw(json);
          setIsLoading(false);
          setResultJson(json);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  function handleButtonClick() {
    if (textFlag) {
      console.log(textFlag);
      setTextFlag(false);
      divBoxes.current.forEach(div => {
        div.style.display = 'none';
      });
      console.log(textFlag);
    } else {
      setTextFlag(true);
      divBoxes.current.forEach(div => {
        div.style.display = 'block';
      });
    }
  }

  function handleFileChange(e) {
    setImageUrl(URL.createObjectURL(fileInputRef.current.files[0]));
  }

  function handleRemoveClick() {
    URL.revokeObjectURL(imageUrl);
    setImageUrl('');
    setResultJson(null);
  }

  return (
    <div className="google-vision-api">
      <h2 className="title">Text Detection Application</h2>
      <div className="help-message">Upload an image and get the selectable text within it!</div>
      <div className="form-wrapper">
        <form className={imageUrl ? undefined : 'active'}>
          <i className="fas fa-file-image icon" onClick={() => fileInputRef.current.click()}></i>
          <div>upload your image</div>
          <input type="file" accept="image/*" name="image" id="image"
            ref={fileInputRef}
            onChange={handleFileChange}></input>
        </form>
        <div className={`preview ${resultJson && 'hidden-top' || imageUrl && 'active'}`}>
          <div className="thumbnail">
            <img src={imageUrl}></img>
          </div>
          <div className="image-name">{imageUrl && fileInputRef.current.files[0].name}</div>
        </div>
        <div className={`result ${resultJson && 'active'}`}>
          <canvas width="300" height="150" ref={canvasRef}>canvas api is not available:(</canvas>
        </div>
      </div>
      {
        imageUrl &&
        <button type="button" onClick={handleSubmitClick} className={imageUrl ? undefined : 'forbidden'}>
          Submit
        </button>
      }
      {
        imageUrl &&
        <button onClick={handleRemoveClick}>
          Remove
        </button>
      }
      {
        resultJson &&
        <button type="button" onClick={handleButtonClick}>
          {textFlag ? 'restore' : 'cover image with text'}
        </button>
      }
      {
        isLoading &&
        <AnimatedLetters string="LOADING..." />
      }
      {/* <AnimatedLetters string="LOADING..." /> */}
    </div>
  );
}

export default MyPage;
