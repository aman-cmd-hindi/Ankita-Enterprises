import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

/* ── Material helpers ── */
const mkMat = (color, roughness = 0.7, metalness = 0.05) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

const mkGold   = () => new THREE.MeshStandardMaterial({ color: 0xC9A15A, roughness: 0.3, metalness: 0.7 });
const mkMarble = () => new THREE.MeshStandardMaterial({ color: 0xF0EDE6, roughness: 0.15, metalness: 0.0 });
const mkDark   = (c = 0x1A1208) => mkMat(c, 0.85, 0.02);

/* ── Build the scene objects ── */
function buildRoom(scene) {
  const objects = [];
  const add = (mesh) => { scene.add(mesh); objects.push(mesh); return mesh; };

  /* Floor — marble */
  const floorGeo = new THREE.PlaneGeometry(10, 10);
  const floor = new THREE.Mesh(floorGeo, mkMarble());
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  add(floor);

  /* Floor reflection plane */
  const reflectMat = new THREE.MeshStandardMaterial({
    color: 0xE8E3DA, roughness: 0.05, metalness: 0.0,
    transparent: true, opacity: 0.18,
  });
  const reflect = new THREE.Mesh(floorGeo, reflectMat);
  reflect.rotation.x = -Math.PI / 2;
  reflect.position.y = 0.001;
  add(reflect);

  /* Back wall */
  const wallMat = mkMat(0x1C1812, 0.9);
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), wallMat);
  backWall.position.set(0, 3, -5);
  backWall.receiveShadow = true;
  add(backWall);

  /* Left wall */
  const lWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), mkMat(0x1A1610, 0.9));
  lWall.position.set(-5, 3, 0);
  lWall.rotation.y = Math.PI / 2;
  lWall.receiveShadow = true;
  add(lWall);

  /* Right wall (lighter for depth) */
  const rWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), mkMat(0x221E14, 0.88));
  rWall.position.set(5, 3, 0);
  rWall.rotation.y = -Math.PI / 2;
  rWall.receiveShadow = true;
  add(rWall);

  /* Ceiling */
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), mkMat(0x0E0C08, 0.95));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = 6;
  add(ceil);

  /* ── Sofa ── */
  const sofaBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.5, 1.2),
    mkMat(0x2C2018, 0.8, 0.05)
  );
  sofaBase.position.set(-0.5, 0.25, 0.5);
  sofaBase.castShadow = true;
  sofaBase.receiveShadow = true;
  add(sofaBase);

  /* Sofa back */
  const sofaBack = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.9, 0.25),
    mkMat(0x2C2018, 0.8, 0.05)
  );
  sofaBack.position.set(-0.5, 0.75, -0.1);
  sofaBack.castShadow = true;
  add(sofaBack);

  /* Sofa cushions */
  const cushionMat = mkMat(0x3D2E18, 0.75, 0.03);
  [-1.1, 0, 1.1].forEach((x) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 1.0), cushionMat);
    c.position.set(x - 0.5, 0.55, 0.5);
    c.castShadow = true;
    add(c);
  });

  /* Sofa arm rests */
  [[-2.1, -0.5], [1.1, -0.5]].forEach(([x]) => {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.55, 1.2),
      mkMat(0x2C2018, 0.8, 0.05)
    );
    arm.position.set(x, 0.4, 0.5);
    arm.castShadow = true;
    add(arm);
  });

  /* Throw pillow */
  const pillow = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.35, 0.1),
    mkMat(0xC9A15A, 0.5, 0.1)
  );
  pillow.position.set(0.8, 0.8, 0.18);
  pillow.rotation.y = 0.3;
  pillow.castShadow = true;
  add(pillow);

  /* ── Coffee Table ── */
  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.06, 0.75),
    mkMarble()
  );
  tableTop.position.set(-0.5, 0.45, 2.0);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  add(tableTop);

  /* Gold table trim */
  const tableTrim = new THREE.Mesh(
    new THREE.BoxGeometry(1.46, 0.03, 0.81),
    mkGold()
  );
  tableTrim.position.set(-0.5, 0.42, 2.0);
  add(tableTrim);

  /* Table legs */
  const legMat = mkGold();
  [
    [-0.6, 2.3], [-0.6, 1.7], [0.6 - 1, 2.3], [0.6 - 1, 1.7]
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), legMat);
    leg.position.set(lx, 0.225, lz);
    add(leg);
  });

  /* Book/decoration on table */
  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.04, 0.22),
    mkMat(0x8B7355, 0.7)
  );
  book.position.set(-0.3, 0.5, 2.05);
  book.rotation.y = -0.2;
  add(book);

  const bookPage = new THREE.Mesh(
    new THREE.BoxGeometry(0.29, 0.06, 0.21),
    mkMat(0xF5F0E8, 0.9)
  );
  bookPage.position.set(-0.3, 0.505, 2.05);
  add(bookPage);

  /* ── Floor Lamp ── */
  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 0.08, 16),
    mkGold()
  );
  lampBase.position.set(2.0, 0.04, 0.2);
  add(lampBase);

  const lampPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 2.2, 12),
    mkGold()
  );
  lampPole.position.set(2.0, 1.14, 0.2);
  add(lampPole);

  /* Lamp shade */
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.5, 16, 1, true),
    mkMat(0x2A2015, 0.7)
  );
  shade.position.set(2.0, 2.5, 0.2);
  shade.rotation.x = Math.PI;
  shade.castShadow = true;
  add(shade);

  /* ── Side Table ── */
  const sideTabletop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.04, 24),
    mkMarble()
  );
  sideTabletop.position.set(1.7, 0.6, 0.5);
  sideTabletop.castShadow = true;
  add(sideTabletop);

  const sideGoldRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.015, 8, 32),
    mkGold()
  );
  sideGoldRing.position.set(1.7, 0.6, 0.5);
  sideGoldRing.rotation.x = Math.PI / 2;
  add(sideGoldRing);

  const sideBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.12, 0.6, 12),
    mkGold()
  );
  sideBase.position.set(1.7, 0.3, 0.5);
  add(sideBase);

  /* ── Potted Plant ── */
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.13, 0.3, 16),
    mkMat(0x8B6914, 0.8)
  );
  pot.position.set(-3.5, 0.15, -1.5);
  pot.castShadow = true;
  add(pot);

  const potSoil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.04, 16),
    mkMat(0x3D2B1F, 0.95)
  );
  potSoil.position.set(-3.5, 0.32, -1.5);
  add(potSoil);

  /* Plant stem + leaves (simple spheres) */
  const leafMat = mkMat(0x1A3A1A, 0.85);
  [[0, 0.7, 0], [-0.15, 0.65, -0.1], [0.14, 0.72, 0.08]].forEach(([dx, dy, dz]) => {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), leafMat);
    leaf.position.set(-3.5 + dx, 0.3 + dy, -1.5 + dz);
    leaf.scale.set(1, 1.5, 1);
    leaf.castShadow = true;
    add(leaf);
  });

  /* ── Wall Art Frame ── */
  const frameMat = mkGold();
  // Outer frame
  const frameOuter = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.3, 0.06),
    frameMat
  );
  frameOuter.position.set(0.5, 3.5, -4.96);
  add(frameOuter);

  // Inner canvas
  const canvas = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 1.15, 0.05),
    mkMat(0x0A0806, 0.95)
  );
  canvas.position.set(0.5, 3.5, -4.94);
  add(canvas);

  /* Subtle abstract lines on canvas */
  const lineMat = mkMat(0xC9A15A, 0.3, 0.5);
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(1.0 - i * 0.25, 0.008, 0.01), lineMat);
    line.position.set(0.5 + (i * 0.05), 3.3 + i * 0.22, -4.91);
    add(line);
  }

  /* ── Ceiling Cove Molding (gold trim) ── */
  const coveMat = mkGold();
  [[0, 0, -5, 0], [0, 0, 5, Math.PI], [-5, 0, 0, Math.PI/2], [5, 0, 0, -Math.PI/2]].forEach(([cx, , cz, ry]) => {
    const cove = new THREE.Mesh(new THREE.BoxGeometry(10, 0.04, 0.08), coveMat);
    cove.position.set(cx, 5.97, cz);
    if (ry) cove.rotation.y = ry;
    add(cove);
  });

  /* ── Baseboard (gold) ── */
  [[0, -5], [0, 5], [-5, 0], [5, 0]].forEach(([bx, bz], i) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(i < 2 ? 10 : 0.06, 0.1, i < 2 ? 0.06 : 10), mkGold());
    board.position.set(bx, 0.05, bz);
    add(board);
  });

  /* ── Rug ── */
  const rugMat = mkMat(0x2A1E10, 0.95);
  const rugGeo = new THREE.PlaneGeometry(3.6, 2.2);
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-0.5, 0.003, 1.2);
  rug.receiveShadow = true;
  add(rug);

  /* Rug border */
  const rugBorder = new THREE.Mesh(new THREE.PlaneGeometry(3.72, 2.32), mkGold());
  rugBorder.rotation.x = -Math.PI / 2;
  rugBorder.position.set(-0.5, 0.002, 1.2);
  add(rugBorder);

  return objects;
}

/* ── Lighting ── */
function buildLights(scene) {
  /* Ambient — very dim, warm */
  const ambient = new THREE.AmbientLight(0x2A1E0A, 0.4);
  scene.add(ambient);

  /* Key light — warm directional from above-right */
  const keyLight = new THREE.DirectionalLight(0xFFE8C0, 1.8);
  keyLight.position.set(4, 8, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.camera.left = keyLight.shadow.camera.bottom = -8;
  keyLight.shadow.camera.right = keyLight.shadow.camera.top = 8;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  /* Fill — cool from opposite side */
  const fill = new THREE.DirectionalLight(0x8899AA, 0.4);
  fill.position.set(-4, 5, 4);
  scene.add(fill);

  /* Lamp point light — warm glow */
  const lampGlow = new THREE.PointLight(0xFFD080, 2.5, 5.0);
  lampGlow.position.set(2.0, 2.3, 0.2);
  lampGlow.castShadow = true;
  scene.add(lampGlow);

  /* Back wall accent */
  const accent = new THREE.SpotLight(0xC9A15A, 1.2, 8, Math.PI / 8, 0.6);
  accent.position.set(0, 5.5, -4);
  accent.target.position.set(0, 3.5, -5);
  scene.add(accent);
  scene.add(accent.target);

  return { lampGlow };
}

/* ══════════════════════════════════════════
   Main component
══════════════════════════════════════════ */
const HeroRoom3D = () => {
  const mountRef  = useRef(null);
  const stateRef  = useRef({
    renderer: null, scene: null, camera: null, animId: null,
    isDragging: false, lastX: 0, lastY: 0,
    rotX: 0.12, rotY: 0.0,    /* client entry angle — looking straight into the room */
    targetRotX: 0.12, targetRotY: 0.0,
    autoRotating: true, idleTimer: null,
    hintVisible: true,
    lampGlow: null,
    clock: null,
    pivot: null,
  });

  const hideHint = useCallback(() => {
    const s = stateRef.current;
    if (s.hintVisible) {
      s.hintVisible = false;
      const hint = mountRef.current?.querySelector('.hero3d-hint');
      if (hint) {
        hint.style.opacity = '0';
        setTimeout(() => { hint.style.display = 'none'; }, 600);
      }
    }
  }, []);

  const resetIdleTimer = useCallback(() => {
    const s = stateRef.current;
    s.autoRotating = false;
    clearTimeout(s.idleTimer);
    s.idleTimer = setTimeout(() => { s.autoRotating = true; }, 2000);
  }, []);

  useEffect(() => {
    const el    = mountRef.current;
    const s     = stateRef.current;
    if (!el) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    s.renderer = renderer;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080604);
    scene.fog = new THREE.Fog(0x080604, 12, 22);
    s.scene = scene;

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 50);
    camera.position.set(0, 2.8, 7.5);
    camera.lookAt(0, 1.5, 0);
    s.camera = camera;
    s.clock  = new THREE.Clock();

    /* ── Pivot for orbit ── */
    const pivot = new THREE.Object3D();
    pivot.position.set(0, 1.5, 0);
    scene.add(pivot);
    s.pivot = pivot;

    /* ── Build room ── */
    buildRoom(scene);
    const { lampGlow } = buildLights(scene);
    s.lampGlow = lampGlow;

    /* ── Animation loop ── */
    const animate = () => {
      s.animId = requestAnimationFrame(animate);
      const dt = s.clock.getDelta();
      const elapsed = s.clock.getElapsedTime();

      /* Lamp flicker */
      if (s.lampGlow) {
        s.lampGlow.intensity = 2.3 + Math.sin(elapsed * 7) * 0.15;
      }

      /* Smooth orbit interpolation */
      if (s.autoRotating) {
        s.targetRotY += 0.0018; /* slow elegant drift */
      }

      s.rotX += (s.targetRotX - s.rotX) * 0.08;
      s.rotY += (s.targetRotY - s.rotY) * 0.08;

      /* Clamp vertical */
      s.rotX = Math.max(-0.35, Math.min(0.55, s.rotX));

      /* Apply rotation via camera orbit around pivot */
      const radius = 7.5;
      camera.position.x = Math.sin(s.rotY) * radius;
      camera.position.z = Math.cos(s.rotY) * radius;
      camera.position.y = 2.8 + s.rotX * 3;
      camera.lookAt(0, 1.5 + s.rotX * 0.5, 0);

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const onResize = () => {
      if (!el) return;
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    /* ── Mouse ── */
    const onMouseDown = (e) => {
      s.isDragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      resetIdleTimer();
      hideHint();
      el.style.cursor = 'grabbing';
    };
    const onMouseMove = (e) => {
      if (!s.isDragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.targetRotY += dx * 0.006;
      s.targetRotX += dy * 0.004;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      resetIdleTimer();
    };
    const onMouseUp = () => {
      s.isDragging = false;
      el.style.cursor = 'grab';
    };

    /* ── Touch ── */
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      s.isDragging = true;
      s.lastX = e.touches[0].clientX;
      s.lastY = e.touches[0].clientY;
      resetIdleTimer();
      hideHint();
    };
    const onTouchMove = (e) => {
      if (!s.isDragging || e.touches.length !== 1) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - s.lastX;
      const dy = e.touches[0].clientY - s.lastY;
      s.targetRotY += dx * 0.006;
      s.targetRotX += dy * 0.004;
      s.lastX = e.touches[0].clientX;
      s.lastY = e.touches[0].clientY;
      resetIdleTimer();
    };
    const onTouchEnd = () => { s.isDragging = false; };

    el.style.cursor = 'grab';
    el.addEventListener('mousedown',  onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(s.animId);
      clearTimeout(s.idleTimer);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [hideHint, resetIdleTimer]);

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {/* Drag hint */}
      <div
        className="hero3d-hint"
        style={{
          position: 'absolute',
          bottom: '6.5rem',
          right: '3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.68rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          zIndex: 3,
          pointerEvents: 'none',
          transition: 'opacity 0.6s ease',
          animation: 'fadeUp 1s 2s both',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 9l7-7 7 7M5 15l7 7 7-7" />
        </svg>
        <span>Drag to explore 3D</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 9l7-7 7 7M5 15l7 7 7-7" />
        </svg>
      </div>
    </div>
  );
};

export default HeroRoom3D;
