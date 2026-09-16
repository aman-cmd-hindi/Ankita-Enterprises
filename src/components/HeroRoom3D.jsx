import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';

const createMaterial = (color, roughness = 0.7, metalness = 0.05) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

const createGoldMaterial = () =>
  new THREE.MeshStandardMaterial({ color: 0xC9A15A, roughness: 0.3, metalness: 0.7 });

const createMarbleMaterial = () =>
  new THREE.MeshStandardMaterial({ color: 0xF0EDE6, roughness: 0.15, metalness: 0.0 });

function buildRoom(scene) {
  const objects = [];
  const add = (mesh) => {
    scene.add(mesh);
    objects.push(mesh);
    return mesh;
  };

  const floorGeo = new THREE.PlaneGeometry(10, 10);
  const floor = new THREE.Mesh(floorGeo, createMarbleMaterial());
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  add(floor);

  const reflectMat = new THREE.MeshStandardMaterial({
    color: 0xE8E3DA,
    roughness: 0.05,
    metalness: 0.0,
    transparent: true,
    opacity: 0.18,
  });
  const reflect = new THREE.Mesh(floorGeo, reflectMat);
  reflect.rotation.x = -Math.PI / 2;
  reflect.position.y = 0.001;
  add(reflect);

  const wallMat = createMaterial(0x1C1812, 0.9);
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), wallMat);
  backWall.position.set(0, 3, -5);
  backWall.receiveShadow = true;
  add(backWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), createMaterial(0x1A1610, 0.9));
  leftWall.position.set(-5, 3, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), createMaterial(0x221E14, 0.88));
  rightWall.position.set(5, 3, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  add(rightWall);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), createMaterial(0x0E0C08, 0.95));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 6;
  add(ceiling);

  const sofaBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.5, 1.2),
    createMaterial(0x2C2018, 0.8, 0.05)
  );
  sofaBase.position.set(-0.5, 0.25, 0.5);
  sofaBase.castShadow = true;
  sofaBase.receiveShadow = true;
  add(sofaBase);

  const sofaBack = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.9, 0.25),
    createMaterial(0x2C2018, 0.8, 0.05)
  );
  sofaBack.position.set(-0.5, 0.75, -0.1);
  sofaBack.castShadow = true;
  add(sofaBack);

  const cushionMat = createMaterial(0x3D2E18, 0.75, 0.03);
  [-1.1, 0, 1.1].forEach((x) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 1.0), cushionMat);
    c.position.set(x - 0.5, 0.55, 0.5);
    c.castShadow = true;
    add(c);
  });

  [[-2.1, -0.5], [1.1, -0.5]].forEach(([x]) => {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.55, 1.2),
      createMaterial(0x2C2018, 0.8, 0.05)
    );
    arm.position.set(x, 0.4, 0.5);
    arm.castShadow = true;
    add(arm);
  });

  const pillow = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.35, 0.1),
    createMaterial(0xC9A15A, 0.5, 0.1)
  );
  pillow.position.set(0.8, 0.8, 0.18);
  pillow.rotation.y = 0.3;
  pillow.castShadow = true;
  add(pillow);

  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.06, 0.75),
    createMarbleMaterial()
  );
  tableTop.position.set(-0.5, 0.45, 2.0);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  add(tableTop);

  const tableTrim = new THREE.Mesh(
    new THREE.BoxGeometry(1.46, 0.03, 0.81),
    createGoldMaterial()
  );
  tableTrim.position.set(-0.5, 0.42, 2.0);
  add(tableTrim);

  const legMat = createGoldMaterial();
  [
    [-0.6, 2.3], [-0.6, 1.7], [0.6 - 1, 2.3], [0.6 - 1, 1.7]
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), legMat);
    leg.position.set(lx, 0.225, lz);
    add(leg);
  });

  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.04, 0.22),
    createMaterial(0x8B7355, 0.7)
  );
  book.position.set(-0.3, 0.5, 2.05);
  book.rotation.y = -0.2;
  add(book);

  const bookPage = new THREE.Mesh(
    new THREE.BoxGeometry(0.29, 0.06, 0.21),
    createMaterial(0xF5F0E8, 0.9)
  );
  bookPage.position.set(-0.3, 0.505, 2.05);
  add(bookPage);

  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 0.08, 16),
    createGoldMaterial()
  );
  lampBase.position.set(2.0, 0.04, 0.2);
  add(lampBase);

  const lampPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 2.2, 12),
    createGoldMaterial()
  );
  lampPole.position.set(2.0, 1.14, 0.2);
  add(lampPole);

  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.5, 16, 1, true),
    createMaterial(0x2A2015, 0.7)
  );
  shade.position.set(2.0, 2.5, 0.2);
  shade.rotation.x = Math.PI;
  shade.castShadow = true;
  add(shade);

  const sideTabletop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.04, 24),
    createMarbleMaterial()
  );
  sideTabletop.position.set(1.7, 0.6, 0.5);
  sideTabletop.castShadow = true;
  add(sideTabletop);

  const sideGoldRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.015, 8, 32),
    createGoldMaterial()
  );
  sideGoldRing.position.set(1.7, 0.6, 0.5);
  sideGoldRing.rotation.x = Math.PI / 2;
  add(sideGoldRing);

  const sideBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.12, 0.6, 12),
    createGoldMaterial()
  );
  sideBase.position.set(1.7, 0.3, 0.5);
  add(sideBase);

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.13, 0.3, 16),
    createMaterial(0x8B6914, 0.8)
  );
  pot.position.set(-3.5, 0.15, -1.5);
  pot.castShadow = true;
  add(pot);

  const potSoil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.04, 16),
    createMaterial(0x3D2B1F, 0.95)
  );
  potSoil.position.set(-3.5, 0.32, -1.5);
  add(potSoil);

  const leafMat = createMaterial(0x1A3A1A, 0.85);
  [[0, 0.7, 0], [-0.15, 0.65, -0.1], [0.14, 0.72, 0.08]].forEach(([dx, dy, dz]) => {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), leafMat);
    leaf.position.set(-3.5 + dx, 0.3 + dy, -1.5 + dz);
    leaf.scale.set(1, 1.5, 1);
    leaf.castShadow = true;
    add(leaf);
  });

  const frameMat = createGoldMaterial();
  const frameOuter = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.3, 0.06),
    frameMat
  );
  frameOuter.position.set(0.5, 3.5, -4.96);
  add(frameOuter);

  const canvas = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 1.15, 0.05),
    createMaterial(0x0A0806, 0.95)
  );
  canvas.position.set(0.5, 3.5, -4.94);
  add(canvas);

  const lineMat = createMaterial(0xC9A15A, 0.3, 0.5);
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(1.0 - i * 0.25, 0.008, 0.01), lineMat);
    line.position.set(0.5 + (i * 0.05), 3.3 + i * 0.22, -4.91);
    add(line);
  }

  const coveMat = createGoldMaterial();
  [[0, 0, -5, 0], [0, 0, 5, Math.PI], [-5, 0, 0, Math.PI / 2], [5, 0, 0, -Math.PI / 2]].forEach(([cx, , cz, ry]) => {
    const cove = new THREE.Mesh(new THREE.BoxGeometry(10, 0.04, 0.08), coveMat);
    cove.position.set(cx, 5.97, cz);
    if (ry) cove.rotation.y = ry;
    add(cove);
  });

  [[0, -5], [0, 5], [-5, 0], [5, 0]].forEach(([bx, bz], i) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(i < 2 ? 10 : 0.06, 0.1, i < 2 ? 0.06 : 10), createGoldMaterial());
    board.position.set(bx, 0.05, bz);
    add(board);
  });

  const rugMat = createMaterial(0x2A1E10, 0.95);
  const rugGeo = new THREE.PlaneGeometry(3.6, 2.2);
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-0.5, 0.003, 1.2);
  rug.receiveShadow = true;
  add(rug);

  const rugBorder = new THREE.Mesh(new THREE.PlaneGeometry(3.72, 2.32), createGoldMaterial());
  rugBorder.rotation.x = -Math.PI / 2;
  rugBorder.position.set(-0.5, 0.002, 1.2);
  add(rugBorder);

  return objects;
}

function buildLights(scene) {
  const ambient = new THREE.AmbientLight(0x2A1E0A, 0.4);
  scene.add(ambient);

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

  const fill = new THREE.DirectionalLight(0x8899AA, 0.4);
  fill.position.set(-4, 5, 4);
  scene.add(fill);

  const lampGlow = new THREE.PointLight(0xFFD080, 2.5, 5.0);
  lampGlow.position.set(2.0, 2.3, 0.2);
  lampGlow.castShadow = true;
  scene.add(lampGlow);

  const accent = new THREE.SpotLight(0xC9A15A, 1.2, 8, Math.PI / 8, 0.6);
  accent.position.set(0, 5.5, -4);
  accent.target.position.set(0, 3.5, -5);
  scene.add(accent);
  scene.add(accent.target);

  return { ambient, keyLight, fill, lampGlow, accent };
}

const HeroRoom3D = () => {
  const mountRef = useRef(null);
  const [activePreset, setActivePreset] = useState('lounge');
  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    animId: null,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    rotX: 0.12,
    rotY: 0.0,
    targetRotX: 0.12,
    targetRotY: 0.0,
    autoRotating: true,
    idleTimer: null,
    hintVisible: true,
    lights: null,
    clock: null,
    pivot: null,
    isNight: false,
  });

  const hideHint = useCallback(() => {
    const s = stateRef.current;
    if (s.hintVisible) {
      s.hintVisible = false;
      const hint = mountRef.current?.querySelector('.hero3d-hint');
      if (hint) {
        hint.style.opacity = '0';
        setTimeout(() => {
          hint.style.display = 'none';
        }, 600);
      }
    }
  }, []);

  const resetIdleTimer = useCallback(() => {
    const s = stateRef.current;
    s.autoRotating = false;
    clearTimeout(s.idleTimer);
    s.idleTimer = setTimeout(() => {
      s.autoRotating = true;
    }, 2500);
  }, []);

  const selectPreset = (preset) => {
    setActivePreset(preset);
    resetIdleTimer();
    hideHint();
    const s = stateRef.current;
    if (!s.lights) return;

    if (preset === 'lounge') {
      s.targetRotX = 0.12;
      s.targetRotY = 0.0;
      s.isNight = false;
      s.lights.keyLight.intensity = 1.8;
      s.lights.ambient.intensity = 0.4;
      s.lights.fill.intensity = 0.4;
      s.lights.accent.intensity = 1.2;
    } else if (preset === 'detail') {
      s.targetRotX = 0.22;
      s.targetRotY = -0.55;
      s.isNight = false;
      s.lights.keyLight.intensity = 1.8;
      s.lights.ambient.intensity = 0.4;
      s.lights.fill.intensity = 0.4;
      s.lights.accent.intensity = 1.4;
    } else if (preset === 'evening') {
      s.targetRotX = 0.16;
      s.targetRotY = 0.35;
      s.isNight = true;
      s.lights.keyLight.intensity = 0.35;
      s.lights.ambient.intensity = 0.12;
      s.lights.fill.intensity = 0.1;
      s.lights.accent.intensity = 1.8;
    }
  };

  useEffect(() => {
    const el = mountRef.current;
    const s = stateRef.current;
    if (!el) return;

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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080604);
    scene.fog = new THREE.Fog(0x080604, 12, 22);
    s.scene = scene;

    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 50);
    camera.position.set(0, 2.8, 7.5);
    camera.lookAt(0, 1.5, 0);
    s.camera = camera;
    s.clock = new THREE.Clock();

    const pivot = new THREE.Object3D();
    pivot.position.set(0, 1.5, 0);
    scene.add(pivot);
    s.pivot = pivot;

    buildRoom(scene);
    const lights = buildLights(scene);
    s.lights = lights;

    const animate = () => {
      s.animId = requestAnimationFrame(animate);
      const elapsed = s.clock.getElapsedTime();

      if (s.lights && s.lights.lampGlow) {
        const base = s.isNight ? 4.0 : 2.3;
        s.lights.lampGlow.intensity = base + Math.sin(elapsed * 7) * 0.18;
      }

      if (s.autoRotating) {
        s.targetRotY += 0.0016;
      }

      s.rotX += (s.targetRotX - s.rotX) * 0.08;
      s.rotY += (s.targetRotY - s.rotY) * 0.08;
      s.rotX = Math.max(-0.35, Math.min(0.55, s.rotX));

      const radius = 7.5;
      camera.position.x = Math.sin(s.rotY) * radius;
      camera.position.z = Math.cos(s.rotY) * radius;
      camera.position.y = 2.8 + s.rotX * 3;
      camera.lookAt(0, 1.5 + s.rotX * 0.5, 0);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!el) return;
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

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

    const onTouchEnd = () => {
      s.isDragging = false;
    };

    el.style.cursor = 'grab';
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

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
      <div
        className="hero3d-controls"
        style={{
          position: 'absolute',
          bottom: '5.5rem',
          right: '2.5rem',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 4,
        }}
      >
        <button
          type="button"
          onClick={() => selectPreset('lounge')}
          style={{
            background: activePreset === 'lounge' ? 'var(--gold)' : 'rgba(10, 10, 10, 0.75)',
            color: activePreset === 'lounge' ? 'var(--black)' : 'var(--text-on-dark)',
            border: '1px solid ' + (activePreset === 'lounge' ? 'var(--gold)' : 'rgba(201, 161, 90, 0.35)'),
            padding: '0.4rem 0.85rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            borderRadius: '20px',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'all 0.25s ease',
          }}
        >
          Lounge View
        </button>

        <button
          type="button"
          onClick={() => selectPreset('detail')}
          style={{
            background: activePreset === 'detail' ? 'var(--gold)' : 'rgba(10, 10, 10, 0.75)',
            color: activePreset === 'detail' ? 'var(--black)' : 'var(--text-on-dark)',
            border: '1px solid ' + (activePreset === 'detail' ? 'var(--gold)' : 'rgba(201, 161, 90, 0.35)'),
            padding: '0.4rem 0.85rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            borderRadius: '20px',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'all 0.25s ease',
          }}
        >
          Detail Angle
        </button>

        <button
          type="button"
          onClick={() => selectPreset('evening')}
          style={{
            background: activePreset === 'evening' ? 'var(--gold)' : 'rgba(10, 10, 10, 0.75)',
            color: activePreset === 'evening' ? 'var(--black)' : 'var(--text-on-dark)',
            border: '1px solid ' + (activePreset === 'evening' ? 'var(--gold)' : 'rgba(201, 161, 90, 0.35)'),
            padding: '0.4rem 0.85rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            borderRadius: '20px',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'all 0.25s ease',
          }}
        >
          Evening Mood
        </button>
      </div>

      <div
        className="hero3d-hint"
        style={{
          position: 'absolute',
          bottom: '3.2rem',
          right: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          zIndex: 3,
          pointerEvents: 'none',
          transition: 'opacity 0.6s ease',
          animation: 'fadeUp 1s 2s both',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 9l7-7 7 7M5 15l7 7 7-7" />
        </svg>
        <span>Drag to rotate 3D space</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 9l7-7 7 7M5 15l7 7 7-7" />
        </svg>
      </div>
    </div>
  );
};

export default HeroRoom3D;
