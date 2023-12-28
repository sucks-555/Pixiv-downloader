# Pixiv-downloader
開いてるページのイラストを一括ダウンロードするだけです。

2023/12/27 12:00 フルサイズ一括ダウンロード機能追加しました！！！！！！！！！！！！！！！！！

```js
if (location.host === "www.pixiv.net") {

  async function GETpixiv() {
    const filelist = [];
    const button = document.querySelector(".sc-emr523-2");
    button && button.click();
    await new Promise(resolve => {
      setTimeout(() => {
        const figure = document.querySelectorAll("figure")[0];
        const image = figure.querySelectorAll("img");
        for (const img of image) {
          const pathArray = img.src.split('/');
          const parts = pathArray[pathArray.length - 1].split('.') || [`${location.pathname.split("/artworks/")[1]}_p${i}`];
          const extension = parts.length > 1 ? parts[parts.length - 1] : 'jpg';
          filelist.push({ url: img.src, fileName: parts[0], extension: extension });
        }
        resolve();
      }, 1000);
    });
    conversion(filelist);
  }

  async function FullGETpixiv() {
    const wait = 150;
    const filelist = [];
    const button = document.querySelector(".sc-emr523-2");
    button && button.click();
    await new Promise(resolve => {
      setTimeout(async () => {
        const figure = document.querySelectorAll("figure")[0];
        const a = figure.querySelectorAll("a");
        for (let i = 0; i < a.length; i++) {
          a[i].click();
          await delay(wait);
          const presentation = document.querySelector(`.sc-1pkrz0g-1`);
          const image = presentation.querySelector("img");
          const pathArray = image.src.split('/');
          const parts = pathArray[pathArray.length - 1].split('.') || [`${location.pathname.split("/artworks/")[1]}_p${i}`];
          const extension = parts.length > 1 ? parts[parts.length - 1] : 'jpg';
          filelist.push({ url: image.src, fileName: parts[0], extension: extension });
          await delay(wait);
          const nextButton = document.querySelector("button.sc-691snt-1.sc-691snt-3.cdYVyZ.bThEqM");
          nextButton && nextButton.click();
        }
        resolve();
      }, 1000);
    });
    conversion(filelist)
  }
  function conversion(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fetch(file.url)
      .then(response => (response.ok && response.blob()))
      .then(blob => {
        const objectURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectURL;
        link.download = `${file.fileName}.${file.extension}`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(objectURL);
        document.body.removeChild(link);
      })
    }
  }

  function delay(wait) {
    return new Promise(innerResolve => setTimeout(innerResolve, wait));
  }
  function artworks() {
    (location.pathname.startsWith("/artworks/") && document.readyState === "complete") ? addbutton() : setTimeout(artworks, 1000);
  }
  function addbutton() {
    const section = document.querySelector("section div.sc-ye57th-1.lbzRfC section");
    function createButton(label, action) {
      const button = document.createElement("button");
      button.classList.add("px-button");
      button.innerHTML = `<span>${label}</span>`;
      button.addEventListener("click", action);
      return button;
    }
    section.appendChild(createButton("保存", GETpixiv));
    section.appendChild(createButton("フルサイズ保存", FullGETpixiv));
  }

  artworks();
}
```
