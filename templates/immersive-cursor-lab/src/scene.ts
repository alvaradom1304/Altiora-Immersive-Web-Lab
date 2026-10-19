import {
  CapsuleGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { damp } from './damp';

export interface SceneOptions {
  /** Límite de devicePixelRatio: el coste de fragmentos crece con su cuadrado. */
  maxDpr?: number;
  onContextLost?: () => void;
  onContextRestored?: () => void;
}

export interface LabScene {
  /** Avanza la pose hacia el puntero. `motion` = false fija la pose de reposo. */
  update(dt: number, px: number, py: number, motion: boolean): void;
  render(): void;
  resize(width: number, height: number): void;
  info(): { calls: number; triangles: number; dpr: number };
  dispose(): void;
}

// Capas de parallax: cuanto mayor `depth`, más se desplaza con el puntero.
const LAYERS = [
  { depth: 0.25, count: 7, scale: 0.55, z: -3 },
  { depth: 0.6, count: 6, scale: 0.75, z: -1 },
  { depth: 1.0, count: 4, scale: 1.0, z: 1.2 },
];

/** Lanza si WebGL no está disponible: quien llama decide la alternativa. */
export function createScene(canvas: HTMLCanvasElement, opts: SceneOptions = {}): LabScene {
  const maxDpr = opts.maxDpr ?? 1.5;
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'default',
    // Si solo hay rasterizado por software, mejor el póster estático.
    failIfMajorPerformanceCaveat: true,
  });
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 10);

  scene.add(new HemisphereLight(0xffffff, 0x8a8478, 1.6));
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 6);
  scene.add(key);

  const accent = new Color('#ff3b1f');
  const ink = new Color('#0e0e0e');

  // Elemento protagonista: geometría y material propios (se liberan en dispose).
  const heroGeo = new TorusGeometry(1.25, 0.55, 24, 64);
  const heroMat = new MeshStandardMaterial({ color: accent, roughness: 0.45, metalness: 0.05, flatShading: true });
  const hero = new Mesh(heroGeo, heroMat);

  // Satélites: una geometría y un material compartidos, una InstancedMesh por capa (3 draw calls).
  const satGeo = new CapsuleGeometry(0.16, 0.5, 4, 12);
  const satMat = new MeshStandardMaterial({ color: ink, roughness: 0.6 });
  const dummy = new Object3D();
  const layers = LAYERS.map((cfg, li) => {
    const mesh = new InstancedMesh(satGeo, satMat, cfg.count);
    // Distribución determinista (sin Math.random) para capturas reproducibles.
    for (let i = 0; i < cfg.count; i++) {
      const a = (i / cfg.count) * Math.PI * 2 + li * 0.9;
      const r = 2.4 + ((i * 37) % 10) * 0.12 + li * 0.35;
      dummy.position.set(Math.cos(a) * r * 1.25, Math.sin(a) * r * 0.75, cfg.z + ((i * 13) % 5) * 0.2);
      dummy.rotation.set(a, a * 0.5, a * 1.3);
      dummy.scale.setScalar(cfg.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    const group = new Group();
    group.add(mesh);
    return { group, depth: cfg.depth };
  });

  // `rig` recibe la inclinación global; la composición se desplaza a la derecha en pantallas anchas.
  const rig = new Group();
  rig.add(hero, ...layers.map((l) => l.group));
  scene.add(rig);

  const pose = { rx: 0, ry: 0, hx: 0, hy: 0, spin: 0 };
  let dpr = 1;

  const onLost = (e: Event) => {
    e.preventDefault(); // permite que el navegador intente restaurar el contexto
    opts.onContextLost?.();
  };
  const onRestored = () => opts.onContextRestored?.();
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  return {
    update(dt, px, py, motion) {
      if (motion) {
        // Amplitudes acotadas: la forma nunca invade el bloque de texto.
        pose.rx = damp(pose.rx, -py * 0.35, 4, dt);
        pose.ry = damp(pose.ry, px * 0.5, 4, dt);
        pose.hx = damp(pose.hx, px * 0.45, 3, dt);
        pose.hy = damp(pose.hy, py * 0.3, 3, dt);
        pose.spin += Math.min(dt, 0.05) * 0.25;
      } else {
        // Sin movimiento: pose de reposo inmediata, sin interpolar.
        pose.rx = pose.ry = pose.hx = pose.hy = 0;
      }

      rig.rotation.set(pose.rx, pose.ry, 0);
      hero.position.set(pose.hx, pose.hy, 0);
      hero.rotation.set(0.6 + pose.spin * 0.6, pose.spin, 0.2);
      for (const l of layers) l.group.position.set(pose.hx * l.depth * 1.6, pose.hy * l.depth * 1.6, 0);
    },
    render() {
      renderer.render(scene, camera);
    },
    resize(width, height) {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      const aspect = width / Math.max(1, height);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      // Ancho: composición a la derecha. Estrecho: arriba y más pequeña, lejos del titular.
      if (aspect >= 1) {
        rig.position.set(2.2 * Math.min(aspect, 1.8), 0.6, 0);
        rig.scale.setScalar(1);
      } else {
        rig.position.set(0.4, 2.2, 0);
        rig.scale.setScalar(0.62);
      }
    },
    info() {
      return { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, dpr };
    },
    dispose() {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      for (const l of layers) (l.group.children[0] as InstancedMesh).dispose();
      heroGeo.dispose();
      heroMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      renderer.dispose();
    },
  };
}
