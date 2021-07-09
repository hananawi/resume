import { useEffect, useState } from 'react';

function useScript(url) {
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  useEffect(() => {
    document.body.appendChild(script);
    return function () {
      document.body.removeChild(script);
    };
  }, [url]);
}

function useConstructor(callback) {
  const [flag, setFlag] = useState(false);
  if(flag) return;
  callback();
  setFlag(true);
}

function syncSleep(second) {
  const start = Date.now();;
  while (Date.now() - start < second * 1000);
}

function sleep(second) {
  return new Promise((resolve) => {
    setTimeout(resolve, second * 1000);
  });
}

export { useScript, useConstructor, syncSleep, sleep };
