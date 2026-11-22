/* MYSTIC-RUN – HAUNTED FOREST
 * Core 3D Endless Runner Engine & Game Loop
 */

class MysticRunGame {
    constructor() {
        this.container = document.getElementById('game-container');
        this.canvas = document.getElementById('webgl-canvas');

        // Game States: 'INTRO', 'PLAYING', 'PAUSED', 'GAMEOVER'
        this.state = 'INTRO';

        // Add ghost visibility variables
        this.ghostTimer = 0; // seconds ghost stays fully visible
        this.ghostFade = false;
        this.ghostOpacity = 1.0;

        this.lowQualityMode = false;
        this.showVirtualButtons = true;

        // Running Speed & Physics
        // Updated base speed for easier start
        this.BASE_SPEED = 12.0; // lowered from 20.0 for smoother entry
        // Adjust initial monster distance to be farther behind player for early visibility
        this.monsterDist = 6.0; // increased from 3.6
        // Ghost visibility timer (seconds) and fade factor
        this.ghostTimer = 5.0; // visible for first 5 seconds
        this.ghostFade = 1.0; // full opacity
        this.MAX_SPEED = 38.0;
        this.speed = this.BASE_SPEED;
        this.GRAVITY = -36.0;
        // Ghost behavior timers
        this.ghostTimer = 0; // counts down when ghost is visible
        this.ghostAlpha = 1.0; // opacity for fade out
        this.ghostVisible = false;
        // Speed smoothing factor
        this.speedLerpFactor = 0.02;
        this.JUMP_FORCE = 13.5;

        // Player State
        this.currentLane = 1; // 0: Left, 1: Center, 2: Right
        this.targetX = 0;
        this.playerY = 0;
        this.playerVY = 0;
        this.isJumping = false;
        this.isSliding = false;
        this.slideTimer = 0;
        this.SLIDE_DURATION = 0.65;
        this.isStumbling = false;
        this.stumbleTimer = 0;
        this.invulnerableTimer = 0;

        // Monster Tracking (fantasy trail Cinder Warden Chaser)
        // In resetRun, set initial ghost distance farther and make visible
        this.monsterDist = 8.0; // start farther behind player for clear view
        this.targetMonsterDist = 8.0;
        this.monster.visible = true;
        // Initialize ghost visibility timer (5 seconds) and fade control
        this.isGhostVisible = true;
        this.ghostTimer = 5.0; // seconds before fade starts
        this.ghostFade = 1.0; // opacity factor for fade out
        // Normal distance behind runner
        this.targetMonsterDist = 3.6;

        // Score & Progress
        this.distance = 0;
        this.score = 0;
        this.coins = 0;
        this.diamonds = 0;
        this.highScore = 0;

        // Timers & Loop
        this.clock = new THREE.Clock();
        this.cameraShake = 0;

        this.initStorage();
        this.initThree();
        this.initLightingAndSky();
        this.initEntities();
        this.initControls();
        this.initUI();

        // Start rendering loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    // LocalStorage for High Scores
    initStorage() {
        try {
            this.highScore = parseInt(localStorage.getItem('mystic_run_highscore') || '0', 10);
            const savedQuality = localStorage.getItem('mystic_run_quality');
            if (savedQuality === 'low') {
                this.lowQualityMode = true;
            }
        } catch (e) {
            console.warn('Storage unavailable:', e);
        }
    }

    // 1. Three.js Scene, Camera, Renderer
    initThree() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        // Scene with dark gothic fog
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050912);
        this.scene.fog = new THREE.FogExp2(0x0b1d28, 0.03); // darker mystic fog for realistic forest

        // Third-person Perspective Camera (fantasy trail Vantage)
        this.camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 160);
        this.camera.position.set(0, 4.3, 7.2);

        // Optimized WebGLRenderer for mobile
        const pixelRatio = this.lowQualityMode
            ? 1.0
            : Math.min(window.devicePixelRatio || 1, 1.75);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: !this.lowQualityMode,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;

        // Shadows
        if (!this.lowQualityMode) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        window.addEventListener('resize', () => this.onWindowResize());
    }

    // 2. Lighting, Giant Glowing Moon & Spooky Sky
    initLightingAndSky() {
        // Ambient light: cool dark navy
        const ambientLight = new THREE.AmbientLight(0x162234, 1.2);
        this.scene.add(ambientLight);

        // Directional Moonlight: cyan-silver hue
        this.moonLight = new THREE.DirectionalLight(0xaad8e6, 2.0);
        this.moonLight.position.set(15, 30, -20);
        if (!this.lowQualityMode) {
            this.moonLight.castShadow = true;
            this.moonLight.shadow.mapSize.width = 1024;
            this.moonLight.shadow.mapSize.height = 1024;
            this.moonLight.shadow.camera.near = 1;
            this.moonLight.shadow.camera.far = 80;
            this.moonLight.shadow.camera.left = -15;
            this.moonLight.shadow.camera.right = 15;
            this.moonLight.shadow.camera.top = 15;
            this.moonLight.shadow.camera.bottom = -15;
            this.moonLight.shadow.bias = -0.001;
        }
        this.scene.add(this.moonLight);
        this.scene.add(this.moonLight.target);

        // Warm rim light defines the runner and Warden silhouettes.
        const fillLight = new THREE.DirectionalLight(0xffa255, 0.85);
        fillLight.position.set(-15, 20, 15);
        this.scene.add(fillLight);

        // Giant Glowing Moon Sphere in sky
        const moonGeo = new THREE.SphereGeometry(7, 16, 16);
        const moonMat = new THREE.MeshBasicMaterial({
            color: 0xebf8ff,
            fog: false
        });
        this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
        this.moonMesh.position.set(25, 42, -90);
        this.scene.add(this.moonMesh);

        // Moon Glow Halo
        const haloGeo = new THREE.SphereGeometry(9, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({
            color: 0x4cc9f0,
            transparent: true,
            opacity: 0.22,
            fog: false
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.position.copy(this.moonMesh.position);
        this.scene.add(haloMesh);
    }

    // 3. Track, Player & Monster Entities
    initEntities() {
        // Track Manager
        this.trackManager = new TrackManager(this.scene);

        // Player Model
        this.player = ModelFactory.createPlayer();
        this.player.position.set(0, 0, 0);
        this.scene.add(this.player);

        // Scary Monster
        this.monster = ModelFactory.createMonster();
        this.monster.position.set(0, 0, this.monsterDist);
        this.scene.add(this.monster);
    }

    // 4. Input & Controls
    initControls() {
        this.input = new InputController((action) => this.handleAction(action));
    }

    handleAction(action) {
        if (this.state !== 'PLAYING') return;

        switch (action) {
            case 'left':
                if (this.currentLane > 0) {
                    this.currentLane--;
                    this.targetX = this.trackManager.LANES[this.currentLane];
                    window.soundEngine.playLaneSwitch();
                }
                break;

            case 'right':
                if (this.currentLane < 2) {
                    this.currentLane++;
                    this.targetX = this.trackManager.LANES[this.currentLane];
                    window.soundEngine.playLaneSwitch();
                }
                break;

            case 'jump':
                // Can jump from ground or cancel slide into a jump
                if (!this.isJumping) {
                    this.isJumping = true;
                    this.isSliding = false;
                    this.playerVY = this.JUMP_FORCE;
                    window.soundEngine.playJump();
                }
                break;

            case 'slide':
                // Can slide from ground or fast-dive down if in mid-air
                if (this.isJumping) {
                    this.playerVY = -18.0; // Fast downward dive
                }
                if (!this.isSliding) {
                    this.isSliding = true;
                    this.slideTimer = this.SLIDE_DURATION;
                    window.soundEngine.playSlide();
                }
                break;
        }
    }

    // 5. UI Elements & Event Listeners
    initUI() {
        this.hudEl = document.getElementById('hud');
        this.introScreen = document.getElementById('intro-screen');
        this.pauseScreen = document.getElementById('pause-screen');
        this.gameOverScreen = document.getElementById('gameover-screen');
        this.beastWarning = document.getElementById('beast-warning');
        this.floatingBanner = document.getElementById('floating-banner');

        this.scoreValEl = document.getElementById('hud-score');
        this.coinValEl = document.getElementById('hud-coins');
        this.diamondValEl = document.getElementById('hud-diamonds');
        this.speedValEl = document.getElementById('hud-speed');

        // Intro Screen UI
        document.getElementById('intro-highscore').textContent = this.highScore.toLocaleString();
        document.getElementById('btn-start-game').addEventListener('click', () => this.startGame());

        // Game Over Screen UI
        document.getElementById('btn-restart').addEventListener('click', () => this.restartGame());
        document.getElementById('btn-menu').addEventListener('click', () => this.showIntroScreen());

        // Pause UI
        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-pause-restart').addEventListener('click', () => this.restartGame());
        document.getElementById('btn-pause-menu').addEventListener('click', () => this.showIntroScreen());

        // Mute Buttons
        const btnMute = document.getElementById('btn-mute');
        btnMute.addEventListener('click', () => {
            window.soundEngine.toggleMute();
            this.updateMuteIcon();
        });
        this.updateMuteIcon();

        // Fullscreen Button
        const btnFullscreen = document.getElementById('btn-fullscreen');
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
        }

        // Toggle On-Screen Touch Buttons Setting
        const btnToggleTouch = document.getElementById('btn-toggle-touch');
        if (btnToggleTouch) {
            btnToggleTouch.addEventListener('click', () => {
                this.showVirtualButtons = !this.showVirtualButtons;
                const touchCluster = document.getElementById('touch-controls');
                touchCluster.style.display = this.showVirtualButtons ? 'flex' : 'none';
                btnToggleTouch.classList.toggle('active', this.showVirtualButtons);
            });
        }

        // Quality Setting (Low / High RAM)
        const btnQuality = document.getElementById('btn-toggle-quality');
        if (btnQuality) {
            btnQuality.classList.toggle('active', !this.lowQualityMode);
            btnQuality.addEventListener('click', () => {
                this.lowQualityMode = !this.lowQualityMode;
                try {
                    localStorage.setItem('mystic_run_quality', this.lowQualityMode ? 'low' : 'high');
                } catch (e) { }
                btnQuality.classList.toggle('active', !this.lowQualityMode);
                btnQuality.querySelector('.btn-text').textContent = this.lowQualityMode ? 'Quality: Performance' : 'Quality: Ultra';
                // Apply renderer resolution
                this.renderer.setPixelRatio(this.lowQualityMode ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.75));
            });
        }
    }

    updateMuteIcon() {
        const isMuted = window.soundEngine.isMuted;
        const btnMute = document.getElementById('btn-mute');
        if (btnMute) {
            btnMute.innerHTML = isMuted ? '🔇' : '🔊';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => { });
            }
        }
    }

    // --- GAME STATE TRANSITIONS ---

    showIntroScreen() {
        this.state = 'INTRO';
        this.introScreen.classList.add('active');
        this.pauseScreen.classList.remove('active');
        this.gameOverScreen.classList.remove('active');
        this.hudEl.style.display = 'none';

        document.getElementById('intro-highscore').textContent = this.highScore.toLocaleString();
        window.soundEngine.stopBGM();
        this.resetRun();
    }

    startGame() {
        window.soundEngine.initAudio();
        window.soundEngine.playButtonClick();
        window.soundEngine.startBGM();

        this.state = 'PLAYING';
        this.introScreen.classList.remove('active');
        this.pauseScreen.classList.remove('active');
        this.gameOverScreen.classList.remove('active');
        this.hudEl.style.display = 'flex';

        this.resetRun();
    }

    restartGame() {
        window.soundEngine.playButtonClick();
        window.soundEngine.startBGM();

        this.state = 'PLAYING';
        this.introScreen.classList.remove('active');
        this.pauseScreen.classList.remove('active');
        this.gameOverScreen.classList.remove('active');
        this.hudEl.style.display = 'flex';

        this.resetRun();
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.pauseScreen.classList.add('active');
            window.soundEngine.stopBGM();
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.pauseScreen.classList.remove('active');
            window.soundEngine.startBGM();
            this.clock.getDelta(); // Clear delta jump
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';
        this.hudEl.style.display = 'none';
        this.gameOverScreen.classList.add('active');

        // Trigger monster attack animation
        this.monster.userData.update(0, 0.5, true);

        // Audio & Screen Shake
        window.soundEngine.stopBGM();
        window.soundEngine.playGameOver();
        this.triggerScreenShake(0.8);

        // High Score check
        let isNewRecord = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            isNewRecord = true;
            try {
                localStorage.setItem('mystic_run_highscore', this.highScore.toString());
            } catch (e) { }
        }

        // Populate Game Over stats
        document.getElementById('go-score').textContent = this.score.toLocaleString();
        document.getElementById('go-distance').textContent = `${Math.floor(this.distance)}m`;
        document.getElementById('go-coins').textContent = this.coins.toLocaleString();
        document.getElementById('go-highscore').textContent = this.highScore.toLocaleString();

        const recordBadge = document.getElementById('go-record-badge');
        if (recordBadge) {
            recordBadge.style.display = isNewRecord ? 'inline-block' : 'none';
        }
    }

    resetRun() {
        this.speed = this.BASE_SPEED;
        this.currentLane = 1;
        this.targetX = 0;
        this.playerY = 0;
        this.playerVY = 0;
        this.isJumping = false;
        this.isSliding = false;
        this.slideTimer = 0;
        this.isStumbling = false;
        this.stumbleTimer = 0;
        this.invulnerableTimer = 0;

        // In resetRun, set initial ghost distance farther and make visible
        this.monsterDist = 8.0; // start farther behind player for clear view
        this.targetMonsterDist = 8.0;
        this.monster.visible = true;
        // Initialize ghost visibility timer (5 seconds) and fade control
        this.isGhostVisible = true;
        this.ghostTimer = 5.0; // seconds before fade starts
        this.ghostFade = 1.0; // opacity factor for fade out

        this.targetMonsterDist = 3.6;

        this.distance = 0;
        this.score = 0;
        this.coins = 0;
        this.diamonds = 0;

        this.player.position.set(0, 0, 0);
        this.player.userData.bodyPivot.position.set(0, 0.95, 0);
        this.player.userData.bodyPivot.rotation.set(0, 0, 0);

        this.monster.position.set(0, 0, 3.6);
        this.trackManager.reset();

        this.updateHUD();
        this.beastWarning.style.opacity = '0';
    }

    showFloatingBanner(text) {
        this.floatingBanner.textContent = text;
        this.floatingBanner.classList.add('show');
        clearTimeout(this.bannerTimer);
        this.bannerTimer = setTimeout(() => {
            this.floatingBanner.classList.remove('show');
        }, 1800);
    }

    triggerScreenShake(intensity = 0.4) {
        this.cameraShake = intensity;
        this.container.classList.add('screen-shake');
        setTimeout(() => {
            this.container.classList.remove('screen-shake');
        }, 350);
    }

    // --- MAIN GAME LOOP ---

    animate() {
        requestAnimationFrame(this.animate);

        const delta = Math.min(this.clock.getDelta(), 0.1); // Clamp delta
        const time = this.clock.getElapsedTime();

        if (this.state === 'PLAYING') {
            this.updatePlaying(delta, time);
        } else if (this.state === 'INTRO') {
            this.updateIntro(delta, time);
        }

        // Render 3D Scene
        this.renderer.render(this.scene, this.camera);
    }

    updateIntro(delta, time) {
        // Cinematic orbit showcasing runner and the realistic Cinder Warden Beast
        this.camera.position.x = Math.sin(time * 0.35) * 4.2;
        this.camera.position.y = 3.6 + Math.cos(time * 0.3) * 0.4;
        this.camera.position.z = 7.5 + Math.cos(time * 0.35) * 1.5;
        this.camera.lookAt(0, 1.1, -1.0);

        // Idle animations
        this.player.userData.updateAnimation(time, 0.4, false, false, false);
        this.monster.userData.update(time, 3.6, false);
    }

    updatePlaying(delta, time) {
        // 1. Running Progress & Speed Acceleration
        this.distance += this.speed * delta;
        this.score = Math.floor(this.distance) + this.coins * 10 + this.diamonds * 50;

        // Gradually increase speed over distance
        const speedRatio = Math.min(1.0, this.distance / 1200);
        this.speed = this.BASE_SPEED + (this.MAX_SPEED - this.BASE_SPEED) * speedRatio;

        // Sync procedural music speed
        window.soundEngine.setSpeedFactor(1.0 + speedRatio * 0.6);

        // Move player forward (-Z)
        this.player.position.z -= this.speed * delta;

        // 2. Smooth Lane Switching (Lerp X)
        this.player.position.x += (this.targetX - this.player.position.x) * delta * 16.0;

        // Banking/Tilting into turns
        const tilt = -(this.targetX - this.player.position.x) * 0.18;
        this.player.userData.bodyPivot.rotation.z = tilt;

        // 3. Jumping Physics
        if (this.isJumping) {
            this.playerY += this.playerVY * delta;
            this.playerVY += this.GRAVITY * delta;

            if (this.playerY <= 0) {
                this.playerY = 0;
                this.playerVY = 0;
                this.isJumping = false;
                // Dust landing impact
                this.triggerScreenShake(0.08);
            }
        }
        this.player.position.y = this.playerY;

        // 4. Sliding Physics & Timer
        if (this.isSliding) {
            this.slideTimer -= delta;
            if (this.slideTimer <= 0) {
                this.isSliding = false;
            }
        }

        // 5. Stumble / Invulnerability recovery
        if (this.stumbleTimer > 0) {
            this.stumbleTimer -= delta;
            if (this.stumbleTimer <= 0) {
                this.isStumbling = false;
                this.targetMonsterDist = 3.6; // Warden falls back to standard chase
            }
        }

        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= delta;
            // Blink player opacity during invulnerability
            this.player.visible = Math.floor(time * 20) % 2 === 0;
        } else {
            this.player.visible = true;
        }

        // 6. fantasy trail Cinder Warden Chase Behavior
        // Interpolate monster distance toward target distance
        this.monsterDist += (this.targetMonsterDist - this.monsterDist) * delta * 2.8;
        this.monster.position.x = this.player.position.x * 0.65; // Tracks runner's lane
        this.monster.position.y = 0;
        this.monster.position.z = this.player.position.z + this.monsterDist;

        // Warden warning banner when it closes in
        if (this.monsterDist < 2.4) {
            this.beastWarning.style.opacity = '1';
        } else {
            this.beastWarning.style.opacity = '0';
        }

        // 7. Update Track & Recycled Chunks
        this.trackManager.update(this.player.position.z, this.distance, time);

        // 8. Animations
        this.player.userData.updateAnimation(
            time,
            this.speed / this.BASE_SPEED,
            this.isJumping,
            this.isSliding,
            this.isStumbling
        );
        this.monster.userData.update(time, this.monsterDist, false);

        // 9. Camera Following & Dynamic Shake (fantasy trail High Vantage)
        // Keep the Warden below the runner and leave the path ahead visible.
        const targetCamX = this.player.position.x * 0.38;
        const targetCamY = 4.3 + (this.player.position.y * 0.35);
        const targetCamZ = this.player.position.z + 7.2;

        this.camera.position.x += (targetCamX - this.camera.position.x) * delta * 12;
        this.camera.position.y += (targetCamY - this.camera.position.y) * delta * 12;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * delta * 14;

        // Apply subtle camera shake
        if (this.cameraShake > 0) {
            this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
            this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
            this.cameraShake = Math.max(0, this.cameraShake - delta * 2.0);
        }

        this.camera.lookAt(
            this.player.position.x * 0.28,
            1.35 + (this.player.position.y * 0.25),
            this.player.position.z - 9.0
        );

        // Move Moon & Directional Light with player to preserve lighting
        this.moonLight.position.z = this.player.position.z - 20;
        this.moonLight.target.position.z = this.player.position.z;
        this.moonMesh.position.z = this.player.position.z - 90;

        // 10. Check Collisions with Obstacles & Collectibles
        this.checkCollisions();

        // 11. Update HUD Stats
        this.updateHUD();
    }

    // --- COLLISION DETECTION ---

    checkCollisions() {
        const playerZ = this.player.position.z;
        const playerX = this.player.position.x;
        const playerY = this.player.position.y;

        // 1. Obstacles Collision Sweep
        for (let i = 0; i < this.trackManager.activeObstacles.length; i++) {
            const obs = this.trackManager.activeObstacles[i];
            const worldPos = new THREE.Vector3();
            obs.getWorldPosition(worldPos);

            // Check Z distance threshold
            const dz = Math.abs(worldPos.z - playerZ);
            if (dz < 1.3) {
                // Check X (Lane) distance threshold
                const dx = Math.abs(worldPos.x - playerX);
                if (dx < 1.1) {
                    // Obstacle is in player's path! Check vertical clearance based on type
                    const obsType = obs.userData.heightType; // 'LOW', 'HIGH', 'FULL'

                    if (obsType === 'LOW') {
                        // Fallen Tree Log -> Safe if jumping (Y > 0.65m)
                        if (playerY < 0.65) {
                            this.handleObstacleHit(obs);
                            break;
                        }
                    } else if (obsType === 'HIGH') {
                        // Ancient Ruin Arch -> Safe if sliding (crouched) and not jumping
                        if (!this.isSliding || playerY > 0.4) {
                            this.handleObstacleHit(obs);
                            break;
                        }
                    } else {
                        // 'FULL' -> Ancient Pillar / Tombstone (Cannot jump or slide past)
                        this.handleObstacleHit(obs);
                        break;
                    }
                }
            }
        }

        // 2. Collectibles Sweep (Coins & Soul Diamonds)
        for (let i = this.trackManager.activeCollectibles.length - 1; i >= 0; i--) {
            const item = this.trackManager.activeCollectibles[i];
            const worldPos = new THREE.Vector3();
            item.getWorldPosition(worldPos);

            const dz = Math.abs(worldPos.z - playerZ);
            if (dz < 1.4) {
                const dx = Math.abs(worldPos.x - playerX);
                const dy = Math.abs(worldPos.y - (playerY + 1.0));

                if (dx < 1.2 && dy < 1.5) {
                    // Collected!
                    this.handleCollectItem(item, worldPos);
                }
            }
        }
    }

    handleObstacleHit(obs) {
        if (this.invulnerableTimer > 0) return;

        window.soundEngine.playCrash();
        this.triggerScreenShake(0.5);

        // If the Warden is already close, end the run.
        if (this.monsterDist < 2.3 || this.isStumbling) {
            this.gameOver();
            return;
        }

        // Otherwise: Stumble mechanic! Beast surges close, warning sounds!
        this.isStumbling = true;
        this.stumbleTimer = 2.6;
        this.invulnerableTimer = 1.2; // Brief grace period
        this.targetMonsterDist = 1.8;  // Beast lunges onto heels without blocking camera!

        window.soundEngine.playMonsterRoar();
        this.showFloatingBanner('CINDER WARDEN CLOSING IN!');
    }

    handleCollectItem(item, worldPos) {
        const isDiamond = item.userData.type === 'DIAMOND';

        if (isDiamond) {
            this.diamonds += 1;
            this.score += 50;
            window.soundEngine.playDiamond();
            this.showFloatingBanner('+5 SOUL GEMS!');
            this.triggerPickupFloat('+50 GEM', worldPos, '#00f5d4');
            // Diamond pushes monster back slightly as a reward
            this.monsterDist = Math.min(5.2, this.monsterDist + 1.2);
        } else {
            this.coins += 1;
            this.score += 10;
            // Slight pitch variation for rapid coin streaks
            const pitchOffset = (this.coins % 8) * 45;
            window.soundEngine.playCoin(pitchOffset);
            this.triggerPickupFloat('+10', worldPos, '#ffd166');
        }

        // Remove from track
        this.trackManager.removeCollectible(item);
    }

    triggerPickupFloat(text, worldPos, color) {
        const floatEl = document.createElement('div');
        floatEl.className = 'pickup-float';
        floatEl.textContent = text;
        floatEl.style.color = color;

        // Convert 3D world position to 2D screen coordinates
        const screenPos = worldPos.clone().project(this.camera);
        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;

        floatEl.style.left = `${x}px`;
        floatEl.style.top = `${y}px`;

        this.container.appendChild(floatEl);
        setTimeout(() => {
            floatEl.remove();
        }, 800);
    }

    updateHUD() {
        this.scoreValEl.textContent = this.score.toLocaleString();
        this.coinValEl.textContent = this.coins.toLocaleString();
        this.diamondValEl.textContent = this.diamonds.toLocaleString();
        this.speedValEl.textContent = `${this.speed.toFixed(0)} KM/H`;
    }

    onWindowResize() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }
}

// Instantiate game once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new MysticRunGame();
});
