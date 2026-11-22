/* MYSTIC RUN – HAUNTED FOREST
 * Core 3D Endless Runner Engine & Game Loop
 */

class MysticRunGame {
  constructor() {
    this.container = document.getElementById('game-container');
    this.canvas = document.getElementById('webgl-canvas');

    // Game States: 'INTRO', 'PLAYING', 'PAUSED', 'GAMEOVER'
    this.state = 'INTRO';
    this.selectedGameMode = 'classic';
    this.gameMode = 'classic';
    this.gameModeLabels = {
      classic: 'CLASSIC',
      'monster-chase': 'MONSTER CHASE',
      survival: 'SURVIVAL',
      adventure: 'ADVENTURE'
    };
    this.health = 3;
    this.routeBonus = 0;
    this.activeEncounter = null;
    this.encounterWarningTimer = 0;
    this.encounterBannerTimer = 0;
    this.encounterLane = 1;
    this.encounterIndex = 0;
    this.nextEncounterAt = 18;
    this.activeRouteGate = null;
    this.nextRouteAt = 12;
    this.environmentIndex = 0;
    this.nextEnvironmentAt = 48;

    this.CHASER_VISIBLE_DURATION = 5.0;
    this.chaserTimer = 0;

    const narrowScreen = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
    const mobileUserAgent = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    this.isMobileDevice = Boolean(narrowScreen || mobileUserAgent);
    this.graphicsQuality = this.isMobileDevice ? 'low' : 'high';
    this.lowQualityMode = this.graphicsQuality === 'low';
    this.showVirtualButtons = true;

    // Running Speed & Physics
    this.BASE_SPEED = 6.5;
    this.SPEED_RAMP_DURATION = 210;
    this.DIFFICULTY_INTERVAL = 35;
    this.MAX_DIFFICULTY = 6;
    this.MAX_SPEED = 18.0;
    this.speed = this.BASE_SPEED;
    this.runTime = 0;
    this.difficultyLevel = 0;
    this.GRAVITY = -36.0;
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

    // Cinder Warden chase
    this.monsterDist = 8.0; // start farther behind player for clear view
    this.targetMonsterDist = 3.6;

    // Score & Progress
    this.distance = 0;
    this.score = 0;
    this.coins = 0;
    this.diamonds = 0;
    this.highScore = 0;

    this.STORE_ITEMS = [
      { id: 'char-mystic-runner', category: 'characters', slot: 'character', name: 'Trail Warden', icon: '🌠', price: 0, description: 'The original runner of the starlit paths.', variant: 0, colors: { hair: 0x25394b, outfit: 0x187d78, accent: 0xd8b96c } },
      { id: 'char-storm-scout', category: 'characters', slot: 'character', name: 'Storm Scout', icon: '🌩️', price: 220, description: 'A teal trailblazer with bright storm goggles.', variant: 2, colors: { hair: 0x24465e, outfit: 0x1b9a9a, accent: 0xf6d365 } },
      { id: 'char-copper-courier', category: 'characters', slot: 'character', name: 'Copper Courier', icon: '🧭', price: 260, description: 'A bronze-clad explorer with a trail pack.', variant: 3, colors: { hair: 0x8a4f32, outfit: 0xb98247, accent: 0x2a706c } },
      { id: 'char-blossom-acrobat', category: 'characters', slot: 'character', name: 'Blossom Acrobat', icon: '🌸', price: 300, description: 'A rose-red gymnast with ribbon details.', variant: 4, colors: { hair: 0xc879b9, outfit: 0xc84d65, accent: 0xffd166 } },
      { id: 'char-crimson-veil', category: 'characters', slot: 'character', name: 'Crimson Veil', icon: '🎭', price: 340, description: 'A maroon night-runner with a carved face guard.', variant: 5, colors: { hair: 0x261e2e, outfit: 0x75293f, accent: 0xd9c1b5 } },
      { id: 'char-obsidian-warden', category: 'characters', slot: 'character', name: 'Obsidian Warden', icon: '🪨', price: 390, description: 'A slate-armored guardian with a dark mantle.', variant: 6, colors: { hair: 0x1d2535, outfit: 0x33445d, accent: 0x92b6cc } },
      { id: 'char-cloud-skipper', category: 'characters', slot: 'character', name: 'Cloud Skipper', icon: '☁️', price: 430, description: 'A bright aerial runner with feather-like fins.', variant: 7, colors: { hair: 0xe7ded2, outfit: 0x56a8d4, accent: 0xffffff } },
      { id: 'char-dune-wanderer', category: 'characters', slot: 'character', name: 'Dune Wanderer', icon: '🏜️', price: 480, description: 'A sand-colored traveler with a round trail pack.', variant: 8, colors: { hair: 0xc8874c, outfit: 0xb78b51, accent: 0x326b63 } },
      { id: 'char-jade-striker', category: 'characters', slot: 'character', name: 'Jade Striker', icon: '🥊', price: 530, description: 'A green martial artist with sturdy wrist guards.', variant: 9, colors: { hair: 0x4d513b, outfit: 0x36855b, accent: 0xd4a34f } },
      { id: 'char-moonlit-sage', category: 'characters', slot: 'character', name: 'Moonlit Sage', icon: '🌙', price: 580, description: 'A violet mystic with a glowing star crest.', variant: 10, colors: { hair: 0x474265, outfit: 0x7663ae, accent: 0xb8e1ea } },
      { id: 'char-frost-tracker', category: 'characters', slot: 'character', name: 'Frost Tracker', icon: '❄️', price: 630, description: 'A pale-blue scout with protective goggles.', variant: 11, colors: { hair: 0xb7ddea, outfit: 0x4e7589, accent: 0xeaf8ff } },
      { id: 'char-ember', category: 'characters', slot: 'character', name: 'Ember Ranger', icon: '🔥', price: 690, description: 'A warm-toned explorer with a tall plume.', variant: 12, colors: { hair: 0x8a4933, outfit: 0xd45032, accent: 0xf1bd4b } },
      { id: 'skin-classic', category: 'skins', slot: 'skin', name: 'Starlit Teal', icon: '🌌', price: 0, description: 'The Trail Warden’s original mist-green outfit.', colors: { outfit: 0x187d78, accent: 0xd8b96c } },
      { id: 'skin-forest', category: 'skins', slot: 'skin', name: 'Fern Ranger', icon: '🌿', price: 120, description: 'Fern-green gear with bright trim.', colors: { outfit: 0x319b62, accent: 0xffd166 } },
      { id: 'skin-starfall', category: 'skins', slot: 'skin', name: 'Starfall Prism', icon: '💠', price: 180, description: 'Vivid violet gear with cyan trim.', colors: { outfit: 0x8048d8, accent: 0x42d8ee } },
      { id: 'board-starter', category: 'skateboards', slot: 'skateboard', name: 'Starter Board', icon: '🛹', price: 0, description: 'A sturdy board with bright rolling wheels.', color: 0xff7b28 },
      { id: 'board-sunset', category: 'skateboards', slot: 'skateboard', name: 'Sunset Cruiser', icon: '🌅', price: 150, description: 'Warm sunset paint and cool wheels.', color: 0xff4d6d },
      { id: 'board-neon', category: 'skateboards', slot: 'skateboard', name: 'Neon Comet', icon: '☄️', price: 240, description: 'Electric purple deck for fast runs.', color: 0x9b5de5 },
      { id: 'plane-starter', category: 'airplanes', slot: 'airplane', name: 'Cloud Hopper', icon: '✈️', price: 0, description: 'A light cartoon plane for a quick escape.', color: 0x36b8f1 },
      { id: 'plane-sunshine', category: 'airplanes', slot: 'airplane', name: 'Sunshine Flyer', icon: '🌤️', price: 280, description: 'Golden wings and a sunny paint job.', color: 0xffb703 },
      { id: 'power-magnet', category: 'powerups', slot: 'powerup', name: 'Coin Magnet', icon: '🧲', price: 160, description: 'Collect coins from a wider lane radius.', effect: 'magnet' },
      { id: 'power-guardian', category: 'powerups', slot: 'powerup', name: 'Guardian Shield', icon: '🛡️', price: 210, description: 'Blocks an obstacle hit and protects you briefly.', effect: 'guardian' },
      { id: 'power-lucky', category: 'powerups', slot: 'powerup', name: 'Double Coins Charm', icon: '🍀', price: 260, description: 'Earn double store coins for every coin collected.', effect: 'double-coins' },
      { id: 'power-speed', category: 'powerups', slot: 'powerup', name: 'Mystic Surge', icon: '⚡', price: 320, description: 'Activate a temporary speed boost during a run.', effect: 'speed-boost' }
    ];
    this.STORE_KEY = 'mystic_run_store_v1';
    this.storeData = {
      wallet: 0,
      owned: ['char-mystic-runner', 'skin-classic', 'board-starter', 'plane-starter'],
      equipped: {
        character: 'char-mystic-runner',
        skin: 'skin-classic',
        skateboard: 'board-starter',
        airplane: 'plane-starter',
        powerup: null
      }
    };

    this.PROGRESS_KEY = 'mystic_run_progress_v1';
    this.MISSION_DEFINITIONS = [
      { id: 'distance-500', title: 'Trailblazer', description: 'Run 500m across your adventures.', stat: 'distance', target: 500, reward: 150, unit: 'm' },
      { id: 'coins-25', title: 'Coin Collector', description: 'Collect 25 coins in total.', stat: 'coins', target: 25, reward: 200, unit: 'coins' },
      { id: 'survive-90', title: 'Steady Runner', description: 'Spend 90 seconds running.', stat: 'survival', target: 90, reward: 250, unit: 's' }
    ];
    this.UPGRADE_DEFINITIONS = [
      { id: 'shield', title: 'Shield Capacity', description: 'Start each run with an extra shield charge.', costs: [180, 360, 650] },
      { id: 'magnet', title: 'Magnet Range', description: 'Collect coins from farther away.', costs: [150, 300, 540] },
      { id: 'coinBonus', title: 'Coin Bonus', description: 'Earn an extra store coin per level.', costs: [220, 420, 700] },
      { id: 'boostDuration', title: 'Mystic Surge Duration', description: 'Extend each speed boost by 1.5 seconds.', costs: [180, 360, 600] }
    ];
    this.progressData = {
      stats: { distance: 0, coins: 0, survival: 0 },
      claimedMissions: [],
      upgrades: { shield: 0, magnet: 0, coinBonus: 0, boostDuration: 0 }
    };
    this.progressSaveTimer = 0;
    this.missionRefreshTimer = 0;

    this.activeMode = null;
    this.modeTimer = 0;
    this.MODE_DURATIONS = { skateboard: 12, airplane: 10 };
    this.guardianCharge = 0;
    this.speedBoostTimer = 0;

    // Timers & Loop
    this.clock = new THREE.Clock();
    this.cameraShake = 0;
    this.collisionWorldPosition = new THREE.Vector3();

    this.initStorage();
    this.initProgress();
    this.initThree();
    this.initLightingAndSky();
    this.initEntities();
    this.applyGraphicsQuality(this.graphicsQuality);
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
      if (savedQuality === 'low' || savedQuality === 'medium' || savedQuality === 'high') {
        this.graphicsQuality = savedQuality;
      }
      this.lowQualityMode = this.graphicsQuality === 'low';
      const savedStore = localStorage.getItem(this.STORE_KEY);
      if (savedStore) {
        const parsed = JSON.parse(savedStore);
        const validIds = new Set(this.STORE_ITEMS.map(item => item.id));
        const migratedIds = {
          'char-azure': 'char-storm-scout',
          'skin-chakra': 'skin-starfall'
        };
        if (Number.isFinite(parsed.wallet) && Array.isArray(parsed.owned) && parsed.equipped) {
          this.storeData.wallet = Math.max(0, Math.floor(parsed.wallet));
          this.storeData.owned = Array.from(new Set(
            parsed.owned
              .map(id => migratedIds[id] || id)
              .filter(id => validIds.has(id))
          ));
          Object.keys(this.storeData.equipped).forEach(slot => {
            const savedId = parsed.equipped[slot];
            const id = migratedIds[savedId] || savedId;
            const item = this.STORE_ITEMS.find(candidate => candidate.id === id);
            this.storeData.equipped[slot] = item && item.slot === slot && this.storeData.owned.includes(id)
              ? id
              : null;
          });
          ['char-mystic-runner', 'skin-classic', 'board-starter', 'plane-starter'].forEach(id => {
            if (!this.storeData.owned.includes(id)) this.storeData.owned.push(id);
          });
          if (!this.storeData.equipped.character) {
            this.storeData.equipped.character = 'char-mystic-runner';
          }
          if (JSON.stringify(parsed.owned) !== JSON.stringify(this.storeData.owned)
            || JSON.stringify(parsed.equipped) !== JSON.stringify(this.storeData.equipped)) {
            this.saveStore();
          }
        }
      }
    } catch (e) {
      console.warn('Storage unavailable:', e);
    }
  }

  initProgress() {
    try {
      const saved = localStorage.getItem(this.PROGRESS_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      const stats = parsed.stats || {};
      ['distance', 'coins', 'survival'].forEach((stat) => {
        const value = Number(stats[stat]);
        if (Number.isFinite(value) && value >= 0) this.progressData.stats[stat] = value;
      });
      if (Array.isArray(parsed.claimedMissions)) {
        this.progressData.claimedMissions = parsed.claimedMissions.filter((id) =>
          this.MISSION_DEFINITIONS.some((mission) => mission.id === id)
        );
      }
      const upgrades = parsed.upgrades || {};
      this.UPGRADE_DEFINITIONS.forEach((upgrade) => {
        const level = Number(upgrades[upgrade.id]);
        if (Number.isInteger(level) && level >= 0) {
          this.progressData.upgrades[upgrade.id] = Math.min(level, upgrade.costs.length);
        }
      });
    } catch (e) {
      console.warn('Progress storage unavailable:', e);
    }
  }

  saveProgress() {
    try {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(this.progressData));
    } catch (e) {
      console.warn('Could not save mission progress:', e);
    }
  }

  getQualityPixelRatio() {
    const ratio = window.devicePixelRatio || 1;
    const caps = {
      low: 1,
      medium: this.isMobileDevice ? 1.15 : 1.35,
      high: this.isMobileDevice ? 1.5 : 1.75
    };
    return Math.min(ratio, caps[this.graphicsQuality] || caps.low);
  }

  applyGraphicsQuality(quality) {
    const settings = {
      low: { shadows: false, shadowMapSize: 256, cameraFar: 115 },
      medium: { shadows: true, shadowMapSize: 512, cameraFar: 140 },
      high: { shadows: true, shadowMapSize: 1024, cameraFar: 160 }
    };
    this.graphicsQuality = Object.prototype.hasOwnProperty.call(settings, quality) ? quality : 'low';
    const profile = settings[this.graphicsQuality];
    this.lowQualityMode = this.graphicsQuality === 'low';

    this.renderer.setPixelRatio(this.getQualityPixelRatio());
    this.renderer.shadowMap.enabled = profile.shadows;
    this.renderer.shadowMap.type = this.graphicsQuality === 'high'
      ? THREE.PCFSoftShadowMap
      : THREE.PCFShadowMap;
    this.camera.far = profile.cameraFar;
    this.camera.updateProjectionMatrix();

    if (this.moonLight) {
      this.moonLight.castShadow = profile.shadows;
      this.moonLight.shadow.mapSize.set(profile.shadowMapSize, profile.shadowMapSize);
      this.moonLight.shadow.needsUpdate = true;
      if (this.moonLight.shadow.map) {
        this.moonLight.shadow.map.dispose();
        this.moonLight.shadow.map = null;
      }
    }
    if (this.trackManager) this.trackManager.setGraphicsQuality(this.graphicsQuality);

    const button = document.getElementById('btn-toggle-quality');
    if (button) {
      button.classList.toggle('active', this.graphicsQuality !== 'low');
      button.querySelector('.btn-text').textContent = `Graphics: ${this.graphicsQuality.toUpperCase()}`;
    }
  }

  // 1. Three.js Scene, Camera, Renderer
  initThree() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Bright twilight palette keeps the path and characters readable at distance.
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x70bce9);
    this.scene.fog = new THREE.FogExp2(0x9bcfee, 0.012);

    // Third-person camera keeps the runner and route ahead in view.
    this.camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 160);
    this.camera.position.set(0, 4.0, 7.8);
    this.cameraLookTarget = new THREE.Vector3(0, 1.35, -10);

    // Optimized WebGLRenderer for mobile
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.graphicsQuality !== 'low',
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.getQualityPixelRatio());
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Shadows
    this.renderer.shadowMap.enabled = this.graphicsQuality !== 'low';
    this.renderer.shadowMap.type = this.graphicsQuality === 'high' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;

    window.addEventListener('resize', () => this.onWindowResize());
  }

  // 2. Lighting, Giant Glowing Moon & Spooky Sky
  initLightingAndSky() {
    // Soft sky/ground fill and warm key light create a colorful cartoon look.
    const ambientLight = new THREE.HemisphereLight(0xc9efff, 0x718650, 1.35);
    this.scene.add(ambientLight);

    this.moonLight = new THREE.DirectionalLight(0xfff0c5, 2.0);
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
    this.fillLight = new THREE.DirectionalLight(0xffa255, 0.95);
    this.fillLight.position.set(-15, 20, 15);
    this.scene.add(this.fillLight);

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
    this.trackManager = new TrackManager(this.scene, this.graphicsQuality);

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
          window.soundEngine.playJumpVoice();
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
          window.soundEngine.playSlideVoice();
        }
        break;

      case 'skateboard':
        this.activateMode('skateboard');
        break;

      case 'airplane':
        this.activateMode('airplane');
        break;

      case 'speed-boost':
        this.activateSpeedBoost();
        break;
    }
  }

  dampValue(current, target, responsiveness, delta) {
    if (delta <= 0) return current;
    return current + (target - current) * (1 - Math.exp(-responsiveness * delta));
  }

  // 5. UI Elements & Event Listeners
  initUI() {
    this.hudEl = document.getElementById('hud');
    this.introScreen = document.getElementById('intro-screen');
    this.pauseScreen = document.getElementById('pause-screen');
    this.gameOverScreen = document.getElementById('gameover-screen');
    this.beastWarning = document.getElementById('beast-warning');
    this.floatingBanner = document.getElementById('floating-banner');
    this.modeScreen = document.getElementById('mode-screen');
    this.missionScreen = document.getElementById('mission-screen');
    this.missionList = document.getElementById('mission-list');
    this.healthBadge = document.getElementById('health-badge');
    this.routePrompt = document.getElementById('route-prompt');

    this.scoreValEl = document.getElementById('hud-score');
    this.coinValEl = document.getElementById('hud-coins');
    this.diamondValEl = document.getElementById('hud-diamonds');
    this.speedValEl = document.getElementById('hud-speed');

    // Intro Screen UI
    document.getElementById('intro-highscore').textContent = this.highScore.toLocaleString();
    document.getElementById('btn-start-game').addEventListener('click', () => this.openModeSelection());
    document.getElementById('btn-mode-back').addEventListener('click', () => this.modeScreen.classList.remove('active'));
    document.getElementById('btn-mode-start').addEventListener('click', () => this.startGame());
    document.querySelectorAll('.mode-option').forEach((option) => {
      option.addEventListener('click', () => {
        this.selectedGameMode = option.dataset.gameMode;
        document.querySelectorAll('.mode-option').forEach((button) => {
          button.classList.toggle('selected', button === option);
        });
      });
    });
    document.getElementById('btn-open-store').addEventListener('click', () => this.showStore());
    document.getElementById('btn-close-store').addEventListener('click', () => this.closeStore());
    document.getElementById('btn-open-missions').addEventListener('click', () => this.openMissionScreen());
    document.getElementById('btn-close-missions').addEventListener('click', () => this.closeMissionScreen());
    document.getElementById('btn-skateboard').addEventListener('click', () => this.activateMode('skateboard'));
    document.getElementById('btn-airplane').addEventListener('click', () => this.activateMode('airplane'));
    document.getElementById('btn-speed-boost').addEventListener('click', () => this.activateSpeedBoost());

    document.querySelectorAll('.progress-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.progress-tab').forEach((button) => {
          button.classList.toggle('active', button === tab);
        });
        this.renderProgressTab(tab.dataset.progressTab);
      });
    });

    document.querySelectorAll('.store-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.store-tab').forEach(button => button.classList.remove('active'));
        tab.classList.add('active');
        this.renderStoreCategory(tab.dataset.storeCategory);
      });
    });

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
    const btnToggleSound = document.getElementById('btn-toggle-sound');
    btnToggleSound.addEventListener('click', () => {
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

    // Graphics Quality Settings (LOW / MEDIUM / HIGH)
    const btnQuality = document.getElementById('btn-toggle-quality');
    if (btnQuality) {
      btnQuality.classList.toggle('active', this.graphicsQuality !== 'low');
      btnQuality.querySelector('.btn-text').textContent = `Graphics: ${this.graphicsQuality.toUpperCase()}`;
      btnQuality.addEventListener('click', () => {
        const levels = ['low', 'medium', 'high'];
        const nextQuality = levels[(levels.indexOf(this.graphicsQuality) + 1) % levels.length];
        this.applyGraphicsQuality(nextQuality);
        try {
          localStorage.setItem('mystic_run_quality', this.graphicsQuality);
        } catch (e) {
          console.warn('Could not save graphics quality:', e);
        }
      });
    }

    this.applyStoreLoadout();
    this.updateStoreWallet();
    this.updateModeHUD();
  }

  saveStore() {
    try {
      localStorage.setItem(this.STORE_KEY, JSON.stringify(this.storeData));
    } catch (e) {
      console.warn('Could not save store progress:', e);
    }
    this.updateStoreWallet();
  }

  updateStoreWallet() {
    const formatted = this.storeData.wallet.toLocaleString();
    const homeWallet = document.getElementById('home-wallet');
    const storeWallet = document.getElementById('store-wallet');
    const missionWallet = document.getElementById('mission-wallet');
    if (homeWallet) homeWallet.textContent = formatted;
    if (storeWallet) storeWallet.textContent = formatted;
    if (missionWallet) missionWallet.textContent = formatted;
  }

  openMissionScreen() {
    this.closeStore();
    this.modeScreen.classList.remove('active');
    this.missionScreen.classList.add('active');
    document.querySelectorAll('.progress-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.progressTab === 'missions');
    });
    this.renderProgressTab('missions');
  }

  closeMissionScreen() {
    this.missionScreen.classList.remove('active');
  }

  renderProgressTab(tab) {
    this.progressTab = tab;
    this.missionList.textContent = '';
    if (tab === 'upgrades') this.renderUpgrades();
    else this.renderMissions();
  }

  renderMissions() {
    this.MISSION_DEFINITIONS.forEach((mission) => {
      const progress = Math.min(mission.target, this.progressData.stats[mission.stat]);
      const complete = progress >= mission.target;
      const claimed = this.progressData.claimedMissions.includes(mission.id);
      const card = document.createElement('article');
      card.className = 'mission-item';

      const details = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = mission.title;
      const description = document.createElement('p');
      description.textContent = mission.description;
      const progressText = document.createElement('p');
      const shownProgress = Math.floor(progress);
      progressText.textContent = `${shownProgress.toLocaleString()} / ${mission.target.toLocaleString()} ${mission.unit} · Reward: ${mission.reward} coins`;
      const progressTrack = document.createElement('div');
      progressTrack.className = 'mission-progress';
      const progressBar = document.createElement('span');
      progressBar.style.width = `${Math.min(100, (progress / mission.target) * 100)}%`;
      progressTrack.appendChild(progressBar);
      details.append(title, description, progressText, progressTrack);

      const claim = document.createElement('button');
      claim.className = 'mission-action';
      claim.textContent = claimed ? 'CLAIMED' : complete ? `CLAIM 🪙${mission.reward}` : 'IN PROGRESS';
      claim.disabled = claimed || !complete;
      claim.addEventListener('click', () => this.claimMission(mission.id));
      card.append(details, claim);
      this.missionList.appendChild(card);
    });
    this.updateStoreWallet();
  }

  renderUpgrades() {
    this.UPGRADE_DEFINITIONS.forEach((upgrade) => {
      const level = this.progressData.upgrades[upgrade.id];
      const maxLevel = upgrade.costs.length;
      const cost = upgrade.costs[level];
      const card = document.createElement('article');
      card.className = 'mission-item';

      const details = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = upgrade.title;
      const description = document.createElement('p');
      description.textContent = upgrade.description;
      const levelText = document.createElement('p');
      levelText.textContent = level >= maxLevel ? `Level ${level} · MAX` : `Level ${level} / ${maxLevel} · Next: ${cost} coins`;
      details.append(title, description, levelText);

      const action = document.createElement('button');
      action.className = 'mission-action';
      action.textContent = level >= maxLevel ? 'MAX LEVEL' : this.storeData.wallet >= cost ? 'UPGRADE' : `NEED ${cost}`;
      action.disabled = level >= maxLevel || this.storeData.wallet < cost;
      action.addEventListener('click', () => this.buyUpgrade(upgrade.id));
      card.append(details, action);
      this.missionList.appendChild(card);
    });
    this.updateStoreWallet();
  }

  claimMission(id) {
    const mission = this.MISSION_DEFINITIONS.find((item) => item.id === id);
    if (!mission || this.progressData.claimedMissions.includes(id)) return;
    if (this.progressData.stats[mission.stat] < mission.target) return;
    this.progressData.claimedMissions.push(id);
    this.storeData.wallet += mission.reward;
    this.saveProgress();
    this.saveStore();
    this.renderMissions();
  }

  buyUpgrade(id) {
    const upgrade = this.UPGRADE_DEFINITIONS.find((item) => item.id === id);
    if (!upgrade) return;
    const level = this.progressData.upgrades[id];
    const cost = upgrade.costs[level];
    if (cost === undefined || this.storeData.wallet < cost) return;
    this.storeData.wallet -= cost;
    this.progressData.upgrades[id] = level + 1;
    this.saveProgress();
    this.saveStore();
    this.renderUpgrades();
  }

  updateMissionProgress(delta) {
    if (delta <= 0) return;
    this.progressData.stats.distance += this.speed * delta;
    this.progressData.stats.survival += delta;
    this.progressSaveTimer += delta;
    this.missionRefreshTimer += delta;
    if (this.progressSaveTimer >= 5) {
      this.saveProgress();
      this.progressSaveTimer = 0;
    }
    if (this.missionRefreshTimer >= 1) {
      this.missionRefreshTimer = 0;
      if (this.missionScreen.classList.contains('active') && this.progressTab === 'missions') {
        this.renderMissions();
      }
    }
  }

  applyStoreLoadout() {
    const character = this.STORE_ITEMS.find(item => item.id === this.storeData.equipped.character);
    const skin = this.STORE_ITEMS.find(item => item.id === this.storeData.equipped.skin);
    const colors = {
      hair: 0x25394b,
      outfit: 0x187d78,
      accent: 0xd8b96c
    };
    if (character && character.colors) Object.assign(colors, character.colors);
    if (skin && skin.colors) Object.assign(colors, skin.colors);
    ModelFactory.applyPlayerCosmetics(this.player, colors);
    ModelFactory.applyPlayerVariant(this.player, character ? character.variant : 0, colors);

    const board = this.STORE_ITEMS.find(item => item.id === this.storeData.equipped.skateboard);
    const airplane = this.STORE_ITEMS.find(item => item.id === this.storeData.equipped.airplane);
    ModelFactory.applyVehicleColor(this.player.userData.skateboard, board ? board.color : 0xff7b28);
    ModelFactory.applyVehicleColor(this.player.userData.airplane, airplane ? airplane.color : 0x36b8f1);
    this.updateModeHUD();
  }

  showStore() {
    const storeScreen = document.getElementById('store-screen');
    storeScreen.classList.add('active');
    this.updateStoreWallet();
    this.setStoreMessage('Starter gear is free. Collect coins during runs to unlock more!');
    this.renderStoreCategory(document.querySelector('.store-tab.active').dataset.storeCategory);
  }

  closeStore() {
    document.getElementById('store-screen').classList.remove('active');
  }

  setStoreMessage(message, type) {
    const messageElement = document.getElementById('store-message');
    messageElement.textContent = message;
    messageElement.classList.remove('success', 'error');
    if (type) messageElement.classList.add(type);
  }

  drawStoreCharacterPreview(canvas, item) {
    canvas.width = 160;
    canvas.height = 100;
    canvas.className = 'store-character-preview';
    const context = canvas.getContext('2d');
    if (!context) return;

    const hair = `#${item.colors.hair.toString(16).padStart(6, '0')}`;
    const outfit = `#${item.colors.outfit.toString(16).padStart(6, '0')}`;
    const accent = `#${item.colors.accent.toString(16).padStart(6, '0')}`;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255,255,255,0.12)';
    context.beginPath();
    context.ellipse(80, 86, 54, 18, 0, 0, Math.PI * 2);
    context.fill();

    const outfitGradient = context.createLinearGradient(43, 61, 119, 100);
    outfitGradient.addColorStop(0, 'rgba(255,255,255,0.65)');
    outfitGradient.addColorStop(0.28, outfit);
    outfitGradient.addColorStop(1, '#17243a');
    context.fillStyle = outfitGradient;
    context.beginPath();
    context.moveTo(36, 100);
    context.quadraticCurveTo(39, 62, 80, 62);
    context.quadraticCurveTo(121, 62, 124, 100);
    context.closePath();
    context.fill();

    const faceGradient = context.createRadialGradient(71, 37, 2, 82, 48, 34);
    faceGradient.addColorStop(0, '#fff0d6');
    faceGradient.addColorStop(0.65, '#ffd2aa');
    faceGradient.addColorStop(1, '#d58a70');
    context.fillStyle = faceGradient;
    context.beginPath();
    context.ellipse(80, 45, 24, 27, 0, 0, Math.PI * 2);
    context.fill();

    const hairGradient = context.createLinearGradient(61, 20, 99, 45);
    hairGradient.addColorStop(0, '#ffffff');
    hairGradient.addColorStop(0.2, hair);
    hairGradient.addColorStop(1, '#182233');
    context.fillStyle = hairGradient;
    context.beginPath();
    context.ellipse(80, 30, 25, 16, 0, Math.PI, Math.PI * 2);
    context.fillStyle = hairGradient;
    context.fill();
    const spikeCount = 2 + item.variant % 5;
    for (let i = 0; i < spikeCount; i++) {
      const x = 61 + i * (38 / Math.max(1, spikeCount - 1));
      const height = 10 + ((i + item.variant) % 3) * 4;
      context.beginPath();
      context.moveTo(x - 5, 33);
      context.lineTo(x, 33 - height);
      context.lineTo(x + 5, 34);
      context.closePath();
      context.fill();
    }

    context.fillStyle = '#263244';
    context.beginPath();
    context.ellipse(72, 45, 2.8, 3.5, 0, 0, Math.PI * 2);
    context.ellipse(88, 45, 2.8, 3.5, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = accent;
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(58, 38);
    context.lineTo(102, 38);
    context.stroke();

    if (item.variant % 3 === 0) {
      context.fillStyle = accent;
      context.beginPath();
      context.arc(112, 70, 8, 0, Math.PI * 2);
      context.fill();
    } else if (item.variant % 3 === 1) {
      context.strokeStyle = accent;
      context.lineWidth = 4;
      context.beginPath();
      context.arc(80, 31, 28, Math.PI, Math.PI * 2);
      context.stroke();
    } else {
      context.fillStyle = accent;
      context.fillRect(73, 72, 14, 6);
    }
  }

  renderStoreCategory(category) {
    const container = document.getElementById('store-items');
    container.textContent = '';
    this.STORE_ITEMS.filter(item => item.category === category).forEach(item => {
      const owned = this.storeData.owned.includes(item.id);
      const equipped = this.storeData.equipped[item.slot] === item.id;
      const card = document.createElement('article');
      card.className = 'store-item';

      const art = document.createElement('div');
      art.className = 'store-item-art';
      art.style.setProperty('--item-color', `#${(item.color || item.colors && item.colors.outfit || 0x368ab5).toString(16).padStart(6, '0')}`);
      const icon = document.createElement('span');
      icon.textContent = item.icon;
      if (item.category === 'characters') {
        const preview = document.createElement('canvas');
        this.drawStoreCharacterPreview(preview, item);
        art.appendChild(preview);
        icon.className = 'store-item-icon';
      }
      art.appendChild(icon);

      const title = document.createElement('h3');
      title.textContent = item.name;
      const description = document.createElement('p');
      description.className = 'store-item-description';
      description.textContent = item.description;
      const price = document.createElement('p');
      price.className = 'store-item-price';
      price.textContent = owned ? 'Owned' : item.price === 0 ? 'Free' : `🪙 ${item.price.toLocaleString()}`;
      const actions = document.createElement('div');
      actions.className = 'store-item-actions';
      const action = document.createElement('button');
      action.className = `store-action${owned ? '' : ' buy'}${equipped ? ' equipped' : ''}`;

      if (!owned) {
        action.textContent = 'BUY';
        action.addEventListener('click', () => this.buyStoreItem(item.id));
      } else {
        action.textContent = equipped ? 'UNEQUIP' : 'EQUIP';
        action.addEventListener('click', () => {
          if (equipped) this.unequipStoreItem(item.id);
          else this.equipStoreItem(item.id);
        });
      }

      actions.appendChild(action);
      card.append(art, title, description, price, actions);
      container.appendChild(card);
    });
  }

  buyStoreItem(id) {
    const item = this.STORE_ITEMS.find(candidate => candidate.id === id);
    if (!item || this.storeData.owned.includes(id)) return;
    if (this.storeData.wallet < item.price) {
      this.setStoreMessage(`You need ${item.price - this.storeData.wallet} more coins for ${item.name}.`, 'error');
      return;
    }
    this.storeData.wallet -= item.price;
    this.storeData.owned.push(id);
    this.saveStore();
    this.setStoreMessage(`${item.name} unlocked! Equip it when you are ready.`, 'success');
    this.renderStoreCategory(item.category);
  }

  equipStoreItem(id) {
    const item = this.STORE_ITEMS.find(candidate => candidate.id === id);
    if (!item || !this.storeData.owned.includes(id)) return;
    this.storeData.equipped[item.slot] = id;
    this.saveStore();
    this.applyStoreLoadout();
    this.setStoreMessage(`${item.name} equipped!`, 'success');
    this.renderStoreCategory(item.category);
  }

  unequipStoreItem(id) {
    const item = this.STORE_ITEMS.find(candidate => candidate.id === id);
    if (!item || this.storeData.equipped[item.slot] !== id) return;
    this.storeData.equipped[item.slot] = null;
    this.saveStore();
    this.applyStoreLoadout();
    this.setStoreMessage(`${item.name} unequipped.`, 'success');
    this.renderStoreCategory(item.category);
  }

  updateModeHUD() {
    const boardButton = document.getElementById('btn-skateboard');
    const airplaneButton = document.getElementById('btn-airplane');
    const boostButton = document.getElementById('btn-speed-boost');
    if (!boardButton || !airplaneButton || !boostButton) return;
    boardButton.disabled = this.state !== 'PLAYING' ||
      (!this.storeData.equipped.skateboard && this.activeMode !== 'skateboard');
    airplaneButton.disabled = this.state !== 'PLAYING' ||
      (!this.storeData.equipped.airplane && this.activeMode !== 'airplane');
    boardButton.classList.toggle('active', this.activeMode === 'skateboard');
    airplaneButton.classList.toggle('active', this.activeMode === 'airplane');

    const boostItem = this.storeData.equipped.powerup;
    const boostAvailable = boostItem === 'power-speed' && this.storeData.owned.includes(boostItem);
    boostButton.classList.toggle('available', boostAvailable);
    boostButton.classList.toggle('active', this.speedBoostTimer > 0);
    boostButton.disabled = this.state !== 'PLAYING' || !boostAvailable || this.speedBoostTimer > 0;
    boostButton.title = this.speedBoostTimer > 0
      ? `Speed boost: ${Math.ceil(this.speedBoostTimer)}s`
      : 'Activate speed boost';

    const status = document.getElementById('mode-status');
    if (this.state === 'PLAYING') {
      const labels = [this.gameModeLabels[this.gameMode] || 'CLASSIC'];
      if (this.activeMode) {
        labels.push(`${this.activeMode === 'skateboard' ? 'SKATEBOARD' : 'AIRPLANE'} ${Math.ceil(this.modeTimer)}s`);
      }
      if (this.speedBoostTimer > 0) labels.push(`BOOST ${Math.ceil(this.speedBoostTimer)}s`);
      status.textContent = labels.join(' · ');
      status.className = 'mode-status active';
      if (this.activeMode) status.classList.add(this.activeMode);
    } else {
      status.textContent = '';
      status.className = 'mode-status';
    }

    if (this.healthBadge) {
      this.healthBadge.classList.toggle('active', this.state === 'PLAYING' && this.gameMode !== 'classic');
      document.getElementById('hud-health').textContent = '❤️'.repeat(Math.max(0, this.health));
    }
  }

  activateMode(mode) {
    if (this.state !== 'PLAYING') return;
    if (this.activeMode) {
      this.showFloatingBanner('A VEHICLE MODE IS ALREADY ACTIVE!');
      return;
    }
    const itemId = this.storeData.equipped[mode];
    if (!itemId || !this.storeData.owned.includes(itemId)) {
      this.showFloatingBanner(`EQUIP A ${mode === 'skateboard' ? 'SKATEBOARD' : 'PLANE'} FIRST!`);
      return;
    }
    this.activeMode = mode;
    this.modeTimer = this.MODE_DURATIONS[mode];
    this.player.userData.skateboard.visible = mode === 'skateboard';
    this.player.userData.airplane.visible = mode === 'airplane';
    if (mode === 'airplane') {
      this.playerY = 1.8;
      this.playerVY = 0;
      this.isJumping = false;
      this.isSliding = false;
    }
    this.showFloatingBanner(mode === 'skateboard' ? 'SKATEBOARD MODE!' : 'AIRPLANE MODE!');
    this.updateModeHUD();
  }

  endActiveMode() {
    const endedMode = this.activeMode;
    this.activeMode = null;
    this.modeTimer = 0;
    this.player.userData.skateboard.visible = false;
    this.player.userData.airplane.visible = false;
    if (endedMode === 'airplane') {
      this.playerY = 0;
      this.playerVY = 0;
      this.isJumping = false;
    }
    this.showFloatingBanner('BACK TO MYSTIC RUN!');
    this.updateModeHUD();
  }

  activateSpeedBoost() {
    if (this.state !== 'PLAYING' || this.speedBoostTimer > 0) return;
    const itemId = this.storeData.equipped.powerup;
    if (itemId !== 'power-speed' || !this.storeData.owned.includes(itemId)) {
      this.showFloatingBanner('EQUIP MYSTIC SURGE FIRST!');
      return;
    }
    this.speedBoostTimer = 5 + this.progressData.upgrades.boostDuration * 1.5;
    window.soundEngine.playButtonClick();
    this.showFloatingBanner('MYSTIC SURGE!');
    this.updateModeHUD();
  }

  updateMuteIcon() {
    const isMuted = window.soundEngine.isMuted;
    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
      btnMute.innerHTML = isMuted ? '🔇' : '🔊';
      btnMute.title = isMuted ? 'Turn Sound On' : 'Turn Sound Off';
    }
    const soundSetting = document.getElementById('btn-toggle-sound');
    if (soundSetting) {
      soundSetting.classList.toggle('active', !isMuted);
      soundSetting.setAttribute('aria-pressed', (!isMuted).toString());
      soundSetting.querySelector('.btn-text').textContent = isMuted ? 'Sound: OFF' : 'Sound: ON';
      soundSetting.querySelector('span').textContent = isMuted ? '🔇' : '🔊';
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

  openModeSelection() {
    this.modeScreen.classList.add('active');
  }

  showIntroScreen() {
    this.state = 'INTRO';
    this.saveProgress();
    this.introScreen.classList.add('active');
    this.modeScreen.classList.remove('active');
    this.missionScreen.classList.remove('active');
    this.closeStore();
    this.pauseScreen.classList.remove('active');
    this.gameOverScreen.classList.remove('active');
    this.hudEl.style.display = 'none';

    document.getElementById('intro-highscore').textContent = this.highScore.toLocaleString();
    window.soundEngine.stopBGM();
    this.resetRun();
    this.updateModeHUD();
  }

  startGame() {
    this.gameMode = this.selectedGameMode;
    window.soundEngine.initAudio();
    window.soundEngine.playButtonClick();
    window.soundEngine.startBGM();

    this.state = 'PLAYING';
    this.introScreen.classList.remove('active');
    this.modeScreen.classList.remove('active');
    this.missionScreen.classList.remove('active');
    this.pauseScreen.classList.remove('active');
    this.gameOverScreen.classList.remove('active');
    this.hudEl.style.display = 'flex';

    this.resetRun();
    this.updateModeHUD();
  }

  restartGame() {
    this.gameMode = this.selectedGameMode;
    window.soundEngine.playButtonClick();
    window.soundEngine.startBGM();

    this.state = 'PLAYING';
    this.introScreen.classList.remove('active');
    this.modeScreen.classList.remove('active');
    this.missionScreen.classList.remove('active');
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
    this.saveProgress();
    this.clearEncounter();
    this.clearRouteGate();
    this.missionScreen.classList.remove('active');
    this.routePrompt.classList.remove('show');
    this.routePrompt.textContent = '';
    this.activeMode = null;
    this.modeTimer = 0;
    this.player.userData.skateboard.visible = false;
    this.player.userData.airplane.visible = false;
    this.updateModeHUD();
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
    this.gameMode = this.selectedGameMode;
    this.speed = this.BASE_SPEED;
    this.runTime = 0;
    this.difficultyLevel = 0;
    window.soundEngine.setSpeedFactor(1);
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
    this.activeMode = null;
    this.modeTimer = 0;
    this.speedBoostTimer = 0;
    this.health = 3;
    this.routeBonus = 0;
    this.encounterWarningTimer = 0;
    this.encounterBannerTimer = 0;
    this.encounterIndex = 0;
    this.nextEncounterAt = this.gameMode === 'monster-chase' ? 12 :
      (this.gameMode === 'adventure' ? 16 : Infinity);
    this.routeIndex = 0;
    this.nextRouteAt = 8;
    this.environmentIndex = 0;
    this.nextEnvironmentAt = 48;
    this.progressSaveTimer = 0;
    this.missionRefreshTimer = 0;
    this.clearEncounter();
    this.clearRouteGate();
    this.guardianCharge = (this.storeData.equipped.powerup === 'power-guardian' ? 1 : 0) +
      this.progressData.upgrades.shield;
    this.player.userData.skateboard.visible = false;
    this.player.userData.airplane.visible = false;

    // Start each run with the chaser visible for its opening appearance.
    this.monsterDist = 8.0; // start farther behind player for clear view
    this.targetMonsterDist = this.gameMode === 'monster-chase' ? 3.1 : 3.6;
    this.showChaser();

    this.distance = 0;
    this.score = 0;
    this.coins = 0;
    this.diamonds = 0;

    this.player.position.set(0, 0, 0);
    this.player.userData.bodyPivot.position.set(0, 0.05, 0);
    this.player.userData.bodyPivot.rotation.set(0, 0, 0);
    this.camera.position.set(0, 4.0, 7.8);
    this.cameraLookTarget.set(0, 1.35, -12);
    this.cameraShake = 0;

    this.monster.position.set(0, 0, 3.6);
    this.trackManager.reset();
    this.setEnvironmentTheme('forest');

    this.updateHUD();
    this.updateModeHUD();
    this.beastWarning.style.opacity = '0';
    this.beastWarning.textContent = '⚠️ CINDER WARDEN CLOSING IN! ⚠️';
    this.routePrompt.classList.remove('show');
    this.routePrompt.textContent = '';
    clearTimeout(this.bannerTimer);
    this.floatingBanner.classList.remove('show');
    this.floatingBanner.textContent = '';
  }

  removeTransientObject(object) {
    if (!object) return;
    if (object.parent) object.parent.remove(object);
    const geometries = new Set();
    object.traverse((child) => {
      if (child.geometry) geometries.add(child.geometry);
    });
    geometries.forEach((geometry) => geometry.dispose());
  }

  clearEncounter() {
    if (this.activeEncounter) {
      this.removeTransientObject(this.activeEncounter);
      this.activeEncounter = null;
    }
  }

  clearRouteGate() {
    if (this.activeRouteGate) {
      this.removeTransientObject(this.activeRouteGate.object);
      this.activeRouteGate = null;
    }
  }

  showChaser() {
    this.chaserTimer = this.CHASER_VISIBLE_DURATION;
    this.monster.visible = true;
    this.monster.position.set(
      this.player.position.x * 0.65,
      0,
      this.player.position.z + this.monsterDist
    );
  }

  updateChaserVisibility(delta) {
    if (this.gameMode === 'monster-chase') {
      this.chaserTimer = this.CHASER_VISIBLE_DURATION;
      this.monster.visible = true;
      return;
    }
    if (!this.monster.visible) return;

    this.chaserTimer = Math.max(0, this.chaserTimer - delta);
    if (this.chaserTimer === 0) {
      this.monster.visible = false;
    }
  }

  setEnvironmentTheme(theme) {
    const themes = {
      forest: { sky: 0x82c4e3, fog: 0xa9d2dc, density: 0.012, key: 2.0, fill: 0.95 },
      jungle: { sky: 0x72ad91, fog: 0x9ebfa5, density: 0.016, key: 1.9, fill: 1.05 },
      temple: { sky: 0xc3aa82, fog: 0xc2b39a, density: 0.014, key: 2.05, fill: 0.9 },
      village: { sky: 0xd9c38e, fog: 0xd4c59f, density: 0.014, key: 2.0, fill: 0.85 },
      cave: { sky: 0x3c5269, fog: 0x617487, density: 0.021, key: 1.6, fill: 0.75 },
      mountain: { sky: 0xa5d2e3, fog: 0xc3dce2, density: 0.016, key: 2.1, fill: 1.0 },
      bridge: { sky: 0x91c9df, fog: 0xb5d5dc, density: 0.013, key: 2.0, fill: 0.9 },
      tunnel: { sky: 0x526779, fog: 0x758594, density: 0.019, key: 1.75, fill: 0.78 },
      volcano: { sky: 0x88666b, fog: 0xb77867, density: 0.018, key: 1.9, fill: 0.82 }
    };
    const palette = themes[theme] || themes.forest;
    this.currentEnvironment = theme;
    this.trackManager.setTheme(theme);
    this.scene.background.setHex(palette.sky);
    if (this.scene.fog) {
      this.scene.fog.color.setHex(palette.fog);
      this.scene.fog.density = palette.density;
    }
    this.moonLight.intensity = palette.key;
    if (this.fillLight) this.fillLight.intensity = palette.fill;
  }

  updateEnvironmentTheme() {
    if (this.gameMode === 'adventure' || this.runTime < this.nextEnvironmentAt) return;
    const themes = ['forest', 'jungle', 'temple', 'mountain', 'cave', 'volcano'];
    this.environmentIndex = (this.environmentIndex + 1) % themes.length;
    this.setEnvironmentTheme(themes[this.environmentIndex]);
    this.nextEnvironmentAt = this.runTime + 48;
  }

  updateMonsterEncounters(delta, time) {
    if (this.gameMode !== 'monster-chase' && this.gameMode !== 'adventure') return;

    if (this.activeEncounter) {
      this.activeEncounter.userData.update(time);
      if (this.activeEncounter.position.z - this.player.position.z > 2.5) {
        this.clearEncounter();
      }
    }

    if (this.encounterWarningTimer > 0) {
      this.encounterWarningTimer = Math.max(0, this.encounterWarningTimer - delta);
      this.beastWarning.textContent = '⚠️ MONSTER AHEAD — MOVE LANES! ⚠️';
      this.beastWarning.style.opacity = '1';
      if (this.encounterWarningTimer === 0) {
        const monster = ModelFactory.createEncounterMonster(this.encounterIndex++);
        monster.position.set(this.trackManager.LANES[this.encounterLane], 0, this.player.position.z - 30);
        this.scene.add(monster);
        this.activeEncounter = monster;
        this.encounterBannerTimer = 1.4;
        this.showFloatingBanner('A MONSTER BLOCKS THE PATH!');
      }
    } else if (!this.activeEncounter && this.runTime >= this.nextEncounterAt) {
      this.encounterLane = Math.floor(Math.random() * this.trackManager.LANES.length);
      this.encounterWarningTimer = 2.4;
      const interval = this.gameMode === 'monster-chase' ? 18 : (this.gameMode === 'adventure' ? 28 : 36);
      this.nextEncounterAt = this.runTime + interval;
      window.soundEngine.playMonsterWarning();
    }

    if (this.encounterBannerTimer > 0) {
      this.encounterBannerTimer = Math.max(0, this.encounterBannerTimer - delta);
    } else if (this.encounterWarningTimer === 0 && this.monsterDist >= 2.4) {
      this.beastWarning.style.opacity = '0';
    }
  }

  updateAdventureRoute(delta) {
    if (this.gameMode !== 'adventure') {
      this.routePrompt.classList.remove('show');
      this.routePrompt.textContent = '';
      return;
    }

    if (!this.activeRouteGate && this.runTime >= this.nextRouteAt) {
      const safeLane = Math.floor(Math.random() * this.trackManager.LANES.length);
      const object = ModelFactory.createRouteGate(safeLane);
      const routeSets = [
        ['bridge', 'cave', 'forest'],
        ['tunnel', 'mountain', 'village'],
        ['jungle', 'volcano', 'temple'],
        ['forest', 'tunnel', 'bridge'],
        ['cave', 'village', 'mountain']
      ];
      object.userData.routeTypes = routeSets[this.routeIndex % routeSets.length];
      this.routeIndex += 1;
      object.position.set(0, 0, this.player.position.z - 34);
      this.scene.add(object);
      this.activeRouteGate = {
        object,
        safeLane,
        warned: false,
        options: object.userData.routeTypes
      };
      this.nextRouteAt = this.runTime + 27;
    }

    const route = this.activeRouteGate;
    if (!route) return;
    const distance = Math.abs(route.object.position.z - this.player.position.z);
    if (distance < 24) {
      this.routePrompt.textContent =
        `CHOOSE A PATH  ·  LEFT: ${route.options[0].toUpperCase()}  ·  CENTER: ${route.options[1].toUpperCase()}  ·  RIGHT: ${route.options[2].toUpperCase()}  ·  FOLLOW GREEN`;
      this.routePrompt.classList.add('show');
      if (!route.warned) {
        route.warned = true;
        window.soundEngine.playMonsterWarning();
      }
    }

    if (distance < 1.25) {
      const selectedLane = this.trackManager.LANES.reduce((nearest, laneX, index) =>
        Math.abs(this.player.position.x - laneX) < Math.abs(this.player.position.x - this.trackManager.LANES[nearest])
          ? index : nearest, 0);
      const selectedTheme = route.options[selectedLane];
      this.clearRouteGate();
      this.routePrompt.classList.remove('show');
      this.routePrompt.textContent = '';

      if (selectedLane === route.safeLane) {
        this.routeBonus += 150;
        this.setEnvironmentTheme(selectedTheme);
        this.showFloatingBanner(`SAFE ROUTE: ${selectedTheme.toUpperCase()}! +150`);
        window.soundEngine.playCoin();
      } else {
        this.setEnvironmentTheme(selectedTheme);
        this.showFloatingBanner('WRONG TURN — MONSTER AMBUSH!');
        window.soundEngine.playMonsterRoar();
        this.handleObstacleHit({ userData: { passed: false } });
      }
    }
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
    // A slow orbit shows the runner's original costume on the title screen.
    const orbitAngle = time * 0.22;
    this.camera.position.x = Math.sin(orbitAngle) * 5.0;
    this.camera.position.y = 3.8 + Math.cos(time * 0.3) * 0.3;
    this.camera.position.z = Math.cos(orbitAngle) * 7.5;
    this.camera.lookAt(0, 1.15, -0.5);

    // Idle animations
    this.player.userData.updateAnimation(time, 0.4, false, false, false);
    this.monster.userData.update(time, 3.6, false);
    this.trackManager.update(this.player.position.z, time, this.BASE_SPEED, 0);
  }

  updatePlaying(delta, time) {
    // 1. Running Progress & Speed Acceleration
    this.updateChaserVisibility(delta);
    if (this.activeMode) {
      this.modeTimer = Math.max(0, this.modeTimer - delta);
      if (this.modeTimer === 0) this.endActiveMode();
    }
    this.runTime += delta;
    const speedRatio = Math.min(1.0, this.runTime / this.SPEED_RAMP_DURATION);
    const rampSpeed = this.BASE_SPEED + (this.MAX_SPEED - this.BASE_SPEED) * speedRatio;
    if (this.speedBoostTimer > 0) {
      this.speedBoostTimer = Math.max(0, this.speedBoostTimer - delta);
      if (this.speedBoostTimer === 0) this.showFloatingBanner('MYSTIC SURGE ENDED!');
    }
    this.speed = this.speedBoostTimer > 0 ? Math.min(this.MAX_SPEED + 6, rampSpeed * 1.35) : rampSpeed;
    this.difficultyLevel = Math.min(
      this.MAX_DIFFICULTY,
      Math.floor(this.runTime / this.DIFFICULTY_INTERVAL)
    );
    this.distance += this.speed * delta;
    this.score = Math.floor(this.distance) + this.coins * 10 + this.diamonds * 50 + this.routeBonus;
    this.updateMissionProgress(delta);

    // Sync procedural music speed
    window.soundEngine.setSpeedFactor(1.0 + speedRatio * 0.6 + (this.speedBoostTimer > 0 ? 0.25 : 0));

    // Move player forward (-Z)
    this.player.position.z -= this.speed * delta;

    // Exponential damping keeps lane changes smooth and stable across frame rates.
    const previousPlayerX = this.player.position.x;
    this.player.position.x = this.dampValue(this.player.position.x, this.targetX, 18, delta);
    const laneVelocity = delta > 0 ? (this.player.position.x - previousPlayerX) / delta : 0;
    const bankTarget = Math.max(-0.28, Math.min(0.28, -laneVelocity * 0.018));
    this.player.userData.bodyPivot.rotation.z = this.dampValue(
      this.player.userData.bodyPivot.rotation.z,
      bankTarget,
      14,
      delta
    );

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
    this.player.position.y = this.activeMode === 'airplane' ? 1.8 : this.playerY;

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
        this.targetMonsterDist = 3.6; // The Cinder Warden falls back to its standard chase
      }
    }

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= delta;
      // Blink player opacity during invulnerability
      this.player.visible = Math.floor(time * 20) % 2 === 0;
    } else {
      this.player.visible = true;
    }

    // 6. Cinder Warden chase behavior
    // Interpolate monster distance toward target distance
    this.monsterDist += (this.targetMonsterDist - this.monsterDist) * delta * 2.8;
    this.monster.position.x = this.player.position.x * 0.65; // Tracks the runner's lane
    this.monster.position.y = 0;
    this.monster.position.z = this.player.position.z + this.monsterDist;

    // Warn when the Cinder Warden is dangerously close
    if (this.monsterDist < 2.4) {
      this.beastWarning.textContent = '⚠️ CINDER WARDEN CLOSING IN! ⚠️';
      this.beastWarning.style.opacity = '1';
    } else {
      this.beastWarning.style.opacity = '0';
    }

    this.updateEnvironmentTheme();
    this.updateMonsterEncounters(delta, time);
    this.updateAdventureRoute(delta);

    // 7. Update Track & Recycled Chunks
    this.trackManager.update(this.player.position.z, time, this.speed, this.difficultyLevel);

    // 8. Animations
    this.player.userData.updateAnimation(
      time,
      Math.min(1.35, this.speed / 9.0),
      this.isJumping,
      this.isSliding,
      this.isStumbling,
      this.activeMode
    );
    if (this.player.userData.skateboard.visible) {
      this.player.userData.skateboard.userData.update(delta, this.speed);
    }
    if (this.player.userData.airplane.visible) {
      this.player.userData.airplane.userData.update(time);
    }
    if (this.monster.visible) {
      this.monster.userData.update(time, this.monsterDist, false);
    }

    // 9. Camera follow and dynamic shake
    // Keep the runner and the path ahead clearly in view.
    const targetCamX = this.player.position.x * 0.35 + this.targetX * 0.08;
    const targetCamY = 4.0 + (this.player.position.y * 0.28);
    const targetCamZ = this.player.position.z + (this.activeMode === 'airplane' ? 8.2 : 7.8);

    this.camera.position.x = this.dampValue(this.camera.position.x, targetCamX, 10, delta);
    this.camera.position.y = this.dampValue(this.camera.position.y, targetCamY, 8, delta);
    this.camera.position.z = this.dampValue(this.camera.position.z, targetCamZ, 12, delta);

    // Use coherent, decaying shake instead of frame-random jumps.
    if (this.cameraShake > 0) {
      this.camera.position.x += Math.sin(time * 31) * this.cameraShake * 0.07;
      this.camera.position.y += Math.sin(time * 43 + 0.8) * this.cameraShake * 0.045;
      this.cameraShake = Math.max(0, this.cameraShake - delta * 2.0);
    }

    const targetLookX = this.player.position.x * 0.22 + this.targetX * 0.06;
    this.cameraLookTarget.x = this.dampValue(this.cameraLookTarget.x, targetLookX, 12, delta);
    this.cameraLookTarget.y = this.dampValue(
      this.cameraLookTarget.y,
      1.35 + this.player.position.y * 0.2,
      10,
      delta
    );
    this.cameraLookTarget.z = this.dampValue(
      this.cameraLookTarget.z,
      this.player.position.z - 12,
      12,
      delta
    );
    this.camera.lookAt(this.cameraLookTarget);

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
      if (obs.userData.passed) continue;
      const worldPos = this.collisionWorldPosition;
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

    if (this.activeEncounter && !this.activeEncounter.userData.passed && this.state === 'PLAYING') {
      const encounter = this.activeEncounter;
      const dz = Math.abs(encounter.position.z - playerZ);
      const dx = Math.abs(encounter.position.x - playerX);
      if (dz < 1.3 && dx < 1.1) {
        encounter.userData.passed = true;
        this.clearEncounter();
        this.handleObstacleHit(encounter);
      }
    }

    // 2. Collectibles Sweep (Coins & Soul Diamonds)
    for (let i = this.trackManager.activeCollectibles.length - 1; i >= 0; i--) {
      const item = this.trackManager.activeCollectibles[i];
      const worldPos = this.collisionWorldPosition;
      item.getWorldPosition(worldPos);

      const dz = Math.abs(worldPos.z - playerZ);
      if (dz < 1.4) {
        const dx = Math.abs(worldPos.x - playerX);
        const dy = Math.abs(worldPos.y - (playerY + 1.0));

        const baseRadius = this.storeData.equipped.powerup === 'power-magnet' ? 2.35 : 1.2;
        const collectionRadius = baseRadius + this.progressData.upgrades.magnet * 0.35;
        if (dx < collectionRadius && dy < 1.5) {
          // Collected!
          this.handleCollectItem(item, worldPos);
        }
      }
    }
  }

  handleObstacleHit(obs) {
    if (this.activeMode === 'airplane' || this.activeMode === 'skateboard') {
      obs.userData.passed = true;
      return;
    }
    if (this.invulnerableTimer > 0) return;

    this.showChaser();
    window.soundEngine.playCrash();
    this.triggerScreenShake(0.5);

    if (this.guardianCharge > 0) {
      this.guardianCharge -= 1;
      this.invulnerableTimer = 0.8;
      obs.userData.passed = true;
      this.showFloatingBanner(
        this.guardianCharge > 0
          ? `SHIELD BLOCKED THE HIT! ${this.guardianCharge} CHARGE${this.guardianCharge === 1 ? '' : 'S'} LEFT`
          : 'SHIELD BLOCKED THE HIT!'
      );
      return;
    }

    if (this.gameMode !== 'classic') {
      this.health = Math.max(0, this.health - 1);
      this.updateModeHUD();
      obs.userData.passed = true;
      if (this.health === 0) {
        this.gameOver();
        return;
      }

      this.isStumbling = true;
      this.stumbleTimer = 1.8;
      this.invulnerableTimer = 1.25;
      this.targetMonsterDist = this.gameMode === 'monster-chase' ? 3.5 : 4.8;
      window.soundEngine.playMonsterRoar();
      this.showFloatingBanner(`${this.health} HEART${this.health === 1 ? '' : 'S'} LEFT!`);
      return;
    }

    // End the run if the Cinder Warden is already at the runner's heels.
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
      const baseCoinReward = this.storeData.equipped.powerup === 'power-lucky' ? 2 : 1;
      this.storeData.wallet += baseCoinReward + this.progressData.upgrades.coinBonus;
      this.progressData.stats.coins += 1;
      this.saveProgress();
      this.saveStore();
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
    this.updateModeHUD();
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
