# Pixiv-downloader
開いてるページのイラストを一括ダウンロードするだけです。

```js
if (location.host === "www.pixiv.net") {

  async function GETPixiv() {
    const filelist = [];
    const button = document.querySelector(".sc-emr523-2");
    try {
      button.click();
    } catch {
      ;
    }
    await new Promise(resolve => {
      setTimeout(() => {
        const figure = document.querySelectorAll("figure")[0];
        const image = figure.querySelectorAll("img");
        for (const img of image) {
          const pathArray = img.src.split('/');
          const parts = pathArray[pathArray.length - 1].split('.') || ["file_"];
          const fileName = parts[0]
          if (parts.length > 1) {
            const extension = parts[parts.length - 1];
            filelist.push({ url: img.src, fileName: fileName, extension: extension });
          } else {
            filelist.push({ url: img.src, fileName: fileName, extension: 'jpg' });
          }
        }
        resolve();
      }, 1000);
    });
    console.log(filelist)
    conversion(filelist);
  }

  async function fullsizeGETpixiv() {
    const filelist = [];
    const button = document.querySelector(".sc-emr523-2");
    button && button.click();
    await new Promise(resolve => {
      setTimeout(async () => {
        const figure = document.querySelectorAll("figure")[0];
        const a = figure.querySelectorAll("a");
        for (let i = 0; i < a.length; i++) {
          console.log(i);
          a[i].click();
          await new Promise(innerResolve => setTimeout(innerResolve, 150));
          const presentation = document.querySelector(`.sc-1pkrz0g-1`);
          const image = presentation.querySelector("img");
          const pathArray = image.src.split('/');
          const parts = pathArray[pathArray.length - 1].split('.') || ["file_"];
          const fileName = parts[0];
          const extension = parts.length > 1 ? parts[parts.length - 1] : 'jpg';
          filelist.push({ url: image.src, fileName: fileName, extension: extension });
          await new Promise(innerResolve => setTimeout(innerResolve, 150));
          const nextButton = document.querySelector("button.sc-691snt-1.sc-691snt-3.cdYVyZ.bThEqM");
          nextButton && nextButton.click();
        }
        resolve();
      }, 500);
    });

    conversion(filelist)
  }

  function downloadFile(url, fileName, fileExtension) {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.blob();
        }
      })
      .then(blob => {
        const objectURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectURL;
        link.download = `${fileName}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(objectURL);
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('error:',error);
      });
  }
  function conversion(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      downloadFile(file.url, file.fileName, file.extension);
    }
  }

  const button = document.createElement('button');
  let isDragging = false;
  let isLongPressing = false;
  let offsetX, offsetY;
  let longPressTimeout;
  let customContextMenu = null;
  button.innerHTML = 'GET';
  button.style.cssText = 'background:rgba(255,255,255,.2);border:none;color:#000;position: fixed;z-index:5500;width:45px;height:33px;border-radius:7px;top:10px;left:5px;cursor:pointer;';
  button.addEventListener("mousedown", handleMouseDown);
  button.addEventListener("mouseup", handleMouseUp);
  button.addEventListener("mousemove", handleMouseMove);
  button.addEventListener("touchstart", handleTouchStart);
  button.addEventListener("touchend", handleTouchEnd);
  button.addEventListener('click', () => GETPixiv());
  button.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (!customContextMenu) {
      customContextMenu = document.createElement('ul');
      customContextMenu.innerHTML = '<li><button id="hide_btn"><h2 style="font-size:13px;">非表示</h2></button><button id="full_btn"><h2 style="font-size:13px;">フルサイズ</h2></button></li>';
      customContextMenu.style.cssText = 'position: fixed;z-index:5500;border-radius:5px;width:auto;height:auto;list-style:none;';
      document.body.appendChild(customContextMenu);
      const hide_btn = document.getElementById('hide_btn');
      const full_btn = document.getElementById('full_btn');
      hide_btn && hide_btn.addEventListener('click', () => hideButton());
      full_btn && full_btn.addEventListener('click', () => fullsizeGETpixiv());


    }
    const x = e.clientX;
    const y = e.clientY;
    customContextMenu.style.left = `${x}px`;
    customContextMenu.style.top = `${y}px`;
    customContextMenu.style.display = 'block';
    customContextMenu.addEventListener('click', () => {
      customContextMenu.style.display = 'none';
    });
  });
  document.body.appendChild(button);
  document.addEventListener('click', () => {
    if (customContextMenu) {
      customContextMenu.style.display = 'none';
    }
  });
  function handleMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - button.getBoundingClientRect().left;
    offsetY = e.clientY - button.getBoundingClientRect().top;
    startLongPressTimer();
  }
  function handleMouseUp() {
    isDragging = false;
    stopLongPressTimer();
  }
  function handleMouseMove(e) {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
    }
  }
  function handleTouchStart(e) {
    e.preventDefault();
    isDragging = true;
    offsetX = e.touches[0].clientX - button.getBoundingClientRect().left;
    offsetY = e.touches[0].clientY - button.getBoundingClientRect().top;
    startLongPressTimer();
  }
  function handleTouchEnd() {
    isDragging = false;
    stopLongPressTimer();
  }
  function startLongPressTimer() {
    isLongPressing = false;
    longPressTimeout = setTimeout(() => {
      isLongPressing = true;
    }, 1000);
  }
  function stopLongPressTimer() {
    clearTimeout(longPressTimeout);
  }
  function hideButton() {
    button.style.display = 'none';
  }

}
```
