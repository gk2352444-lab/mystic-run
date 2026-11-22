/* MYSTIC-RUN – HAUNTED FOREST
 * Infinite Procedural Track & Chunk Manager
 * Object pooling and fair obstacle generation for endless runner gameplay.
 */

class TrackManager {
    constructor(scene) {
        this.scene = scene;

        // 3 distinct lanes: Left (-2.8), Center (0.0), Right (2.8)
        this.LANES = [-2.8, 0, 2.8];
        this.CHUNK_LENGTH = 32;
        this.NUM_CHUNKS = 8;

        this.chunks = [];
        this.activeObstacles = [];
        this.activeCollectibles = [];

        // Pooled particle wisps
        this.wisps = [];

        this.initTrack();
    }

    initTrack() {
        // Generate initial track chunks extending forward (-Z)
        for (let i = 0; i < this.NUM_CHUNKS; i++) {
            const chunkZ = -i * this.CHUNK_LENGTH;
            const chunk = this.createChunk(chunkZ, i < 2); // First 2 chunks are safe/clear
            this.chunks.push(chunk);
            this.scene.add(chunk.group);
        }

        // Add floating ambient forest wisps
        this.initWisps();
    }

    createChunk(zPos, isSafe = false) {
        const chunkGroup = new THREE.Group();
        chunkGroup.position.z = zPos;

        // 1. Central Dirt/Stone Path
        const pathGeo = new THREE.PlaneGeometry(8.8, this.CHUNK_LENGTH, 1, 1);
        const pathMat = ModelFactory.materials.roadPath;
        const pathMesh = new THREE.Mesh(pathGeo, pathMat);
        pathMesh.rotation.x = -Math.PI / 2;
        pathMesh.receiveShadow = true;
        chunkGroup.add(pathMesh);

        // 2. Dark Forest Road Borders (Verges)
        const borderGeo = new THREE.PlaneGeometry(16, this.CHUNK_LENGTH, 1, 1);
        const borderMat = ModelFactory.materials.roadBorder;

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
        for (let t = 0; t < numTrees; t++) {
            const localZ = (t / numTrees) * this.CHUNK_LENGTH - this.CHUNK_LENGTH / 2;

            // Left Tree
            const treeL = ModelFactory.createHauntedTree();
            treeL.position.set(-5.5 - Math.random() * 2.5, 0, localZ + (Math.random() - 0.5) * 3);
            treeL.rotation.y = Math.random() * Math.PI * 2;
            chunkGroup.add(treeL);

            // Right Tree
            const treeR = ModelFactory.createHauntedTree();
            treeR.position.set(5.5 + Math.random() * 2.5, 0, localZ + (Math.random() - 0.5) * 3);
            treeR.rotation.y = Math.random() * Math.PI * 2;
            chunkGroup.add(treeR);

            // Occasional ancient stone ruins / pillars on side
            if (Math.random() > 0.5) {
                const wall = ModelFactory.createRuinWallSegment();
                const sideX = (Math.random() > 0.5 ? 1 : -1) * 4.6;
                wall.position.set(sideX, 0, localZ);
                chunkGroup.add(wall);
            }

            // Spooky glowing lurking eyes in dark background
            if (Math.random() > 0.6) {
                const eyes = ModelFactory.createSpookyEyes();
                const eyeX = (Math.random() > 0.5 ? 1 : -1) * (6.5 + Math.random() * 2);
                eyes.position.set(eyeX, 1.2 + Math.random() * 0.8, localZ);
                chunkGroup.add(eyes);
            }
        }

        const chunkData = {
            group: chunkGroup,
            obstacles: [],
            collectibles: [],
            zPos: zPos
        };

        if (!isSafe) {
            this.populateChunkObjects(chunkData);
        }

        return chunkData;
    }

    // Populate chunk with obstacles and coins/diamonds adhering to fair gameplay rules
    populateChunkObjects(chunkData, distanceTravelled = 0) {
        // Clear previous items from group
        chunkData.obstacles.forEach(obs => {
            chunkData.group.remove(obs);
            const idx = this.activeObstacles.indexOf(obs);
            if (idx !== -1) this.activeObstacles.splice(idx, 1);
        });
        chunkData.obstacles = [];

        chunkData.collectibles.forEach(col => {
            chunkData.group.remove(col);
            const idx = this.activeCollectibles.indexOf(col);
            if (idx !== -1) this.activeCollectibles.splice(idx, 1);
        });
        chunkData.collectibles = [];

        // Decide obstacle rows (1 or 2 rows per chunk)
        const zRows = [-8, 8];

        zRows.forEach((rowZ) => {
            // Difficulty progression: probability of spawning obstacles
            const spawnChance = Math.min(0.85, 0.45 + (distanceTravelled / 1000) * 0.35);
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
            const maxObstacles = distanceTravelled > 250 ? (Math.random() > 0.4 ? 2 : 1) : 1;

            // Shuffle lane indices
            laneIndices.sort(() => Math.random() - 0.5);

            for (let i = 0; i < maxObstacles; i++) {
                blockedLanes.push(laneIndices[i]);
            }

            // Spawn obstacle in chosen lanes
            blockedLanes.forEach(laneIdx => {
                const laneX = this.LANES[laneIdx];
                const obsTypeRand = Math.random();
                let obs;

                if (obsTypeRand < 0.35) {
                    // Low Hurdle: Fallen Tree Log (Jumpable)
                    obs = ModelFactory.createLogObstacle();
                } else if (obsTypeRand < 0.65) {
                    // Overhead Barrier: Ancient Ruin Arch (Slideable)
                    obs = ModelFactory.createRuinArchObstacle();
                } else if (obsTypeRand < 0.85) {
                    // Blocker: Ancient Pillar (Must switch lanes)
                    obs = ModelFactory.createPillarObstacle();
                } else {
                    // Blocker: Cursed Tombstone
                    obs = ModelFactory.createTombstoneObstacle();
                }

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
                    const diamond = ModelFactory.createDiamond();
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
            const coin = ModelFactory.createCoin();
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
            const coin = ModelFactory.createCoin();
            coin.position.set(laneX, heights[i], centerZ + zOff);
            chunkData.group.add(coin);
            chunkData.collectibles.push(coin);
            this.activeCollectibles.push(coin);
        });
    }

    // Ambient floating wisps across the forest
    initWisps() {
        const wispGeo = new THREE.SphereGeometry(0.12, 6, 6);
        const numWisps = 15;
        for (let i = 0; i < numWisps; i++) {
            const mat = Math.random() > 0.4 ? ModelFactory.materials.wispParticle : ModelFactory.materials.sparkParticle;
            const wisp = new THREE.Mesh(wispGeo, mat);
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
    update(playerZ, distanceTravelled, time) {
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
                this.populateChunkObjects(chunk, distanceTravelled);
            }
        });

        // 2. Animate Collectibles (Rotation and gentle float)
        this.activeCollectibles.forEach(item => {
            item.rotation.y = time * 3.0;
            if (item.userData.type === 'DIAMOND') {
                item.rotation.x = Math.sin(time * 2.0) * 0.3;
            }
        });

        // 3. Animate Ambient Wisps
        this.wisps.forEach(wisp => {
            wisp.position.y = wisp.userData.baseY + Math.sin(time * wisp.userData.speed + wisp.userData.offset) * 0.4;
            wisp.position.x = wisp.userData.baseX + Math.cos(time * wisp.userData.speed * 0.5) * 0.6;

            // Keep wisps within player view zone
            if (wisp.position.z > playerZ + 15) {
                wisp.position.z = playerZ - 140 - Math.random() * 40;
            }
        });
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
