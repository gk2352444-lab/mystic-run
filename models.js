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
        texture.generateMipmaps = true;

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

    function updateGhostPortraits(time) {
        ghostPortraitCanvases.forEach(item => {
            drawGhostPortrait(item.ctx, item.type, time);
            item.texture.needsUpdate = true;
        });
    }

    // Generate textures once
    const runnerFaceTexture = createRunnerFaceTexture();
    const runnerHeadbandTexture = createRunnerHeadbandTexture();
    const runnerJacketTexture = createRunnerJacketTexture();
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
        runnerMetal: new THREE.MeshStandardMaterial({ color: 0xdde5ee, metalness: 0.85, roughness: 0.25 }),
        runnerAura: new THREE.MeshBasicMaterial({ color: 0x72f5d1, transparent: true, opacity: 0.75 }),
        runnerEmblem: new THREE.MeshStandardMaterial({ color: 0xd8b96c, roughness: 0.5 }),

        // fantasy trail Cinder Warden Beast materials
        wardenHide: new THREE.MeshStandardMaterial({
            map: wardenHideTex,
            color: 0xc1cfca,
            roughness: 0.85,
            metalness: 0.2
        }),
        wardenStone: new THREE.MeshStandardMaterial({ color: 0x53696b, roughness: 0.75, metalness: 0.15 }),
        wardenCrystals: new THREE.MeshStandardMaterial({ color: 0x263e49, roughness: 0.38, metalness: 0.45 }),
        wardenEyes: new THREE.MeshBasicMaterial({ color: 0x9bffe3 }),
        wardenFangs: new THREE.MeshStandardMaterial({ color: 0xe7dcb6, roughness: 0.3 }),
        wardenGlow: new THREE.MeshStandardMaterial({ color: 0x72f5d1, emissive: 0x32d4b0, emissiveIntensity: 0.75 }),

        // Obstacle materials
        woodBark: new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.9 }),
        mossWood: new THREE.MeshStandardMaterial({ color: 0x2d3a24, roughness: 0.95 }),
        ancientStone: new THREE.MeshStandardMaterial({ color: 0x38404a, roughness: 0.85 }),
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
        roadPath: new THREE.MeshStandardMaterial({ color: 0x181e26, roughness: 0.95 }),
        roadBorder: new THREE.MeshStandardMaterial({ color: 0x0e141c, roughness: 1.0 }),
        foliage: new THREE.MeshStandardMaterial({ color: 0x0a1410, roughness: 0.9 }),
        foliageDead: new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.95 }),
        treeTrunk: new THREE.MeshStandardMaterial({ color: 0x1a1512, roughness: 0.95 }),

        // Particle materials
        dustParticle: new THREE.MeshBasicMaterial({ color: 0x4a5568, transparent: true, opacity: 0.5 }),
        sparkParticle: new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.9 }),
        wispParticle: new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.8 })
    };

    return {
        materials,

        // ==========================================
        // 1. Original 3D Trail Warden character
        // ==========================================
        createPlayer() {
            const group = new THREE.Group();

            // Root pivot for tilt, lean, bobbing
            const bodyPivot = new THREE.Group();
            group.add(bodyPivot);

            // --- TEAL TRAIL COAT ---
            // In Three.js BoxGeometry: [right(+x), left(-x), top(+y), bottom(-y), back(+z), front(-z)]
            // Player runs towards -Z, camera is at +Z looking at player's BACK (+Z).
            const backJacketMat = new THREE.MeshStandardMaterial({
                map: runnerJacketTexture,
                roughness: 0.65
            });

            const torsoMaterials = [
                materials.runnerOutfit, // right
                materials.runnerOutfit, // left
                materials.runnerAccent,   // top (navy shoulder patch)
                materials.runnerAccent,   // bottom (navy waist belt)
                backJacketMat,          // back (+Z: original geometric trail mark)
                materials.runnerOutfit  // front (-Z: front jacket)
            ];

            const torsoGeo = new THREE.BoxGeometry(0.54, 0.68, 0.36);
            const torso = new THREE.Mesh(torsoGeo, torsoMaterials);
            torso.position.y = 1.12;
            torso.castShadow = true;
            bodyPivot.add(torso);

            // Folded scarf collar
            const collarGroup = new THREE.Group();
            collarGroup.position.set(0, 1.48, 0);

            const collarGeo = new THREE.BoxGeometry(0.44, 0.22, 0.38);
            const collarMesh = new THREE.Mesh(collarGeo, materials.runnerAccent);
            collarGroup.add(collarMesh);

            // Inner white fleece lining at neck rim
            const fleeceGeo = new THREE.BoxGeometry(0.38, 0.06, 0.32);
            const fleeceMesh = new THREE.Mesh(fleeceGeo, materials.runnerTrim);
            fleeceMesh.position.y = 0.1;
            collarGroup.add(fleeceMesh);

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
            headGroup.position.set(0, 1.74, 0);

            // Original face texture with soft green eyes and simple features.
            const faceMat = new THREE.MeshStandardMaterial({
                map: runnerFaceTexture,
                roughness: 0.65
            });
            const headMaterials = [
                materials.runnerSkin, // right
                materials.runnerSkin, // left
                materials.runnerHair, // top
                materials.runnerSkin, // bottom
                materials.runnerHair, // back
                faceMat               // front (-Z)
            ];

            const headGeo = new THREE.BoxGeometry(0.40, 0.42, 0.40);
            const head = new THREE.Mesh(headGeo, headMaterials);
            head.castShadow = true;
            headGroup.add(head);

            // Ears
            const earGeo = new THREE.BoxGeometry(0.06, 0.12, 0.08);
            const leftEar = new THREE.Mesh(earGeo, materials.runnerSkin);
            leftEar.position.set(-0.22, -0.02, 0);
            headGroup.add(leftEar);
            const rightEar = new THREE.Mesh(earGeo, materials.runnerSkin);
            rightEar.position.set(0.22, -0.02, 0);
            headGroup.add(rightEar);

            // Woven trail headband
            const headbandBandGeo = new THREE.BoxGeometry(0.42, 0.16, 0.42);
            const headbandBand = new THREE.Mesh(headbandBandGeo, materials.runnerAccent);
            headbandBand.position.set(0, 0.08, 0);
            headGroup.add(headbandBand);

            // Faceted crystal token with the original trail mark
            const plateGeo = new THREE.PlaneGeometry(0.28, 0.14);
            const plateMat = new THREE.MeshStandardMaterial({
                map: runnerHeadbandTexture,
                metalness: 0.75,
                roughness: 0.3
            });
            const plate = new THREE.Mesh(plateGeo, plateMat);
            plate.position.set(0, 0.08, -0.215);
            headGroup.add(plate);

            const hairGroup = new THREE.Group();
            const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12), materials.runnerHair);
            hairCap.position.set(0, 0.17, 0.035);
            hairCap.scale.set(1.05, 0.8, 1.08);
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
                hairGroup.add(lock);
            });

            headGroup.add(hairGroup);
            bodyPivot.add(headGroup);

            // --- ARMS & HANDS ---
            const leftArmPivot = new THREE.Group();
            leftArmPivot.position.set(-0.35, 1.36, 0);

            // Upper arm
            const armUpperGeo = new THREE.BoxGeometry(0.16, 0.34, 0.16);
            const leftUpperArm = new THREE.Mesh(armUpperGeo, materials.runnerOutfit);
            leftUpperArm.position.y = -0.17;
            leftUpperArm.castShadow = true;
            leftArmPivot.add(leftUpperArm);

            // Geometric trim patch
            const badgeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 8);
            const badge = new THREE.Mesh(badgeGeo, materials.runnerEmblem);
            badge.rotation.z = Math.PI / 2;
            badge.position.set(-0.09, -0.16, 0);
            leftArmPivot.add(badge);

            // Forearm with a dark trail cuff
            const forearmGeo = new THREE.BoxGeometry(0.14, 0.36, 0.14);
            const leftForearm = new THREE.Mesh(forearmGeo, materials.runnerOutfit);
            leftForearm.position.y = -0.46;
            leftForearm.castShadow = true;
            leftArmPivot.add(leftForearm);

            // Navy wrist cuff
            const cuffGeo = new THREE.BoxGeometry(0.15, 0.08, 0.15);
            const leftCuff = new THREE.Mesh(cuffGeo, materials.runnerAccent);
            leftCuff.position.y = -0.58;
            leftArmPivot.add(leftCuff);

            // Ninja hand
            const handGeo = new THREE.BoxGeometry(0.11, 0.14, 0.08);
            const leftHand = new THREE.Mesh(handGeo, materials.runnerSkin);
            leftHand.position.y = -0.68;
            leftArmPivot.add(leftHand);

            bodyPivot.add(leftArmPivot);

            // Right Arm
            const rightArmPivot = new THREE.Group();
            rightArmPivot.position.set(0.35, 1.36, 0);

            const rightUpperArm = new THREE.Mesh(armUpperGeo, materials.runnerOutfit);
            rightUpperArm.position.y = -0.17;
            rightUpperArm.castShadow = true;
            rightArmPivot.add(rightUpperArm);

            const rightForearm = new THREE.Mesh(forearmGeo, materials.runnerOutfit);
            rightForearm.position.y = -0.46;
            rightForearm.castShadow = true;
            rightArmPivot.add(rightForearm);

            const rightCuff = new THREE.Mesh(cuffGeo, materials.runnerAccent);
            rightCuff.position.y = -0.58;
            rightArmPivot.add(rightCuff);

            const rightHand = new THREE.Mesh(handGeo, materials.runnerSkin);
            rightHand.position.y = -0.68;
            rightArmPivot.add(rightHand);

            bodyPivot.add(rightArmPivot);

            // --- LEGS & TRAIL BOOTS ---
            const leftLegPivot = new THREE.Group();
            leftLegPivot.position.set(-0.16, 0.74, 0);

            const thighGeo = new THREE.BoxGeometry(0.20, 0.44, 0.22);
            const leftThigh = new THREE.Mesh(thighGeo, materials.runnerOutfit);
            leftThigh.position.y = -0.22;
            leftThigh.castShadow = true;
            leftLegPivot.add(leftThigh);

            const shinGeo = new THREE.BoxGeometry(0.18, 0.42, 0.18);
            const leftShin = new THREE.Mesh(shinGeo, materials.runnerOutfit);
            leftShin.position.y = -0.58;
            leftShin.castShadow = true;
            leftLegPivot.add(leftShin);

            // Enclosed trail boot
            const sandalGeo = new THREE.BoxGeometry(0.19, 0.14, 0.30);
            const leftSandal = new THREE.Mesh(sandalGeo, materials.runnerAccent);
            leftSandal.position.set(0, -0.74, -0.03);
            leftSandal.castShadow = true;
            leftLegPivot.add(leftSandal);

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
            rightThigh.position.y = -0.22;
            rightThigh.castShadow = true;
            rightLegPivot.add(rightThigh);

            const rightShin = new THREE.Mesh(shinGeo, materials.runnerOutfit);
            rightShin.position.y = -0.58;
            rightShin.castShadow = true;
            rightLegPivot.add(rightShin);

            const rightSandal = new THREE.Mesh(sandalGeo, materials.runnerAccent);
            rightSandal.position.set(0, -0.74, -0.03);
            rightSandal.castShadow = true;
            rightLegPivot.add(rightSandal);

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
                leftLegPivot,
                rightLegPivot,
                auraGroup,

                updateAnimation(time, speedRatio, isJumping, isSliding, isStumbling) {
                    const runFreq = time * 15 * Math.max(1, speedRatio);

                    // Animate the short aura trail.
                    auraGroup.children.forEach((w, idx) => {
                        w.position.y = 0.12 + Math.sin(time * 12 + idx) * 0.08;
                        w.position.z = 0.25 + Math.cos(time * 10 + idx * 1.5) * 0.15;
                        w.scale.setScalar(0.7 + Math.sin(time * 16 + idx) * 0.35);
                    });

                    // 1. Stumble Animation (Recovery roll/stagger)
                    if (isStumbling) {
                        bodyPivot.position.y = 0.82;
                        bodyPivot.rotation.x = -0.28;
                        leftLegPivot.rotation.x = -0.55;
                        rightLegPivot.rotation.x = 0.45;
                        // Flailing arms
                        leftArmPivot.rotation.x = 0.8;
                        rightArmPivot.rotation.x = 0.8;
                        leftArmPivot.rotation.z = -0.5;
                        rightArmPivot.rotation.z = 0.5;
                        headGroup.rotation.x = 0.2;
                        return;
                    }

                    // 2. Ninja Low Slide
                    if (isSliding) {
                        bodyPivot.position.y = 0.42;
                        bodyPivot.rotation.x = -0.92; // Leaned back low to ground
                        headGroup.rotation.x = 0.65;   // Head facing forward

                        // Legs extended forward
                        leftLegPivot.rotation.x = -1.15;
                        rightLegPivot.rotation.x = -0.85;

                        // Right hand skimming ground, left arm stabilizing
                        leftArmPivot.rotation.x = -0.4;
                        rightArmPivot.rotation.x = 0.8;
                        leftArmPivot.rotation.z = -0.6;
                        rightArmPivot.rotation.z = 0.3;
                        return;
                    }

                    // 3. Ninja High Leap / Flip
                    if (isJumping) {
                        bodyPivot.position.y = 1.05;
                        bodyPivot.rotation.x = 0.32; // Aerodynamic tuck
                        headGroup.rotation.x = -0.25;

                        // Bent knees tucked in midair
                        leftLegPivot.rotation.x = 0.75;
                        rightLegPivot.rotation.x = 0.60;

                        // Arms counterbalance the tucked legs.
                        leftArmPivot.rotation.x = -0.85;
                        rightArmPivot.rotation.x = -0.85;
                        leftArmPivot.rotation.z = 0.55;
                        rightArmPivot.rotation.z = -0.55;
                        return;
                    }

                    // 4. Natural running cycle
                    bodyPivot.rotation.x = 0.35; // Distinctive forward ninja lean
                    headGroup.rotation.x = -0.22; // Eyes locked on the path ahead

                    // Leg strides
                    const legAngle = Math.sin(runFreq) * 0.82;
                    leftLegPivot.rotation.x = legAngle;
                    rightLegPivot.rotation.x = -legAngle;

                    const armSwing = Math.sin(runFreq) * 0.32;
                    leftArmPivot.rotation.x = 0.2 + armSwing;
                    rightArmPivot.rotation.x = 0.2 - armSwing;

                    // Arms flare slightly outwards to sides
                    leftArmPivot.rotation.z = 0.22;
                    rightArmPivot.rotation.z = -0.22;

                    // Natural vertical ninja bounce
                    bodyPivot.position.y = 0.95 + Math.abs(Math.sin(runFreq * 2)) * 0.11;
                }
            };

            return group;
        },

        // =======================================================
        // 2. Cinder Warden, a crystalline forest guardian (chaser)
        // =======================================================
        // Compact stone plates, mint mineral seams, and swept crystal horns define the original guardian.
        createMonster() {
            const monsterGroup = new THREE.Group();

            const beastPivot = new THREE.Group();
            monsterGroup.add(beastPivot);

            // --- ARMORED BODY ---
            const chestGeo = new THREE.BoxGeometry(1.18, 0.92, 1.15);
            const chest = new THREE.Mesh(chestGeo, materials.wardenHide);
            chest.position.set(0, 1.15, 0);
            chest.castShadow = true;
            beastPivot.add(chest);

            // Overlapping chest plates
            const pecGeo = new THREE.BoxGeometry(0.42, 0.34, 0.12);
            const leftPec = new THREE.Mesh(pecGeo, materials.wardenStone);
            leftPec.position.set(-0.32, 1.15, -0.62);
            beastPivot.add(leftPec);

            const rightPec = new THREE.Mesh(pecGeo, materials.wardenStone);
            rightPec.position.set(0.32, 1.15, -0.62);
            beastPivot.add(rightPec);

            // Layered back armor
            const humpGeo = new THREE.BoxGeometry(1.25, 0.52, 0.78);
            const hump = new THREE.Mesh(humpGeo, materials.wardenHide);
            hump.position.set(0, 1.45, 0.1);
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
            const magmaGeo = new THREE.BoxGeometry(0.12, 0.85, 0.12);
            const magmaStrip = new THREE.Mesh(magmaGeo, materials.wardenGlow);
            magmaStrip.position.set(0, 1.48, 0.2);
            beastPivot.add(magmaStrip);

            // --- MASKED STONE FACE ---
            const headPivot = new THREE.Group();
            headPivot.position.set(0, 1.28, -0.72); // Positioned forward and low

            // Skull
            const skullGeo = new THREE.BoxGeometry(0.85, 0.72, 0.88);
            const skull = new THREE.Mesh(skullGeo, materials.wardenHide);
            skull.castShadow = true;
            headPivot.add(skull);

            // Carved stone brow ridge
            const browGeo = new THREE.BoxGeometry(0.88, 0.22, 0.35);
            const brow = new THREE.Mesh(browGeo, materials.wardenStone);
            brow.position.set(0, 0.22, -0.38);
            headPivot.add(brow);

            // Hinged jaw for its warning animation
            const jawPivot = new THREE.Group();
            jawPivot.position.set(0, -0.22, -0.15);

            const jawMeshGeo = new THREE.BoxGeometry(0.72, 0.24, 0.74);
            const jawMesh = new THREE.Mesh(jawMeshGeo, materials.wardenHide);
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
            const eyeGeo = new THREE.SphereGeometry(0.10, 8, 8);
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

            const armUpperBicep = new THREE.BoxGeometry(0.34, 0.44, 0.34);
            const leftBicep = new THREE.Mesh(armUpperBicep, materials.wardenHide);
            leftBicep.position.y = -0.22;
            leftBicep.castShadow = true;
            leftArmPivot.add(leftBicep);

            const forearmMeshGeo = new THREE.BoxGeometry(0.30, 0.46, 0.32);
            const leftForearm = new THREE.Mesh(forearmMeshGeo, materials.wardenHide);
            leftForearm.position.set(0, -0.58, 0.05);
            leftForearm.castShadow = true;
            leftArmPivot.add(leftForearm);

            const knuckleGeo = new THREE.BoxGeometry(0.34, 0.18, 0.38);
            const leftKnuckle = new THREE.Mesh(knuckleGeo, materials.wardenStone);
            leftKnuckle.position.set(0, -0.9, 0.04);
            leftKnuckle.castShadow = true;
            leftArmPivot.add(leftKnuckle);

            // Small crystal claws
            for (let k = -1; k <= 1; k++) {
                const clawGeo = new THREE.ConeGeometry(0.045, 0.20, 4);
                const claw = new THREE.Mesh(clawGeo, materials.wardenCrystals);
                claw.position.set(k * 0.12, -0.98, -0.12);
                claw.rotation.x = -1.2;
                leftArmPivot.add(claw);
            }

            beastPivot.add(leftArmPivot);

            // Right Arm
            const rightArmPivot = new THREE.Group();
            rightArmPivot.position.set(0.82, 1.25, -0.2);

            const rightBicep = new THREE.Mesh(armUpperBicep, materials.wardenHide);
            rightBicep.position.y = -0.22;
            rightBicep.castShadow = true;
            rightArmPivot.add(rightBicep);

            const rightForearm = new THREE.Mesh(forearmMeshGeo, materials.wardenHide);
            rightForearm.position.set(0, -0.58, 0.05);
            rightForearm.castShadow = true;
            rightArmPivot.add(rightForearm);

            const rightKnuckle = new THREE.Mesh(knuckleGeo, materials.wardenStone);
            rightKnuckle.position.set(0, -0.9, 0.04);
            rightKnuckle.castShadow = true;
            rightArmPivot.add(rightKnuckle);

            for (let k = -1; k <= 1; k++) {
                const clawGeo = new THREE.ConeGeometry(0.045, 0.20, 4);
                const claw = new THREE.Mesh(clawGeo, materials.wardenCrystals);
                claw.position.set(k * 0.12, -0.98, -0.12);
                claw.rotation.x = -1.2;
                rightArmPivot.add(claw);
            }

            beastPivot.add(rightArmPivot);

            // --- HIND LEGS ---
            const leftLegPivot = new THREE.Group();
            leftLegPivot.position.set(-0.46, 0.90, 0.55);

            const thighMeshGeo = new THREE.BoxGeometry(0.36, 0.60, 0.36);
            const leftThigh = new THREE.Mesh(thighMeshGeo, materials.wardenHide);
            leftThigh.position.y = -0.30;
            leftThigh.castShadow = true;
            leftLegPivot.add(leftThigh);

            const calfGeo = new THREE.BoxGeometry(0.30, 0.58, 0.30);
            const leftCalf = new THREE.Mesh(calfGeo, materials.wardenHide);
            leftCalf.position.set(0, -0.72, -0.08);
            leftCalf.castShadow = true;
            leftLegPivot.add(leftCalf);

            const footGeo = new THREE.BoxGeometry(0.32, 0.18, 0.42);
            const leftFoot = new THREE.Mesh(footGeo, materials.wardenStone);
            leftFoot.position.set(0, -1.02, -0.16);
            leftLegPivot.add(leftFoot);

            beastPivot.add(leftLegPivot);

            const rightLegPivot = new THREE.Group();
            rightLegPivot.position.set(0.46, 0.90, 0.55);

            const rightThigh = new THREE.Mesh(thighMeshGeo, materials.wardenHide);
            rightThigh.position.y = -0.30;
            rightThigh.castShadow = true;
            rightLegPivot.add(rightThigh);

            const rightCalf = new THREE.Mesh(calfGeo, materials.wardenHide);
            rightCalf.position.set(0, -0.72, -0.08);
            rightCalf.castShadow = true;
            rightLegPivot.add(rightCalf);

            const rightFoot = new THREE.Mesh(footGeo, materials.wardenStone);
            rightFoot.position.set(0, -1.02, -0.16);
            rightLegPivot.add(rightFoot);

            beastPivot.add(rightLegPivot);

            // --- fantasy trail QUADRUPEDAL GALLOP ANIMATION ---
            monsterGroup.userData = {
                beastPivot,
                headPivot,
                jawPivot,
                leftArmPivot,
                rightArmPivot,
                leftLegPivot,
                rightLegPivot,
                eyeLight,

                update(time, currentDistance, isLunge) {
                    const runFreq = time * 11;

                    // Game over attack lunge
                    if (isLunge) {
                        beastPivot.position.y = 0.45;
                        beastPivot.rotation.x = 0.45;
                        leftArmPivot.rotation.x = -1.45;
                        rightArmPivot.rotation.x = -1.45;
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

                    // Hind legs propel forward
                    leftLegPivot.rotation.x = -stride * 0.6;
                    rightLegPivot.rotation.x = stride * 0.6;

                    // Snapping ferocious jaw
                    jawPivot.rotation.x = Math.max(0, Math.sin(runFreq * 2.5)) * 0.38;

                    // Menacing eye light pulse
                    eyeLight.intensity = 1.8 + Math.sin(runFreq * 3.5) * 0.6;
                }
            };

            return monsterGroup;
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
        createHauntedTree() {
            const treeGroup = new THREE.Group();

            const trunkGeo = new THREE.CylinderGeometry(0.4, 0.8, 6.0, 7);
            const trunk = new THREE.Mesh(trunkGeo, materials.treeTrunk);
            trunk.position.y = 3.0;
            trunk.rotation.z = (Math.random() - 0.5) * 0.2;
            trunk.castShadow = true;
            treeGroup.add(trunk);

            for (let i = 0; i < 3; i++) {
                const branchGeo = new THREE.CylinderGeometry(0.15, 0.3, 3.2, 5);
                const branch = new THREE.Mesh(branchGeo, materials.treeTrunk);
                branch.position.set(0, 4.5 + i * 0.6, 0);
                branch.rotation.z = (i % 2 === 0 ? 0.7 : -0.7) + (Math.random() - 0.5) * 0.2;
                branch.rotation.y = (i * 1.8);
                treeGroup.add(branch);
            }

            const foliageGeo = new THREE.DodecahedronGeometry(2.2, 0);
            const foliage = new THREE.Mesh(foliageGeo, materials.foliage);
            foliage.position.set(0, 6.5, 0);
            foliage.scale.set(1.2, 0.8, 1.2);
            treeGroup.add(foliage);

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
            const frameBorderGeo = new THREE.BoxGeometry(1.8, 2.2, 0.12);
            const frameBorder = new THREE.Mesh(frameBorderGeo, materials.woodBark);
            frameGroup.add(frameBorder);

            // 3D Animated Ghost Canvas Picture
            const picGeo = new THREE.PlaneGeometry(1.5, 1.9);
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
            return wallGroup;
        },

        updateGhostPortraits(time) {
            updateGhostPortraits(time);
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
