/* MYSTIC-RUN – HAUNTED FOREST
 * Mobile Touch, Swipe & Keyboard Input Handler
 * Optimized for low-latency responsiveness and Android mobile browser compatibility.
 */

class InputController {
  constructor(onActionCallback) {
    this.onAction = onActionCallback || (() => {});

    // Swipe tracking
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.minSwipeDistance = 32; // Pixels
    this.maxSwipeTime = 450;    // Milliseconds

    // Enabled state
    this.enabled = true;

    this.initTouch();
    this.initKeyboard();
    this.initVirtualButtons();
  }

  setEnabled(val) {
    this.enabled = val;
  }

  triggerAction(action) {
    if (!this.enabled) return;
    this.onAction(action);
  }

  // 1. Mobile Swipe Detection
  initTouch() {
    const canvas = document.getElementById('webgl-canvas') || window;

    window.addEventListener('touchstart', (e) => {
      // Don't intercept UI button clicks
      if (e.target.closest('.hud-btn') || e.target.closest('.touch-btn') ||
        e.target.closest('.menu-card') || e.target.closest('.store-card') ||
        e.target.closest('.mode-select-card') || e.target.closest('.mission-card')) {
        return;
      }

      if (e.touches.length > 0) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now();
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (e.target.closest('.store-card') || e.target.closest('.mission-card') ||
        e.target.closest('.mode-select-card')) return;
      // Prevent browser pull-to-refresh & pinch zooming
      if (e.cancelable) {
        e.preventDefault();
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (e.target.closest('.hud-btn') || e.target.closest('.touch-btn') ||
        e.target.closest('.menu-card') || e.target.closest('.store-card') ||
        e.target.closest('.mode-select-card') || e.target.closest('.mission-card')) {
        return;
      }

      if (!this.enabled) return;

      const deltaX = (e.changedTouches[0] ? e.changedTouches[0].clientX : 0) - this.touchStartX;
      const deltaY = (e.changedTouches[0] ? e.changedTouches[0].clientY : 0) - this.touchStartY;
      const deltaTime = Date.now() - this.touchStartTime;

      if (deltaTime > this.maxSwipeTime) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) < this.minSwipeDistance) return;

      if (absX > absY) {
        // Horizontal swipe
        if (deltaX < 0) {
          this.triggerAction('left');
        } else {
          this.triggerAction('right');
        }
      } else {
        // Vertical swipe
        if (deltaY < 0) {
          this.triggerAction('jump');
        } else {
          this.triggerAction('slide');
        }
      }
    }, { passive: false });
  }

  // 2. On-Screen Virtual Touch Buttons
  initVirtualButtons() {
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnSlide = document.getElementById('btn-slide');

    const bindButton = (btn, action) => {
      if (!btn) return;

      const press = (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.add('pressed');
        this.triggerAction(action);
      };

      const release = (e) => {
        btn.classList.remove('pressed');
      };

      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: true });
      btn.addEventListener('touchcancel', release, { passive: true });

      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    };

    bindButton(btnLeft, 'left');
    bindButton(btnRight, 'right');
    bindButton(btnJump, 'jump');
    bindButton(btnSlide, 'slide');
  }

  // 3. Desktop Keyboard Controls (Arrow keys, WASD, Space)
  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.triggerAction('left');
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.triggerAction('right');
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          e.preventDefault();
          this.triggerAction('jump');
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          this.triggerAction('slide');
          break;
        case 'KeyQ':
          this.triggerAction('skateboard');
          break;
        case 'KeyE':
          this.triggerAction('airplane');
          break;
        case 'KeyR':
          this.triggerAction('speed-boost');
          break;
        case 'KeyP':
          window.gameInstance && window.gameInstance.togglePause();
          break;
        case 'Escape':
          if (document.getElementById('mode-screen').classList.contains('active')) {
            document.getElementById('mode-screen').classList.remove('active');
          } else if (document.getElementById('mission-screen').classList.contains('active')) {
            window.gameInstance && window.gameInstance.closeMissionScreen();
          } else if (document.getElementById('store-screen').classList.contains('active')) {
            window.gameInstance && window.gameInstance.closeStore();
          } else {
            window.gameInstance && window.gameInstance.togglePause();
          }
          break;
        case 'KeyM':
          window.soundEngine && window.soundEngine.toggleMute();
          window.gameInstance && window.gameInstance.updateMuteIcon();
          break;
      }
    });
  }
}

window.InputController = InputController;
