/**
 * Galaxy Three.js Background
 * Avinash Pandey Portfolio - Live Galaxy Animation
 */
class GalaxyBackground {
  constructor() {
    this.canvas = document.getElementById('three-canvas');
    if (!this.canvas) return;

    this.scene    = new THREE.Scene();
    this.camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.clock    = new THREE.Clock();
    this.mouse    = new THREE.Vector2(0, 0);
    this.groups   = {};

    this.init();
    // this.createGalaxy();
    this.createNebula();
    this.createFloatingOrbs();
    this.createConstellationLines();
    this.addEventListeners();
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Limit pixel ratio to keep performance smooth on high-DPI screens
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.z = 50;

    // Pause heavy animations when page is not visible
    document.addEventListener('visibilitychange', () => {
      this.isHidden = document.hidden;
    });
  }

  /* ---- GALAXY PARTICLES ---- */
  createGalaxy() {
    // Particle counts adapt to screen size for smoother performance on smaller devices
    const screenFactor = Math.max(0.7, Math.min(1.1, window.innerWidth / 1920));
    const COUNT       = Math.round(3400 * screenFactor);
    const positions   = new Float32Array(COUNT * 3);
    const colors      = new Float32Array(COUNT * 3);
    const sizes       = new Float32Array(COUNT);

    const colorOptions = [
      new THREE.Color(0x00f5ff), // cyan
      new THREE.Color(0xb300ff), // purple
      new THREE.Color(0xff006e), // pink
      new THREE.Color(0x0066ff), // blue
      new THREE.Color(0xffffff), // white
      new THREE.Color(0xffd700), // gold
    ];

    const Arms  = 4;
    const Spin  = 1.5;
    const Rand  = 1.8;
    const Inner = 0.3;

    for (let i = 0; i < COUNT; i++) {
      const i3   = i * 3;
      const r    = Math.random() * 80 + 2;
      const arm  = (i % Arms) / Arms * Math.PI * 2;
      const spin = r * Spin;

      const randX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * Rand;
      const randY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * Rand * Inner;
      const randZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * Rand;

      positions[i3]     = Math.cos(arm + spin) * r + randX;
      positions[i3 + 1] = randY;
      positions[i3 + 2] = Math.sin(arm + spin) * r + randZ;

      // Blend colors (inner = cyan/gold, outer = purple/pink)
      const t = r / 80;
      const innerColor = colorOptions[Math.random() > 0.5 ? 0 : 5];
      const outerColor = colorOptions[Math.floor(Math.random() * 3) + 1];
      const blended    = innerColor.clone().lerp(outerColor, t);

      colors[i3]     = blended.r;
      colors[i3 + 1] = blended.g;
      colors[i3 + 2] = blended.b;

      sizes[i] = Math.random() * 1.5 + 0.3;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.galaxyParticles = new THREE.Points(geo, mat);
    this.scene.add(this.galaxyParticles);
  }

  /* ---- BACKGROUND STARS ---- */
  createNebula() {
    // Keep background stars light and smooth
    const screenFactor = Math.max(0.8, Math.min(1.0, window.innerWidth / 1920));
    const COUNT       = Math.round(1200 * screenFactor);
    const positions   = new Float32Array(COUNT * 3);
    const colors      = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT * 3; i += 3) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 150 + Math.random() * 200;

      positions[i]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      const brightness = 0.6 + Math.random() * 0.4;
      if (Math.random() > 0.8) {
        // Colored stars
        const hue = Math.random();
        const c   = new THREE.Color().setHSL(hue, 1, 0.7);
        colors[i] = c.r * brightness; colors[i+1] = c.g * brightness; colors[i+2] = c.b * brightness;
      } else {
        // White stars
        colors[i] = brightness; colors[i+1] = brightness; colors[i+2] = brightness;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.stars = new THREE.Points(geo, mat);
    this.scene.add(this.stars);
  }

  /* ---- FLOATING GLOWING ORBS ---- */
  createFloatingOrbs() {
    this.orbs = [];
    const orbData = [
      { color: 0x00f5ff, size: 1.2, pos: [15, 10, -30],  speed: 0.4 },
      { color: 0xb300ff, size: 0.8, pos: [-20, -8, -40], speed: 0.6 },
      { color: 0xff006e, size: 1.0, pos: [25, -15, -25], speed: 0.3 },
      { color: 0x0066ff, size: 0.6, pos: [-10, 20, -35], speed: 0.8 },
      { color: 0xffd700, size: 0.5, pos: [5, -20, -20],  speed: 0.5 },
    ];

    orbData.forEach(data => {
      const geo = new THREE.SphereGeometry(data.size, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.25,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...data.pos);
      mesh.userData = { baseY: data.pos[1], speed: data.speed, phase: Math.random() * Math.PI * 2 };

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(data.size * 2.5, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      mesh.add(halo);

      this.scene.add(mesh);
      this.orbs.push(mesh);
    });
  }

  /* ---- CONSTELLATION LINES ---- */
  createConstellationLines() {
    const points = [];
    const nodeCount = 12;

    for (let i = 0; i < nodeCount; i++) {
      points.push(new THREE.Vector3(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 20
      ));
    }

    const linePoints = [];
    for (let i = 0; i < nodeCount - 1; i++) {
      linePoints.push(points[i]);
      linePoints.push(points[i + 1]);
    }

    const geo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const mat = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    this.constellations = new THREE.LineSegments(geo, mat);
    this.scene.add(this.constellations);

    // Constellation nodes
    const nodeMat = new THREE.PointsMaterial({
      color: 0x00f5ff,
      size: 0.3,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const nodesGeo = new THREE.BufferGeometry().setFromPoints(points);
    this.constellationNodes = new THREE.Points(nodesGeo, nodeMat);
    this.scene.add(this.constellationNodes);
  }

  /* ---- EVENT LISTENERS ---- */
  addEventListeners() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', e => {
      this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }

  /* ---- ANIMATE ---- */
  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.isHidden) {
      // Keep a lightweight render if user navigates away
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const t = this.clock.getElapsedTime();

    // Galaxy slow rotation
    if (this.galaxyParticles) {
      this.galaxyParticles.rotation.y = t * 0.03;
      this.galaxyParticles.rotation.x = Math.sin(t * 0.05) * 0.05;
    }

    // Stars very slow drift
    if (this.stars) {
      this.stars.rotation.y = t * 0.004;
      this.stars.rotation.x = t * 0.002;
    }

    // Float orbs
    this.orbs.forEach(orb => {
      orb.position.y = orb.userData.baseY + Math.sin(t * orb.userData.speed + orb.userData.phase) * 3;
      orb.rotation.y += 0.005;
    });

    // Constellation drift
    if (this.constellations) {
      this.constellations.rotation.y = t * 0.01;
      this.constellationNodes.rotation.y = t * 0.01;
    }

    // Camera follows mouse gently
    this.camera.position.x += (this.mouse.x * 8 - this.camera.position.x) * 0.02;
    this.camera.position.y += (-this.mouse.y * 5 - this.camera.position.y) * 0.02;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('three-canvas') && typeof THREE !== 'undefined') {
    window.galaxyBg = new GalaxyBackground();
  }
});