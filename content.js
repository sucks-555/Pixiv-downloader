if (location.host === "www.pixiv.net") {

  function processImage(img, i) {
    const pathArray = img.src.split('/');
    const parts = pathArray[pathArray.length - 1].split('.') || [`${location.pathname.split("/artworks/")[1]}_p${i}`];
    const extension = parts.length > 1 ? parts[parts.length - 1] : 'jpg';
    return { url: img.src, fileName: parts[0], extension: extension };
  }

  async function GETpixiv() {
    const filelist = [];
    const button = document.querySelector(".sc-emr523-2");
    button && button.click();
    await new Promise(resolve => {
      setTimeout(() => {
        const exception = document.querySelector(".sc-1qlsbpb-0");
        if (exception) {
          const lane = exception.querySelector('.sc-1oz5uvo-1').querySelectorAll('img');
          for (let i = 0; i < lane.length; i++) {
            filelist.push(processImage(lane[i], i));
          }
        } else {
          const figure = document.querySelectorAll("figure")[0];
          const image = figure.querySelectorAll("img");
          for (let i = 0; i < image.length; i++) {
            filelist.push(processImage(image[i], i));
          }
        }
        resolve();
      }, 1000);
    });
    download(filelist);
  }

  async function FullGETpixiv() {
    const wait = 200;
    const filelist = [];
    const button = document.querySelector(".sc-emr523-2");
    button && button.click();
    await new Promise(resolve => {
      setTimeout(async () => {
        const exception = document.querySelector(".sc-1qlsbpb-0");
        if (exception) {
          const lane = exception.querySelector('.sc-1oz5uvo-1').querySelectorAll('img');
          const count = parseInt(document.querySelector(".sc-yzbnij-6").innerHTML, 10)-1 || lane.length
          const master_image = exception.querySelector("img")
          master_image && master_image.click()
          for (let i = 0; i < count; i ++) {
            await delay(wait);
            const origin = document.querySelector(".sc-tmsb78-0");
            const img = origin.querySelector("img")
            filelist.push(processImage(img, i));
            await delay(wait);
            img && img.scrollIntoView({
              behavior: 'instant',
              block: 'end'
            });
            setTimeout(() => {
              const nextButton = document.querySelector(".sc-tmsb78-3");
              nextButton && nextButton.click();
            }, 0);
          }
        } else {
          const figure = document.querySelectorAll("figure")[0];
          const a = figure.querySelectorAll("a");
          for (let i = 0; i < a.length; i++) {
            a[i].click();
            await delay(wait);
            const presentation = document.querySelector(`.sc-1pkrz0g-1`);
            const img = presentation.querySelector("img");
            filelist.push(processImage(img, i));
            await delay(wait);
            const nextButton = document.querySelector("button.sc-691snt-1.sc-691snt-3.cdYVyZ.bThEqM");
            nextButton && nextButton.click();
          }
        }

        resolve();
      }, 1000);
    });
    download(filelist)
  }
  async function download(files) {
    for (let i = 0; i < files.length; i++) {
      await delay(300);
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
