class BackgroundAnimation {
  constructor() {
    this.container = document.getElementById("canvas-container");
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.particles = [];
    this.lines = [];
    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0a0a0a, 1);
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.z = 30;

    this.createGrid();
    this.createParticles();
    this.createLines();
    this.animate();

    window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  createGrid() {
    const size = 100;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper(
      size,
      divisions,
      0x4285f4,
      0x4285f4
    );
    gridHelper.position.y = -10;
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);
  }

  createParticles() {
    const googleColors = [
      0x4285f4, // blue
      0xea4335, // red
      0xfbbc05, // yellow
      0x34a853, // green
    ];

    const geometry = new THREE.SphereGeometry(0.15, 8, 8);

    for (let i = 0; i < 150; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: googleColors[Math.floor(Math.random() * googleColors.length)],
        transparent: true,
        opacity: 0.8,
      });

      const particle = new THREE.Mesh(geometry, material);

      particle.position.x = Math.random() * 80 - 40;
      particle.position.y = Math.random() * 80 - 40;
      particle.position.z = Math.random() * 80 - 40;

      particle.velocity = new THREE.Vector3(
        Math.random() * 0.02 - 0.01,
        Math.random() * 0.02 - 0.01,
        Math.random() * 0.02 - 0.01
      );

      particle.originalScale = Math.random() * 0.5 + 0.5;
      particle.scale.set(
        particle.originalScale,
        particle.originalScale,
        particle.originalScale
      );

      this.particles.push(particle);
      this.scene.add(particle);
    }
  }

  createLines() {
    const material = new THREE.LineBasicMaterial({
      color: 0x4285f4,
      transparent: true,
      opacity: 0.2,
    });

    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.BufferGeometry();
      const points = [];

      const startPoint = new THREE.Vector3(
        Math.random() * 80 - 40,
        Math.random() * 80 - 40,
        Math.random() * 80 - 40
      );

      points.push(startPoint);
      points.push(
        new THREE.Vector3(
          startPoint.x + (Math.random() * 20 - 10),
          startPoint.y + (Math.random() * 20 - 10),
          startPoint.z + (Math.random() * 20 - 10)
        )
      );

      geometry.setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.lines.push(line);
      this.scene.add(line);
    }
  }

  updateParticles() {
    const time = this.clock.getElapsedTime();

    this.particles.forEach((particle) => {
      particle.position.add(particle.velocity);

      // Pulsating effect
      const scale =
        particle.originalScale * (1 + Math.sin(time * 2 + Math.random()) * 0.1);
      particle.scale.set(scale, scale, scale);

      if (particle.position.x < -40 || particle.position.x > 40)
        particle.velocity.x *= -1;
      if (particle.position.y < -40 || particle.position.y > 40)
        particle.velocity.y *= -1;
      if (particle.position.z < -40 || particle.position.z > 40)
        particle.velocity.z *= -1;
    });

    // Rotate lines
    this.lines.forEach((line, index) => {
      line.rotation.x = time * 0.1 + index * 0.1;
      line.rotation.y = time * 0.15 + index * 0.1;
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Rotate camera slowly
    const time = this.clock.getElapsedTime();
    this.camera.position.x = Math.sin(time * 0.1) * 5;
    this.camera.position.y = Math.cos(time * 0.1) * 5;
    this.camera.lookAt(0, 0, 0);

    this.updateParticles();
    this.renderer.render(this.scene, this.camera);
  }
}
