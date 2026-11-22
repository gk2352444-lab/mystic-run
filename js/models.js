/* MYSTIC RUN – FANTASY TRAIL
 * 3D Procedural Models & Procedural Asset Builder
 * Original Trail Warden character and Cinder Warden models built from procedural geometry.
 * Optimized for mobile GPUs with shared geometries, lightweight materials & low draw calls.
 */

const ModelFactory = (() => {

  // --- PROCEDURAL CANVAS TEXTURE GENERATORS ---

  // Helper for rounded rect on 2D canvas
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // 1. Original runner face texture with soft green eyes and simple features.
  function createRunnerFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e9b995';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = 'rgba(255, 213, 183, 0.3)';
    ctx.beginPath();
    ctx.ellipse(128, 145, 84, 72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#263d46';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(48, 91); ctx.lineTo(98, 96);
    ctx.moveTo(208, 91); ctx.lineTo(158, 96);
    ctx.stroke();
    [-1, 1].forEach(side => {
      const x = 70 + (side > 0 ? 116 : 0);
      ctx.fillStyle = '#f6ffff';
      ctx.beginPath(); ctx.ellipse(x, 118, 22, 14, 0, 0, Math.PI * 2); ctx.fill();
      const iris = ctx.createRadialGradient(x, 116, 2, x, 118, 13);
      iris.addColorStop(0, '#9bf4d1'); iris.addColorStop(1, '#168c75');
      ctx.fillStyle = iris;
      ctx.beginPath(); ctx.arc(x, 118, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#14232a';
      ctx.beginPath(); ctx.arc(x, 118, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x - 3, 114, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.strokeStyle = '#9b624c';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(128, 139); ctx.lineTo(124, 149); ctx.lineTo(130, 151); ctx.stroke();
    ctx.beginPath(); ctx.arc(128, 169, 20, 0.2, Math.PI - 0.2); ctx.stroke();
    return new THREE.CanvasTexture(canvas);
  }

  // 2. Original cloth-and-crystal headband texture.
  function createRunnerHeadbandTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#153d48';
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    for (let y = 0; y < 128; y += 6) ctx.fillRect(0, y, 256, 2);
    const px = 28, py = 16, pw = 200, ph = 96;
    const metal = ctx.createLinearGradient(0, py, 0, py + ph);
    metal.addColorStop(0, '#f4e3a9'); metal.addColorStop(1, '#9b8552');
    ctx.fillStyle = metal;
    roundRect(ctx, px, py, pw, ph, 16);
    ctx.fill();
    ctx.fillStyle = '#163f46';
    ctx.beginPath();
    ctx.moveTo(128, 34); ctx.lineTo(153, 64); ctx.lineTo(128, 94); ctx.lineTo(103, 64);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#72f5d1';
    ctx.beginPath();
    ctx.moveTo(128, 43); ctx.lineTo(145, 64); ctx.lineTo(128, 85); ctx.lineTo(111, 64);
    ctx.closePath(); ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  // 3. Original geometric trail mark for the runner's jacket.
  function createRunnerJacketTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#187d78';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = 'rgba(2, 28, 38, 0.12)';
    for (let y = 0; y < 256; y += 10) ctx.fillRect(0, y, 256, 2);
    ctx.fillStyle = '#d8b96c';
    ctx.beginPath();
    ctx.moveTo(128, 45); ctx.lineTo(156, 108); ctx.lineTo(211, 128);
    ctx.lineTo(156, 148); ctx.lineTo(128, 211); ctx.lineTo(100, 148);
    ctx.lineTo(45, 128); ctx.lineTo(100, 108); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#173f49';
    ctx.beginPath();
    ctx.moveTo(128, 78); ctx.lineTo(142, 116); ctx.lineTo(180, 128);
    ctx.lineTo(142, 140); ctx.lineTo(128, 178); ctx.lineTo(114, 140);
    ctx.lineTo(76, 128); ctx.lineTo(114, 116); ctx.closePath();
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }
  // 4. Reinforced trail trouser texture.
  function createLegBandageTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#187d78';
    ctx.fillRect(0, 0, 128, 128);

    ctx.fillStyle = '#153d48';
    roundRect(ctx, 24, 34, 80, 60, 12);
    ctx.fill();
    ctx.strokeStyle = '#d8b96c';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 40, 68, 48);
    ctx.fillStyle = '#72f5d1';
    ctx.beginPath();
    ctx.moveTo(64, 46); ctx.lineTo(76, 64); ctx.lineTo(64, 82); ctx.lineTo(52, 64);
    ctx.closePath();
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // 5. Original Cinder Warden mineral texture.
  function createWardenHideTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#344d50';
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 220; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const shade = 62 + Math.floor(Math.random() * 34);
      ctx.fillStyle = `rgb(${shade}, ${shade + 15}, ${shade + 17})`;
      ctx.beginPath();
      ctx.ellipse(x, y, 2 + Math.random() * 4, 3 + Math.random() * 6, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(114, 245, 209, 0.72)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    function drawMineralSeam(startX, startY, segments) {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      let curX = startX, curY = startY;
      for (let s = 0; s < segments; s++) {
        curX += (Math.random() - 0.5) * 18;
        curY += 7 + Math.random() * 12;
        ctx.lineTo(curX, curY);
      }
      ctx.stroke();
    }

    drawMineralSeam(65, 30, 5);
    drawMineralSeam(190, 40, 5);
    drawMineralSeam(128, 110, 6);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // 6. 3D Animated Ghost Wall Portraits Generator & System
  const ghostPortraitCanvases = [];
  const branchCharacterCanvases = [];

  function drawGhostPortrait(ctx, type, time) {
    // Gothic carved portrait background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, 256, 256);

    // Spectral background aura gradient
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
    if (type === 0) {
      // Cursed Shinobi Ghoul (Spectral Cyan/Aqua Aura)
      grad.addColorStop(0, 'rgba(0, 245, 212, 0.55)');
      grad.addColorStop(0.65, 'rgba(0, 160, 210, 0.20)');
      grad.addColorStop(1, 'rgba(6, 10, 18, 0)');
    } else if (type === 1) {
      // Ember-mask ghost portrait with a warm crimson aura
      grad.addColorStop(0, 'rgba(255, 60, 20, 0.60)');
      grad.addColorStop(0.65, 'rgba(200, 20, 10, 0.22)');
      grad.addColorStop(1, 'rgba(6, 10, 18, 0)');
    } else {
      // Spectral Banshee / Phantom Sorcerer (Amethyst Purple Aura)
      grad.addColorStop(0, 'rgba(190, 75, 255, 0.55)');
      grad.addColorStop(0.65, 'rgba(130, 30, 210, 0.20)');
      grad.addColorStop(1, 'rgba(6, 10, 18, 0)');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Floating spectral ghost dynamics
    const floatY = Math.sin(time * 3.2 + type * 1.5) * 12;
    const floatX = Math.cos(time * 2.2 + type) * 7;
    const headY = 96 + floatY;
    const headX = 128 + floatX;

    // Wavering phantom spectral shroud / body
    ctx.save();
    ctx.fillStyle = type === 1 ? 'rgba(240, 200, 200, 0.85)' : 'rgba(210, 250, 255, 0.85)';
    ctx.beginPath();
    ctx.moveTo(headX - 44, headY + 32);
    ctx.quadraticCurveTo(headX - 62, headY + 115, headX - 35 + Math.sin(time * 4.5) * 12, 238);
    ctx.quadraticCurveTo(headX, 206, headX + 35 + Math.cos(time * 4.5) * 12, 238);
    ctx.quadraticCurveTo(headX + 62, headY + 115, headX + 44, headY + 32);
    ctx.closePath();
    ctx.fill();

    // Floating Ghost Head
    ctx.beginPath();
    ctx.ellipse(headX, headY, 44, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    // Give each wall portrait a distinct looping gesture.
    const gesture = time * (type === 1 ? 4.2 : 3.1) + type * 1.8;
    const armLift = type === 0
      ? Math.sin(gesture) * 18
      : (type === 1 ? 22 + Math.sin(gesture) * 8 : Math.cos(gesture) * 20);
    ctx.strokeStyle = type === 1 ? 'rgba(255, 190, 170, 0.9)' : 'rgba(220, 250, 255, 0.9)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(headX - 34, headY + 68);
    ctx.quadraticCurveTo(headX - 62, headY + 48 - armLift, headX - 54, headY + 25 - armLift);
    ctx.moveTo(headX + 34, headY + 68);
    ctx.quadraticCurveTo(headX + 62, headY + 48 + armLift, headX + 54, headY + 25 + armLift);
    ctx.stroke();

    // Eye sockets with animated pupils tracking runner
    const eyeOffsetX = Math.sin(time * 2.6 + type) * 5;
    const eyeOffsetY = Math.cos(time * 2.0) * 3;

    function drawGhostEye(ex, ey) {
      // Hollow dark socket
      ctx.fillStyle = '#040608';
      ctx.beginPath();
      ctx.arc(ex, ey, 14, 0, Math.PI * 2);
      ctx.fill();

      // Glowing pupil
      ctx.fillStyle = type === 1 ? '#ff1100' : (type === 0 ? '#00f5d4' : '#d946ef');
      ctx.beginPath();
      ctx.arc(ex + eyeOffsetX, ey + eyeOffsetY, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Burning white center spark
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex + eyeOffsetX, ey + eyeOffsetY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    drawGhostEye(headX - 18, headY - 4);
    drawGhostEye(headX + 18, headY - 4);

    // Animated wailing / howling ghost mouth
    const mouthHeight = 8 + Math.abs(Math.sin(time * 3.6 + type)) * 16;
    ctx.fillStyle = '#040608';
    ctx.beginPath();
    ctx.ellipse(headX, headY + 28, 12, mouthHeight, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ornate Carved Picture Frame Border
    ctx.strokeStyle = type === 1 ? '#ff4400' : (type === 0 ? '#00f5d4' : '#c084fc');
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 244, 244);
    ctx.strokeStyle = '#223246';
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, 232, 232);

    ctx.restore();
  }

  function getGhostPortraitTexture(typeIndex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;

    ghostPortraitCanvases.push({ canvas, ctx, type: typeIndex % 3, texture });
    drawGhostPortrait(ctx, typeIndex % 3, 0);
    texture.needsUpdate = true;

    return texture;
  }

  // Pre-create 3 distinct animated portrait textures for left & right walls
  const ghostPortraitTextures = [
    getGhostPortraitTexture(0), // Cursed Shinobi Ghoul
    getGhostPortraitTexture(1), // Ember-mask ghost
    getGhostPortraitTexture(2)  // Spectral Banshee
  ];

  let lastGhostPortraitTime = -Infinity;

  function updateGhostPortraits(time, speedFactor = 1) {
    const animatedTime = time * speedFactor;
    if (time - lastGhostPortraitTime < 1 / 30) return;
    lastGhostPortraitTime = time;

    ghostPortraitCanvases.forEach(item => {
      drawGhostPortrait(item.ctx, item.type, animatedTime);
      item.texture.needsUpdate = true;
    });
  }

  function drawBranchCharacter(ctx, type, activity, time) {
    const phase = time * (activity === 2 ? 2.2 : 4.4) + type * 1.4 + activity;
    const swing = Math.sin(phase);
    const jump = activity === 1 ? Math.abs(Math.sin(phase)) * 9 : 0;
    const sit = activity === 2;
    const workout = activity === 3;
    const bodyY = 58 - jump + (sit ? 5 : 0);
    const leftArmY = activity === 0 ? 27 + swing * 13 : (workout ? 20 + swing * 20 : 26);
    const rightArmY = activity === 0 ? 27 - swing * 13 : (workout ? 20 - swing * 20 : 26);

    ctx.clearRect(0, 0, 96, 96);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 7;

    // Swinging arms and legs make each pose readable even at small sizes.
    ctx.strokeStyle = type === 0 ? '#3d8b45' : (type === 1 ? '#bceeff' : '#f2a24d');
    ctx.beginPath();
    ctx.moveTo(32, bodyY + 1);
    ctx.quadraticCurveTo(20, leftArmY + 12, 14 + swing * 5, leftArmY);
    ctx.moveTo(64, bodyY + 1);
    ctx.quadraticCurveTo(76, rightArmY + 12, 82 - swing * 5, rightArmY);
    if (sit) {
      ctx.moveTo(39, bodyY + 15);
      ctx.lineTo(27, 82);
      ctx.lineTo(16, 82);
      ctx.moveTo(57, bodyY + 15);
      ctx.lineTo(69, 82);
      ctx.lineTo(80, 82);
    } else {
      ctx.moveTo(40, bodyY + 14);
      ctx.lineTo(35 - swing * 5, 85 - jump);
      ctx.moveTo(56, bodyY + 14);
      ctx.lineTo(61 + swing * 5, 85 - jump);
    }
    ctx.stroke();

    if (type === 0) {
      // Halloween pumpkin with a bobbing stem and a cheeky grin.
      ctx.fillStyle = '#ff8b22';
      ctx.strokeStyle = '#ad4a10';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(48, bodyY, 23, 21, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(173, 74, 16, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(48, bodyY, 11, 20, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#4d9b40';
      ctx.fillRect(44, bodyY - 28, 8, 10);
      ctx.fillStyle = '#241313';
      ctx.beginPath();
      ctx.moveTo(38, bodyY - 5);
      ctx.lineTo(43, bodyY + 3);
      ctx.lineTo(47, bodyY - 5);
      ctx.moveTo(50, bodyY - 5);
      ctx.lineTo(55, bodyY + 3);
      ctx.lineTo(59, bodyY - 5);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(48, bodyY + 5, 8, 0.15, Math.PI - 0.15);
      ctx.stroke();
    } else if (type === 1) {
      // Friendly little ghost, drawn as one soft silhouette.
      ctx.fillStyle = 'rgba(226, 250, 255, 0.96)';
      ctx.strokeStyle = '#71d9e7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(26, bodyY + 15);
      ctx.quadraticCurveTo(17, bodyY - 2, 25, bodyY - 16);
      ctx.arc(48, bodyY - 7, 23, Math.PI, 0);
      ctx.quadraticCurveTo(79, bodyY + 4, 70, bodyY + 15);
      ctx.lineTo(64, bodyY + 10);
      ctx.lineTo(56, bodyY + 17);
      ctx.lineTo(48, bodyY + 11);
      ctx.lineTo(39, bodyY + 17);
      ctx.lineTo(32, bodyY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#263548';
      ctx.beginPath();
      ctx.arc(40, bodyY - 7, 3, 0, Math.PI * 2);
      ctx.arc(56, bodyY - 7, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(48, bodyY + 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff9bb5';
      ctx.beginPath();
      ctx.arc(33, bodyY + 1, 4, 0, Math.PI * 2);
      ctx.arc(63, bodyY + 1, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // A cheerful masked cartoon with a bright headband.
      ctx.fillStyle = '#ffcf9f';
      ctx.strokeStyle = '#8b4b2f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(48, bodyY - 3, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4c86e8';
      ctx.fillRect(27, bodyY - 15, 42, 8);
      ctx.fillStyle = '#36251d';
      ctx.beginPath();
      ctx.arc(40, bodyY - 3, 2.5, 0, Math.PI * 2);
      ctx.arc(56, bodyY - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#a64b37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(48, bodyY + 3, 7, 0.15, Math.PI - 0.15);
      ctx.stroke();
      ctx.fillStyle = '#ef6b48';
      ctx.beginPath();
      ctx.ellipse(48, bodyY + 26, 15, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (workout) {
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(7, 14 + Math.cos(phase) * 4, 10, 4);
      ctx.fillRect(79, 14 - Math.cos(phase) * 4, 10, 4);
    }

    ctx.restore();
  }

  function createBranchCharacterTextures() {
    const textures = [];
    for (let type = 0; type < 3; type++) {
      textures[type] = [];
      for (let activity = 0; activity < 4; activity++) {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        drawBranchCharacter(ctx, type, activity, 0);
        const texture = new THREE.CanvasTexture(canvas);
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        branchCharacterCanvases.push({ ctx, type, activity, texture });
        textures[type][activity] = texture;
      }
    }
    return textures;
  }

  const branchCharacterMaterials = [];
  let lastBranchCharacterTime = -Infinity;

  function updateBranchCharacterTextures(time, speedFactor) {
    const animatedTime = time * speedFactor;
    if (time - lastBranchCharacterTime < 1 / 30) return;
    lastBranchCharacterTime = time;

    branchCharacterCanvases.forEach(item => {
      drawBranchCharacter(item.ctx, item.type, item.activity, animatedTime);
      item.texture.needsUpdate = true;
    });
  }

  // Generate textures once
  const runnerHeadbandTexture = createRunnerHeadbandTexture();
  const legBandageTex = createLegBandageTexture();
  const wardenHideTex = createWardenHideTexture();

  // Shared materials for GPU performance optimization
  const materials = {
    // Ghost Train materials
    ghostTrainBody: new THREE.MeshStandardMaterial({ 
      color: 0x09141f, 
      roughness: 0.45, 
      metalness: 0.7 
    }),
    ghostTrainTrim: new THREE.MeshStandardMaterial({ 
      color: 0x00f5d4, 
      emissive: 0x00f5d4, 
      emissiveIntensity: 0.8 
    }),
    ghostTrainGlow: new THREE.MeshBasicMaterial({ color: 0x00ffcc }),
    ghostTrainWindow: new THREE.MeshBasicMaterial({ color: 0x00f5a0, transparent: true, opacity: 0.85 }),
    ghostTrainWheels: new THREE.MeshStandardMaterial({ color: 0x121b24, roughness: 0.6, metalness: 0.8 }),
    // runner materials
    runnerSkin: new THREE.MeshStandardMaterial({ color: 0xe9b995, roughness: 0.65 }),
    runnerHair: new THREE.MeshStandardMaterial({ color: 0x25394b, roughness: 0.55 }),
    runnerOutfit: new THREE.MeshStandardMaterial({ color: 0x187d78, roughness: 0.7 }),
    runnerAccent: new THREE.MeshStandardMaterial({ color: 0x153d48, roughness: 0.6 }),
    runnerTrim: new THREE.MeshStandardMaterial({ color: 0xd8b96c, roughness: 0.75 }),
    runnerEyeWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 }),
    runnerIris: new THREE.MeshStandardMaterial({ color: 0x168c75, roughness: 0.3 }),
    runnerPupil: new THREE.MeshBasicMaterial({ color: 0x101827 }),
    jacketTrim: new THREE.MeshStandardMaterial({ color: 0xffc13b, roughness: 0.55 }),
    sandalSole: new THREE.MeshStandardMaterial({ color: 0x263957, roughness: 0.85 }),
    cartoonPumpkin: new THREE.MeshStandardMaterial({ color: 0xff851b, roughness: 0.58 }),
    pumpkinRidge: new THREE.MeshStandardMaterial({ color: 0xe76a13, roughness: 0.65 }),
    pumpkinStem: new THREE.MeshStandardMaterial({ color: 0x4c9a48, roughness: 0.8 }),
    ghostBody: new THREE.MeshStandardMaterial({ color: 0xf1fcff, roughness: 0.32, metalness: 0.02 }),
    ghostTrim: new THREE.MeshStandardMaterial({ color: 0x86e5f4, roughness: 0.35 }),
    cartoonSkin: new THREE.MeshStandardMaterial({ color: 0xffc89a, roughness: 0.62 }),
    cartoonBlue: new THREE.MeshStandardMaterial({ color: 0x4388ed, roughness: 0.55 }),
    cartoonRed: new THREE.MeshStandardMaterial({ color: 0xf06a4e, roughness: 0.65 }),
    cartoonDark: new THREE.MeshStandardMaterial({ color: 0x38283a, roughness: 0.72 }),
    runnerMetal: new THREE.MeshStandardMaterial({ color: 0xd8b96c, metalness: 0.65, roughness: 0.32 }),
    runnerAura: new THREE.MeshBasicMaterial({ color: 0x72f5d1, transparent: true, opacity: 0.75 }),
    runnerEmblem: new THREE.MeshStandardMaterial({ color: 0xd8b96c, roughness: 0.5 }),

    // fantasy trail Cinder Warden Beast materials
    wardenHide: new THREE.MeshStandardMaterial({
      map: wardenHideTex, 
      color: 0xffffff,
      roughness: 0.85, 
      metalness: 0.2 
    }),
    wardenStone: new THREE.MeshStandardMaterial({ color: 0x53696b, roughness: 0.75, metalness: 0.15 }),
    wardenCrystals: new THREE.MeshStandardMaterial({ color: 0x263e49, roughness: 0.38, metalness: 0.45 }),
    wardenEyes: new THREE.MeshBasicMaterial({ color: 0x9bffe3 }),
    wardenFangs: new THREE.MeshStandardMaterial({ color: 0xe7dcb6, roughness: 0.3 }),
    wardenGlow: new THREE.MeshStandardMaterial({ color: 0x72f5d1, emissive: 0x32d4b0, emissiveIntensity: 0.75 }),

    // Obstacle materials
    woodBark: new THREE.MeshStandardMaterial({ color: 0x8c5b36, roughness: 0.9 }),
    mossWood: new THREE.MeshStandardMaterial({ color: 0x69a34c, roughness: 0.95 }),
    ancientStone: new THREE.MeshStandardMaterial({ color: 0x778ba5, roughness: 0.85 }),
    ruinRune: new THREE.MeshStandardMaterial({ color: 0x9d4edd, emissive: 0x9d4edd, emissiveIntensity: 0.5 }),
    spikes: new THREE.MeshStandardMaterial({ color: 0x22262c, roughness: 0.4, metalness: 0.6 }),

    // Collectibles materials
    coinGold: new THREE.MeshStandardMaterial({ 
      color: 0xffd166, 
      metalness: 0.85, 
      roughness: 0.2, 
      emissive: 0xffa200, 
      emissiveIntensity: 0.35 
    }),
    diamondGem: new THREE.MeshStandardMaterial({ 
      color: 0x00f5d4, 
      metalness: 0.1, 
      roughness: 0.1, 
      emissive: 0x00f5d4, 
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.92
    }),

    // Environment materials
    roadPath: new THREE.MeshStandardMaterial({ color: 0x627d91, roughness: 0.95 }),
    roadBorder: new THREE.MeshStandardMaterial({ color: 0x49794d, roughness: 1.0 }),
    foliage: new THREE.MeshStandardMaterial({ color: 0x42a85b, roughness: 0.9 }),
    foliageLight: new THREE.MeshStandardMaterial({ color: 0x70c95c, roughness: 0.88 }),
    foliageDead: new THREE.MeshStandardMaterial({ color: 0xa9773b, roughness: 0.95 }),
    treeTrunk: new THREE.MeshStandardMaterial({ color: 0x785038, roughness: 0.95 }),

    // Particle materials
    dustParticle: new THREE.MeshBasicMaterial({ color: 0x4a5568, transparent: true, opacity: 0.5 }),
    sparkParticle: new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.9 }),
    wispParticle: new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.8 })
  };

  const characterSphereGeo = new THREE.SphereGeometry(1, 16, 12);
  const pumpkinRidgeGeo = new THREE.TorusGeometry(0.26, 0.018, 6, 18);
  const pumpkinStemGeo = new THREE.CylinderGeometry(0.06, 0.085, 0.22, 10);
  const pumpkinEyeGeo = new THREE.ConeGeometry(1, 1, 3);
  const ghostRobeGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0, -0.42),
    new THREE.Vector2(0.25, -0.28),
    new THREE.Vector2(0.33, -0.02),
    new THREE.Vector2(0.29, 0.22),
    new THREE.Vector2(0.2, 0.36),
    new THREE.Vector2(0, 0.4)
  ], 16);

  return {
    materials,

    // ==========================================
    // 1. Original 3D Trail Warden character
    // ==========================================
    createPlayer() {
      const group = new THREE.Group();

      // Root pivot for tilt, lean, bobbing
      const bodyPivot = new THREE.Group();
      bodyPivot.position.y = 0.05;
      bodyPivot.scale.set(1.08, 0.88, 1.04);
      group.add(bodyPivot);

      // Teal trail coat with a small geometric back sigil.
      // In Three.js BoxGeometry: [right(+x), left(-x), top(+y), bottom(-y), back(+z), front(-z)]
      // Player runs towards -Z, camera is at +Z looking at player's BACK (+Z).
      const torsoGeo = new THREE.SphereGeometry(1, 24, 16);
      const torso = new THREE.Mesh(torsoGeo, materials.runnerOutfit);
      torso.scale.set(0.34, 0.48, 0.24);
      torso.position.y = 1.12;
      torso.userData.storeColor = 'outfit';
      torso.castShadow = true;
      bodyPivot.add(torso);

      const shoulderGeo = new THREE.SphereGeometry(1, 16, 12);
      [-1, 1].forEach(side => {
        const shoulder = new THREE.Mesh(shoulderGeo, materials.runnerOutfit);
        shoulder.position.set(side * 0.31, 1.34, 0);
        shoulder.scale.set(0.16, 0.18, 0.22);
        shoulder.userData.storeColor = 'outfit';
        shoulder.castShadow = true;
        bodyPivot.add(shoulder);
      });

      const jacketZip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.48, 8),
        materials.jacketTrim
      );
      jacketZip.position.set(0, 1.12, -0.235);
      bodyPivot.add(jacketZip);

      const backSigil = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), materials.runnerEmblem);
      backSigil.position.set(0, 1.14, 0.25);
      backSigil.scale.set(1, 1.4, 0.35);
      backSigil.userData.runnerDetail = true;
      bodyPivot.add(backSigil);

      // A folded scarf collar adds a distinct silhouette.
      const collarGroup = new THREE.Group();
      collarGroup.position.set(0, 1.48, 0);

      const collarGeo = new THREE.SphereGeometry(1, 16, 12);
      const collarMesh = new THREE.Mesh(collarGeo, materials.runnerAccent);
      collarMesh.scale.set(0.25, 0.15, 0.22);
      collarGroup.add(collarMesh);

      [-1, 1].forEach(side => {
        const collarWing = new THREE.Mesh(
          new THREE.SphereGeometry(1, 12, 8),
          materials.runnerTrim
        );
        collarWing.position.set(side * 0.15, 0.03, -0.08);
        collarWing.scale.set(0.11, 0.13, 0.08);
        collarWing.rotation.z = side * -0.35;
        collarGroup.add(collarWing);
      });

      bodyPivot.add(collarGroup);

      // Navy waist sash / belt with ninja equipment pouch on rear
      const beltGeo = new THREE.BoxGeometry(0.56, 0.12, 0.38);
      const belt = new THREE.Mesh(beltGeo, materials.runnerAccent);
      belt.position.y = 0.78;
      bodyPivot.add(belt);

      // Rear trail-kit pouch on the belt
      const pouchGeo = new THREE.BoxGeometry(0.18, 0.14, 0.10);
      const pouch = new THREE.Mesh(pouchGeo, materials.runnerAccent);
      pouch.position.set(0.12, 0.78, 0.22);
      bodyPivot.add(pouch);

      // --- FACE, CRYSTAL TOKEN & SWEPT HAIR ---
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.72, 0);
      headGroup.scale.set(1.35, 1.35, 1.25);

      // Soft facial features keep the original runner readable at game distance.
      const headGeo = new THREE.SphereGeometry(0.27, 24, 18);
      const head = new THREE.Mesh(headGeo, materials.runnerSkin);
      head.castShadow = true;
      headGroup.add(head);

      const eyeWhiteGeo = new THREE.SphereGeometry(1, 16, 12);
      const irisGeo = new THREE.SphereGeometry(1, 14, 10);
      const pupilGeo = new THREE.SphereGeometry(1, 12, 8);
      [-1, 1].forEach(side => {
        const eyeWhite = new THREE.Mesh(eyeWhiteGeo, materials.runnerEyeWhite);
        eyeWhite.position.set(side * 0.105, 0.015, -0.26);
        eyeWhite.scale.set(0.064, 0.062, 0.035);
        headGroup.add(eyeWhite);

        const iris = new THREE.Mesh(irisGeo, materials.runnerIris);
        iris.position.set(side * 0.105, 0.012, -0.29);
        iris.scale.set(0.034, 0.041, 0.025);
        headGroup.add(iris);

        const pupil = new THREE.Mesh(pupilGeo, materials.runnerPupil);
        pupil.position.set(side * 0.105, 0.012, -0.31);
        pupil.scale.set(0.018, 0.026, 0.014);
        headGroup.add(pupil);

        const brow = new THREE.Mesh(
          new THREE.SphereGeometry(1, 10, 8),
          materials.runnerHair
        );
        brow.position.set(side * 0.105, 0.12, -0.24);
        brow.scale.set(0.075, 0.018, 0.018);
        brow.rotation.z = side * -0.12;
        headGroup.add(brow);

      });

      const nose = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 10, 8),
        materials.runnerSkin
      );
      nose.position.set(0, -0.045, -0.28);
      nose.scale.set(0.75, 0.65, 0.7);
      headGroup.add(nose);

      const mouth = new THREE.Mesh(
        new THREE.TorusGeometry(0.048, 0.008, 5, 14, Math.PI),
        materials.cartoonDark
      );
      mouth.position.set(0, -0.12, -0.25);
      mouth.rotation.z = Math.PI;
      headGroup.add(mouth);

      // Ears
      const earGeo = new THREE.BoxGeometry(0.06, 0.12, 0.08);
      const leftEar = new THREE.Mesh(earGeo, materials.runnerSkin);
      leftEar.position.set(-0.22, -0.02, 0);
      headGroup.add(leftEar);
      const rightEar = new THREE.Mesh(earGeo, materials.runnerSkin);
      rightEar.position.set(0.22, -0.02, 0);
      headGroup.add(rightEar);

      // Woven trail headband with a faceted crystal token.
      const headbandBandGeo = new THREE.SphereGeometry(1, 16, 10);
      const headbandBand = new THREE.Mesh(headbandBandGeo, materials.runnerAccent);
      headbandBand.position.set(0, 0.16, -0.235);
      headbandBand.scale.set(0.25, 0.055, 0.045);
      headbandBand.userData.storeColor = 'accent';
      headGroup.add(headbandBand);

      // The token carries the original four-point trail mark.
      const plateGeo = new THREE.BoxGeometry(0.20, 0.09, 0.035);
      const plateMat = new THREE.MeshStandardMaterial({
        map: runnerHeadbandTexture,
        metalness: 0.75,
        roughness: 0.3
      });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.set(0, 0.16, -0.29);
      plate.userData.runnerDetail = true;
      headGroup.add(plate);

      const hairGroup = new THREE.Group();
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12), materials.runnerHair);
      hairCap.position.set(0, 0.17, 0.035);
      hairCap.scale.set(1.05, 0.8, 1.08);
      hairCap.userData.storeColor = 'hair';
      hairCap.castShadow = true;
      hairGroup.add(hairCap);

      const hairLockGeo = new THREE.SphereGeometry(1, 12, 8);
      [
        { position: [-0.17, 0.07, -0.13], scale: [0.12, 0.11, 0.18], rotation: [0.2, 0, 0.35] },
        { position: [0.17, 0.07, -0.13], scale: [0.12, 0.11, 0.18], rotation: [0.2, 0, -0.35] },
        { position: [0, -0.015, -0.19], scale: [0.10, 0.14, 0.14], rotation: [0.35, 0, 0] },
        { position: [-0.2, 0.01, 0.04], scale: [0.09, 0.12, 0.15], rotation: [0.2, 0, 0.4] },
        { position: [0.2, 0.01, 0.04], scale: [0.09, 0.12, 0.15], rotation: [0.2, 0, -0.4] }
      ].forEach(lockShape => {
        const lock = new THREE.Mesh(hairLockGeo, materials.runnerHair);
        lock.position.set(...lockShape.position);
        lock.scale.set(...lockShape.scale);
        lock.rotation.set(...lockShape.rotation);
        lock.userData.storeColor = 'hair';
        hairGroup.add(lock);
      });

      headGroup.add(hairGroup);
      hairGroup.userData.runnerDetail = true;
      bodyPivot.add(headGroup);

      // --- ARMS & HANDS ---
      const leftArmPivot = new THREE.Group();
      leftArmPivot.position.set(-0.35, 1.36, 0);

      const armUpperGeo = new THREE.SphereGeometry(1, 16, 12);
      const leftUpperArm = new THREE.Mesh(armUpperGeo, materials.runnerOutfit);
      leftUpperArm.position.y = -0.16;
      leftUpperArm.scale.set(0.12, 0.22, 0.13);
      leftUpperArm.userData.storeColor = 'outfit';
      leftUpperArm.castShadow = true;
      leftArmPivot.add(leftUpperArm);

      // Small geometric trim patch
      const badgeGeo = new THREE.BoxGeometry(0.075, 0.055, 0.025);
      const badge = new THREE.Mesh(badgeGeo, materials.runnerEmblem);
      badge.position.set(-0.095, -0.16, -0.015);
      badge.userData.runnerDetail = true;
      leftArmPivot.add(badge);

      const leftElbowPivot = new THREE.Group();
      leftElbowPivot.position.y = -0.34;
      const forearmGeo = new THREE.SphereGeometry(1, 16, 12);
      const leftForearm = new THREE.Mesh(forearmGeo, materials.runnerOutfit);
      leftForearm.position.y = -0.16;
      leftForearm.scale.set(0.095, 0.21, 0.105);
      leftForearm.userData.storeColor = 'outfit';
      leftForearm.castShadow = true;
      leftElbowPivot.add(leftForearm);

      // Navy wrist cuff
      const cuffGeo = new THREE.SphereGeometry(1, 12, 8);
      const leftCuff = new THREE.Mesh(cuffGeo, materials.runnerAccent);
      leftCuff.position.y = -0.32;
      leftCuff.scale.set(0.105, 0.055, 0.11);
      leftElbowPivot.add(leftCuff);

      // Ninja hand
      const handGeo = new THREE.SphereGeometry(1, 12, 10);
      const leftHand = new THREE.Mesh(handGeo, materials.runnerSkin);
      leftHand.position.set(0, -0.39, -0.015);
      leftHand.scale.set(0.085, 0.09, 0.075);
      leftElbowPivot.add(leftHand);
      leftArmPivot.add(leftElbowPivot);

      bodyPivot.add(leftArmPivot);

      // Right Arm
      const rightArmPivot = new THREE.Group();
      rightArmPivot.position.set(0.35, 1.36, 0);

      const rightUpperArm = new THREE.Mesh(armUpperGeo, materials.runnerOutfit);
      rightUpperArm.position.y = -0.16;
      rightUpperArm.scale.set(0.12, 0.22, 0.13);
      rightUpperArm.userData.storeColor = 'outfit';
      rightUpperArm.castShadow = true;
      rightArmPivot.add(rightUpperArm);

      const rightElbowPivot = new THREE.Group();
      rightElbowPivot.position.y = -0.34;
      const rightForearm = new THREE.Mesh(forearmGeo, materials.runnerOutfit);
      rightForearm.position.y = -0.16;
      rightForearm.scale.set(0.095, 0.21, 0.105);
      rightForearm.userData.storeColor = 'outfit';
      rightForearm.castShadow = true;
      rightElbowPivot.add(rightForearm);

      const rightCuff = new THREE.Mesh(cuffGeo, materials.runnerAccent);
      rightCuff.position.y = -0.32;
      rightCuff.scale.set(0.105, 0.055, 0.11);
      rightElbowPivot.add(rightCuff);

      const rightHand = new THREE.Mesh(handGeo, materials.runnerSkin);
      rightHand.position.set(0, -0.39, -0.015);
      rightHand.scale.set(0.085, 0.09, 0.075);
      rightElbowPivot.add(rightHand);
      rightArmPivot.add(rightElbowPivot);

      bodyPivot.add(rightArmPivot);

      // --- LEGS & TRAIL BOOTS ---
      const leftLegPivot = new THREE.Group();
      leftLegPivot.position.set(-0.16, 0.74, 0);

      const thighGeo = new THREE.SphereGeometry(1, 16, 12);
      const leftThigh = new THREE.Mesh(thighGeo, materials.runnerOutfit);
      leftThigh.position.y = -0.20;
      leftThigh.scale.set(0.145, 0.27, 0.15);
      leftThigh.userData.storeColor = 'outfit';
      leftThigh.castShadow = true;
      leftLegPivot.add(leftThigh);

      const leftKneePivot = new THREE.Group();
      leftKneePivot.position.y = -0.40;
      const shinGeo = new THREE.SphereGeometry(1, 16, 12);
      const leftShin = new THREE.Mesh(shinGeo, materials.runnerOutfit);
      leftShin.position.y = -0.19;
      leftShin.scale.set(0.115, 0.25, 0.12);
      leftShin.castShadow = true;
      leftKneePivot.add(leftShin);

      // Enclosed trail boot
      const sandalGeo = new THREE.SphereGeometry(1, 14, 10);
      const leftSandal = new THREE.Mesh(sandalGeo, materials.runnerAccent);
      leftSandal.position.set(0, -0.39, -0.035);
      leftSandal.scale.set(0.13, 0.10, 0.20);
      leftSandal.castShadow = true;
      leftKneePivot.add(leftSandal);
      const leftSole = new THREE.Mesh(sandalGeo, materials.sandalSole);
      leftSole.position.set(0, -0.43, -0.025);
      leftSole.scale.set(0.13, 0.035, 0.20);
      leftKneePivot.add(leftSole);

      leftLegPivot.add(leftKneePivot);

      bodyPivot.add(leftLegPivot);

      // Right Leg (with white medical bandages and weapon holster!)
      const rightLegPivot = new THREE.Group();
      rightLegPivot.position.set(0.16, 0.74, 0);

      // Right Thigh with bandage & holster material
      const bandageMat = new THREE.MeshStandardMaterial({
        map: legBandageTex,
        roughness: 0.7
      });
      const rightThigh = new THREE.Mesh(thighGeo, bandageMat);
      rightThigh.position.y = -0.20;
      rightThigh.scale.set(0.145, 0.27, 0.15);
      rightThigh.userData.storeColor = 'outfit';
      rightThigh.castShadow = true;
      rightLegPivot.add(rightThigh);

      const rightKneePivot = new THREE.Group();
      rightKneePivot.position.y = -0.40;
      const rightShin = new THREE.Mesh(shinGeo, materials.runnerOutfit);
      rightShin.position.y = -0.19;
      rightShin.scale.set(0.115, 0.25, 0.12);
      rightShin.castShadow = true;
      rightKneePivot.add(rightShin);

      const rightSandal = new THREE.Mesh(sandalGeo, materials.runnerAccent);
      rightSandal.position.set(0, -0.39, -0.035);
      rightSandal.scale.set(0.13, 0.10, 0.20);
      rightSandal.castShadow = true;
      rightKneePivot.add(rightSandal);
      const rightSole = new THREE.Mesh(sandalGeo, materials.sandalSole);
      rightSole.position.set(0, -0.43, -0.025);
      rightSole.scale.set(0.13, 0.035, 0.20);
      rightKneePivot.add(rightSole);

      rightLegPivot.add(rightKneePivot);

      bodyPivot.add(rightLegPivot);

      // Soft mint aura particles trail the runner.
      const auraGroup = new THREE.Group();
      for (let c = 0; c < 4; c++) {
        const wispGeo = new THREE.SphereGeometry(0.08 + Math.random() * 0.05, 5, 5);
        const wisp = new THREE.Mesh(wispGeo, materials.runnerAura);
        wisp.position.set((Math.random() - 0.5) * 0.4, 0.1 + Math.random() * 0.3, 0.2 + Math.random() * 0.4);
        auraGroup.add(wisp);
      }
      bodyPivot.add(auraGroup);

      // --- runner ANIMATION CONTROLLER ---
      group.userData = {
        bodyPivot,
        headGroup,
        leftArmPivot,
        rightArmPivot,
        leftElbowPivot,
        rightElbowPivot,
        leftLegPivot,
        rightLegPivot,
        leftKneePivot,
        rightKneePivot,
        auraGroup,

        updateAnimation(time, speedRatio, isJumping, isSliding, isStumbling, vehicleMode) {
          const runFreq = time * 10 * Math.max(0.55, speedRatio);
          leftElbowPivot.rotation.set(0, 0, 0);
          rightElbowPivot.rotation.set(0, 0, 0);
          leftKneePivot.rotation.set(0, 0, 0);
          rightKneePivot.rotation.set(0, 0, 0);
          leftArmPivot.rotation.z = 0;
          rightArmPivot.rotation.z = 0;
          headGroup.rotation.x = 0;

          // Animate the short aura trail.
          auraGroup.children.forEach((w, idx) => {
            w.position.y = 0.12 + Math.sin(time * 12 + idx) * 0.08;
            w.position.z = 0.25 + Math.cos(time * 10 + idx * 1.5) * 0.15;
            w.scale.setScalar(0.7 + Math.sin(time * 16 + idx) * 0.35);
          });

          if (vehicleMode === 'skateboard' && !isJumping && !isSliding && !isStumbling) {
            bodyPivot.position.y = 0.08 + Math.sin(time * 8) * 0.025;
            bodyPivot.rotation.x = 0.08;
            headGroup.rotation.x = -0.12;
            leftLegPivot.rotation.x = -0.22 + Math.sin(time * 5) * 0.04;
            rightLegPivot.rotation.x = -0.22 - Math.sin(time * 5) * 0.04;
            leftKneePivot.rotation.x = 0.38;
            rightKneePivot.rotation.x = 0.38;
            leftArmPivot.rotation.x = -0.48;
            rightArmPivot.rotation.x = -0.48;
            leftArmPivot.rotation.z = 0.12;
            rightArmPivot.rotation.z = -0.12;
            leftElbowPivot.rotation.x = -0.32;
            rightElbowPivot.rotation.x = -0.32;
            return;
          }

          if (vehicleMode === 'airplane') {
            bodyPivot.position.y = 0.12 + Math.sin(time * 3) * 0.025;
            bodyPivot.rotation.x = 0.02;
            headGroup.rotation.x = -0.12;
            leftArmPivot.rotation.x = -1.05;
            rightArmPivot.rotation.x = -1.05;
            leftArmPivot.rotation.z = 0.15;
            rightArmPivot.rotation.z = -0.15;
            leftElbowPivot.rotation.x = -0.1;
            rightElbowPivot.rotation.x = -0.1;
            leftLegPivot.rotation.x = 0.35;
            rightLegPivot.rotation.x = 0.35;
            leftKneePivot.rotation.x = -0.65;
            rightKneePivot.rotation.x = -0.65;
            return;
          }

          // 1. Stumble Animation (Recovery roll/stagger)
          if (isStumbling) {
            bodyPivot.position.y = 0.12;
            bodyPivot.rotation.x = -0.28;
            leftLegPivot.rotation.x = -0.55;
            rightLegPivot.rotation.x = 0.45;
            leftKneePivot.rotation.x = 0.8;
            rightKneePivot.rotation.x = -0.5;
            // Flailing arms
            leftArmPivot.rotation.x = 0.8;
            rightArmPivot.rotation.x = 0.8;
            leftArmPivot.rotation.z = -0.5;
            rightArmPivot.rotation.z = 0.5;
            leftElbowPivot.rotation.x = -0.7;
            rightElbowPivot.rotation.x = 0.7;
            headGroup.rotation.x = 0.2;
            return;
          }

          // 2. Ninja Low Slide
          if (isSliding) {
            bodyPivot.position.y = 0.16;
            bodyPivot.rotation.x = -0.92; // Leaned back low to ground
            headGroup.rotation.x = 0.65;   // Head facing forward

            // Legs extended forward
            leftLegPivot.rotation.x = -1.15;
            rightLegPivot.rotation.x = -0.85;
            leftKneePivot.rotation.x = 0.35;
            rightKneePivot.rotation.x = 0.2;

            // Right hand skimming ground, left arm stabilizing
            leftArmPivot.rotation.x = -0.4;
            rightArmPivot.rotation.x = 0.8;
            leftArmPivot.rotation.z = -0.6;
            rightArmPivot.rotation.z = 0.3;
            leftElbowPivot.rotation.x = -0.55;
            rightElbowPivot.rotation.x = 0.75;
            return;
          }

          // 3. High leap
          if (isJumping) {
            bodyPivot.position.y = 0.2;
            bodyPivot.rotation.x = 0.32; // Aerodynamic tuck
            headGroup.rotation.x = -0.25;

            // Bent knees tucked in midair
            leftLegPivot.rotation.x = 0.75;
            rightLegPivot.rotation.x = 0.60;
            leftKneePivot.rotation.x = -0.8;
            rightKneePivot.rotation.x = -0.65;

            // Arms counterbalance the tucked legs.
            leftArmPivot.rotation.x = -0.85;
            rightArmPivot.rotation.x = -0.85;
            leftArmPivot.rotation.z = 0.55;
            rightArmPivot.rotation.z = -0.55;
            leftElbowPivot.rotation.x = -0.35;
            rightElbowPivot.rotation.x = -0.35;
            return;
          }

          // 4. Natural running cycle
          bodyPivot.rotation.x = 0.12;
          headGroup.rotation.x = -0.22; // Eyes locked on the path ahead

          // Leg strides
          const legAngle = Math.sin(runFreq) * 0.62;
          leftLegPivot.rotation.x = legAngle;
          rightLegPivot.rotation.x = -legAngle;
          leftKneePivot.rotation.x = Math.max(0, Math.sin(runFreq + Math.PI * 0.5)) * -0.72;
          rightKneePivot.rotation.x = Math.max(0, Math.sin(runFreq - Math.PI * 0.5)) * -0.72;

          const armSwing = Math.sin(runFreq) * 0.32;
          leftArmPivot.rotation.x = 0.2 + armSwing;
          rightArmPivot.rotation.x = 0.2 - armSwing;
          leftElbowPivot.rotation.x = -0.12 + Math.max(0, Math.sin(runFreq)) * 0.16;
          rightElbowPivot.rotation.x = -0.12 + Math.max(0, Math.sin(runFreq + Math.PI)) * 0.16;

          // Arms flare slightly outwards to sides
          leftArmPivot.rotation.z = 0.22;
          rightArmPivot.rotation.z = -0.22;

          // Natural vertical ninja bounce
          bodyPivot.position.y = 0.05 + Math.abs(Math.sin(runFreq * 2)) * 0.055;
        }
      };

      const skateboard = this.createSkateboard();
      const airplane = this.createAirplane();
      skateboard.visible = false;
      airplane.visible = false;
      group.add(skateboard, airplane);
      group.userData.skateboard = skateboard;
      group.userData.airplane = airplane;

      return group;
    },

    createSkateboard() {
      const board = new THREE.Group();
      const deckMaterial = new THREE.MeshStandardMaterial({
        color: 0xff7b28,
        roughness: 0.42,
        metalness: 0.08
      });
      const trimMaterial = new THREE.MeshStandardMaterial({
        color: 0x18243a,
        roughness: 0.52,
        metalness: 0.15
      });
      const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x38d7e5,
        roughness: 0.32,
        metalness: 0.12
      });

      const deck = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.11, 0.48), deckMaterial);
      deck.position.y = 0.17;
      deck.castShadow = true;
      board.add(deck);

      const centerStripe = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.012, 0.1), trimMaterial);
      centerStripe.position.set(0, 0.232, 0);
      board.add(centerStripe);

      const wheels = [];
      const wheelGeo = new THREE.CylinderGeometry(0.105, 0.105, 0.085, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      [-1, 1].forEach(side => {
        const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 10), trimMaterial);
        axle.rotation.z = Math.PI / 2;
        axle.position.set(0, 0.105, side * 0.31);
        board.add(axle);

        [-1, 1].forEach(end => {
          const wheel = new THREE.Mesh(wheelGeo, wheelMaterial);
          wheel.position.set(end * 0.52, 0.105, side * 0.31);
          wheel.castShadow = true;
          board.add(wheel);
          wheels.push(wheel);
        });
      });

      board.userData = {
        paintMaterial: deckMaterial,
        wheels,
        update(delta, speed) {
          const spin = delta * Math.max(4, speed * 2.2);
          this.wheels.forEach(wheel => {
            wheel.rotation.x += spin;
          });
        }
      };
      return board;
    },

    createAirplane() {
      const airplane = new THREE.Group();
      airplane.position.y = 0.5;
      const paintMaterial = new THREE.MeshStandardMaterial({
        color: 0x36b8f1,
        roughness: 0.4,
        metalness: 0.12
      });
      const trimMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd166,
        roughness: 0.4,
        metalness: 0.15
      });
      const fuselage = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 14),
        paintMaterial
      );
      fuselage.scale.set(0.24, 0.23, 1.2);
      fuselage.position.y = 0.1;
      fuselage.castShadow = true;
      airplane.add(fuselage);

      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.48, 16), trimMaterial);
      nose.rotation.x = -Math.PI / 2;
      nose.position.set(0, 0.1, -1.32);
      airplane.add(nose);

      const wing = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.09, 0.48), paintMaterial);
      wing.position.set(0, 0.1, -0.05);
      wing.castShadow = true;
      airplane.add(wing);

      const tailWing = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.28), trimMaterial);
      tailWing.position.set(0, 0.2, 0.88);
      airplane.add(tailWing);

      const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.34), paintMaterial);
      tailFin.position.set(0, 0.36, 0.88);
      airplane.add(tailFin);

      const cockpit = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 16, 12),
        new THREE.MeshStandardMaterial({
          color: 0xb9f2ff,
          transparent: true,
          opacity: 0.48,
          roughness: 0.2,
          metalness: 0.18
        })
      );
      cockpit.scale.set(0.82, 0.72, 0.9);
      cockpit.position.set(0, 0.36, 0.12);
      airplane.add(cockpit);

      const propeller = new THREE.Group();
      propeller.position.set(0, 0.1, -1.45);
      const bladeGeo = new THREE.BoxGeometry(0.09, 0.72, 0.07);
      const bladeA = new THREE.Mesh(bladeGeo, trimMaterial);
      const bladeB = new THREE.Mesh(bladeGeo, trimMaterial);
      bladeB.rotation.z = Math.PI / 2;
      propeller.add(bladeA, bladeB);
      airplane.add(propeller);

      airplane.userData = {
        paintMaterial,
        propeller,
        update(time) {
          this.propeller.rotation.z = time * 22;
          airplane.rotation.x = Math.sin(time * 2.2) * 0.035;
          airplane.rotation.z = Math.sin(time * 1.4) * 0.025;
        }
      };
      return airplane;
    },

    applyPlayerCosmetics(player, colors) {
      player.traverse(object => {
        const slot = object.userData.storeColor;
        if (slot && colors[slot] && object.material && object.material.color) {
          object.material.color.set(colors[slot]);
        }
      });
    },

    applyPlayerVariant(player, variant, colors) {
      player.traverse(object => {
        if (object.userData.runnerDetail) object.visible = !variant;
      });

      const previous = player.userData.variantAccessories || [];
      previous.forEach(group => {
        group.parent.remove(group);
        group.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) object.material.dispose();
        });
      });

      const accessories = new THREE.Group();
      player.userData.headGroup.add(accessories);
      const bodyGear = new THREE.Group();
      player.userData.bodyPivot.add(bodyGear);
      player.userData.variantAccessories = [accessories, bodyGear];
      if (!variant) return;

      const trim = new THREE.MeshStandardMaterial({
        color: colors.accent,
        roughness: 0.48,
        metalness: 0.14
      });
      const cloth = new THREE.MeshStandardMaterial({
        color: colors.outfit,
        roughness: 0.68
      });
      const hair = new THREE.MeshStandardMaterial({
        color: colors.hair,
        roughness: 0.72
      });
      const mesh = (parent, geometry, material, position, scale, rotation) => {
        const item = new THREE.Mesh(geometry, material);
        item.position.set(position[0], position[1], position[2]);
        if (scale) item.scale.set(scale[0], scale[1], scale[2]);
        if (rotation) item.rotation.set(rotation[0], rotation[1], rotation[2]);
        item.castShadow = true;
        item.receiveShadow = true;
        parent.add(item);
        return item;
      };
      const spike = (position, scale, rotation) => mesh(
        accessories,
        new THREE.ConeGeometry(1, 1, 8),
        hair,
        position,
        scale,
        rotation
      );

      mesh(accessories, new THREE.SphereGeometry(0.27, 16, 12), hair,
        [0, 0.18, 0.025], [1.05, 0.65, 0.95]);

      switch (variant) {
        case 1:
          mesh(bodyGear, new THREE.TorusGeometry(0.29, 0.055, 8, 20), trim,
            [0, 1.48, 0], [1, 0.75, 1], [Math.PI / 2, 0, 0]);
          mesh(bodyGear, new THREE.BoxGeometry(0.14, 0.58, 0.06), cloth,
            [0.24, 1.13, 0.27], null, [0, 0, -0.3]);
          break;
        case 2:
          [-1, 0, 1].forEach(side => {
            spike([side * 0.15, 0.36, 0.02], [0.12, side === 0 ? 0.42 : 0.34, 0.12],
              [0.12, 0, side * -0.22]);
          });
          [-1, 1].forEach(side => {
            mesh(accessories, new THREE.SphereGeometry(0.075, 14, 10), trim,
              [side * 0.105, 0.02, -0.31], [1.12, 0.82, 0.42]);
          });
          mesh(bodyGear, new THREE.BoxGeometry(0.68, 0.14, 0.08), trim,
            [0, 1.33, -0.02]);
          break;
        case 3:
          spike([0, 0.36, 0.05], [0.13, 0.46, 0.13], [-0.32, 0, 0]);
          mesh(bodyGear, new THREE.SphereGeometry(0.25, 16, 12), cloth,
            [0, 0.98, 0.27], [0.8, 1.05, 0.78]);
          mesh(bodyGear, new THREE.BoxGeometry(0.11, 0.78, 0.07), trim,
            [0.24, 1.1, -0.23], null, [0, 0, -0.24]);
          break;
        case 4:
          [-1, 1].forEach(side => {
            mesh(accessories, new THREE.SphereGeometry(0.15, 12, 10), hair,
              [side * 0.27, 0.02, 0.05], [0.72, 0.9, 0.75]);
          });
          [-1, 1].forEach(side => {
            mesh(bodyGear, new THREE.BoxGeometry(0.12, 0.54, 0.055), trim,
              [side * 0.36, 1.0, 0.14], null, [0, 0, side * 0.25]);
          });
          mesh(accessories, new THREE.TorusGeometry(0.2, 0.025, 6, 18), trim,
            [0, 0.27, -0.02], [1.3, 0.8, 1]);
          break;
        case 5:
          [-1, 1].forEach(side => {
            spike([side * 0.22, -0.04, -0.02], [0.11, 0.42, 0.11], [0.25, 0, side * -0.18]);
          });
          mesh(accessories, new THREE.SphereGeometry(0.2, 16, 12), trim,
            [0, -0.12, -0.25], [1.2, 0.56, 0.18]);
          mesh(bodyGear, new THREE.BoxGeometry(0.72, 0.34, 0.09), cloth,
            [0, 1.55, 0.12]);
          break;
        case 6:
          [-1, 1].forEach(side => {
            spike([side * 0.24, -0.1, 0.08], [0.12, 0.48, 0.12], [0.16, 0, side * -0.18]);
          });
          mesh(bodyGear, new THREE.BoxGeometry(0.78, 0.82, 0.11), cloth,
            [0, 1.03, 0.25], null, [0.15, 0, 0]);
          [-1, 1].forEach(side => {
            mesh(bodyGear, new THREE.BoxGeometry(0.23, 0.25, 0.27), trim,
              [side * 0.34, 1.38, 0]);
          });
          break;
        case 7:
          [-1, 1].forEach(side => {
            spike([side * 0.17, 0.36, 0.03], [0.1, 0.42, 0.09], [0.08, 0, side * -0.3]);
          });
          [-1, 1].forEach(side => {
            mesh(accessories, new THREE.ConeGeometry(0.09, 0.38, 8), trim,
              [side * 0.19, 0.32, 0.05], [1, 1, 0.6], [0, 0, side * -0.35]);
          });
          mesh(bodyGear, new THREE.BoxGeometry(0.62, 0.52, 0.06), cloth,
            [0, 1.02, 0.26], null, [0.12, 0, 0]);
          break;
        case 8:
          mesh(accessories, new THREE.TorusGeometry(0.24, 0.055, 8, 18), cloth,
            [0, 0.2, 0.02], [1.2, 0.72, 1]);
          mesh(bodyGear, new THREE.SphereGeometry(0.27, 16, 12), cloth,
            [0.12, 0.98, 0.3], [0.86, 1.05, 0.72]);
          mesh(accessories, new THREE.TorusGeometry(0.29, 0.045, 8, 18), trim,
            [0, 0.32, -0.02], [1.05, 0.78, 0.8], [Math.PI / 2, 0, 0]);
          break;
        case 9:
          mesh(accessories, new THREE.SphereGeometry(0.29, 16, 12), hair,
            [0, 0.14, 0.03], [1.13, 0.52, 1]);
          [-1, 1].forEach(side => {
            mesh(bodyGear, new THREE.BoxGeometry(0.18, 0.2, 0.21), trim,
              [side * 0.38, 1.12, -0.05], null, [0, 0, side * 0.15]);
          });
          mesh(bodyGear, new THREE.CylinderGeometry(0.31, 0.31, 0.08, 16), trim,
            [0, 0.78, 0], [1, 1, 0.72]);
          break;
        case 10:
          [-1, 0, 1].forEach(side => {
            spike([side * 0.12, 0.38, 0.02], [0.1, 0.36, 0.1], [0.05, 0, side * -0.2]);
          });
          mesh(accessories, new THREE.OctahedronGeometry(0.13, 0), trim,
            [0, 0.33, -0.04], [1.1, 1.35, 0.7]);
          mesh(bodyGear, new THREE.TorusGeometry(0.29, 0.045, 8, 18), cloth,
            [0, 1.43, 0.02], [1.25, 0.78, 0.85], [Math.PI / 2, 0, 0]);
          break;
        case 11:
          mesh(accessories, new THREE.SphereGeometry(0.3, 16, 12), cloth,
            [0, 0.14, 0.24], [1.18, 0.95, 0.8]);
          [-1, 1].forEach(side => {
            mesh(accessories, new THREE.SphereGeometry(0.07, 12, 8), trim,
              [side * 0.105, 0.02, -0.31], [1.1, 0.8, 0.38]);
          });
          break;
        case 12:
          spike([0, 0.42, 0.02], [0.14, 0.58, 0.14], [-0.15, 0, 0]);
          mesh(accessories, new THREE.ConeGeometry(0.11, 0.48, 8), trim,
            [0, 0.42, 0.02], [1, 1, 0.85], [0.15, 0, 0]);
          mesh(bodyGear, new THREE.BoxGeometry(0.72, 0.62, 0.08), cloth,
            [0, 1.12, 0.28], null, [-0.12, 0, 0]);
          break;
        default:
          break;
      }

    },

    applyVehicleColor(vehicle, color) {
      if (vehicle && vehicle.userData.paintMaterial) {
        vehicle.userData.paintMaterial.color.set(color);
      }
    },

    // =======================================================
    // 2. Cinder Warden, a crystalline forest guardian (chaser)
    // =======================================================
    // Compact stone plates, mint mineral seams, and swept crystal horns define the original guardian.
    createMonster() {
      const monsterGroup = new THREE.Group();
      monsterGroup.scale.setScalar(0.68);
      const softFormGeo = new THREE.SphereGeometry(1, 20, 14);

      const beastPivot = new THREE.Group();
      monsterGroup.add(beastPivot);

      // --- ARMORED BODY ---
      const chest = new THREE.Mesh(softFormGeo, materials.wardenHide);
      chest.position.set(0, 1.15, 0);
      chest.scale.set(0.82, 0.62, 0.78);
      chest.castShadow = true;
      beastPivot.add(chest);

      [-1, 1].forEach(side => {
        const pec = new THREE.Mesh(softFormGeo, materials.wardenStone);
        pec.position.set(side * 0.31, 1.13, -0.59);
        pec.scale.set(0.32, 0.24, 0.12);
        beastPivot.add(pec);
      });

      const hump = new THREE.Mesh(softFormGeo, materials.wardenHide);
      hump.position.set(0, 1.45, 0.1);
      hump.scale.set(0.84, 0.42, 0.58);
      hump.castShadow = true;
      beastPivot.add(hump);

      // Faceted crystal ridges
      for (let i = 0; i < 5; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.10, 0.52, 5);
        const spike = new THREE.Mesh(spikeGeo, materials.wardenCrystals);
        spike.position.set(0, 1.25 + i * 0.16, 0.58 + i * 0.12);
        spike.rotation.x = 1.35;
        beastPivot.add(spike);
      }

      // A soft mint mineral seam
      const magmaGeo = new THREE.CylinderGeometry(0.045, 0.065, 0.8, 8);
      const magmaStrip = new THREE.Mesh(magmaGeo, materials.wardenGlow);
      magmaStrip.position.set(0, 1.6, 0.25);
      beastPivot.add(magmaStrip);

      // --- MASKED STONE FACE ---
      const headPivot = new THREE.Group();
      headPivot.position.set(0, 1.28, -0.72); // Positioned forward and low

      // Skull
      const skull = new THREE.Mesh(softFormGeo, materials.wardenHide);
      skull.scale.set(0.49, 0.42, 0.49);
      skull.castShadow = true;
      headPivot.add(skull);

      [-1, 1].forEach(side => {
        const cheek = new THREE.Mesh(softFormGeo, materials.wardenHide);
        cheek.position.set(side * 0.34, -0.05, -0.29);
        cheek.scale.set(0.20, 0.22, 0.24);
        headPivot.add(cheek);

        const brow = new THREE.Mesh(softFormGeo, materials.wardenStone);
        brow.position.set(side * 0.21, 0.23, -0.37);
        brow.scale.set(0.24, 0.09, 0.12);
        brow.rotation.z = side * -0.12;
        headPivot.add(brow);
      });

      const muzzle = new THREE.Mesh(softFormGeo, materials.wardenStone);
      muzzle.position.set(0, -0.12, -0.44);
      muzzle.scale.set(0.30, 0.20, 0.18);
      headPivot.add(muzzle);

      // Hinged jaw for its warning animation
      const jawPivot = new THREE.Group();
      jawPivot.position.set(0, -0.22, -0.15);

      const jawMesh = new THREE.Mesh(softFormGeo, materials.wardenHide);
      jawMesh.scale.set(0.38, 0.14, 0.35);
      jawMesh.position.set(0, 0, -0.22);
      jawPivot.add(jawMesh);

      // Lower sharp ivory fangs
      const fangGeo = new THREE.ConeGeometry(0.065, 0.34, 5);
      const leftLowerFang = new THREE.Mesh(fangGeo, materials.wardenFangs);
      leftLowerFang.position.set(-0.26, 0.20, -0.48);
      jawPivot.add(leftLowerFang);

      const rightLowerFang = new THREE.Mesh(fangGeo, materials.wardenFangs);
      rightLowerFang.position.set(0.26, 0.20, -0.48);
      jawPivot.add(rightLowerFang);

      headPivot.add(jawPivot);

      // Upper Fangs hanging down from upper snout
      const upperFangGeo = new THREE.ConeGeometry(0.075, 0.38, 5);
      const leftUpperFang = new THREE.Mesh(upperFangGeo, materials.wardenFangs);
      leftUpperFang.position.set(-0.28, -0.18, -0.52);
      leftUpperFang.rotation.x = Math.PI;
      headPivot.add(leftUpperFang);

      const rightUpperFang = new THREE.Mesh(upperFangGeo, materials.wardenFangs);
      rightUpperFang.position.set(0.28, -0.18, -0.52);
      rightUpperFang.rotation.x = Math.PI;
      headPivot.add(rightUpperFang);

      // Mint-lit eyes
      const eyeGeo = new THREE.SphereGeometry(0.105, 16, 12);
      const leftEye = new THREE.Mesh(eyeGeo, materials.wardenEyes);
      leftEye.position.set(-0.25, 0.10, -0.46);
      headPivot.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, materials.wardenEyes);
      rightEye.position.set(0.25, 0.10, -0.46);
      headPivot.add(rightEye);

      const eyeLight = new THREE.PointLight(0x72f5d1, 1.5, 4.0);
      eyeLight.position.set(0, 0.1, -0.65);
      headPivot.add(eyeLight);

      // Swept crystal fins
      const hornGeo = new THREE.ConeGeometry(0.11, 0.9, 7);

      const leftHorn = new THREE.Mesh(hornGeo, materials.wardenCrystals);
      leftHorn.position.set(-0.46, 0.42, 0.05);
      leftHorn.rotation.set(-0.65, 0, 0.45);
      headPivot.add(leftHorn);

      const rightHorn = new THREE.Mesh(hornGeo, materials.wardenCrystals);
      rightHorn.position.set(0.46, 0.42, 0.05);
      rightHorn.rotation.set(-0.65, 0, -0.45);
      headPivot.add(rightHorn);

      beastPivot.add(headPivot);

      // --- SHORT FORELEGS & STONE PAWS ---
      // Left Arm
      const leftArmPivot = new THREE.Group();
      leftArmPivot.position.set(-0.82, 1.25, -0.2);

      const armUpperBicep = softFormGeo;
      const leftBicep = new THREE.Mesh(armUpperBicep, materials.wardenHide);
      leftBicep.position.y = -0.28;
      leftBicep.scale.set(0.24, 0.36, 0.24);
      leftBicep.castShadow = true;
      leftArmPivot.add(leftBicep);

      const forearmMeshGeo = softFormGeo;
      const leftForearm = new THREE.Mesh(forearmMeshGeo, materials.wardenHide);
      leftForearm.position.set(0, -0.14, 0.05);
      leftForearm.scale.set(0.20, 0.33, 0.20);
      leftForearm.castShadow = true;
      const leftElbowPivot = new THREE.Group();
      leftElbowPivot.position.y = -0.60;
      leftElbowPivot.add(leftForearm);

      // Broad stone paw
      const knuckleGeo = softFormGeo;
      const leftKnuckle = new THREE.Mesh(knuckleGeo, materials.wardenStone);
      leftKnuckle.position.set(0, -0.37, 0.04);
      leftKnuckle.scale.set(0.24, 0.11, 0.24);
      leftKnuckle.castShadow = true;
      leftElbowPivot.add(leftKnuckle);

      // Small crystal claws
      for (let k = -1; k <= 1; k++) {
        const clawGeo = new THREE.ConeGeometry(0.045, 0.20, 4);
        const claw = new THREE.Mesh(clawGeo, materials.wardenCrystals);
        claw.position.set(k * 0.12, -0.46, -0.12);
        claw.rotation.x = -1.2;
        leftElbowPivot.add(claw);
      }

      leftArmPivot.add(leftElbowPivot);
      beastPivot.add(leftArmPivot);

      // Right Arm
      const rightArmPivot = new THREE.Group();
      rightArmPivot.position.set(0.82, 1.25, -0.2);

      const rightBicep = new THREE.Mesh(armUpperBicep, materials.wardenHide);
      rightBicep.position.y = -0.28;
      rightBicep.scale.set(0.24, 0.36, 0.24);
      rightBicep.castShadow = true;
      rightArmPivot.add(rightBicep);

      const rightForearm = new THREE.Mesh(forearmMeshGeo, materials.wardenHide);
      rightForearm.position.set(0, -0.14, 0.05);
      rightForearm.scale.set(0.20, 0.33, 0.20);
      rightForearm.castShadow = true;
      const rightElbowPivot = new THREE.Group();
      rightElbowPivot.position.y = -0.60;
      rightElbowPivot.add(rightForearm);

      const rightKnuckle = new THREE.Mesh(knuckleGeo, materials.wardenStone);
      rightKnuckle.position.set(0, -0.37, 0.04);
      rightKnuckle.scale.set(0.24, 0.11, 0.24);
      rightKnuckle.castShadow = true;
      rightElbowPivot.add(rightKnuckle);

      for (let k = -1; k <= 1; k++) {
        const clawGeo = new THREE.ConeGeometry(0.045, 0.20, 4);
        const claw = new THREE.Mesh(clawGeo, materials.wardenCrystals);
        claw.position.set(k * 0.12, -0.46, -0.12);
        claw.rotation.x = -1.2;
        rightElbowPivot.add(claw);
      }

      rightArmPivot.add(rightElbowPivot);
      beastPivot.add(rightArmPivot);

      // --- HIND LEGS ---
      const leftLegPivot = new THREE.Group();
      leftLegPivot.position.set(-0.46, 0.90, 0.55);

      const thighMeshGeo = softFormGeo;
      const leftThigh = new THREE.Mesh(thighMeshGeo, materials.wardenHide);
      leftThigh.position.y = -0.30;
      leftThigh.scale.set(0.28, 0.42, 0.28);
      leftThigh.castShadow = true;
      leftLegPivot.add(leftThigh);

      const calfGeo = softFormGeo;
      const leftCalf = new THREE.Mesh(calfGeo, materials.wardenHide);
      leftCalf.position.set(0, -0.18, -0.08);
      leftCalf.scale.set(0.22, 0.40, 0.22);
      leftCalf.castShadow = true;
      const leftKneePivot = new THREE.Group();
      leftKneePivot.position.y = -0.55;
      leftKneePivot.add(leftCalf);

      const footGeo = softFormGeo;
      const leftFoot = new THREE.Mesh(footGeo, materials.wardenStone);
      leftFoot.position.set(0, -0.48, -0.16);
      leftFoot.scale.set(0.22, 0.13, 0.28);
      leftKneePivot.add(leftFoot);

      leftLegPivot.add(leftKneePivot);
      beastPivot.add(leftLegPivot);

      const rightLegPivot = new THREE.Group();
      rightLegPivot.position.set(0.46, 0.90, 0.55);

      const rightThigh = new THREE.Mesh(thighMeshGeo, materials.wardenHide);
      rightThigh.position.y = -0.30;
      rightThigh.scale.set(0.28, 0.42, 0.28);
      rightThigh.castShadow = true;
      rightLegPivot.add(rightThigh);

      const rightCalf = new THREE.Mesh(calfGeo, materials.wardenHide);
      rightCalf.position.set(0, -0.18, -0.08);
      rightCalf.scale.set(0.22, 0.40, 0.22);
      rightCalf.castShadow = true;
      const rightKneePivot = new THREE.Group();
      rightKneePivot.position.y = -0.55;
      rightKneePivot.add(rightCalf);

      const rightFoot = new THREE.Mesh(footGeo, materials.wardenStone);
      rightFoot.position.set(0, -0.48, -0.16);
      rightFoot.scale.set(0.22, 0.13, 0.28);
      rightKneePivot.add(rightFoot);

      rightLegPivot.add(rightKneePivot);
      beastPivot.add(rightLegPivot);

      // --- fantasy trail QUADRUPEDAL GALLOP ANIMATION ---
      monsterGroup.userData = {
        beastPivot,
        headPivot,
        jawPivot,
        leftArmPivot,
        rightArmPivot,
        leftElbowPivot,
        rightElbowPivot,
        leftLegPivot,
        rightLegPivot,
        leftKneePivot,
        rightKneePivot,
        eyeLight,

        update(time, currentDistance, isLunge) {
          const runFreq = time * 11;

          // Game over attack lunge
          if (isLunge) {
            beastPivot.position.y = 0.45;
            beastPivot.rotation.x = 0.45;
            leftArmPivot.rotation.x = -1.45;
            rightArmPivot.rotation.x = -1.45;
            leftElbowPivot.rotation.x = -0.55;
            rightElbowPivot.rotation.x = -0.55;
            jawPivot.rotation.x = 0.55; // Snapping open
            eyeLight.intensity = 3.5;
            return;
          }

          // The guardian bounds on all fours:
          // Low athletic predatory stance
          beastPivot.rotation.x = 0.22;
          // Heavy ground heaving bounce
          beastPivot.position.y = Math.abs(Math.sin(runFreq * 2)) * 0.16;

          // Quadrupedal bounding: Left arm + Right leg stride, then Right arm + Left leg stride!
          const stride = Math.sin(runFreq) * 0.65;

          // Knuckles plant firmly on ground alternately
          leftArmPivot.rotation.x = stride * 0.75 - 0.2;
          rightArmPivot.rotation.x = -stride * 0.75 - 0.2;
          leftElbowPivot.rotation.x = Math.max(0, stride) * 0.55;
          rightElbowPivot.rotation.x = Math.max(0, -stride) * 0.55;

          // Hind legs propel forward
          leftLegPivot.rotation.x = -stride * 0.6;
          rightLegPivot.rotation.x = stride * 0.6;
          leftKneePivot.rotation.x = Math.max(0, stride) * 0.65;
          rightKneePivot.rotation.x = Math.max(0, -stride) * 0.65;

          // Snapping ferocious jaw
          jawPivot.rotation.x = Math.max(0, Math.sin(runFreq * 2.5)) * 0.38;

          // Menacing eye light pulse
          eyeLight.intensity = 1.8 + Math.sin(runFreq * 3.5) * 0.6;
        }
      };

      return monsterGroup;
    },

    createEncounterMonster(variant = 0) {
      const group = new THREE.Group();
      const bodyGeo = new THREE.SphereGeometry(0.7, 14, 10);
      const headGeo = new THREE.SphereGeometry(0.48, 14, 10);
      const eyeGeo = new THREE.SphereGeometry(0.09, 8, 6);
      const hornGeo = new THREE.ConeGeometry(0.16, 0.62, 6);
      const palette = variant % 3;
      const bodyMaterial = palette === 1 ? materials.ancientStone :
        (palette === 2 ? materials.cartoonPumpkin : materials.wardenHide);
      const trimMaterial = palette === 1 ? materials.ruinRune :
        (palette === 2 ? materials.pumpkinStem : materials.wardenCrystals);
      const eyeMaterial = palette === 2 ? materials.runnerIris : materials.wardenEyes;

      const body = new THREE.Mesh(bodyGeo, bodyMaterial);
      body.position.y = 0.95;
      body.scale.set(0.78, 0.95, 0.56);
      body.castShadow = true;
      group.add(body);

      const head = new THREE.Mesh(headGeo, palette === 2 ? materials.cartoonPumpkin : bodyMaterial);
      head.position.set(0, 1.75, -0.08);
      head.scale.set(1, 0.9, 0.86);
      head.castShadow = true;
      group.add(head);

      [-1, 1].forEach((side) => {
        const eye = new THREE.Mesh(eyeGeo, eyeMaterial);
        eye.position.set(side * 0.19, 1.82, -0.46);
        group.add(eye);

        const horn = new THREE.Mesh(hornGeo, trimMaterial);
        horn.position.set(side * 0.34, 2.2, 0.02);
        horn.rotation.z = side * -0.28;
        group.add(horn);

        const arm = new THREE.Mesh(bodyGeo, trimMaterial);
        arm.position.set(side * 0.78, 1.05, -0.06);
        arm.scale.set(0.24, 0.62, 0.25);
        arm.rotation.z = side * -0.38;
        group.add(arm);
      });

      if (palette === 1) {
        const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), materials.ruinRune);
        crystal.position.set(0, 1.15, -0.51);
        group.add(crystal);
      } else if (palette === 2) {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.24, 7), materials.pumpkinStem);
        stem.position.set(0, 2.22, 0);
        group.add(stem);
      }

      group.userData.heightType = 'FULL';
      group.userData.kind = 'ENCOUNTER_MONSTER';
      group.userData.update = (time) => {
        group.position.y = Math.sin(time * 4.2 + palette) * 0.08;
        group.rotation.z = Math.sin(time * 2.5 + palette) * 0.035;
        head.rotation.x = Math.sin(time * 3.2 + palette) * 0.06;
      };
      return group;
    },

    createRouteGate(safeLane = 1) {
      const group = new THREE.Group();
      const lanes = [-2.8, 0, 2.8];
      const laneMaterials = [materials.coinGold, materials.ghostTrim, materials.ruinRune];
      const routeTypes = ['bridge', 'cave', 'forest'];
      const floorGeo = new THREE.BoxGeometry(2.35, 0.08, 30);
      const postGeo = new THREE.BoxGeometry(0.16, 2.25, 0.22);
      const beamGeo = new THREE.BoxGeometry(2.25, 0.18, 0.24);

      lanes.forEach((laneX, index) => {
        const floor = new THREE.Mesh(floorGeo, laneMaterials[index]);
        floor.position.set(laneX, 0.025, -12);
        floor.receiveShadow = true;
        group.add(floor);

        [-1, 1].forEach((side) => {
          const post = new THREE.Mesh(postGeo, laneMaterials[index]);
          post.position.set(laneX + side * 0.98, 1.12, 0);
          post.castShadow = true;
          group.add(post);
        });

        const beam = new THREE.Mesh(beamGeo, laneMaterials[index]);
        beam.position.set(laneX, 2.2, 0);
        beam.castShadow = true;
        group.add(beam);

        const markerMaterial = index === safeLane ? materials.foliageLight : materials.cartoonRed;
        const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), markerMaterial);
        marker.position.set(laneX, 2.65, -0.05);
        group.add(marker);
      });

      group.userData.routeTypes = routeTypes;
      group.userData.heightType = 'FULL';
      return group;
    },

    createBiomeDecoration(theme, side) {
      const group = new THREE.Group();
      const x = side * 1.1;

      if (theme === 'jungle') {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 3.4, 7), materials.treeTrunk);
        trunk.position.y = 1.7;
        group.add(trunk);
        [-1, 1].forEach((leafSide) => {
          const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.05, 2.4, 7), materials.foliageLight);
          canopy.position.set(leafSide * 0.42, 3.0, leafSide * -0.22);
          canopy.rotation.z = leafSide * -0.12;
          group.add(canopy);
        });
        const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.055, 2.6, 5), materials.foliage);
        vine.position.set(-side * 0.72, 2.3, -0.5);
        vine.rotation.z = 0.3;
        group.add(vine);
      } else if (theme === 'temple') {
        [-1, 1].forEach((pillarSide) => {
          const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 3.1, 0.48), materials.ancientStone);
          pillar.position.set(pillarSide * 0.72, 1.55, 0);
          pillar.castShadow = true;
          group.add(pillar);
        });
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.42, 0.65), materials.ancientStone);
        lintel.position.set(0, 3.25, 0);
        group.add(lintel);
        const rune = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.08), materials.ruinRune);
        rune.position.set(0, 3.27, -0.36);
        group.add(rune);
      } else if (theme === 'volcano') {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 0), materials.cartoonDark);
        rock.position.y = 0.8;
        rock.scale.set(1.25, 0.9, 1.1);
        rock.castShadow = true;
        group.add(rock);
        const lava = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.09, 0.16), materials.wardenGlow);
        lava.position.set(0, 0.72, -0.95);
        group.add(lava);
        const vent = new THREE.Mesh(new THREE.ConeGeometry(0.52, 1.0, 6), materials.ancientStone);
        vent.position.set(side * 0.55, 1.55, 0.18);
        group.add(vent);
      } else if (theme === 'village') {
        const walls = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.1, 1.5), materials.woodBark);
        walls.position.y = 1.05;
        walls.castShadow = true;
        group.add(walls);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.05, 4), materials.cartoonRed);
        roof.position.set(0, 2.55, 0);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        const window = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.48, 0.05), materials.coinGold);
        window.position.set(-side * 0.2, 1.3, -0.78);
        group.add(window);
      } else if (theme === 'cave') {
        const archGeo = new THREE.TorusGeometry(1.5, 0.3, 5, 12, Math.PI);
        const arch = new THREE.Mesh(archGeo, materials.ancientStone);
        arch.position.y = 2.0;
        arch.rotation.z = Math.PI;
        arch.castShadow = true;
        group.add(arch);
        const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.15, 5), materials.ruinRune);
        crystal.position.set(0, 0.72, 0);
        group.add(crystal);
      } else if (theme === 'mountain') {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 0), materials.ancientStone);
        rock.position.y = 0.7;
        rock.scale.set(1.2, 0.85, 1);
        rock.castShadow = true;
        group.add(rock);
        const peak = new THREE.Mesh(new THREE.ConeGeometry(0.72, 2.2, 6), materials.foliageLight);
        peak.position.set(side * 0.15, 1.9, -0.2);
        peak.castShadow = true;
        group.add(peak);
      } else {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.8, 7), materials.treeTrunk);
        trunk.position.y = 1.4;
        group.add(trunk);
        const crown = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.5, 7), materials.foliageLight);
        crown.position.y = 3.1;
        group.add(crown);
      }

      group.position.x = x;
      group.userData.side = side;
      return group;
    },

    // ==========================================
    // 3. OBSTACLES (PRESERVED FAIRNESS RULES)
    // ==========================================
    // A: Fallen Mossy Tree Log (Low Hurdle -> MUST JUMP)
    createLogObstacle() {
      const group = new THREE.Group();

      const logGeo = new THREE.CylinderGeometry(0.35, 0.4, 2.5, 8);
      const log = new THREE.Mesh(logGeo, materials.woodBark);
      log.rotation.z = Math.PI / 2;
      log.position.y = 0.35;
      log.castShadow = true;
      group.add(log);

      // Moss patch on top
      const mossGeo = new THREE.BoxGeometry(1.8, 0.12, 0.5);
      const moss = new THREE.Mesh(mossGeo, materials.mossWood);
      moss.position.y = 0.65;
      group.add(moss);

      // Dead branches
      const branchGeo = new THREE.ConeGeometry(0.08, 0.6, 5);
      const b1 = new THREE.Mesh(branchGeo, materials.woodBark);
      b1.position.set(-0.6, 0.7, 0.1);
      b1.rotation.z = -0.4;
      group.add(b1);

      group.userData = {
        type: 'LOG',
        heightType: 'LOW', // Requires Jump
        boxSize: new THREE.Vector3(2.5, 0.8, 0.9)
      };

      return group;
    },

    // B: Ancient Ruin Arch with Spikes (High Barrier -> MUST SLIDE)
    createRuinArchObstacle() {
      const group = new THREE.Group();

      // Left Pillar
      const pillarGeo = new THREE.BoxGeometry(0.4, 3.2, 0.4);
      const leftPillar = new THREE.Mesh(pillarGeo, materials.ancientStone);
      leftPillar.position.set(-1.2, 1.6, 0);
      leftPillar.castShadow = true;
      group.add(leftPillar);

      // Right Pillar
      const rightPillar = new THREE.Mesh(pillarGeo, materials.ancientStone);
      rightPillar.position.set(1.2, 1.6, 0);
      rightPillar.castShadow = true;
      group.add(rightPillar);

      // Overhead Crossbeam (Low enough to hit standing runner, clears sliding runner!)
      const beamGeo = new THREE.BoxGeometry(2.8, 0.75, 0.6);
      const beam = new THREE.Mesh(beamGeo, materials.ancientStone);
      beam.position.set(0, 1.9, 0);
      beam.castShadow = true;
      group.add(beam);

      // Ancient Glowing Rune on beam
      const runeGeo = new THREE.BoxGeometry(0.6, 0.25, 0.65);
      const rune = new THREE.Mesh(runeGeo, materials.ruinRune);
      rune.position.set(0, 1.9, 0);
      group.add(rune);

      // Hanging rusted spikes
      for (let i = -2; i <= 2; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.08, 0.5, 4);
        const spike = new THREE.Mesh(spikeGeo, materials.spikes);
        spike.position.set(i * 0.45, 1.35, 0);
        spike.rotation.x = Math.PI;
        group.add(spike);
      }

      group.userData = {
        type: 'RUIN_ARCH',
        heightType: 'HIGH', // Requires Slide
        minClearHeight: 0.9,
        boxSize: new THREE.Vector3(2.6, 1.5, 0.8),
        boxCenterY: 1.85
      };

      return group;
    },

    // C: Broken Ancient Pillar / Obelisk (Full Blocker -> MUST CHANGE LANE)
    createPillarObstacle() {
      const group = new THREE.Group();

      const baseGeo = new THREE.BoxGeometry(1.3, 0.4, 1.3);
      const base = new THREE.Mesh(baseGeo, materials.ancientStone);
      base.position.y = 0.2;
      base.castShadow = true;
      group.add(base);

      const colGeo = new THREE.CylinderGeometry(0.45, 0.55, 2.6, 8);
      const col = new THREE.Mesh(colGeo, materials.ancientStone);
      col.position.y = 1.5;
      col.rotation.y = 0.5;
      col.castShadow = true;
      group.add(col);

      const topGeo = new THREE.BoxGeometry(0.7, 0.5, 0.7);
      const top = new THREE.Mesh(topGeo, materials.ancientStone);
      top.position.set(0.1, 2.7, 0);
      top.rotation.z = 0.2;
      group.add(top);

      group.userData = {
        type: 'PILLAR',
        heightType: 'FULL', // Cannot jump or slide, must dodge
        boxSize: new THREE.Vector3(1.4, 2.8, 1.4),
        boxCenterY: 1.4
      };

      return group;
    },

    // D: Cursed Tombstone (Lane Blocker -> MUST CHANGE LANE)
    createTombstoneObstacle() {
      const group = new THREE.Group();

      const slabGeo = new THREE.BoxGeometry(1.1, 1.6, 0.35);
      const slab = new THREE.Mesh(slabGeo, materials.ancientStone);
      slab.position.y = 0.8;
      slab.rotation.y = 0.15;
      slab.castShadow = true;
      group.add(slab);

      const crossGeo = new THREE.BoxGeometry(0.9, 0.25, 0.38);
      const cross = new THREE.Mesh(crossGeo, materials.ancientStone);
      cross.position.set(0, 1.1, 0);
      group.add(cross);

      const runeGeo = new THREE.SphereGeometry(0.16, 6, 6);
      const rune = new THREE.Mesh(runeGeo, materials.ruinRune);
      rune.position.set(0, 1.1, 0.2);
      group.add(rune);

      group.userData = {
        type: 'TOMBSTONE',
        heightType: 'FULL',
        boxSize: new THREE.Vector3(1.2, 1.8, 0.8),
        boxCenterY: 0.9
      };

      return group;
    },

    // ==========================================
    // 4. COLLECTIBLES
    // ==========================================
    // A: Mystic Gold Coin
    createCoin() {
      const group = new THREE.Group();

      const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12);
      const coin = new THREE.Mesh(coinGeo, materials.coinGold);
      coin.rotation.x = Math.PI / 2;
      group.add(coin);

      const runeGeo = new THREE.BoxGeometry(0.2, 0.2, 0.1);
      const rune = new THREE.Mesh(runeGeo, materials.runnerOutfit);
      group.add(rune);

      group.position.y = 1.0;
      group.userData = {
        type: 'COIN',
        value: 1,
        score: 10,
        radius: 0.6
      };

      return group;
    },

    // B: Soul Diamond
    createDiamond() {
      const group = new THREE.Group();

      const gemGeo = new THREE.OctahedronGeometry(0.42, 0);
      const gem = new THREE.Mesh(gemGeo, materials.diamondGem);
      group.add(gem);

      const coreGeo = new THREE.OctahedronGeometry(0.2, 0);
      const core = new THREE.Mesh(coreGeo, materials.runnerAura);
      group.add(core);

      const gemLight = new THREE.PointLight(0x00f5d4, 1.2, 3.0);
      group.add(gemLight);

      group.position.y = 1.1;
      group.userData = {
        type: 'DIAMOND',
        value: 5,
        score: 50,
        radius: 0.7
      };

      return group;
    },

    // ==========================================
    // 5. ENVIRONMENT ASSETS
    // ==========================================
    createBranchCharacter(type, activity, side) {
      const character = new THREE.Group();
      character.position.set(side * 1.6, activity === 2 ? 4.7 : 5.0, 2.15);
      character.rotation.y = Math.PI;
      character.scale.setScalar(1.45);
      const sphereGeo = characterSphereGeo;
      const limbMaterial = type === 0
        ? materials.pumpkinStem
        : (type === 1 ? materials.ghostTrim : materials.cartoonBlue);

      const addBall = (parent, material, position, scale, geometry = sphereGeo) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[2]);
        mesh.scale.set(scale[0], scale[1], scale[2]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };

      const bodyMaterial = type === 0
        ? materials.cartoonPumpkin
        : (type === 1 ? materials.ghostBody : materials.cartoonRed);
      const torso = addBall(character, bodyMaterial, [0, 0.02, 0], [0.29, 0.35, 0.22]);
      const head = new THREE.Group();
      head.position.set(0, 0.43, -0.015);
      character.add(head);

      if (type === 0) {
        const pumpkin = addBall(head, materials.cartoonPumpkin, [0, 0.03, 0], [0.38, 0.34, 0.34]);
        for (let ridge = -1; ridge <= 1; ridge += 2) {
          const rib = new THREE.Mesh(pumpkinRidgeGeo, materials.pumpkinRidge);
          rib.position.set(ridge * 0.14, 0.03, 0.12);
          rib.scale.set(0.72, 1, 0.7);
          head.add(rib);
        }
        addBall(head, materials.pumpkinStem, [0, 0.36, 0], [1, 1, 1],
          pumpkinStemGeo);
        [-1, 1].forEach(sideSign => {
          addBall(head, materials.cartoonDark, [sideSign * 0.13, 0.04, -0.35], [0.07, 0.09, 0.035],
            pumpkinEyeGeo);
        });
        const grin = addBall(head, materials.cartoonDark, [0, -0.12, -0.355], [0.16, 0.045, 0.025]);
        grin.rotation.z = Math.PI;
        pumpkin.userData.isPumpkin = true;
      } else if (type === 1) {
        torso.geometry = ghostRobeGeo;
        torso.position.y = -0.02;
        torso.scale.set(1, 1, 1);
        addBall(head, materials.ghostBody, [0, 0.02, 0], [0.31, 0.31, 0.3]);
        [-1, 1].forEach(sideSign => {
          addBall(head, materials.cartoonDark, [sideSign * 0.11, 0.04, -0.315], [0.035, 0.055, 0.025]);
          addBall(head, materials.ghostTrim, [sideSign * 0.19, -0.05, -0.22], [0.06, 0.035, 0.025]);
        });
        addBall(head, materials.cartoonDark, [0, -0.08, -0.32], [0.045, 0.06, 0.025]);
      } else {
        addBall(head, materials.cartoonSkin, [0, 0.04, 0], [0.29, 0.31, 0.27]);
        addBall(head, materials.cartoonBlue, [0, 0.22, -0.015], [0.31, 0.085, 0.29]);
        [-1, 1].forEach(sideSign => {
          addBall(head, materials.cartoonDark, [sideSign * 0.105, 0.045, -0.28], [0.028, 0.04, 0.02]);
        });
        const smile = addBall(head, materials.cartoonDark, [0, -0.08, -0.29], [0.095, 0.018, 0.02]);
        smile.rotation.z = Math.PI;
      }

      const arms = [];
      const legs = [];
      [-1, 1].forEach(sideSign => {
        const arm = new THREE.Group();
        arm.position.set(sideSign * 0.25, 0.18, 0);
        addBall(arm, limbMaterial, [sideSign * 0.035, -0.12, 0], [0.09, 0.22, 0.09]);
        character.add(arm);
        arms.push(arm);

        const leg = new THREE.Group();
        leg.position.set(sideSign * 0.12, -0.22, 0);
        addBall(leg, type === 1 ? materials.ghostBody : limbMaterial,
          [0, -0.13, 0], [0.10, 0.20, 0.11]);
        character.add(leg);
        legs.push(leg);
      });

      character.userData = {
        type,
        activity,
        baseY: character.position.y,
        phase: Math.random() * Math.PI * 2,
        torso,
        head,
        arms,
        legs,
        update(time) {
          const activityStep = Math.floor((time + this.phase) / 8);
          const currentActivity = (this.activity + activityStep) % 5;
          const cycle = time * (currentActivity === 2 ? 2.2 : 4.0) + this.phase;
          const swing = Math.sin(cycle);
          const hop = Math.abs(Math.sin(cycle));
          this.currentActivity = currentActivity;
          character.position.y = this.baseY + (currentActivity === 1 ? hop * 0.34 : Math.sin(cycle) * 0.035);
          character.rotation.z = currentActivity === 0 ? swing * 0.09 : 0;
          this.head.rotation.z = currentActivity === 0 ? -swing * 0.08 : Math.sin(cycle) * 0.025;
          this.arms[0].rotation.z = currentActivity === 4
            ? -1.0 - Math.sin(cycle * 1.8) * 0.35
            : -0.2 + swing * (currentActivity === 3 ? 0.9 : 0.42);
          this.arms[1].rotation.z = currentActivity === 4
            ? 0.25 + Math.sin(cycle) * 0.12
            : 0.2 - swing * (currentActivity === 3 ? 0.9 : 0.42);
          this.legs[0].rotation.x = currentActivity === 2 ? -0.85 : swing * 0.48;
          this.legs[1].rotation.x = currentActivity === 2 ? -0.85 : -swing * 0.48;
          if (currentActivity === 2) {
            this.torso.scale.y = type === 1 ? 0.85 : 0.27;
          } else {
            this.torso.scale.y = type === 1 ? 1 : 0.35;
          }
        }
      };
      return character;
    },

    updateBranchCharacters(time, speedFactor = 1) {
      const animatedTime = time * speedFactor;
      branchCharacterCanvases.forEach(item => {
        drawBranchCharacter(item.ctx, item.type, item.activity, animatedTime);
        item.texture.needsUpdate = true;
      });
    },

    createHauntedTree() {
      const treeGroup = new THREE.Group();

      const trunkGeo = new THREE.CylinderGeometry(0.4, 0.8, 6.0, 10);
      const trunk = new THREE.Mesh(trunkGeo, materials.treeTrunk);
      trunk.position.y = 3.0;
      trunk.rotation.z = (Math.random() - 0.5) * 0.2;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      for (let i = 0; i < 3; i++) {
        const branchGeo = new THREE.CylinderGeometry(0.15, 0.3, 3.2, 8);
        const branch = new THREE.Mesh(branchGeo, materials.treeTrunk);
        branch.position.set(0, 4.5 + i * 0.6, 0);
        branch.rotation.z = (i % 2 === 0 ? 0.7 : -0.7) + (Math.random() - 0.5) * 0.2;
        branch.rotation.y = (i * 1.8);
        treeGroup.add(branch);
      }

      const foliageGeo = new THREE.SphereGeometry(1, 16, 12);
      const foliageClusters = [
        { x: 0, y: 6.35, z: 0, scale: [1.65, 1.25, 1.35], material: materials.foliage },
        { x: -1.15, y: 6.05, z: 0.12, scale: [1.12, 0.94, 1.08], material: materials.foliageLight },
        { x: 1.15, y: 6.15, z: -0.08, scale: [1.14, 0.98, 1.1], material: materials.foliageLight }
      ];
      foliageClusters.forEach(cluster => {
        const foliage = new THREE.Mesh(foliageGeo, cluster.material);
        foliage.position.set(cluster.x, cluster.y, cluster.z);
        foliage.scale.set(cluster.scale[0], cluster.scale[1], cluster.scale[2]);
        foliage.castShadow = true;
        treeGroup.add(foliage);
      });

      return treeGroup;
    },

    // 3D PHANTOM GHOST STEAM TRAIN LOCOMOTIVE
    createGhostTrain() {
      const trainGroup = new THREE.Group();

      // Main heavy locomotive chassis
      const chassisGeo = new THREE.BoxGeometry(2.0, 0.5, 6.8);
      const chassis = new THREE.Mesh(chassisGeo, materials.ghostTrainBody);
      chassis.position.y = 0.65;
      chassis.castShadow = true;
      trainGroup.add(chassis);

      // Cylindrical Spectral Boiler
      const boilerGeo = new THREE.CylinderGeometry(0.85, 0.85, 4.4, 14);
      const boiler = new THREE.Mesh(boilerGeo, materials.ghostTrainBody);
      boiler.rotation.x = Math.PI / 2;
      boiler.position.set(0, 1.6, 0.4);
      boiler.castShadow = true;
      trainGroup.add(boiler);

      // Glowing Spectral Boiler Ribs (Cyan / Jade Rune Rings)
      for (let r = -2; r <= 2; r++) {
        const ringGeo = new THREE.TorusGeometry(0.88, 0.05, 8, 16);
        const ring = new THREE.Mesh(ringGeo, materials.ghostTrainTrim);
        ring.position.set(0, 1.6, 0.4 + r * 0.8);
        trainGroup.add(ring);
      }

      // Cinder Warden front guard
      const cowcatcherGeo = new THREE.ConeGeometry(1.1, 1.2, 4);
      const cowcatcher = new THREE.Mesh(cowcatcherGeo, materials.spikes);
      cowcatcher.position.set(0, 0.5, -3.2);
      cowcatcher.rotation.x = Math.PI / 2;
      cowcatcher.rotation.y = Math.PI / 4;
      trainGroup.add(cowcatcher);

      // Cinder Warden front guard plate
      const skullGeo = new THREE.BoxGeometry(0.8, 0.8, 0.3);
      const skullFront = new THREE.Mesh(skullGeo, materials.wardenHide);
      skullFront.position.set(0, 1.6, -1.85);
      trainGroup.add(skullFront);

      // GIANT GLOWING CYCLOPS GHOST HEADLIGHT
      const lightBulbGeo = new THREE.SphereGeometry(0.32, 12, 12);
      const lightBulb = new THREE.Mesh(lightBulbGeo, materials.ghostTrainGlow);
      lightBulb.position.set(0, 1.6, -2.05);
      trainGroup.add(lightBulb);

      // Powerful Headlight Beam PointLight
      const trainLight = new THREE.PointLight(0x00ffcc, 3.5, 20.0);
      trainLight.position.set(0, 1.6, -2.5);
      trainGroup.add(trainLight);

      // Tall Gothic Smokestack
      const stackGeo = new THREE.CylinderGeometry(0.24, 0.34, 1.2, 8);
      const stack = new THREE.Mesh(stackGeo, materials.ghostTrainBody);
      stack.position.set(0, 2.7, -1.2);
      trainGroup.add(stack);

      // Smokestack glowing rim
      const stackRimGeo = new THREE.CylinderGeometry(0.36, 0.28, 0.15, 8);
      const stackRim = new THREE.Mesh(stackRimGeo, materials.ghostTrainTrim);
      stackRim.position.set(0, 3.3, -1.2);
      trainGroup.add(stackRim);

      // Spectral smoke wisps emerging from smokestack
      const smokeGroup = new THREE.Group();
      smokeGroup.position.set(0, 3.4, -1.2);
      for (let s = 0; s < 3; s++) {
        const sGeo = new THREE.SphereGeometry(0.2 + s * 0.12, 6, 6);
        const sMesh = new THREE.Mesh(sGeo, materials.wispParticle);
        sMesh.position.set((Math.random() - 0.5) * 0.2, s * 0.35, s * 0.4);
        smokeGroup.add(sMesh);
      }
      trainGroup.add(smokeGroup);

      // Conductor Cab (Rear boxed cab)
      const cabGeo = new THREE.BoxGeometry(1.85, 2.0, 2.0);
      const cab = new THREE.Mesh(cabGeo, materials.ghostTrainBody);
      cab.position.set(0, 1.85, 2.2);
      cab.castShadow = true;
      trainGroup.add(cab);

      // Glowing spectral cab windows (Front and sides)
      const winGeo = new THREE.PlaneGeometry(0.65, 0.65);

      // Front cab window
      const winFront = new THREE.Mesh(winGeo, materials.ghostTrainWindow);
      winFront.position.set(0, 2.2, 1.18);
      trainGroup.add(winFront);

      // Side windows
      const winSideL = new THREE.Mesh(winGeo, materials.ghostTrainWindow);
      winSideL.position.set(-0.93, 2.2, 2.2);
      winSideL.rotation.y = -Math.PI / 2;
      trainGroup.add(winSideL);

      const winSideR = new THREE.Mesh(winGeo, materials.ghostTrainWindow);
      winSideR.position.set(0.93, 2.2, 2.2);
      winSideR.rotation.y = Math.PI / 2;
      trainGroup.add(winSideR);

      // Glowing Ghost Conductor Silhouette inside cab
      const condGeo = new THREE.BoxGeometry(0.45, 0.65, 0.45);
      const condMesh = new THREE.Mesh(condGeo, materials.wardenStone);
      condMesh.position.set(0, 2.0, 2.2);
      trainGroup.add(condMesh);

      // Conductor glowing red eyes
      const condEyeGeo = new THREE.SphereGeometry(0.05, 6, 6);
      const condEyeL = new THREE.Mesh(condEyeGeo, materials.wardenEyes);
      condEyeL.position.set(-0.12, 2.25, 1.95);
      trainGroup.add(condEyeL);
      const condEyeR = new THREE.Mesh(condEyeGeo, materials.wardenEyes);
      condEyeR.position.set(0.12, 2.25, 1.95);
      trainGroup.add(condEyeR);

      // Heavy Locomotive Wheels (6 Wheels: 3 on left, 3 on right)
      const wheels = [];
      const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.22, 10);
      wheelGeo.rotateZ(Math.PI / 2);

      const zWheelPositions = [-1.5, 0.4, 2.2];
      zWheelPositions.forEach(wz => {
        // Left wheel
        const wheelL = new THREE.Mesh(wheelGeo, materials.ghostTrainWheels);
        wheelL.position.set(-1.05, 0.5, wz);
        trainGroup.add(wheelL);
        wheels.push(wheelL);

        // Right wheel
        const wheelR = new THREE.Mesh(wheelGeo, materials.ghostTrainWheels);
        wheelR.position.set(1.05, 0.5, wz);
        trainGroup.add(wheelR);
        wheels.push(wheelR);
      });

      // Side Connecting Drive Rods
      const rodGeo = new THREE.BoxGeometry(0.08, 0.12, 3.8);
      const rodL = new THREE.Mesh(rodGeo, materials.ghostTrainTrim);
      rodL.position.set(-1.18, 0.5, 0.35);
      trainGroup.add(rodL);

      const rodR = new THREE.Mesh(rodGeo, materials.ghostTrainTrim);
      rodR.position.set(1.18, 0.5, 0.35);
      trainGroup.add(rodR);

      // UserData & Update
      trainGroup.userData = {
        type: 'GHOST_TRAIN',
        heightType: 'FULL', // Lane blocker (must dodge lanes!)
        boxSize: new THREE.Vector3(2.2, 3.2, 7.0),
        boxCenterY: 1.6,
        wheels,
        smokeGroup,
        speed: 12.0, // Moves down the tracks towards player!
        hornPlayed: false,

        update(delta, playerZ) {
          // Drive forward towards player (+Z in relative chunk)
          trainGroup.position.z += this.speed * delta;

          // Rotate wheels as train moves
          this.wheels.forEach(w => {
            w.rotation.x += delta * 14.0;
          });

          // Animate spectral smoke puffs
          smokeGroup.children.forEach((s, idx) => {
            s.position.y += delta * 1.5;
            s.position.z += delta * 1.2;
            s.scale.multiplyScalar(1.015);
            if (s.position.y > 1.8) {
              s.position.set((Math.random() - 0.5) * 0.2, 0, (Math.random() - 0.5) * 0.2);
              s.scale.setScalar(1.0);
            }
          });

          // Play ghost train whistle when closing in on player
          const worldZ = trainGroup.parent ? trainGroup.parent.position.z + trainGroup.position.z : trainGroup.position.z;
          const distToPlayer = worldZ - playerZ;
          if (!this.hornPlayed && distToPlayer < -5 && distToPlayer > -45) {
            this.hornPlayed = true;
            if (window.soundEngine && window.soundEngine.playGhostTrainHorn) {
              window.soundEngine.playGhostTrainHorn();
            }
          }
        }
      };

      return trainGroup;
    },

    // 3D Ruined Wall with Embedded 3D Animated Ghost Portrait!
    createRuinWallSegment(portraitType = 0, side = 1) {
      const wallGroup = new THREE.Group();

      const wallGeo = new THREE.BoxGeometry(0.8, 2.4, 6.0);
      const wall = new THREE.Mesh(wallGeo, materials.ancientStone);
      wall.position.y = 1.2;
      wall.castShadow = true;
      wallGroup.add(wall);

      // Stone Pillars at wall ends
      const colGeo = new THREE.BoxGeometry(1.0, 3.0, 1.0);
      const col1 = new THREE.Mesh(colGeo, materials.ancientStone);
      col1.position.set(0, 1.5, -2.8);
      wallGroup.add(col1);

      const col2 = new THREE.Mesh(colGeo, materials.ancientStone);
      col2.position.set(0, 1.5, 2.8);
      wallGroup.add(col2);

      // 3D ANIMATED GHOST PHOTO / PORTRAIT MOUNTED ON THE WALL!
      const frameGroup = new THREE.Group();
      const frameX = side < 0 ? 0.42 : -0.42;
      frameGroup.position.set(frameX, 1.45, 0);
      if (side < 0) {
        frameGroup.rotation.y = Math.PI / 2;
      } else {
        frameGroup.rotation.y = -Math.PI / 2;
      }

      // Ornate Gothic Stone Picture Frame
      const frameBorderGeo = new THREE.BoxGeometry(2.0, 2.35, 0.12);
      const frameBorder = new THREE.Mesh(frameBorderGeo, materials.woodBark);
      frameGroup.add(frameBorder);

      // 3D Animated Ghost Canvas Picture
      const picGeo = new THREE.PlaneGeometry(1.68, 2.08);
      const selectedTex = ghostPortraitTextures[portraitType % ghostPortraitTextures.length];
      const picMat = new THREE.MeshBasicMaterial({ map: selectedTex });
      const picMesh = new THREE.Mesh(picGeo, picMat);
      picMesh.position.z = 0.07;
      frameGroup.add(picMesh);

      // Eerie Ghost Glow PointLight
      const glowColor = portraitType % 3 === 1 ? 0xff2200 : (portraitType % 3 === 0 ? 0x00f5d4 : 0xc084fc);
      const ghostLight = new THREE.PointLight(glowColor, 1.2, 5.0);
      ghostLight.position.set(0, 0, 0.4);
      frameGroup.add(ghostLight);

      wallGroup.add(frameGroup);
      wallGroup.userData.hasAnimatedPortrait = true;
      return wallGroup;
    },

    updateGhostPortraits(time, speedFactor = 1) {
      updateGhostPortraits(time, speedFactor);
    },

    createSpookyEyes() {
      const eyeGroup = new THREE.Group();
      const eyeGeo = new THREE.SphereGeometry(0.06, 6, 6);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });

      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(-0.12, 0, 0);
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(0.12, 0, 0);

      eyeGroup.add(eyeL);
      eyeGroup.add(eyeR);

      return eyeGroup;
    }
  };
})();

// Attach globally
window.ModelFactory = ModelFactory;
