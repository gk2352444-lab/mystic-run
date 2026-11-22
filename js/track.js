/* MYSTIC RUN – HAUNTED FOREST
 * Infinite Procedural Track & Chunk Manager
 * Object pooling and fair obstacle generation for endless runner gameplay.
 */

class TrackManager {
  constructor(scene, graphicsQuality = 'high') {
    this.scene = scene;
    this.graphicsQuality = graphicsQuality;

    // 3 distinct lanes: Left (-2.8), Center (0.0), Right (2.8)
    this.LANES = [-2.8, 0, 2.8];
    this.CHUNK_LENGTH = 32;
    this.NUM_CHUNKS = 8;

    this.chunks = [];
    this.activeObstacles = [];
    this.activeCollectibles = [];
    this.branchCharacters = [];
    this.environmentDecorations = [];
    this.obstaclePools = { log: [], arch: [], pillar: [], tombstone: [] };
    this.collectiblePools = { coin: [], diamond: [] };
    this.currentTheme = 'forest';
    this.animationFrame = 0;
    this.themeColors = {
      forest: { path: 0x71899a, border: 0x49794d },
      jungle: { path: 0x657d63, border: 0x315f3b },
      temple: { path: 0x8c8272, border: 0x69604f },
      village: { path: 0x9a8068, border: 0x80674f },
      cave: { path: 0x52667c, border: 0x394554 },
      mountain: { path: 0x899aa1, border: 0x647b72 },
      bridge: { path: 0x8c8173, border: 0x6f695f },
      tunnel: { path: 0x596c78, border: 0x40525e },
      volcano: { path: 0x514b4c, border: 0x713b35 }
    };

    // Pooled particle wisps
    this.wisps = [];

    this.initTrack();
  }

  initTrack() {
    // Generate initial track chunks extending forward (-Z)
    for (let i = 0; i < this.NUM_CHUNKS; i++) {
      const chunkZ = -i * this.CHUNK_LENGTH;
      const chunk = this.createChunk(chunkZ, i < 2, i); // First 2 chunks are safe/clear
      this.chunks.push(chunk);
      this.scene.add(chunk.group);
    }

    // Add floating ambient forest wisps
    this.initWisps();
  }

  createChunk(zPos, isSafe = false, chunkIndex = 0) {
    const chunkGroup = new THREE.Group();
    chunkGroup.position.z = zPos;

    // 1. Central Dirt/Stone Path
    const pathGeo = new THREE.PlaneGeometry(8.8, this.CHUNK_LENGTH, 1, 1);
    const biomeNames = ['forest', 'jungle', 'temple', 'mountain', 'cave', 'volcano'];
    const biome = biomeNames[chunkIndex % biomeNames.length];
    const pathMat = ModelFactory.materials.roadPath.clone();
    pathMat.color.setHex(this.themeColors[biome].path);
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.userData.trackSurface = 'path';
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.receiveShadow = true;
    chunkGroup.add(pathMesh);

    // 2. Dark Forest Road Borders (Verges)
    const borderGeo = new THREE.PlaneGeometry(16, this.CHUNK_LENGTH, 1, 1);
    const borderMat = ModelFactory.materials.roadBorder.clone();
    borderMat.color.setHex(this.themeColors[biome].border);

    const leftBorder = new THREE.Mesh(borderGeo, borderMat);
    leftBorder.rotation.x = -Math.PI / 2;
    leftBorder.position.set(-12, -0.05, 0);
    leftBorder.receiveShadow = true;
    chunkGroup.add(leftBorder);

    const rightBorder = new THREE.Mesh(borderGeo, borderMat);
    rightBorder.rotation.x = -Math.PI / 2;
    rightBorder.position.set(12, -0.05, 0);
    rightBorder.receiveShadow = true;
    chunkGroup.add(rightBorder);

    // 3. Side Trees & Ancient Ruins
    const numTrees = 3;
    const wallSegments = [];
    for (let t = 0; t < numTrees; t++) {
      const localZ = (t / numTrees) * this.CHUNK_LENGTH - this.CHUNK_LENGTH / 2;

      [-1, 1].forEach(side => {
        const tree = ModelFactory.createHauntedTree();
        const sideOffset = side < 0 ? 0 : 1;
        tree.position.set(
          side * (5.5 + Math.random() * 2.5),
          0,
          localZ + (Math.random() - 0.5) * 3
        );
        tree.rotation.y = (Math.random() - 0.5) * 0.6;

        const characterType = (chunkIndex + t + sideOffset) % 3;
        const activity = (chunkIndex + t + sideOffset * 2) % 4;
        const character = ModelFactory.createBranchCharacter(characterType, activity, side);
        tree.add(character);
        this.branchCharacters.push(character);
        chunkGroup.add(tree);
      });

      if (t === 1) {
        [-1, 1].forEach(side => {
          const decoration = ModelFactory.createBiomeDecoration(biome, side);
          decoration.position.x += side * 10.1;
          decoration.position.z = localZ;
          chunkGroup.add(decoration);
          this.environmentDecorations.push(decoration);
        });
      }

      // Regular wall sections keep the animated portraits visible throughout each chunk.
      if (t !== 1) {
        const wallSide = Math.random() > 0.5 ? 1 : -1;
        const portraitType = (chunkIndex + t + (wallSide < 0 ? 1 : 0)) % 3;
        const wall = ModelFactory.createRuinWallSegment(portraitType, wallSide);
        wall.position.set(wallSide * 4.6, 0, localZ);
        chunkGroup.add(wall);
        wallSegments.push(wall);
      }

      // Spooky glowing lurking eyes in dark background
      if (Math.random() > 0.6) {
        const eyes = ModelFactory.createSpookyEyes();
        const eyeX = (Math.random() > 0.5 ? 1 : -1) * (6.5 + Math.random() * 2);
        eyes.position.set(eyeX, 1.2 + Math.random() * 0.8, localZ);
        chunkGroup.add(eyes);
        this.environmentDecorations.push(eyes);
      }
    }

    const chunkData = {
      group: chunkGroup,
      obstacles: [],
      collectibles: [],
      wallSegments,
      biome,
      pathMaterial: pathMat,
      borderMaterial: borderMat,
      zPos: zPos
    };

    if (!isSafe) {
      this.populateChunkObjects(chunkData);
    }

    return chunkData;
  }

  setTheme(theme) {
    if (!this.themeColors[theme]) return;
    this.currentTheme = theme;
    const colors = this.themeColors[theme];
    this.chunks.forEach((chunk) => {
      chunk.pathMaterial.color.setHex(colors.path);
      chunk.borderMaterial.color.setHex(colors.border);
    });
  }

  setGraphicsQuality(quality) {
    this.graphicsQuality = quality;
    const decorationStride = quality === 'low' ? 4 : quality === 'medium' ? 2 : 1;
    this.environmentDecorations.forEach((decoration, index) => {
      decoration.visible = index % decorationStride === 0;
    });

    const wispCount = quality === 'low' ? 4 : quality === 'medium' ? 8 : 15;
    this.ensureWisps(wispCount);
    this.wisps.forEach((wisp, index) => {
      wisp.visible = index < wispCount;
    });
  }

  getObstacle(type) {
    const pool = this.obstaclePools[type];
    let obstacle = pool.length ? pool.pop() : null;
    if (!obstacle) {
      if (type === 'log') obstacle = ModelFactory.createLogObstacle();
      else if (type === 'arch') obstacle = ModelFactory.createRuinArchObstacle();
      else if (type === 'pillar') obstacle = ModelFactory.createPillarObstacle();
      else if (type === 'tombstone') obstacle = ModelFactory.createTombstoneObstacle();
      else throw new Error(`Unknown obstacle pool type: ${type}`);
    }
    obstacle.userData.poolType = type;
    obstacle.userData.passed = false;
    obstacle.visible = true;
    return obstacle;
  }

  getCollectible(type) {
    const pool = this.collectiblePools[type];
    const item = pool.length ? pool.pop() : (type === 'coin'
      ? ModelFactory.createCoin()
      : ModelFactory.createDiamond());
    item.visible = true;
    item.rotation.set(0, 0, 0);
    return item;
  }

  recycleChunkObjects(chunkData) {
    chunkData.obstacles.forEach(obstacle => {
      chunkData.group.remove(obstacle);
      const activeIndex = this.activeObstacles.indexOf(obstacle);
      if (activeIndex !== -1) this.activeObstacles.splice(activeIndex, 1);
      const type = obstacle.userData.poolType;
      if (this.obstaclePools[type]) this.obstaclePools[type].push(obstacle);
    });
    chunkData.obstacles = [];

    chunkData.collectibles.forEach(item => {
      chunkData.group.remove(item);
      const activeIndex = this.activeCollectibles.indexOf(item);
      if (activeIndex !== -1) this.activeCollectibles.splice(activeIndex, 1);
      const type = item.userData.type === 'DIAMOND' ? 'diamond' : 'coin';
      this.collectiblePools[type].push(item);
    });
    chunkData.collectibles = [];
  }

  // Populate chunk with obstacles and coins/diamonds adhering to fair gameplay rules
  populateChunkObjects(chunkData, difficultyLevel = 0) {
    this.recycleChunkObjects(chunkData);

    // Decide obstacle rows (1 or 2 rows per chunk)
    const zRows = [-8, 8];

    zRows.forEach((rowZ) => {
      // Difficulty progression: probability of spawning obstacles
      const spawnChance = Math.min(0.85, 0.45 + difficultyLevel * 0.055);
      if (Math.random() > spawnChance) {
        // Spawn coin run instead
        this.spawnCoinTrail(chunkData, rowZ, Math.floor(Math.random() * 3));
        return;
      }

      // Randomly pick lane layout: ensure AT LEAST 1 lane is completely safe or traversable!
      // Available lanes: 0: Left, 1: Center, 2: Right
      const laneIndices = [0, 1, 2];
      const blockedLanes = [];

      // Determine how many obstacles in this row (1 or 2, NEVER 3)
      const maxObstacles = difficultyLevel >= 2 ? (Math.random() > 0.4 ? 2 : 1) : 1;

      // Shuffle lane indices
      laneIndices.sort(() => Math.random() - 0.5);

      for (let i = 0; i < maxObstacles; i++) {
        blockedLanes.push(laneIndices[i]);
      }

      // Spawn obstacle in chosen lanes
      blockedLanes.forEach(laneIdx => {
        const laneX = this.LANES[laneIdx];
        const obsTypeRand = Math.random();
        let obstacleType;
        if (obsTypeRand < 0.35) {
          // Low Hurdle: Fallen Tree Log (Jumpable)
          obstacleType = 'log';
        } else if (obsTypeRand < 0.65) {
          // Overhead Barrier: Ancient Ruin Arch (Slideable)
          obstacleType = 'arch';
        } else if (obsTypeRand < 0.85) {
          // Blocker: Ancient Pillar (Must switch lanes)
          obstacleType = 'pillar';
        } else {
          // Blocker: Cursed Tombstone
          obstacleType = 'tombstone';
        }

        const obs = this.getObstacle(obstacleType);
        obs.position.set(laneX, 0, rowZ);
        chunkData.group.add(obs);
        chunkData.obstacles.push(obs);
        this.activeObstacles.push(obs);

        // If it's a jump log, spawn coin arc over it to reward jumping!
        if (obs.userData.heightType === 'LOW' && Math.random() > 0.3) {
          this.spawnJumpCoinArc(chunkData, rowZ, laneX);
        }
      });

      // In one of the unblocked lanes, maybe spawn a Soul Diamond or Coin line
      const unblockedLanes = laneIndices.slice(maxObstacles);
      if (unblockedLanes.length > 0) {
        const safeLaneIdx = unblockedLanes[0];
        const safeLaneX = this.LANES[safeLaneIdx];

        if (Math.random() < 0.25) {
          // Rare Soul Diamond
          const diamond = this.getCollectible('diamond');
          diamond.position.set(safeLaneX, 1.1, rowZ);
          chunkData.group.add(diamond);
          chunkData.collectibles.push(diamond);
          this.activeCollectibles.push(diamond);
        } else {
          // Coin Trail
          this.spawnCoinTrail(chunkData, rowZ, safeLaneIdx);
        }
      }
    });
  }

  // Straight coin trail in a lane
  spawnCoinTrail(chunkData, centerZ, laneIdx) {
    const laneX = this.LANES[laneIdx];
    for (let c = -2; c <= 2; c++) {
      const coin = this.getCollectible('coin');
      coin.position.set(laneX, 1.0, centerZ + c * 2.2);
      chunkData.group.add(coin);
      chunkData.collectibles.push(coin);
      this.activeCollectibles.push(coin);
    }
  }

  // Rewarding parabolic arc of coins over a jump hurdle
  spawnJumpCoinArc(chunkData, centerZ, laneX) {
    const offsets = [-2.5, -1.2, 0, 1.2, 2.5];
    const heights = [1.0, 1.8, 2.4, 1.8, 1.0];

    offsets.forEach((zOff, i) => {
      const coin = this.getCollectible('coin');
      coin.position.set(laneX, heights[i], centerZ + zOff);
      chunkData.group.add(coin);
      chunkData.collectibles.push(coin);
      this.activeCollectibles.push(coin);
    });
  }

  // Ambient floating wisps across the forest
  initWisps() {
    this.wispGeometry = new THREE.SphereGeometry(0.12, 6, 6);
    this.ensureWisps(this.graphicsQuality === 'low' ? 4 : this.graphicsQuality === 'medium' ? 8 : 15);
  }

  ensureWisps(count) {
    while (this.wisps.length < count) {
      const mat = Math.random() > 0.4 ? ModelFactory.materials.wispParticle : ModelFactory.materials.sparkParticle;
      const wisp = new THREE.Mesh(this.wispGeometry, mat);
      wisp.position.set(
        (Math.random() - 0.5) * 22,
        0.5 + Math.random() * 3.5,
        -Math.random() * (this.NUM_CHUNKS * this.CHUNK_LENGTH)
      );
      wisp.userData = {
        baseY: wisp.position.y,
        baseX: wisp.position.x,
        speed: 0.8 + Math.random() * 1.5,
        offset: Math.random() * Math.PI * 2
      };
      this.scene.add(wisp);
      this.wisps.push(wisp);
    }
  }

  // Update track recycling based on player Z position
  update(playerZ, time, speed = 12, difficultyLevel = 0) {
    // 1. Recycle chunks that have fallen behind the player/camera
    let farthestZ = 0;
    this.chunks.forEach(chunk => {
      if (chunk.group.position.z < farthestZ) {
        farthestZ = chunk.group.position.z;
      }
    });

    this.chunks.forEach(chunk => {
      // When chunk is 25m behind player, recycle to front
      if (chunk.group.position.z > playerZ + 25) {
        const newZ = farthestZ - this.CHUNK_LENGTH;
        chunk.group.position.z = newZ;
        farthestZ = newZ;

        // Repopulate with new obstacles & coins
        this.populateChunkObjects(chunk, difficultyLevel);
      }
    });

    this.animationFrame += 1;
    const updateDecorations = this.graphicsQuality !== 'low' || this.animationFrame % 2 === 0;

    // 2. Animate Collectibles (Rotation and gentle float)
    this.activeCollectibles.forEach(item => {
      item.rotation.y = time * 3.0;
      if (item.userData.type === 'DIAMOND') {
        item.rotation.x = Math.sin(time * 2.0) * 0.3;
      }
    });

    // 3. Animate Ambient Wisps
    if (updateDecorations) {
      this.wisps.forEach(wisp => {
        if (!wisp.visible) return;
        wisp.position.y = wisp.userData.baseY + Math.sin(time * wisp.userData.speed + wisp.userData.offset) * 0.4;
        wisp.position.x = wisp.userData.baseX + Math.cos(time * wisp.userData.speed * 0.5) * 0.6;

        if (wisp.position.z > playerZ + 15) {
          wisp.position.z = playerZ - 140 - Math.random() * 40;
        }
      });

      const speedFactor = Math.max(0.45, Math.min(0.9, speed / 13));
      this.branchCharacters.forEach(character => {
        character.userData.update(time * speedFactor);
      });

      ModelFactory.updateGhostPortraits(time, Math.max(0.45, Math.min(0.9, speed / 13)));
    }
  }

  // Remove collected item immediately from collision pool and visually
  removeCollectible(item) {
    const idx = this.activeCollectibles.indexOf(item);
    if (idx !== -1) {
      this.activeCollectibles.splice(idx, 1);
    }
    if (item.parent) {
      item.parent.remove(item);
    }
  }

  reset() {
    // Reset all chunks back to starting configuration
    this.activeObstacles = [];
    this.activeCollectibles = [];

    for (let i = 0; i < this.NUM_CHUNKS; i++) {
      const chunk = this.chunks[i];
      const chunkZ = -i * this.CHUNK_LENGTH;
      chunk.group.position.z = chunkZ;

      // First 2 chunks safe
      if (i < 2) {
        // Clear obstacles
        chunk.obstacles.forEach(o => chunk.group.remove(o));
        chunk.obstacles = [];
        chunk.collectibles.forEach(c => chunk.group.remove(c));
        chunk.collectibles = [];
      } else {
        this.populateChunkObjects(chunk, 0);
      }
    }
  }
}

window.TrackManager = TrackManager;
