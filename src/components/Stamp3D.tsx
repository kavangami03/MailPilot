import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  SplineCurve,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// A classic wax-seal stamp, built in "drawing units" (the 2D stamp's 120 × 196 box) so it sits where that one did.
const U = 0.02; // drawing units → scene units
const MID = 91.25; // drawing y of the model's vertical centre
const y3 = (y: number) => (MID - y) * U;
const FACE_TILT = -1.05; // radians: how far it tips to show you its seal
const CAM_Y = 1.0;
const CAM_Z = 9.4;
// while it's held or pressing it tips toward you (about 62°), so its seal faces the page
const PRESS_TILT = 1.08;
const FACE_SPIN = Math.PI / 2; // turn that brings the engraving upright when it tips toward you

// slim turned walnut handle: (radius, y) from the rounded top down to the brass ferrule
const HANDLE: [number, number][] = [
  [0, 6],
  [4.2, 6.8],
  [7, 8.8],
  [8.8, 12],
  [9.5, 15.5],
  [8.9, 19],
  [7, 22],
  [5.6, 24],
  [6.8, 25.6],
  [8.2, 27.5],
  [7.2, 29.5],
  [6.6, 31.5],
  [7.8, 36],
  [9.6, 46],
  [10.8, 58],
  [11.2, 70],
  [10.8, 82],
  [9.8, 94],
  [8.6, 104],
  [7.6, 112],
  [7.2, 117],
  [8.4, 119.5],
  [9.2, 122],
  [9.4, 125],
  [9.4, 129],
];

const makeCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = Math.round(w);
  c.height = Math.round(h);
  return [c, c.getContext("2d")!] as const;
};
const seeded = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const tex = (c: HTMLCanvasElement, srgb = false) => {
  const t = new CanvasTexture(c);
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

function woodTexture() {
  const [c, g] = makeCanvas(512, 512);
  g.fillStyle = "#5e3417";
  g.fillRect(0, 0, 512, 512);
  const rnd = seeded(11);
  for (let i = 0; i < 180; i++) {
    const x = rnd() * 512;
    const amp = 2 + rnd() * 7;
    const f = 0.004 + rnd() * 0.012;
    const ph = rnd() * 6.28;
    g.strokeStyle = rnd() > 0.55 ? `rgba(170,104,52,${0.15 + rnd() * 0.28})` : `rgba(34,16,6,${0.22 + rnd() * 0.4})`;
    g.lineWidth = 0.6 + rnd() * 2.6;
    g.beginPath();
    for (let y = 0; y <= 512; y += 8) g.lineTo(x + Math.sin(y * f + ph) * amp, y);
    g.stroke();
  }
  const t = tex(c, true);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(2, 1);
  return t;
}

// lathe marks: fine rings of slightly varying roughness (ferrule, neck)
function turnedTexture() {
  const [c, g] = makeCanvas(4, 256);
  for (let y = 0; y < 256; y++) {
    const v = 92 + Math.round(Math.sin(y * 1.9) * 18 + Math.sin(y * 0.37) * 14);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(0, y, 4, 1);
  }
  const t = tex(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(1, 3);
  return t;
}

// the seal head's edge: a knurled grip band between two plain lips
function knurlTexture() {
  const [c, g] = makeCanvas(1024, 64);
  g.fillStyle = "#fff";
  g.fillRect(0, 0, 1024, 64);
  const ridges = 64;
  for (let i = 0; i < ridges; i++) {
    const x = (i / ridges) * 1024;
    const grad = g.createLinearGradient(x, 0, x + 1024 / ridges, 0);
    grad.addColorStop(0, "#6a6a6a");
    grad.addColorStop(0.5, "#fff");
    grad.addColorStop(1, "#6a6a6a");
    g.fillStyle = grad;
    g.fillRect(x, 14, 1024 / ridges, 36);
  }
  const t = tex(c);
  t.wrapS = RepeatWrapping;
  return t;
}

// the head's top: concentric machining rings
function ringsTexture() {
  const [c, g] = makeCanvas(512, 512);
  for (let r = 256; r > 0; r -= 3) {
    const v = 70 + ((r / 3) % 2 ? 26 : 0) + Math.round(Math.sin(r * 0.21) * 10);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.beginPath();
    g.arc(256, 256, r, 0, Math.PI * 2);
    g.fill();
  }
  return tex(c);
}

// the seal face: raised polished border, lettering and MailPilot mark on an antiqued, recessed field
function faceTextures(logo: HTMLImageElement) {
  const S = 1024;
  const C = S / 2;
  const draw = (raised: string, field: string) => {
    const [c, g] = makeCanvas(S, S);
    g.fillStyle = field;
    g.fillRect(0, 0, S, S);
    g.fillStyle = raised;
    g.strokeStyle = raised;
    // border ring and inner ring
    g.lineWidth = 34;
    g.beginPath();
    g.arc(C, C, C - 30, 0, Math.PI * 2);
    g.stroke();
    g.lineWidth = 8;
    g.beginPath();
    g.arc(C, C, C - 150, 0, Math.PI * 2);
    g.stroke();
    // lettering around the rim
    const text = "MAILPILOT · SEALED BY YOU · SENT FROM YOUR ADDRESS · ";
    g.font = "700 52px Poppins, Arial, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    const step = (Math.PI * 2) / text.length;
    for (let i = 0; i < text.length; i++) {
      g.save();
      g.translate(C, C);
      g.rotate(-Math.PI / 2 + i * step);
      g.translate(0, -(C - 92));
      g.fillText(text[i], 0, 0);
      g.restore();
    }
    // the mark
    const lw = S * 0.42;
    const lh = (lw * logo.naturalHeight) / logo.naturalWidth;
    const [mc, m] = makeCanvas(lw, lh);
    m.drawImage(logo, 0, 0, lw, lh);
    m.globalCompositeOperation = "source-in";
    m.fillStyle = raised;
    m.fillRect(0, 0, lw, lh);
    g.drawImage(mc, C - lw / 2, C - lh / 2);
    return c;
  };
  return {
    color: tex(draw("#e7c590", "#6e5233"), true),
    rough: tex(draw("rgb(55,55,55)", "rgb(170,170,170)")), // polished reliefs, satin field
    bump: tex(draw("#fff", "#000")),
  };
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/**
 * A real 3D wax-seal stamp. It turns slowly, leans toward the cursor, and tips its engraved face toward
 * you on hover (and now and then by itself); while it's being dragged or pressed it stands upright.
 */
export default function Stamp3D({ onReady }: { onReady: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const host = canvas.parentElement as HTMLElement; // the stamp button
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the drawn stamp stays
    }
    let disposed = false;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTarget = pmrem.fromScene(room, 0.04);
    scene.environment = envTarget.texture;
    scene.add(new HemisphereLight(0xfff4e6, 0x0b2b2c, 0.5));
    const key = new DirectionalLight(0xffe6c4, 2.1);
    key.position.set(-4, 5, 6);
    const rim = new DirectionalLight(0x7fd6c8, 1.6); // picks up the teal of the desk mat
    rim.position.set(5, 3, -4);
    const fill = new DirectionalLight(0xfff0dc, 0.8); // lights the face when it tips toward you
    fill.position.set(0, -3, 7);
    scene.add(key, rim, fill);

    const camera = new PerspectiveCamera(24, 1, 0.1, 50);
    camera.position.set(0, CAM_Y, CAM_Z);
    camera.lookAt(0, 0.02, 0);

    const wood = woodTexture();
    const turned = turnedTexture();
    const knurl = knurlTexture();
    const rings = ringsTexture();
    const woodMat = new MeshPhysicalMaterial({
      map: wood,
      color: 0xb08c72,
      roughness: 0.4,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
    }); // walnut under lacquer
    const brass = new MeshPhysicalMaterial({
      color: 0xc9a06a,
      metalness: 1,
      roughness: 1,
      roughnessMap: turned,
      envMapIntensity: 1.25,
    });
    const brassBright = new MeshPhysicalMaterial({
      color: 0xe2c08a,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.35,
    });
    const brassDark = new MeshPhysicalMaterial({ color: 0x8f6c45, metalness: 1, roughness: 0.42 });
    const headSide = new MeshPhysicalMaterial({
      color: 0xc9a06a,
      metalness: 1,
      roughness: 0.4,
      bumpMap: knurl,
      bumpScale: 1,
      envMapIntensity: 1.2,
    });
    const headTop = new MeshPhysicalMaterial({
      color: 0xd2ab73,
      metalness: 1,
      roughness: 1,
      roughnessMap: rings,
      envMapIntensity: 1.3,
    });
    const disposables: { dispose: () => void }[] = [
      wood,
      turned,
      knurl,
      rings,
      woodMat,
      brass,
      brassBright,
      brassDark,
      headSide,
      headTop,
      envTarget,
      pmrem,
    ];

    const pivot = new Group(); // tilt and the face-reveal turn
    const model = new Group(); // spins about the stamp's own axis
    pivot.add(model);
    scene.add(pivot);
    const add = (mesh: Mesh, y: number, rotX = 0) => {
      mesh.position.y = y3(y);
      mesh.rotation.x = rotX;
      model.add(mesh);
      disposables.push(mesh.geometry);
      return mesh;
    };
    const ring = (r: number, tube: number, y: number, mat: MeshPhysicalMaterial) =>
      add(new Mesh(new TorusGeometry(r * U, tube * U, 16, 96), mat), y, Math.PI / 2);

    // walnut handle: the outline spun on a lathe (listed bottom to top so its faces point outward)
    const outline = new SplineCurve(HANDLE.map(([r, y]) => new Vector2(r * U, y3(y))))
      .getPoints(220)
      .map((p) => new Vector2(Math.max(0, p.x), p.y));
    outline.push(new Vector2(0, y3(129)));
    add(new Mesh(new LatheGeometry(outline.reverse(), 96), woodMat), MID);
    // brass ferrule with bead rings and a groove
    add(new Mesh(new CylinderGeometry(9.6 * U, 9.6 * U, 23 * U, 96), brass), 140.5);
    ring(9.95, 1.15, 131.4, brassBright);
    ring(9.95, 1.15, 149.6, brassBright);
    ring(9.62, 0.45, 140.5, brassDark);
    // neck flaring into the seal head
    add(new Mesh(new CylinderGeometry(7.6 * U, 10.5 * U, 11.5 * U, 96), brass), 157.75);
    // seal head: knurled edge, machined top, rounded top edge, engraved face underneath
    const head = add(
      new Mesh(new CylinderGeometry(27 * U, 26.4 * U, 13 * U, 128, 1, false), [headSide, headTop, brassDark]),
      170,
    );
    ring(26.6, 1.35, 163.6, brassBright);
    ring(26.2, 0.9, 176.4, brassDark);

    // the engraved face arrives with the logo image
    loadImage("/mailpilot-mark-light.png")
      .then((img) => {
        if (disposed) return;
        const t = faceTextures(img);
        const face = new MeshPhysicalMaterial({
          map: t.color,
          metalness: 1,
          roughness: 1,
          roughnessMap: t.rough,
          bumpMap: t.bump,
          bumpScale: 3,
          envMapIntensity: 1.3,
        });
        disposables.push(t.color, t.rough, t.bump, face);
        head.material = [headSide, headTop, face];
      })
      .catch(() => {});

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // lean toward the cursor over the desk mat; tip the face toward you while the stamp is hovered
    const tilt = { x: 0, z: 0, tx: 0, tz: 0 };
    let hover = false;
    const area = (canvas.closest(".mat") ?? host) as HTMLElement;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const a = area.getBoundingClientRect();
      tilt.tz = -((e.clientX - (r.left + r.width / 2)) / a.width) * 0.55;
      tilt.tx = ((e.clientY - (r.top + r.height / 2)) / a.height) * 0.35;
    };
    const onLeave = () => {
      tilt.tx = 0;
      tilt.tz = 0;
    };
    const onEnter = () => (hover = true);
    const onExit = () => (hover = false);
    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onExit);

    let raf = 0;
    let ready = false;
    let last = performance.now();
    let spin = 0;
    let reveal = 0;
    let held = 0;
    const start = last;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;
      const busy = host.classList.contains("is-dragging") || host.classList.contains("is-pressing");
      // now and then it shows its seal by itself (for touch screens, where there's no hover)
      const showOff = t % 12 > 9.4 && t % 12 < 11.2;
      const target = !busy && (hover || showOff) ? 1 : 0;
      reveal += (target - reveal) * Math.min(1, dt * 5);
      held += ((busy ? 1 : 0) - held) * Math.min(1, dt * 7);
      // spin while upright; while revealing, settle on the turn that shows the engraving upright
      if (target) {
        const goal = FACE_SPIN + Math.round((spin - FACE_SPIN) / (Math.PI * 2)) * Math.PI * 2;
        spin += (goal - spin) * Math.min(1, dt * 5);
      } else if (!busy) spin += dt * 0.16; // a slow, calm turn (about 40 seconds a revolution)
      model.rotation.y = spin;
      tilt.x += (tilt.tx - tilt.x) * 0.07;
      tilt.z += (tilt.tz - tilt.z) * 0.07;
      const restX = tilt.x * (1 - reveal) + FACE_TILT * reveal;
      pivot.rotation.x = restX * (1 - held) + PRESS_TILT * held;
      pivot.rotation.z = tilt.z * (1 - reveal) * (1 - held);
      pivot.position.y = (Math.sin(t * 1.3) * 0.025 * (1 - reveal) + reveal * 0.35) * (1 - held);
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        onReady();
      }
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      last = performance.now();
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    });
    // prepare the shaders first, so scrolling never hitches when the stamp appears
    if (renderer.extensions.has("KHR_parallel_shader_compile")) {
      renderer
        .compileAsync(scene, camera)
        .catch(() => {})
        .then(() => !disposed && io.observe(canvas));
    } else {
      renderer.compile(scene, camera);
      io.observe(canvas);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onExit);
      disposables.forEach((d) => d.dispose());
      room.dispose();
      renderer.dispose();
    };
  }, [onReady]);

  return <canvas ref={ref} className="stamp3d" aria-hidden="true" />;
}
