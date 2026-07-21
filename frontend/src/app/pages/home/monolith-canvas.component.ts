import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
  inject,
  Input,
} from '@angular/core';
import * as THREE from 'three';

// ── Face drawing helpers ────────────────────────────────────────────────────
const FACE_SIZE = 512;
const BG = '#1c1b1d';
const ACCENT = '#6366f1';
const PURPLE = '#a855f7';
const INK = '#e5e1e4';
const MUTED = '#8e9192';
const DARK = '#2a2a2c';

function createFaceCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = FACE_SIZE;
  c.height = FACE_SIZE;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

/** Fill face background */
function clearFace(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, FACE_SIZE, FACE_SIZE);
}

// ── Face 0: OCR Scan ────────────────────────────────────────────────────────
function drawOCR(ctx: CanvasRenderingContext2D, t: number) {
  clearFace(ctx);
  const scanY = ((t * 0.4) % 1) * FACE_SIZE;

  // Text line placeholders
  const lines = [80, 120, 160, 200, 240, 300, 340, 380, 420];
  const widths = [320, 280, 360, 200, 340, 260, 380, 300, 180];
  for (let i = 0; i < lines.length; i++) {
    const y = lines[i];
    const visible = y < scanY;
    ctx.fillStyle = visible ? `rgba(229,225,228,${0.5 + Math.random() * 0.15})` : 'rgba(229,225,228,0.06)';
    ctx.fillRect(80, y, widths[i], 8);
    // Confidence badges for visible lines
    if (visible && i % 3 === 0) {
      ctx.fillStyle = 'rgba(99,102,241,0.3)';
      ctx.fillRect(80 + widths[i] + 12, y - 2, 40, 12);
      ctx.fillStyle = ACCENT;
      ctx.font = '9px monospace';
      ctx.fillText('99%', 80 + widths[i] + 16, y + 8);
    }
  }

  // Scan beam
  const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
  grad.addColorStop(0, 'rgba(99,102,241,0)');
  grad.addColorStop(0.5, 'rgba(99,102,241,0.6)');
  grad.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(40, scanY - 30, FACE_SIZE - 80, 60);

  // Thin scan line
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, scanY);
  ctx.lineTo(FACE_SIZE - 40, scanY);
  ctx.stroke();

  // Label
  ctx.fillStyle = 'rgba(99,102,241,0.5)';
  ctx.font = '600 11px monospace';
  ctx.fillText('OCR  ·  TEXT EXTRACTION', 80, 50);
}

// ── Face 1: Vision AI Bounding Boxes ────────────────────────────────────────
function drawVision(ctx: CanvasRenderingContext2D, t: number) {
  clearFace(ctx);

  const boxes = [
    { x: 60, y: 80, w: 160, h: 100, label: 'Button' },
    { x: 280, y: 60, w: 180, h: 80, label: 'Image' },
    { x: 60, y: 220, w: 400, h: 50, label: 'Navigation' },
    { x: 100, y: 320, w: 140, h: 60, label: 'Heading' },
    { x: 300, y: 300, w: 120, h: 80, label: 'Form' },
    { x: 80, y: 420, w: 340, h: 40, label: 'Link' },
  ];

  const cycle = (t * 0.3) % 1;
  boxes.forEach((box, i) => {
    const phase = ((cycle + i * 0.15) % 1);
    const alpha = Math.max(0, Math.sin(phase * Math.PI) * 0.8);
    if (alpha < 0.05) return;

    ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = `rgba(99,102,241,${alpha * 0.7})`;
    ctx.fillRect(box.x, box.y - 16, ctx.measureText(box.label).width + 16 || 60, 16);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.font = '10px monospace';
    ctx.fillText(box.label, box.x + 4, box.y - 4);
  });

  ctx.fillStyle = 'rgba(168,85,247,0.4)';
  ctx.font = '600 11px monospace';
  ctx.fillText('VISION AI  ·  SCENE ANALYSIS', 80, 50);
}

// ── Face 2: Accessibility Tree ──────────────────────────────────────────────
function drawTree(ctx: CanvasRenderingContext2D, t: number) {
  clearFace(ctx);

  const progress = Math.min(1, ((t * 0.25) % 1) * 1.6);
  const nodes = [
    { x: 256, y: 80, label: 'body', depth: 0 },
    { x: 120, y: 170, label: 'nav', depth: 1 },
    { x: 256, y: 170, label: 'main', depth: 1 },
    { x: 400, y: 170, label: 'footer', depth: 1 },
    { x: 160, y: 260, label: 'heading', depth: 2 },
    { x: 260, y: 260, label: 'image', depth: 2 },
    { x: 360, y: 260, label: 'button', depth: 2 },
    { x: 210, y: 340, label: 'form', depth: 2 },
    { x: 310, y: 340, label: 'input', depth: 3 },
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3], [2, 4], [2, 5], [2, 6], [2, 7], [7, 8],
  ];

  const visibleCount = Math.floor(progress * nodes.length);

  // Draw edges
  edges.forEach(([from, to]) => {
    if (from >= visibleCount || to >= visibleCount) return;
    const a = nodes[from];
    const b = nodes[to];
    ctx.strokeStyle = 'rgba(99,102,241,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + 12);
    ctx.lineTo(b.x, b.y - 12);
    ctx.stroke();
  });

  // Draw nodes
  for (let i = 0; i < visibleCount; i++) {
    const n = nodes[i];
    const alpha = Math.min(1, (progress * nodes.length - i) * 2);
    ctx.fillStyle = `rgba(42,42,44,${alpha})`;
    ctx.strokeStyle = `rgba(99,102,241,${alpha * 0.6})`;
    ctx.lineWidth = 1;
    const tw = ctx.measureText(n.label).width || 40;
    const pad = 10;
    const rw = tw + pad * 2;
    const rh = 24;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(n.x - rw / 2, n.y - rh / 2, rw, rh, 4);
    } else {
      ctx.rect(n.x - rw / 2, n.y - rh / 2, rw, rh);
    }
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = `rgba(229,225,228,${alpha})`;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(n.label, n.x, n.y + 4);
    ctx.textAlign = 'start';
  }

  ctx.fillStyle = 'rgba(99,102,241,0.4)';
  ctx.font = '600 11px monospace';
  ctx.textAlign = 'start';
  ctx.fillText('A11Y TREE  ·  SEMANTIC STRUCTURE', 80, 50);
}

// ── Face 3: Alt Text Generation ─────────────────────────────────────────────
function drawAltText(ctx: CanvasRenderingContext2D, t: number) {
  clearFace(ctx);

  const cycle = (t * 0.2) % 1;

  // Image placeholder
  const imgAlpha = Math.min(1, cycle * 4);
  ctx.strokeStyle = `rgba(142,145,146,${imgAlpha * 0.5})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(120, 80, 272, 180);
  ctx.setLineDash([]);

  // Mountain icon inside
  if (imgAlpha > 0.3) {
    ctx.strokeStyle = `rgba(142,145,146,${imgAlpha * 0.3})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, 220);
    ctx.lineTo(240, 140);
    ctx.lineTo(300, 200);
    ctx.lineTo(340, 160);
    ctx.lineTo(380, 220);
    ctx.stroke();
  }

  // Generated alt text (typing effect)
  const text = 'A photograph of a modern office building with glass facades reflecting the sunset sky.';
  const textProgress = Math.max(0, (cycle - 0.3) / 0.7);
  const chars = Math.floor(textProgress * text.length);
  if (chars > 0) {
    ctx.fillStyle = 'rgba(229,225,228,0.7)';
    ctx.font = '13px Inter, sans-serif';
    // Word wrap
    const maxW = 340;
    const words = text.substring(0, chars).split(' ');
    let line = '';
    let y = 300;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line.trim(), 90, y);
        line = word + ' ';
        y += 22;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), 90, y);

    // Cursor blink
    if (chars < text.length) {
      const lastLine = ctx.measureText(line.trim()).width;
      ctx.fillStyle = ACCENT;
      ctx.fillRect(90 + lastLine + 2, y - 12, 2, 14);
    }
  }

  ctx.fillStyle = 'rgba(168,85,247,0.4)';
  ctx.font = '600 11px monospace';
  ctx.fillText('ALT TEXT  ·  IMAGE DESCRIPTION', 80, 50);
}

// ── Face 4: Contrast Analysis ───────────────────────────────────────────────
function drawContrast(ctx: CanvasRenderingContext2D, t: number) {
  clearFace(ctx);

  const phase = (t * 0.3) % 1;
  const cols = 6;
  const rows = 5;
  const cellW = 56;
  const cellH = 56;
  const startX = 70;
  const startY = 90;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (cellW + 6);
      const y = startY + r * (cellH + 6);
      const idx = r * cols + c;
      const wave = Math.sin((phase + idx * 0.08) * Math.PI * 2);

      // Determine pass/fail
      const pass = wave > -0.2;
      if (pass) {
        const g = 80 + Math.floor(wave * 40);
        ctx.fillStyle = `rgba(${40 + g}, ${80 + g}, ${40 + g}, 0.5)`;
      } else {
        ctx.fillStyle = `rgba(200, 60, 60, 0.4)`;
      }
      ctx.fillRect(x, y, cellW, cellH);

      // Ratio text
      const ratio = (3 + wave * 8).toFixed(1);
      ctx.fillStyle = pass ? 'rgba(45,212,191,0.7)' : 'rgba(248,113,113,0.7)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${ratio}:1`, x + cellW / 2, y + cellH / 2 + 3);
      ctx.textAlign = 'start';

      // Pass/fail indicator
      ctx.fillStyle = pass ? 'rgba(45,212,191,0.5)' : 'rgba(248,113,113,0.5)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(pass ? 'AA' : 'FAIL', x + cellW / 2, y + cellH / 2 + 16);
      ctx.textAlign = 'start';
    }
  }

  ctx.fillStyle = 'rgba(99,102,241,0.4)';
  ctx.font = '600 11px monospace';
  ctx.fillText('CONTRAST  ·  WCAG ANALYSIS', 80, 50);
}

// ── Face 5: Reading Order ───────────────────────────────────────────────────
function drawReadingOrder(ctx: CanvasRenderingContext2D, t: number) {
  clearFace(ctx);

  const blocks = [
    { x: 80, y: 80, w: 350, h: 40, n: 1 },
    { x: 80, y: 150, w: 180, h: 120, n: 2 },
    { x: 300, y: 150, w: 140, h: 50, n: 3 },
    { x: 300, y: 230, w: 140, h: 40, n: 4 },
    { x: 80, y: 310, w: 360, h: 35, n: 5 },
    { x: 80, y: 380, w: 200, h: 60, n: 6 },
    { x: 310, y: 380, w: 130, h: 60, n: 7 },
  ];

  const progress = ((t * 0.25) % 1) * (blocks.length + 1);

  blocks.forEach((b, i) => {
    const alpha = i < progress ? Math.min(1, (progress - i) * 2) : 0.08;

    // Block
    ctx.fillStyle = `rgba(42,42,44,${alpha * 0.8})`;
    ctx.strokeStyle = `rgba(99,102,241,${alpha * 0.4})`;
    ctx.lineWidth = 1;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeRect(b.x, b.y, b.w, b.h);

    // Number badge
    if (alpha > 0.1) {
      ctx.fillStyle = `rgba(99,102,241,${alpha})`;
      ctx.beginPath();
      ctx.arc(b.x + b.w - 14, b.y + 14, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(b.n), b.x + b.w - 14, b.y + 18);
      ctx.textAlign = 'start';
    }

    // Connection line to next block
    if (i < blocks.length - 1 && alpha > 0.3) {
      const next = blocks[i + 1];
      ctx.strokeStyle = `rgba(168,85,247,${alpha * 0.3})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(b.x + b.w / 2, b.y + b.h);
      ctx.lineTo(next.x + next.w / 2, next.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  ctx.fillStyle = 'rgba(168,85,247,0.4)';
  ctx.font = '600 11px monospace';
  ctx.fillText('READING ORDER  ·  FLOW SEQUENCE', 80, 50);
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const FACE_DRAWERS = [drawOCR, drawVision, drawTree, drawAltText, drawContrast, drawReadingOrder];

@Component({
  selector: 'app-monolith-canvas',
  standalone: true,
  template: `<canvas #glCanvas></canvas>`,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
      }
      canvas {
        width: 100%;
        height: 100%;
        display: block;
      }
    `,
  ],
})
export class MonolithCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('glCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() opacity = 0.38;

  private ngZone = inject(NgZone);
  private elRef = inject(ElementRef);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private monolith!: THREE.Mesh;

  private faceCanvases: HTMLCanvasElement[] = [];
  private faceCtxs: CanvasRenderingContext2D[] = [];
  private faceTextures: THREE.CanvasTexture[] = [];

  private animId = 0;
  private startTime = 0;
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private isVisible = true;
  private observer?: IntersectionObserver;
  private onMouseMove = (e: MouseEvent) => {
    this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  private onResize = () => this.handleResize();

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initScene();
      this.initFaceTextures();
      this.initMonolith();
      this.startTime = performance.now() / 1000;
      this.animate();
      this.setupListeners();
    });
  }

  // ── Scene ───────────────────────────────────────────────────────────────
  private initScene() {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || 800;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    this.camera.position.set(0, 0.3, 5.5);

    // Lighting — premium, understated
    const ambient = new THREE.AmbientLight(0x404050, 0.6);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xdddde8, 1.4);
    keyLight.position.set(4, 5, 3);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6366f1, 0.25);
    fillLight.position.set(-3, 1, 2);
    this.scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xa855f7, 0.4, 12);
    rimLight.position.set(0, -2, 4);
    this.scene.add(rimLight);

    // Subtle top accent
    const topAccent = new THREE.PointLight(0x6366f1, 0.2, 10);
    topAccent.position.set(2, 4, 1);
    this.scene.add(topAccent);
  }

  // ── Face Textures ───────────────────────────────────────────────────────
  private initFaceTextures() {
    for (let i = 0; i < 6; i++) {
      const [canvas, ctx] = createFaceCanvas();
      this.faceCanvases.push(canvas);
      this.faceCtxs.push(ctx);
      clearFace(ctx);
      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      this.faceTextures.push(tex);
    }
  }

  // ── Monolith ────────────────────────────────────────────────────────────
  private initMonolith() {
    // Slightly tall monolith (2:2.6:2 proportions)
    const geo = new THREE.BoxGeometry(2, 2.6, 2, 1, 1, 1);

    // One material per face: +X, -X, +Y, -Y, +Z, -Z
    const materials = this.faceTextures.map(
      (tex) =>
        new THREE.MeshPhysicalMaterial({
          map: tex,
          color: 0xffffff,
          metalness: 0.55,
          roughness: 0.42,
          clearcoat: 0.08,
          clearcoatRoughness: 0.5,
          reflectivity: 0.4,
          envMapIntensity: 0.4,
        })
    );

    this.monolith = new THREE.Mesh(geo, materials);
    this.monolith.castShadow = true;

    // Edge highlight wireframe (very subtle)
    const edgeGeo = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.08,
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    this.monolith.add(edges);

    this.scene.add(this.monolith);
  }

  // ── Animation Loop ──────────────────────────────────────────────────────
  private animate = () => {
    this.animId = requestAnimationFrame(this.animate);
    if (!this.isVisible) return;

    const now = performance.now() / 1000;
    const t = now - this.startTime;

    // Smooth mouse follow
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.03;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.03;

    // Monolith rotation — 30s per full revolution + mouse parallax influence
    const baseRotY = (t / 30) * Math.PI * 2;
    this.monolith.rotation.y = baseRotY + this.mouseX * 0.15;
    this.monolith.rotation.x = Math.sin(t * 0.3) * 0.05 + this.mouseY * 0.08;

    // Dynamic responsive position: scales smoothly across desktop, laptop, and mobile screens
    const w = window.innerWidth;
    let baseOffsetX = 0;
    if (w > 1300) {
      baseOffsetX = -1.25;
    } else if (w > 900) {
      baseOffsetX = -0.85;
    } else {
      baseOffsetX = 0;
    }

    this.monolith.position.y = Math.sin(t * 0.5) * 0.12;
    this.monolith.position.x = baseOffsetX + Math.sin(t * 0.3) * 0.04;

    // Camera subtle parallax
    this.camera.position.x = baseOffsetX * 0.4 + this.mouseX * 0.2;
    this.camera.position.y = 0.3 - this.mouseY * 0.15;
    this.camera.lookAt(baseOffsetX * 0.8, 0, 0);

    // Update face textures (~15 FPS for performance)
    if (Math.floor(t * 15) !== Math.floor((t - 1 / 60) * 15)) {
      for (let i = 0; i < 6; i++) {
        FACE_DRAWERS[i](this.faceCtxs[i], t);
        this.faceTextures[i].needsUpdate = true;
      }
    }

    // Edge light sweep (subtle indigo glow traveling along edges)
    const edgeLine = this.monolith.children[0] as THREE.LineSegments;
    if (edgeLine) {
      const sweepAlpha = 0.04 + Math.sin(t * 0.8) * 0.04;
      (edgeLine.material as THREE.LineBasicMaterial).opacity = sweepAlpha;
    }

    this.renderer.render(this.scene, this.camera);
  };

  // ── Event Listeners ─────────────────────────────────────────────────────
  private setupListeners() {
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    // IntersectionObserver: pause when off-screen
    this.observer = new IntersectionObserver(
      (entries) => {
        this.isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    this.observer.observe(this.elRef.nativeElement);
  }

  private handleResize() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || 800;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // ── Cleanup ─────────────────────────────────────────────────────────────
  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
    this.observer?.disconnect();

    // Dispose Three.js resources
    this.faceTextures.forEach((t) => t.dispose());
    if (this.monolith) {
      (this.monolith.geometry as THREE.BufferGeometry).dispose();
      const mats = this.monolith.material as THREE.Material[];
      mats.forEach((m) => m.dispose());
    }
    this.renderer?.dispose();
  }
}
