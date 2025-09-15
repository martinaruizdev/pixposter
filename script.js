document.addEventListener('DOMContentLoaded', () => {

    const canvasEl = document.getElementById('canvas');
    const fileInput = document.getElementById('file-upload');
    const textInput = document.getElementById('text-input');
    const fontColorInput = document.getElementById('font-color-input');
    const fontSizeInput = document.getElementById('font-size-input');
    const addTextBtn = document.getElementById('add-text-btn');
    const deleteBtn = document.getElementById('delete-btn'); 
    const downloadBtn = document.getElementById('download-btn');
    const grayscaleBtn = document.getElementById('grayscale-btn');
    const sepiaBtn = document.getElementById('sepia-btn');

    const brightnessInput = document.getElementById('brightness-input');
    const brightnessValueSpan = document.getElementById('brightness-value');
    const saturationInput = document.getElementById('saturation-input');
    const saturationValueSpan = document.getElementById('saturation-value');
    const contrastInput = document.getElementById('contrast-input');
    const contrastValueSpan = document.getElementById('contrast-value');
    const hueInput = document.getElementById('hue-input');
    const hueValueSpan = document.getElementById('hue-value');
    
    const stickerBtns = document.querySelectorAll('.sticker-btn');

    const canvas = new fabric.Canvas(canvasEl, {
        width: 800,
        height: 500,
        backgroundColor: "#f0f0f0",
    });

    let mainImage = null; 
    let isGrayscale = false;
    let isSepia = false;

    // --- Funciones de la aplicación ---

    const applyFilters = () => {
        if (!mainImage) return;

        const filters = [];
        if (isGrayscale) {
            filters.push(new fabric.Image.filters.Grayscale());
        }
        if (isSepia) {
            filters.push(new fabric.Image.filters.Sepia());
        }

        const brightnessValue = parseInt(brightnessInput.value);
        if (brightnessValue !== 0) {
            filters.push(new fabric.Image.filters.Brightness({ brightness: brightnessValue / 100 }));
        }

        const saturationValue = parseInt(saturationInput.value);
        if (saturationValue !== 0) {
            filters.push(new fabric.Image.filters.Saturation({ saturation: saturationValue / 100 }));
        }

        const contrastValue = parseInt(contrastInput.value);
        if (contrastValue !== 0) {
            filters.push(new fabric.Image.filters.Contrast({ contrast: contrastValue / 100 }));
        }
        
        const hueValue = parseInt(hueInput.value);
        if (hueValue !== 0) {
            filters.push(new fabric.Image.filters.HueRotation({ rotation: hueValue / 100 }));
        }

        mainImage.filters = filters;
        mainImage.applyFilters();
        canvas.renderAll();
    };

    const handleDeleteObject = () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            canvas.renderAll();
        }
    };

    const updateActiveText = (prop, value) => {
        const active = canvas.getActiveObject();
        if (active && active instanceof fabric.IText) {
            active.set(prop, value);
            canvas.renderAll();
        }
    };

    // --- Manejadores de eventos ---

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (f) => {
            if (mainImage) {
                canvas.remove(mainImage);
            }
            
            fabric.Image.fromURL(
                f.target.result,
                (img) => {
                    if (!img) return;
                    
                    const maxWidth = canvas.getWidth();
                    const maxHeight = canvas.getHeight();
                    const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                    img.scale(scale);

                    img.set({
                        left: canvas.width / 2,
                        top: canvas.height / 2,
                        originX: "center",
                        originY: "center",
                        selectable: false,
                        evented: false,
                    });
                    
                    mainImage = img;
                    canvas.add(mainImage);
                    canvas.moveTo(mainImage, 0);
                    canvas.renderAll();
                    applyFilters(); 
                },
                { crossOrigin: "anonymous" }
            );
        };
        reader.readAsDataURL(file);
    });

    addTextBtn.addEventListener('click', () => {
        const text = new fabric.IText(textInput.value, {
            left: 100,
            top: 100,
            fontSize: parseInt(fontSizeInput.value),
            fill: fontColorInput.value,
            fontFamily: "Arial",
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    });

    deleteBtn.addEventListener('click', handleDeleteObject);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            handleDeleteObject();
        }
    });

    fontColorInput.addEventListener('input', (e) => {
        updateActiveText("fill", e.target.value);
    });

    fontSizeInput.addEventListener('input', (e) => {
        updateActiveText("fontSize", parseInt(e.target.value));
    });

    downloadBtn.addEventListener('click', () => {
        const dataURL = canvas.toDataURL({ format: "png", quality: 1 });
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "mi-diseño.png";
        link.click();
    });

    grayscaleBtn.addEventListener('click', () => {
        isGrayscale = !isGrayscale;
        grayscaleBtn.classList.toggle('bg-gray-400');
        grayscaleBtn.classList.toggle('text-black');
        grayscaleBtn.classList.toggle('bg-gray-200');
        grayscaleBtn.classList.toggle('text-gray-700');
        applyFilters();
    });

    sepiaBtn.addEventListener('click', () => {
        isSepia = !isSepia;
        sepiaBtn.classList.toggle('bg-amber-800');
        sepiaBtn.classList.toggle('text-white');
        sepiaBtn.classList.toggle('bg-amber-500');
        sepiaBtn.classList.toggle('text-gray-800');
        applyFilters();
    });

    brightnessInput.addEventListener('input', (e) => {
        brightnessValueSpan.textContent = `${e.target.value}%`;
        applyFilters();
    });
    
    saturationInput.addEventListener('input', (e) => {
        saturationValueSpan.textContent = `${e.target.value}%`;
        applyFilters();
    });
    
    contrastInput.addEventListener('input', (e) => {
        contrastValueSpan.textContent = `${e.target.value}%`;
        applyFilters();
    });
    
    hueInput.addEventListener('input', (e) => {
        hueValueSpan.textContent = `${e.target.value}%`;
        applyFilters();
    });

/*     stickerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = e.target.getAttribute('data-url');
            fabric.Image.fromURL(
                url,
                (img) => {
                    if (!img) return;
                    const maxSize = 150;
                    const scale = Math.min(maxSize / img.width, maxSize / img.height);
                    img.scale(scale);
                    img.set({
                        left: canvas.width / 2,
                        top: canvas.height / 2,
                        originX: "center",
                        originY: "center",
                    });
                    canvas.add(img);
                    img.bringToFront();
                    img.setCoords();
                    canvas.renderAll();
                },
                { crossOrigin: "anonymous" }
            );
        });
    }); */

    stickerBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const emoji = e.target.textContent.trim(); // obtiene el emoji del botón
    const text = new fabric.IText(emoji, {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fontSize: 64,        // tamaño del emoji
      originX: 'center',
      originY: 'center',
      editable: false
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  });
});


});