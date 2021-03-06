  extend(prototype, {
    build: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;
      var image = _this.image;
      var template;
      var cropper;
      var canvas;
      var dragBox;
      var cropBox;
      var face;

      if (!_this.ready) {
        return;
      }

      // Unbuild first when replace
      if (_this.built) {
        _this.unbuild();
      }

      template = createElement('div');
      template.innerHTML = Cropper.TEMPLATE;

      // Create cropper elements
      _this.container = element.parentNode;
      _this.cropper = cropper = querySelector(template, '.cropper-container');
      _this.canvas = canvas = querySelector(cropper, '.cropper-canvas');
      _this.dragBox = dragBox = querySelector(cropper, '.cropper-drag-box');
      _this.cropBox = cropBox = querySelector(cropper, '.cropper-crop-box');
      _this.viewBox = querySelector(cropper, '.cropper-view-box');
      _this.face = face = querySelector(cropBox, '.cropper-face');

      appendChild(canvas, image);

      // Hide the original image
      addClass(element, CLASS_HIDDEN);
      insertBefore(element, cropper);

      // Show the image if is hidden
      if (!_this.isImg) {
        removeClass(image, CLASS_HIDE);
      }

      _this.initPreview();
      _this.bind();

      options.aspectRatio = max(0, options.aspectRatio) || NaN;
      options.viewMode = max(0, min(3, round(options.viewMode))) || 0;

      if (options.autoCrop) {
        _this.cropped = true;

        if (options.modal) {
          addClass(dragBox, CLASS_MODAL);
        }
      } else {
        addClass(cropBox, CLASS_HIDDEN);
      }

      if (!options.guides) {
        addClass(querySelectorAll(cropBox, '.cropper-dashed'), CLASS_HIDDEN);
      }

      if (!options.center) {
        addClass(querySelector(cropBox, '.cropper-center'), CLASS_HIDDEN);
      }

      if (options.background) {
        addClass(cropper, CLASS_BG);
      }

      if (!options.highlight) {
        addClass(face, CLASS_INVISIBLE);
      }

      if (options.cropBoxMovable) {
        addClass(face, CLASS_MOVE);
        setData(face, DATA_ACTION, ACTION_ALL);
      }

      if (!options.cropBoxResizable) {
        addClass(querySelectorAll(cropBox, '.cropper-line'), CLASS_HIDDEN);
        addClass(querySelectorAll(cropBox, '.cropper-point'), CLASS_HIDDEN);
      }

      _this.setDragMode(options.dragMode);
      _this.render();
      _this.built = true;
      _this.setData(options.data);

      // Call the built asynchronously to keep "image.cropper" is defined
      setTimeout(function () {
        if (isFunction(options.built)) {
          options.built.call(element);
        }

        if (isFunction(options.crop)) {
          options.crop.call(element, _this.getData());
        }

        _this.complete = true;
      }, 0);
    },

    unbuild: function () {
      var _this = this;

      if (!_this.built) {
        return;
      }

      _this.built = false;
      _this.complete = false;
      _this.initialImageData = null;

      // Clear `initialCanvasData` is necessary when replace
      _this.initialCanvasData = null;
      _this.initialCropBoxData = null;
      _this.containerData = null;
      _this.canvasData = null;

      // Clear `cropBoxData` is necessary when replace
      _this.cropBoxData = null;
      _this.unbind();

      _this.resetPreview();
      _this.previews = null;

      _this.viewBox = null;
      _this.cropBox = null;
      _this.dragBox = null;
      _this.canvas = null;
      _this.container = null;

      removeChild(_this.cropper);
      _this.cropper = null;
    }
  });
