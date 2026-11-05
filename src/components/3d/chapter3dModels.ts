import * as THREE from 'three';
import { ModelType3D, TopicDetail } from './chapter3dData';

type SurfaceKind =
  | 'wood'
  | 'stone'
  | 'metal'
  | 'gold'
  | 'glass'
  | 'water'
  | 'foliage'
  | 'enamel'
  | 'pcb'
  | 'fabric'
  | 'plastic'
  | 'emissive';

const textureCache: Record<string, THREE.CanvasTexture> = {};

function getProceduralTexture(kind: 'wood' | 'stone' | 'metal' | 'pcb' | 'foliage' | 'water'): THREE.CanvasTexture {
  if (textureCache[kind]) return textureCache[kind];

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (kind === 'wood') {
      ctx.fillStyle = '#b48a60';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 90; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(80, 45, 15, 0.18)' : 'rgba(255, 220, 180, 0.12)';
        ctx.fillRect(0, (i * 3) % 256, 256, 2);
      }
    } else if (kind === 'stone') {
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 900; i++) {
        const v = 100 + Math.floor(Math.random() * 120);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
      }
    } else if (kind === 'metal') {
      const grad = ctx.createLinearGradient(0, 0, 256, 256);
      grad.addColorStop(0, '#d1d5db');
      grad.addColorStop(0.5, '#f9fafb');
      grad.addColorStop(1, '#9ca3af');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      for (let y = 0; y < 256; y += 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }
    } else if (kind === 'pcb') {
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      for (let i = 16; i < 256; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.moveTo(0, i);
        ctx.lineTo(256, i);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(i, i, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (kind === 'foliage') {
      ctx.fillStyle = '#86efac';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = 'rgba(20, 83, 45, 0.25)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 256; i += 24) {
        ctx.beginPath();
        ctx.moveTo(128, i);
        ctx.lineTo(0, i - 20);
        ctx.moveTo(128, i);
        ctx.lineTo(256, i - 20);
        ctx.stroke();
      }
    } else if (kind === 'water') {
      ctx.fillStyle = '#7dd3fc';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 3;
      for (let y = 12; y < 256; y += 24) {
        ctx.beginPath();
        ctx.arc(128, y, 60, 0, Math.PI);
        ctx.stroke();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  textureCache[kind] = tex;
  return tex;
}

export function pbrMat(color: number, kind: SurfaceKind = 'plastic', wireframe = false): THREE.MeshPhysicalMaterial {
  switch (kind) {
    case 'wood': {
      const t = getProceduralTexture('wood');
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.62,
        metalness: 0.05,
        bumpMap: t,
        bumpScale: 0.035,
        clearcoat: 0.2,
        wireframe,
      });
    }
    case 'stone': {
      const t = getProceduralTexture('stone');
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.78,
        metalness: 0.08,
        bumpMap: t,
        bumpScale: 0.05,
        wireframe,
      });
    }
    case 'metal': {
      const t = getProceduralTexture('metal');
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.22,
        metalness: 0.85,
        bumpMap: t,
        bumpScale: 0.015,
        clearcoat: 0.4,
        wireframe,
      });
    }
    case 'gold': {
      const t = getProceduralTexture('metal');
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.16,
        metalness: 0.92,
        bumpMap: t,
        bumpScale: 0.01,
        clearcoat: 0.65,
        emissive: color,
        emissiveIntensity: 0.12,
        wireframe,
      });
    }
    case 'glass':
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.06,
        metalness: 0.1,
        transparent: true,
        opacity: 0.58,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        wireframe,
      });
    case 'water': {
      const t = getProceduralTexture('water');
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.12,
        metalness: 0.15,
        transparent: true,
        opacity: 0.82,
        bumpMap: t,
        bumpScale: 0.03,
        clearcoat: 0.95,
        wireframe,
      });
    }
    case 'foliage': {
      const t = getProceduralTexture('foliage');
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.42,
        metalness: 0.05,
        bumpMap: t,
        bumpScale: 0.03,
        clearcoat: 0.35,
        wireframe,
      });
    }
    case 'enamel':
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.1,
        metalness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        wireframe,
      });
    case 'pcb': {
      const t = getProceduralTexture('pcb');
      return new THREE.MeshPhysicalMaterial({
        color,
        map: t,
        roughness: 0.3,
        metalness: 0.45,
        clearcoat: 0.5,
        wireframe,
      });
    }
    case 'emissive':
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.2,
        metalness: 0.2,
        emissive: color,
        emissiveIntensity: 0.55,
        wireframe,
      });
    case 'fabric':
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.85,
        metalness: 0.02,
        sheen: 0.6,
        wireframe,
      });
    default:
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.28,
        metalness: 0.12,
        clearcoat: 0.45,
        wireframe,
      });
  }
}

/**
 * Builds a realistic chapter-matched 3D Diorama Pedestal under the centerpiece model.
 */
export function buildEnvironmentStage(preset: TopicDetail['environmentPreset'], wireframe = false): THREE.Group {
  const stage = new THREE.Group();
  stage.position.y = -1.55;

  if (preset === 'nature') {
    const turf = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.3, 0.32, 40), pbrMat(0x16a34a, 'foliage', wireframe));
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 2.9, 0.35, 40), pbrMat(0x78350f, 'stone', wireframe));
    soil.position.y = -0.32;
    stage.add(turf, soil);
  } else if (preset === 'heritage') {
    const plinth1 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.5, 0.3, 8), pbrMat(0xd97706, 'stone', wireframe));
    const plinth2 = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.1, 0.22, 8), pbrMat(0xfef3c7, 'stone', wireframe));
    plinth2.position.y = 0.22;
    const goldRim = new THREE.Mesh(new THREE.TorusGeometry(2.95, 0.05, 12, 48), pbrMat(0xfacc15, 'gold', wireframe));
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.32;
    stage.add(plinth1, plinth2, goldRim);
  } else if (preset === 'cyber_tech') {
    const pcbBase = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 0.28, 32), pbrMat(0x10b981, 'pcb', wireframe));
    const holoRing1 = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.05, 16, 64), pbrMat(0x38bdf8, 'emissive', wireframe));
    holoRing1.rotation.x = Math.PI / 2;
    holoRing1.position.y = 0.16;
    const holoRing2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.04, 16, 64), pbrMat(0xa855f7, 'emissive', wireframe));
    holoRing2.rotation.x = Math.PI / 2;
    holoRing2.position.y = 0.18;
    stage.add(pcbBase, holoRing1, holoRing2);
  } else if (preset === 'ocean') {
    const sea = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.35, 0.32, 40), pbrMat(0x0284c7, 'water', wireframe));
    const sand = new THREE.Mesh(new THREE.CylinderGeometry(3.35, 3.0, 0.25, 40), pbrMat(0xf59e0b, 'stone', wireframe));
    sand.position.y = -0.26;
    stage.add(sea, sand);
  } else if (preset === 'alpine') {
    const rock = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.5, 0.35, 12), pbrMat(0x64748b, 'stone', wireframe));
    const snow = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 3.15, 0.18, 12), pbrMat(0xf8fafc, 'enamel', wireframe));
    snow.position.y = 0.22;
    stage.add(rock, snow);
  } else if (preset === 'playroom') {
    const wood = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 0.3, 40), pbrMat(0xd97706, 'wood', wireframe));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.07, 16, 48), pbrMat(0xec4899, 'plastic', wireframe));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.15;
    stage.add(wood, rim);
  } else {
    // science_lab default
    const labBase = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 0.28, 40), pbrMat(0x1e293b, 'metal', wireframe));
    const labRing = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.05, 16, 64), pbrMat(0x38bdf8, 'emissive', wireframe));
    labRing.rotation.x = Math.PI / 2;
    labRing.position.y = 0.16;
    stage.add(labBase, labRing);
  }

  return stage;
}

/**
 * Builds the realistic, multi-part 3D centerpiece model with physically-based materials.
 */
export function buildRealistic3DModel(modelType: ModelType3D, wireframe = false): THREE.Group {
  const group = new THREE.Group();

  const stdMat = (color: number, roughness = 0.3, metalness = 0.2): THREE.MeshPhysicalMaterial => {
    if (metalness >= 0.7) return pbrMat(color, color === 0xfacc15 || color === 0xfbbf24 || color === 0xf59e0b ? 'gold' : 'metal', wireframe);
    if (roughness >= 0.65) return pbrMat(color, color === 0x92400e || color === 0x78350f ? 'wood' : 'stone', wireframe);
    if (color === 0x16a34a || color === 0x15803d || color === 0x22c55e) return pbrMat(color, 'foliage', wireframe);
    if (color === 0x0284c7 || color === 0x38bdf8) return pbrMat(color, 'water', wireframe);
    return pbrMat(color, 'enamel', wireframe);
  };

  switch (modelType) {
    // =========================================================================
    // NEW CODING & AI 3D TEMPLATES
    // =========================================================================
    case 'computer_memory_ram': {
      // 3D Motherboard DDR5 RAM Stick with Gold Contacts + Silicon CPU Core + USB Pen Drive
      const ramBoard = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.1, 0.14), pbrMat(0x10b981, 'pcb', wireframe));
      ramBoard.position.set(0, 0.55, -0.2);
      group.add(ramBoard);

      // 4 Black NAND Memory IC Chips on the RAM stick
      for (let i = 0; i < 4; i++) {
        const chip = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.22), pbrMat(0x0f172a, 'metal', wireframe));
        chip.position.set(-1.15 + i * 0.76, 0.6, -0.2);
        group.add(chip);
      }

      // Gold Edge Connector Pins along bottom of RAM
      for (let p = 0; p < 14; p++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.16), pbrMat(0xfacc15, 'gold', wireframe));
        pin.position.set(-1.45 + p * 0.22, -0.02, -0.2);
        group.add(pin);
      }

      // Silicon CPU Processor with Brushed Aluminum IHS Lid
      const cpuSub = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.14, 1.4), pbrMat(0x059669, 'pcb', wireframe));
      cpuSub.position.set(-0.9, -0.75, 0.75);
      const cpuLid = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 1.1), pbrMat(0xe2e8f0, 'metal', wireframe));
      cpuLid.position.set(-0.9, -0.62, 0.75);
      group.add(cpuSub, cpuLid);

      // USB Flash Pen Drive
      const usbBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.6), pbrMat(0x2563eb, 'enamel', wireframe));
      usbBody.position.set(1.0, -0.65, 0.75);
      const usbPlug = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.24, 0.42), pbrMat(0xcbd5e1, 'metal', wireframe));
      usbPlug.position.set(1.75, -0.65, 0.75);
      group.add(usbBody, usbPlug);
      break;
    }

    case 'desktop_os_gui': {
      // 3D Widescreen Desktop Monitor + Windows GUI + Yellow Folders + Keyboard
      const bezel = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.1, 0.18), pbrMat(0x1e293b, 'metal', wireframe));
      bezel.position.set(0, 0.45, -0.3);
      const screen = new THREE.Mesh(new THREE.BoxGeometry(3.15, 1.85, 0.2), pbrMat(0x0284c7, 'enamel', wireframe));
      screen.position.set(0, 0.45, -0.28);
      const taskbar = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.2, 0.22), pbrMat(0x0f172a, 'glass', wireframe));
      taskbar.position.set(0, -0.36, -0.26);
      const standNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.9, 16), pbrMat(0x94a3b8, 'metal', wireframe));
      standNeck.position.set(0, -0.8, -0.35);
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.9), pbrMat(0x94a3b8, 'metal', wireframe));
      standBase.position.set(0, -1.2, -0.35);
      group.add(bezel, screen, taskbar, standNeck, standBase);

      // 3D Floating Yellow File Folders on Screen
      [-0.85, 0, 0.85].forEach((fx, i) => {
        const folder = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.12), pbrMat(0xfacc15, 'gold', wireframe));
        folder.position.set(fx, 0.55 + (i % 2) * 0.25, -0.12);
        group.add(folder);
      });

      // Mechanical Keyboard in front
      const kb = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.75), pbrMat(0x334155, 'metal', wireframe));
      kb.position.set(0, -1.15, 0.65);
      kb.rotation.x = 0.12;
      group.add(kb);
      break;
    }

    case 'word_processor_doc': {
      // 3D Floating Paper Document + Bold/Italic Formatting Blocks + Fountain Pen
      const page = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.9, 0.12), pbrMat(0xffffff, 'enamel', wireframe));
      page.rotation.x = -0.2;
      group.add(page);

      // Colored Header & Text Paragraph Lines
      const headerBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.26, 0.15), pbrMat(0x2563eb, 'enamel', wireframe));
      headerBar.position.set(0, 0.95, 0.2);
      headerBar.rotation.x = -0.2;
      group.add(headerBar);

      for (let l = 0; l < 5; l++) {
        const line = new THREE.Mesh(
          new THREE.BoxGeometry(l === 4 ? 1.1 : 1.75, 0.1, 0.15),
          pbrMat(l === 0 ? 0xf59e0b : 0x475569, 'plastic', wireframe)
        );
        line.position.set(l === 4 ? -0.32 : 0, 0.45 - l * 0.32, 0.08 - l * 0.06);
        line.rotation.x = -0.2;
        group.add(line);
      }

      // Metallic Stylus Pen
      const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.03, 1.9, 16), pbrMat(0xfacc15, 'gold', wireframe));
      pen.rotation.z = 0.55;
      pen.position.set(1.35, 0.2, 0.4);
      group.add(pen);
      break;
    }

    case 'flowchart_algorithm': {
      // 3D Connected Flowchart: Start Oval -> Input Box -> Decision Diamond -> End Oval
      const startNode = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 24), pbrMat(0x10b981, 'enamel', wireframe));
      startNode.rotation.x = Math.PI / 2;
      startNode.position.set(0, 1.35, 0);

      const processNode = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.65, 0.32), pbrMat(0x3b82f6, 'enamel', wireframe));
      processNode.position.set(0, 0.35, 0);

      const decisionDiamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), pbrMat(0xf59e0b, 'gold', wireframe));
      decisionDiamond.position.set(0, -0.75, 0);

      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 12), pbrMat(0x38bdf8, 'emissive', wireframe));
      pipe.position.set(0, 0.3, -0.1);

      group.add(startNode, processNode, decisionDiamond, pipe);
      break;
    }

    case 'presentation_stage': {
      // 3D Slide Screen with 3D Bar Graph & Pie Chart + Projector
      const screenBoard = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.1, 0.14), pbrMat(0xf8fafc, 'enamel', wireframe));
      screenBoard.position.set(0, 0.35, -0.4);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.3, 0.1), pbrMat(0x3b82f6, 'metal', wireframe));
      frame.position.set(0, 0.35, -0.45);
      group.add(screenBoard, frame);

      // 3D Rising Bar Chart Columns on the Slide
      const barColors = [0xef4444, 0xf59e0b, 0x10b981, 0x8b5cf6];
      barColors.forEach((col, i) => {
        const h = 0.5 + i * 0.32;
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.38, h, 0.25), pbrMat(col, 'enamel', wireframe));
        bar.position.set(-0.9 + i * 0.55, -0.45 + h / 2, -0.25);
        group.add(bar);
      });
      break;
    }

    case 'scratch_block_coding': {
      // 3D Interlocking Visual Code Blocks + Green Flag + Cute 3D Cat Sprite
      const blockColors = [0xf59e0b, 0x3b82f6, 0x8b5cf6, 0x10b981];
      blockColors.forEach((col, i) => {
        const y = 1.0 - i * 0.58;
        const b = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.5, 0.45), pbrMat(col, 'enamel', wireframe));
        b.position.set(-0.7, y, 0);
        const notch = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.45, 16), pbrMat(col, 'enamel', wireframe));
        notch.position.set(-1.1, y - 0.25, 0);
        group.add(b, notch);
      });

      // Green Flag Trigger & Cute Orange Sprite Character
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 12), pbrMat(0xe2e8f0, 'metal', wireframe));
      pole.position.set(1.2, 0.5, 0);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.1), pbrMat(0x22c55e, 'emissive', wireframe));
      flag.position.set(1.6, 1.1, 0);

      const spriteCat = new THREE.Mesh(new THREE.SphereGeometry(0.58, 20, 20), pbrMat(0xf97316, 'enamel', wireframe));
      spriteCat.position.set(1.2, -0.55, 0.3);
      group.add(pole, flag, spriteCat);
      break;
    }

    case 'ai_humanoid_robot': {
      // Realistic 3D AI Humanoid Robot with Glowing Visor, Neural Core & Servo Limbs
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.58, 1.4, 24), pbrMat(0xf8fafc, 'enamel', wireframe));
      torso.position.y = 0;

      const core = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), pbrMat(0x38bdf8, 'emissive', wireframe));
      core.position.set(0, 0.15, 0.55);

      const head = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.82, 0.85), pbrMat(0xf8fafc, 'enamel', wireframe));
      head.position.set(0, 1.25, 0);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.38, 0.88), pbrMat(0x0f172a, 'glass', wireframe));
      visor.position.set(0, 1.25, 0.02);

      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), pbrMat(0x38bdf8, 'emissive', wireframe));
      eyeL.position.set(-0.22, 1.25, 0.45);
      const eyeR = eyeL.clone();
      eyeR.position.x = 0.22;

      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12), pbrMat(0x94a3b8, 'metal', wireframe));
      antenna.position.set(0, 1.85, 0);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), pbrMat(0xfacc15, 'emissive', wireframe));
      tip.position.set(0, 2.1, 0);

      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.2, 16), pbrMat(0x94a3b8, 'metal', wireframe));
      armL.position.set(-1.05, 0.05, 0);
      armL.rotation.z = 0.25;
      const armR = armL.clone();
      armR.position.x = 1.05;
      armR.rotation.z = -0.25;

      group.add(torso, core, head, visor, eyeL, eyeR, antenna, tip, armL, armR);
      break;
    }

    // =========================================================================
    // NEW ENGLISH LITERATURE (FOCUS 4) 3D TEMPLATES
    // =========================================================================
    case 'secret_garden_key': {
      // Ornate Antique Brass Key + Ivy Stone Garden Archway + Blooming Roses
      const archL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.4, 0.55), pbrMat(0x64748b, 'stone', wireframe));
      archL.position.set(-1.35, 0, -0.3);
      const archR = archL.clone();
      archR.position.x = 1.35;
      const archTop = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.28, 16, 32, Math.PI), pbrMat(0x64748b, 'stone', wireframe));
      archTop.position.set(0, 1.15, -0.3);

      // Ornate Golden Brass Key in center foreground
      const keyBow = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.11, 16, 32), pbrMat(0xfacc15, 'gold', wireframe));
      keyBow.position.set(-0.75, 0.1, 0.5);
      const keyShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.65, 16), pbrMat(0xfacc15, 'gold', wireframe));
      keyShaft.rotation.z = Math.PI / 2;
      keyShaft.position.set(0.3, 0.1, 0.5);
      const keyBit = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, 0.1), pbrMat(0xfacc15, 'gold', wireframe));
      keyBit.position.set(0.9, -0.12, 0.5);

      // Blooming Red Roses
      [-1.35, 1.35, 0].forEach((rx, i) => {
        const rose = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 1), pbrMat(0xe11d48, 'enamel', wireframe));
        rose.position.set(rx, i === 2 ? 2.45 : 0.8, -0.05);
        group.add(rose);
      });

      group.add(archL, archR, archTop, keyBow, keyShaft, keyBit);
      break;
    }

    case 'pied_piper_flute': {
      // Golden Magic Flute + Medieval Hamelin Clock Tower
      const tower = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.3, 1.2), pbrMat(0xb45309, 'stone', wireframe));
      tower.position.set(-0.95, 0.05, -0.3);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.2, 4), pbrMat(0x1e293b, 'stone', wireframe));
      spire.position.set(-0.95, 1.75, -0.3);
      spire.rotation.y = Math.PI / 4;

      const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 2.8, 24), pbrMat(0xfacc15, 'gold', wireframe));
      flute.rotation.z = Math.PI / 3;
      flute.position.set(0.55, 0.2, 0.4);

      // Glowing Musical Note Orbs
      [0.4, 1.0, 1.6].forEach((nx, i) => {
        const note = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), pbrMat(0x38bdf8, 'emissive', wireframe));
        note.position.set(nx, 0.7 + i * 0.35, 0.5);
        group.add(note);
      });

      group.add(tower, spire, flute);
      break;
    }

    case 'isro_mars_rocket': {
      // Golden Foil ISRO Mangalyaan Orbiter + Solar Panel + Red Planet Mars
      const mars = new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 32), pbrMat(0xea580c, 'stone', wireframe));
      mars.position.set(1.05, 0.1, -0.2);

      const probe = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.85), pbrMat(0xfacc15, 'gold', wireframe));
      probe.position.set(-1.1, 0.35, 0.3);
      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.28, 24), pbrMat(0xf8fafc, 'metal', wireframe));
      dish.position.set(-1.1, 0.95, 0.3);
      const solarWing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.65), pbrMat(0x1d4ed8, 'metal', wireframe));
      solarWing.position.set(-2.1, 0.35, 0.3);

      group.add(mars, probe, dish, solarWing);
      break;
    }

    case 'tom_paint_fence': {
      // Wooden Picket Fence (Half Whitewashed, Half Cedar Wood) + Paint Bucket & Brush
      for (let i = -3; i <= 3; i++) {
        const isPainted = i <= 0;
        const picket = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 2.1, 0.14),
          pbrMat(isPainted ? 0xffffff : 0xb45309, isPainted ? 'enamel' : 'wood', wireframe)
        );
        picket.position.set(i * 0.46, 0, -0.2);
        group.add(picket);
      }
      const rail = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.2, 0.18), pbrMat(0x92400e, 'wood', wireframe));
      rail.position.set(0, 0.3, -0.25);

      const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.38, 0.85, 24), pbrMat(0xcbd5e1, 'metal', wireframe));
      bucket.position.set(0.85, -0.65, 0.65);
      const apple = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), pbrMat(0xef4444, 'enamel', wireframe));
      apple.position.set(-0.9, -0.75, 0.65);

      group.add(rail, bucket, apple);
      break;
    }

    case 'heidi_alps_goats': {
      // Swiss Alps Snow Peak + Timber Chalet + White Mountain Goat
      const peak = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.5, 7), pbrMat(0x64748b, 'stone', wireframe));
      peak.position.set(-0.85, 0.2, -0.5);
      const snowCap = new THREE.Mesh(new THREE.ConeGeometry(0.68, 1.1, 7), pbrMat(0xffffff, 'enamel', wireframe));
      snowCap.position.set(-0.85, 1.0, -0.5);

      const chalet = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.0), pbrMat(0x92400e, 'wood', wireframe));
      chalet.position.set(0.95, -0.55, -0.1);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.75, 4), pbrMat(0xb91c1c, 'wood', wireframe));
      roof.position.set(0.95, 0.25, -0.1);
      roof.rotation.y = Math.PI / 4;

      const goatBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.42, 0.35), pbrMat(0xf8fafc, 'enamel', wireframe));
      goatBody.position.set(0.1, -0.65, 0.65);
      const goatHead = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.28), pbrMat(0xf8fafc, 'enamel', wireframe));
      goatHead.position.set(0.4, -0.4, 0.65);

      group.add(peak, snowCap, chalet, roof, goatBody, goatHead);
      break;
    }

    case 'kalam_missile_island': {
      // Agni/SLV-3 Aerospace Rocket + Books Stack + Soaring White Seabird
      const rocketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 2.4, 24), pbrMat(0xf8fafc, 'metal', wireframe));
      rocketBody.position.set(-0.6, 0.2, 0);
      const rocketNose = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.9, 24), pbrMat(0xf97316, 'enamel', wireframe));
      rocketNose.position.set(-0.6, 1.85, 0);

      const book1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.24, 0.9), pbrMat(0x2563eb, 'enamel', wireframe));
      book1.position.set(0.95, -0.85, 0.2);
      const book2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.24, 0.85), pbrMat(0x16a34a, 'enamel', wireframe));
      book2.position.set(0.95, -0.6, 0.2);

      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.08, 0.3), pbrMat(0xffffff, 'enamel', wireframe));
      wingL.position.set(0.8, 1.1, 0.2);
      wingL.rotation.z = 0.35;
      const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.08, 0.3), pbrMat(0xffffff, 'enamel', wireframe));
      wingR.position.set(1.4, 1.1, 0.2);
      wingR.rotation.z = -0.35;

      group.add(rocketBody, rocketNose, book1, book2, wingL, wingR);
      break;
    }

    case 'magic_brass_pot': {
      // Glowing Hammered Brass Cauldron Pot Overflowing with Golden Coins
      const potBelly = new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 24), pbrMat(0xd97706, 'gold', wireframe));
      potBelly.scale.set(1.1, 0.92, 1.1);
      potBelly.position.y = -0.2;

      const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.16, 16, 36), pbrMat(0xfacc15, 'gold', wireframe));
      potRim.rotation.x = Math.PI / 2;
      potRim.position.y = 0.65;

      for (let c = 0; c < 12; c++) {
        const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.1, 20), pbrMat(0xfde047, 'gold', wireframe));
        const a = (c / 12) * Math.PI * 2;
        coin.position.set(Math.cos(a) * 0.5, 0.8 + (c % 3) * 0.18, Math.sin(a) * 0.5);
        coin.rotation.set(0.4, a, 0.3);
        group.add(coin);
      }

      group.add(potBelly, potRim);
      break;
    }

    // =========================================================================
    // NEW HINDI, VALUE EDUCATION & MALAYALAM 3D TEMPLATES
    // =========================================================================
    case 'udan_khatola_flying': {
      // Magical Flying Royal Gondola Carriage & Balloon Canopy with Clouds
      const gondola = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.8, 0.85, 8), pbrMat(0x92400e, 'wood', wireframe));
      gondola.position.y = -0.55;

      const balloon = new THREE.Mesh(new THREE.SphereGeometry(1.35, 28, 28), pbrMat(0xec4899, 'enamel', wireframe));
      balloon.position.y = 1.35;
      const goldBand = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.1, 16, 36), pbrMat(0xfacc15, 'gold', wireframe));
      goldBand.rotation.x = Math.PI / 2;
      goldBand.position.y = 1.35;

      [-0.7, 0.7].forEach((rx) => {
        const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), pbrMat(0xfacc15, 'gold', wireframe));
        rope.position.set(rx, 0.25, 0);
        group.add(rope);
      });

      group.add(gondola, balloon, goldBand);
      break;
    }

    case 'birbal_royal_throne': {
      // Ornate Mughal Royal Throne + Sandstone Arch + Golden Crown
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 1.4), pbrMat(0xfacc15, 'gold', wireframe));
      seat.position.y = -0.55;
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.22, 1.2), pbrMat(0xdc2626, 'fabric', wireframe));
      cushion.position.y = -0.25;
      const backrest = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.25, 24), pbrMat(0xfacc15, 'gold', wireframe));
      backrest.rotation.x = Math.PI / 2;
      backrest.position.set(0, 0.55, -0.58);
      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        pbrMat(0xd97706, 'gold', wireframe)
      );
      canopy.position.set(0, 1.35, -0.2);

      group.add(seat, cushion, backrest, canopy);
      break;
    }

    case 'unity_doves_net': {
      // Flock of White Doves Lifting Golden Net Together
      const netRing = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.06, 12, 36), pbrMat(0xfacc15, 'gold', wireframe));
      netRing.rotation.x = Math.PI / 2;
      netRing.position.y = -0.2;
      group.add(netRing);

      for (let d = 0; d < 5; d++) {
        const a = (d / 5) * Math.PI * 2;
        const dove = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.85, 12), pbrMat(0xffffff, 'enamel', wireframe));
        dove.rotation.x = Math.PI / 2;
        dove.position.set(Math.cos(a) * 1.2, 0.85 + (d % 2) * 0.25, Math.sin(a) * 1.2);
        group.add(dove);
      }
      break;
    }

    case 'kerala_snake_boat': {
      // 3D Kerala Chundan Vallam Snake Boat + Onam Pookkalam + Brass Nilavilakku
      const hull = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.32, 0.65), pbrMat(0x78350f, 'wood', wireframe));
      hull.position.set(0, -0.35, 0.3);
      const prow = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.6, 16), pbrMat(0xfacc15, 'gold', wireframe));
      prow.rotation.z = -0.45;
      prow.position.set(1.85, 0.35, 0.3);

      // Pookkalam Floral Carpet Disc
      const pookkalam1 = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.12, 24), pbrMat(0xf97316, 'enamel', wireframe));
      pookkalam1.position.set(-0.7, -0.95, -0.5);
      const pookkalam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.16, 24), pbrMat(0xfacc15, 'enamel', wireframe));
      pookkalam2.position.set(-0.7, -0.92, -0.5);

      // Nilavilakku Lamp
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.4, 1.35, 20), pbrMat(0xfacc15, 'gold', wireframe));
      lamp.position.set(1.0, -0.3, -0.5);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 12), pbrMat(0xf97316, 'emissive', wireframe));
      flame.position.set(1.0, 0.55, -0.5);

      group.add(hull, prow, pookkalam1, pookkalam2, lamp, flame);
      break;
    }

    case 'changathi_garden_bugs': {
      // 3D Red-Spotted Mushroom House (കൂൺ) + Butterfly (പൂമ്പാറ്റ) + Snail (ഒച്ച്)
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 1.35, 24), pbrMat(0xfef9c3, 'enamel', wireframe));
      stalk.position.set(-0.4, -0.4, 0);
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(1.35, 28, 20, 0, Math.PI * 2, 0, Math.PI / 1.8),
        pbrMat(0xef4444, 'enamel', wireframe)
      );
      cap.position.set(-0.4, 0.25, 0);

      // White Polka Dots on Mushroom Cap
      [
        [-0.4, 1.45, 0],
        [-0.95, 1.1, 0.55],
        [0.2, 1.1, 0.55],
        [-0.4, 1.1, -0.65],
      ].forEach(([dx, dy, dz]) => {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), pbrMat(0xffffff, 'enamel', wireframe));
        dot.position.set(dx, dy, dz);
        group.add(dot);
      });

      // Colorful Butterfly
      const wing1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 16), pbrMat(0xec4899, 'emissive', wireframe));
      wing1.position.set(1.15, 1.1, 0.3);
      wing1.rotation.z = 0.5;
      const wing2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 16), pbrMat(0xfacc15, 'emissive', wireframe));
      wing2.position.set(1.65, 1.1, 0.3);
      wing2.rotation.z = -0.5;

      // Cute Snail (ഒച്ച്)
      const shell = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.18, 16, 24), pbrMat(0xd97706, 'enamel', wireframe));
      shell.position.set(1.25, -0.65, 0.5);

      group.add(stalk, cap, wing1, wing2, shell);
      break;
    }

    case 'malayalam_vowels_elephant': {
      // 3D Kerala Elephant (ആന) with Golden Nettipattam Caparison & Vowel Block
      const body = new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 24), pbrMat(0x475569, 'stone', wireframe));
      body.scale.set(1.3, 1.0, 0.95);
      body.position.set(-0.2, -0.1, 0);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.72, 24, 24), pbrMat(0x475569, 'stone', wireframe));
      head.position.set(0.95, 0.35, 0);

      // Golden Nettipattam on forehead
      const netti = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.85, 16), pbrMat(0xfacc15, 'gold', wireframe));
      netti.rotation.z = -Math.PI / 2;
      netti.position.set(1.55, 0.45, 0);

      // White Tusks
      const tuskL = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.75, 12), pbrMat(0xffffff, 'enamel', wireframe));
      tuskL.rotation.z = -1.1;
      tuskL.position.set(1.55, -0.05, 0.32);
      const tuskR = tuskL.clone();
      tuskR.position.z = -0.32;

      group.add(body, head, netti, tuskL, tuskR);
      break;
    }

    // =========================================================================
    // NEW UKG GENERAL AWARENESS, MATH & VALUE EDUCATION 3D TEMPLATES
    // =========================================================================
    case 'ukg_sweet_home_school': {
      // 3D Family House with Terracotta Roof, Glowing Windows, Door & School Bus
      const walls = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.5, 1.8), pbrMat(0xfef08a, 'stone', wireframe));
      walls.position.set(-0.45, -0.25, 0);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.85, 1.15, 4), pbrMat(0xdc2626, 'wood', wireframe));
      roof.position.set(-0.45, 1.05, 0);
      roof.rotation.y = Math.PI / 4;
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.85, 0.1), pbrMat(0x92400e, 'wood', wireframe));
      door.position.set(-0.45, -0.55, 0.91);

      const schoolBus = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 0.75), pbrMat(0xfacc15, 'enamel', wireframe));
      schoolBus.position.set(1.45, -0.6, 0.4);

      group.add(walls, roof, door, schoolBus);
      break;
    }

    case 'ukg_community_helpers': {
      // 3D Hospital Building with Red Cross + Emergency Ambulance
      const hosp = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.2, 1.5), pbrMat(0xf8fafc, 'enamel', wireframe));
      hosp.position.set(-0.55, 0.1, -0.2);
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.85, 0.15), pbrMat(0xef4444, 'emissive', wireframe));
      crossV.position.set(-0.55, 0.65, 0.56);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.15), pbrMat(0xef4444, 'emissive', wireframe));
      crossH.position.set(-0.55, 0.65, 0.56);

      const ambulance = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.85, 0.85), pbrMat(0xffffff, 'enamel', wireframe));
      ambulance.position.set(1.25, -0.55, 0.4);
      const siren = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.2, 16), pbrMat(0xef4444, 'emissive', wireframe));
      siren.position.set(1.25, -0.05, 0.4);

      group.add(hosp, crossV, crossH, ambulance, siren);
      break;
    }

    case 'ukg_traffic_safety': {
      // 3D Glowing Red-Yellow-Green Traffic Signal + Zebra Crossing Road + Car
      const road = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.15, 2.2), pbrMat(0x334155, 'stone', wireframe));
      road.position.y = -0.95;
      for (let z = -3; z <= 3; z++) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.22), pbrMat(0xffffff, 'enamel', wireframe));
        stripe.position.set(-0.3, -0.92, z * 0.3);
        group.add(stripe);
      }

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.3, 16), pbrMat(0x1e293b, 'metal', wireframe));
      post.position.set(-1.3, 0.2, -0.5);
      const signalBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.55, 0.45), pbrMat(0x0f172a, 'metal', wireframe));
      signalBox.position.set(-1.3, 0.85, -0.5);

      const lightColors = [0xef4444, 0xfacc15, 0x22c55e];
      lightColors.forEach((col, i) => {
        const l = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), pbrMat(col, 'emissive', wireframe));
        l.position.set(-1.3, 1.3 - i * 0.45, -0.25);
        group.add(l);
      });

      const car = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.65, 0.85), pbrMat(0x2563eb, 'enamel', wireframe));
      car.position.set(0.95, -0.55, 0.2);

      group.add(road, post, signalBox, car);
      break;
    }

    case 'ukg_heavy_light_seesaw': {
      // 3D See-Saw Balance comparing Big Heavy Sphere vs Small Light Sphere
      const pivot = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.95, 4), pbrMat(0xf59e0b, 'metal', wireframe));
      pivot.position.y = -0.65;
      const plank = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 0.85), pbrMat(0x10b981, 'wood', wireframe));
      plank.rotation.z = 0.22;
      plank.position.y = -0.15;

      const heavyBig = new THREE.Mesh(new THREE.SphereGeometry(0.78, 24, 24), pbrMat(0x2563eb, 'metal', wireframe));
      heavyBig.position.set(-1.35, 0.25, 0);
      const lightSmall = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 20), pbrMat(0xec4899, 'enamel', wireframe));
      lightSmall.position.set(1.4, 0.5, 0);

      group.add(pivot, plank, heavyBig, lightSmall);
      break;
    }

    case 'shapes_3d_geometry': {
      // 3D PBR Geometric Solids: Sphere, Cube, Cylinder, Cone & Torus
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 32), pbrMat(0xef4444, 'enamel', wireframe));
      sphere.position.set(-1.35, 0.1, 0.2);
      const cube = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 1.15), pbrMat(0x3b82f6, 'enamel', wireframe));
      cube.position.set(0, 0.05, -0.3);
      cube.rotation.y = 0.45;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.45, 28), pbrMat(0xfacc15, 'gold', wireframe));
      cone.position.set(1.35, 0.15, 0.2);
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.2, 16, 36), pbrMat(0x10b981, 'enamel', wireframe));
      torus.position.set(0, 1.35, 0);

      group.add(sphere, cube, cone, torus);
      break;
    }

    case 'moral_gratitude_shrine': {
      // White Marble Sanctuary Arch + Golden Lamp + Blooming Lotus
      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.22, 16, 36, Math.PI), pbrMat(0xf8fafc, 'stone', wireframe));
      arch.position.y = 0.2;
      const lotus = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 1), pbrMat(0xf472b6, 'enamel', wireframe));
      lotus.position.set(0, -0.35, 0);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.65, 16), pbrMat(0xfacc15, 'emissive', wireframe));
      flame.position.set(0, 0.55, 0);

      group.add(arch, lotus, flame);
      break;
    }

    case 'moral_honesty_scales': {
      // 3D Golden Scales of Justice & Truth
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 2.4, 20), pbrMat(0xfacc15, 'gold', wireframe));
      pillar.position.y = 0.1;
      const beam = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 0.14), pbrMat(0xfacc15, 'gold', wireframe));
      beam.position.y = 1.15;
      const panL = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.45, 0.18, 24), pbrMat(0xfacc15, 'gold', wireframe));
      panL.position.set(-1.3, 0.15, 0);
      const panR = panL.clone();
      panR.position.x = 1.3;

      group.add(pillar, beam, panL, panR);
      break;
    }

    case 'moral_kindness_heart': {
      // 3D Glowing Heart of Kindness & Golden Champion Trophy
      const heartL = new THREE.Mesh(new THREE.SphereGeometry(0.68, 24, 24), pbrMat(0xf43f5e, 'enamel', wireframe));
      heartL.position.set(-0.42, 0.55, 0);
      const heartR = heartL.clone();
      heartR.position.x = 0.42;
      const heartBot = new THREE.Mesh(new THREE.ConeGeometry(0.96, 1.35, 24), pbrMat(0xf43f5e, 'enamel', wireframe));
      heartBot.rotation.x = Math.PI;
      heartBot.position.set(0, -0.15, 0);

      const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 0.35, 24), pbrMat(0xfacc15, 'gold', wireframe));
      ped.position.y = -0.95;

      group.add(heartL, heartR, heartBot, ped);
      break;
    }

    // =========================================================================
    // EXISTING MODELS UPGRADED WITH REALISTIC PBR MATERIALS
    // =========================================================================
    case 'monument': {
      const base1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 3.6), stdMat(0xd97706, 0.7));
      base1.position.y = -1.2;
      const base2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.35, 2.8), stdMat(0xf59e0b, 0.65));
      base2.position.y = -0.85;
      group.add(base1, base2);

      [
        [-1.0, -1.0],
        [1.0, -1.0],
        [-1.0, 1.0],
        [1.0, 1.0],
      ].forEach(([px, pz]) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.8, 16), stdMat(0xfde68a, 0.65));
        pillar.position.set(px, 0.2, pz);
        group.add(pillar);
      });

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        stdMat(0xfbbf24, 0.2, 0.8)
      );
      dome.position.y = -0.65;
      const roof = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.22, 2.5), stdMat(0xb45309, 0.7));
      roof.position.y = 1.1;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 16), stdMat(0xfacc15, 0.2, 0.85));
      spire.position.y = 1.65;
      group.add(dome, roof, spire);
      break;
    }

    case 'coins': {
      const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.3, 32), stdMat(0x78350f, 0.7));
      platform.position.y = -1.2;
      const goldCoin = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.22, 32), stdMat(0xfacc15, 0.2, 0.85));
      goldCoin.rotation.x = Math.PI / 2;
      goldCoin.position.set(-0.9, 0.1, 0.3);
      const coinInner = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.26, 8), stdMat(0xd97706, 0.3, 0.75));
      coinInner.rotation.x = Math.PI / 2;
      coinInner.position.set(-0.9, 0.1, 0.3);
      const tablet = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.1, 0.35), stdMat(0x94a3b8, 0.75));
      tablet.position.set(0.2, -0.05, -0.4);
      const potBody = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 24), stdMat(0xea580c, 0.65));
      potBody.position.set(1.1, -0.45, 0.5);
      const potNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.45, 20), stdMat(0xc2410c, 0.65));
      potNeck.position.set(1.1, 0.15, 0.5);
      group.add(platform, goldCoin, coinInner, tablet, potBody, potNeck);
      break;
    }

    case 'scroll': {
      const parchment = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 1.6), pbrMat(0xfef08a, 'wood', wireframe));
      parchment.rotation.x = 0.35;
      const rollerGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.9, 20);
      const rollerLeft = new THREE.Mesh(rollerGeo, pbrMat(0x92400e, 'wood', wireframe));
      rollerLeft.rotation.x = Math.PI / 2 + 0.35;
      rollerLeft.position.set(-1.45, 0, 0);
      const rollerRight = rollerLeft.clone();
      rollerRight.position.x = 1.45;
      const stylus = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.8, 16), pbrMat(0xf59e0b, 'gold', wireframe));
      stylus.rotation.z = -0.6;
      stylus.position.set(0.4, 0.95, 0.2);
      group.add(parchment, rollerLeft, rollerRight, stylus);
      break;
    }

    case 'hourglass': {
      const topFrame = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.2, 24), pbrMat(0xfbbf24, 'gold', wireframe));
      topFrame.position.y = 1.35;
      const botFrame = topFrame.clone();
      botFrame.position.y = -1.35;
      const topBulb = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.25, 24), pbrMat(0x38bdf8, 'glass', wireframe));
      topBulb.rotation.x = Math.PI;
      topBulb.position.y = 0.65;
      const botBulb = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.25, 24), pbrMat(0xfacc15, 'gold', wireframe));
      botBulb.position.y = -0.65;
      group.add(topFrame, botFrame, topBulb, botBulb);
      break;
    }

    case 'magnifier': {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.16, 20, 48), pbrMat(0xfbbf24, 'gold', wireframe));
      ring.position.set(-0.3, 0.4, 0);
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.08, 32), pbrMat(0x7dd3fc, 'glass', wireframe));
      lens.rotation.x = Math.PI / 2;
      lens.position.set(-0.3, 0.4, 0);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.7, 16), pbrMat(0x92400e, 'wood', wireframe));
      handle.rotation.z = -0.75;
      handle.position.set(0.85, -0.75, 0);
      const relic = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), pbrMat(0x10b981, 'enamel', wireframe));
      relic.position.set(-0.3, 0.4, -0.5);
      group.add(ring, lens, handle, relic);
      break;
    }

    case 'flag_parliament': {
      const rotunda = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.9, 32), pbrMat(0xf8fafc, 'stone', wireframe));
      rotunda.position.y = -0.9;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.6, 12), pbrMat(0xfacc15, 'gold', wireframe));
      pole.position.set(0, 0.7, 0);
      const saffron = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 0.08), pbrMat(0xf97316, 'fabric', wireframe));
      saffron.position.set(0.75, 1.75, 0);
      const white = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 0.08), pbrMat(0xffffff, 'fabric', wireframe));
      white.position.set(0.75, 1.45, 0);
      const green = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 0.08), pbrMat(0x16a34a, 'fabric', wireframe));
      green.position.set(0.75, 1.15, 0);
      group.add(rotunda, pole, saffron, white, green);
      break;
    }

    case 'globe': {
      const earth = new THREE.Mesh(new THREE.SphereGeometry(1.45, 32, 32), pbrMat(0x0284c7, 'water', wireframe));
      const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), pbrMat(0x16a34a, 'foliage', wireframe));
      c1.position.set(0.95, 0.45, 0.65);
      const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), pbrMat(0x15803d, 'foliage', wireframe));
      c2.position.set(-0.85, -0.3, 0.85);
      const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.8, 12), pbrMat(0xfacc15, 'gold', wireframe));
      axis.rotation.z = 0.41;
      const eqRing = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.05, 16, 64), pbrMat(0xfbbf24, 'gold', wireframe));
      eqRing.rotation.x = Math.PI / 2;
      eqRing.rotation.y = 0.41;
      group.add(earth, c1, c2, axis, eqRing);
      break;
    }

    case 'compass': {
      const mapBase = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.2, 0.25, 32), pbrMat(0x1e293b, 'metal', wireframe));
      mapBase.position.y = -0.5;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.12, 16, 48), pbrMat(0xfacc15, 'gold', wireframe));
      rim.rotation.x = Math.PI / 2;
      rim.position.y = -0.38;
      const northNeedle = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 8), pbrMat(0xef4444, 'metal', wireframe));
      northNeedle.rotation.x = -Math.PI / 2;
      northNeedle.position.set(0, 0, -0.9);
      const southNeedle = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 8), pbrMat(0xe2e8f0, 'metal', wireframe));
      southNeedle.rotation.x = Math.PI / 2;
      southNeedle.position.set(0, 0, 0.9);
      const eastWest = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 0.35), pbrMat(0xfbbf24, 'gold', wireframe));
      group.add(mapBase, rim, northNeedle, southNeedle, eastWest);
      break;
    }

    case 'mountain': {
      const terrain = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 3.2), pbrMat(0x22c55e, 'foliage', wireframe));
      terrain.position.y = -1.1;
      const m1 = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.4, 7), pbrMat(0x64748b, 'stone', wireframe));
      m1.position.set(-0.9, 0.2, -0.4);
      const snow1 = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.95, 7), pbrMat(0xffffff, 'enamel', wireframe));
      snow1.position.set(-0.9, 0.95, -0.4);
      const m2 = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.9, 7), pbrMat(0x475569, 'stone', wireframe));
      m2.position.set(0.4, -0.05, -0.6);
      const snow2 = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.75, 7), pbrMat(0xf8fafc, 'enamel', wireframe));
      snow2.position.set(0.4, 0.55, -0.6);
      const river = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 3.1), pbrMat(0x0ea5e9, 'water', wireframe));
      river.position.set(-0.1, -0.92, 0);
      group.add(terrain, m1, snow1, m2, snow2, river);
      break;
    }

    case 'river_dam': {
      const damWall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 0.5), pbrMat(0x94a3b8, 'stone', wireframe));
      damWall.position.set(0, -0.4, 0);
      const water = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 1.6), pbrMat(0x0284c7, 'water', wireframe));
      water.position.set(0, -0.6, -1.0);
      const cloud1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), pbrMat(0xf8fafc, 'enamel', wireframe));
      cloud1.position.set(-0.8, 1.35, 0);
      const sun = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), pbrMat(0xfacc15, 'emissive', wireframe));
      sun.position.set(1.2, 1.45, -0.3);
      group.add(damWall, water, cloud1, sun);
      break;
    }

    case 'tree_leaf': {
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.2, 0.5, 24), pbrMat(0x78350f, 'stone', wireframe));
      soil.position.y = -1.15;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 1.8, 16), pbrMat(0x92400e, 'wood', wireframe));
      trunk.position.y = -0.2;
      const foliage1 = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 24), pbrMat(0x16a34a, 'foliage', wireframe));
      foliage1.position.set(0, 1.0, 0);
      const foliage2 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 20), pbrMat(0x22c55e, 'foliage', wireframe));
      foliage2.position.set(-0.7, 0.7, 0.4);
      const sun = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20), pbrMat(0xfacc15, 'emissive', wireframe));
      sun.position.set(1.6, 1.6, 0);
      group.add(soil, trunk, foliage1, foliage2, sun);
      break;
    }

    case 'tooth': {
      const crown = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.3, 1.7), pbrMat(0xffffff, 'enamel', wireframe));
      crown.position.y = 0.45;
      const root1 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.4, 16), pbrMat(0xfef08a, 'enamel', wireframe));
      root1.rotation.x = Math.PI;
      root1.position.set(-0.42, -0.75, 0);
      const root2 = root1.clone();
      root2.position.x = 0.42;
      const gum = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.7, 0.45, 24), pbrMat(0xf472b6, 'enamel', wireframe));
      gum.position.y = -0.35;
      group.add(crown, root1, root2, gum);
      break;
    }

    case 'carbs_energy': {
      const board = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.22, 2.6), pbrMat(0x92400e, 'wood', wireframe));
      board.position.y = -0.9;
      const loaf = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 1.8, 16), pbrMat(0xd97706, 'wood', wireframe));
      loaf.rotation.z = Math.PI / 2;
      loaf.position.set(-0.7, -0.4, -0.2);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.45, 0.55, 20), pbrMat(0xf8fafc, 'enamel', wireframe));
      bowl.position.set(0.9, -0.6, -0.3);
      const butter = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 0.5), pbrMat(0xfacc15, 'enamel', wireframe));
      butter.position.set(0.7, -0.65, 0.75);
      group.add(board, loaf, bowl, butter);
      break;
    }

    case 'proteins_body': {
      const milkBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.6, 0.85), pbrMat(0xf8fafc, 'enamel', wireframe));
      milkBody.position.set(-1.1, -0.2, -0.2);
      const egg = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), pbrMat(0xfef08a, 'enamel', wireframe));
      egg.scale.set(1, 1.35, 1);
      egg.position.set(-0.1, -0.4, 0.5);
      const fishBody = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.6, 16), pbrMat(0x38bdf8, 'metal', wireframe));
      fishBody.rotation.z = Math.PI / 2;
      fishBody.position.set(0.9, -0.2, -0.3);
      group.add(milkBody, egg, fishBody);
      break;
    }

    case 'vitamins_protect': {
      const apple = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 24), pbrMat(0xef4444, 'enamel', wireframe));
      apple.position.set(-0.85, -0.3, -0.2);
      const orange = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 20), pbrMat(0xf97316, 'enamel', wireframe));
      orange.position.set(0.85, -0.35, -0.2);
      const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.4, 16), pbrMat(0xea580c, 'enamel', wireframe));
      carrot.rotation.z = 0.5;
      carrot.position.set(-0.4, -0.5, 0.7);
      const brocHead = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 1), pbrMat(0x166534, 'foliage', wireframe));
      brocHead.position.set(0.65, -0.15, 0.7);
      group.add(apple, orange, carrot, brocHead);
      break;
    }

    case 'food_pyramid': {
      const pGrains = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.7, 0.65, 4), pbrMat(0xf59e0b, 'enamel', wireframe));
      pGrains.position.y = -1.0;
      const pVeggies = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.05, 0.65, 4), pbrMat(0x10b981, 'foliage', wireframe));
      pVeggies.position.y = -0.35;
      const pDairy = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.45, 0.65, 4), pbrMat(0x3b82f6, 'enamel', wireframe));
      pDairy.position.y = 0.3;
      const pFats = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.75, 4), pbrMat(0xec4899, 'enamel', wireframe));
      pFats.position.y = 0.98;
      group.add(pGrains, pVeggies, pDairy, pFats);
      break;
    }

    case 'food_preservation': {
      const fridge = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.1), pbrMat(0xe0f2fe, 'metal', wireframe));
      fridge.position.set(-1.0, 0, -0.2);
      const ice1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), pbrMat(0x7dd3fc, 'glass', wireframe));
      ice1.position.set(0.1, 0.2, 0.5);
      const jarBody = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.55, 0.85, 20), pbrMat(0xf8fafc, 'enamel', wireframe));
      jarBody.position.set(1.05, -0.5, 0.3);
      group.add(fridge, ice1, jarBody);
      break;
    }

    case 'tooth_jaw': {
      const gum = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.38, 16, 32, Math.PI), pbrMat(0xf472b6, 'enamel', wireframe));
      gum.rotation.x = Math.PI / 2;
      gum.position.y = -0.5;
      group.add(gum);
      for (let i = 0; i < 8; i++) {
        const a = (i / 7) * Math.PI;
        const toothMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.65, 0.35), pbrMat(0xffffff, 'enamel', wireframe));
        toothMesh.position.set(Math.cos(a) * 1.9, -0.05, Math.sin(a) * 1.9);
        group.add(toothMesh);
      }
      break;
    }

    case 'tooth_cross_section': {
      const halfCrown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.85, 1.2, 24, 1, false, 0, Math.PI),
        pbrMat(0xffffff, 'enamel', wireframe)
      );
      halfCrown.position.y = 0.4;
      const dentine = new THREE.Mesh(
        new THREE.CylinderGeometry(0.72, 0.62, 1.1, 20, 1, false, 0, Math.PI),
        pbrMat(0xfef08a, 'enamel', wireframe)
      );
      dentine.position.y = 0.35;
      const pulp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.15, 0.95, 16, 1, false, 0, Math.PI),
        pbrMat(0xef4444, 'emissive', wireframe)
      );
      pulp.position.y = 0.25;
      group.add(halfCrown, dentine, pulp);
      break;
    }

    case 'digestive_system': {
      const stomach = new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 20), pbrMat(0xf43f5e, 'enamel', wireframe));
      stomach.scale.set(1.4, 0.85, 0.9);
      stomach.position.set(-0.35, 0.4, 0);
      const liver = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.1, 16), pbrMat(0x881337, 'enamel', wireframe));
      liver.rotation.z = -1.2;
      liver.position.set(0.85, 0.5, 0);
      const intestine = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.25, 16, 32), pbrMat(0xf59e0b, 'enamel', wireframe));
      intestine.position.set(0, -0.65, 0);
      group.add(stomach, liver, intestine);
      break;
    }

    case 'leaf_photosynthesis': {
      const leafPlate = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 1.9), pbrMat(0x16a34a, 'foliage', wireframe));
      leafPlate.rotation.x = 0.35;
      const sunRay = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 12), pbrMat(0xfacc15, 'emissive', wireframe));
      sunRay.rotation.x = Math.PI;
      sunRay.position.set(0.8, 1.4, -0.5);
      const bubble1 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), pbrMat(0x38bdf8, 'glass', wireframe));
      bubble1.position.set(-0.8, 0.9, 0.4);
      group.add(leafPlate, sunRay, bubble1);
      break;
    }

    case 'plant_cactus': {
      const stemC = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.2, 16), pbrMat(0x15803d, 'foliage', wireframe));
      const armL = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.22, 12, 16, Math.PI / 2), pbrMat(0x15803d, 'foliage', wireframe));
      armL.position.set(-0.45, 0.2, 0);
      const flower = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), pbrMat(0xec4899, 'emissive', wireframe));
      flower.position.set(0, 1.25, 0);
      group.add(stemC, armL, flower);
      break;
    }

    case 'plant_pine': {
      const trunkP = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.4, 12), pbrMat(0x78350f, 'wood', wireframe));
      trunkP.position.y = -0.3;
      const tier1 = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.1, 12), pbrMat(0x14532d, 'foliage', wireframe));
      tier1.position.y = 0.3;
      const tier2 = new THREE.Mesh(new THREE.ConeGeometry(1.05, 0.95, 12), pbrMat(0x15803d, 'foliage', wireframe));
      tier2.position.y = 0.95;
      const snow = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.45, 8), pbrMat(0xffffff, 'enamel', wireframe));
      snow.position.y = 1.45;
      group.add(trunkP, tier1, tier2, snow);
      break;
    }

    case 'plant_lotus': {
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32, 1, false, 0, Math.PI * 1.8),
        pbrMat(0x16a34a, 'foliage', wireframe)
      );
      pad.position.set(0, -0.78, 0);
      const flowerCore = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), pbrMat(0xfacc15, 'gold', wireframe));
      flowerCore.position.set(0, -0.4, 0);
      for (let p = 0; p < 8; p++) {
        const pa = (p / 8) * Math.PI * 2;
        const petal = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.8, 8), pbrMat(0xf472b6, 'enamel', wireframe));
        petal.rotation.z = Math.PI / 4;
        petal.rotation.y = pa;
        petal.position.set(Math.cos(pa) * 0.38, -0.45, Math.sin(pa) * 0.38);
        group.add(petal);
      }
      group.add(pad, flowerCore);
      break;
    }

    case 'animal_camel': {
      const cBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 0.95), pbrMat(0xd97706, 'wood', wireframe));
      const hump = new THREE.Mesh(new THREE.SphereGeometry(0.62, 16, 16), pbrMat(0xb45309, 'wood', wireframe));
      hump.position.set(-0.1, 0.8, 0);
      const cNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 1.2, 12), pbrMat(0xd97706, 'wood', wireframe));
      cNeck.rotation.z = -0.45;
      cNeck.position.set(1.0, 0.6, 0);
      group.add(cBody, hump, cNeck);
      break;
    }

    case 'animal_polar': {
      const iceberg = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.5, 0.45, 8), pbrMat(0xe0f2fe, 'glass', wireframe));
      iceberg.position.y = -0.9;
      const bearBody = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), pbrMat(0xf8fafc, 'enamel', wireframe));
      bearBody.scale.set(1.4, 1, 1);
      bearBody.position.set(-0.85, -0.3, 0);
      const pBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 1.1, 16), pbrMat(0x0f172a, 'enamel', wireframe));
      pBody.position.set(1.1, -0.2, 0);
      group.add(iceberg, bearBody, pBody);
      break;
    }

    case 'animal_aquatic': {
      const dolphin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.48, 2.4, 20), pbrMat(0x0284c7, 'water', wireframe));
      dolphin.rotation.z = Math.PI / 3;
      dolphin.position.set(0, 0.3, 0);
      const wave = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.25, 12, 32), pbrMat(0x38bdf8, 'water', wireframe));
      wave.rotation.x = Math.PI / 2;
      wave.position.y = -0.9;
      group.add(dolphin, wave);
      break;
    }

    case 'matter_molecules': {
      const chamberGeo = new THREE.BoxGeometry(1.1, 1.8, 1.1);
      [-1.5, 0, 1.5].forEach((cx, cIdx) => {
        const box = new THREE.Mesh(chamberGeo, pbrMat(0x38bdf8, 'glass', wireframe));
        box.position.set(cx, 0, 0);
        group.add(box);
        const col = cIdx === 0 ? 0xef4444 : cIdx === 1 ? 0x3b82f6 : 0xfacc15;
        for (let m = 0; m < 4; m++) {
          const mol = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), pbrMat(col, 'metal', wireframe));
          mol.position.set(cx + (m % 2 - 0.5) * 0.4, -0.4 + Math.floor(m / 2) * 0.5, 0);
          group.add(mol);
        }
      });
      break;
    }

    case 'matter_change': {
      const burner = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.35, 24), pbrMat(0x334155, 'metal', wireframe));
      burner.position.y = -0.8;
      const iceCube = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.95), pbrMat(0xbae6fd, 'glass', wireframe));
      iceCube.rotation.y = 0.4;
      group.add(burner, iceCube);
      break;
    }

    case 'matter_beaker': {
      const beaker = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.0, 2.2, 24, 1, true), pbrMat(0x7dd3fc, 'glass', wireframe));
      const liquid = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 0.95, 1.5, 24), pbrMat(0x0284c7, 'water', wireframe));
      liquid.position.y = -0.3;
      group.add(beaker, liquid);
      break;
    }

    case 'water_cycle': {
      const ocean = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 3.2), pbrMat(0x0284c7, 'water', wireframe));
      ocean.position.set(1.1, -0.9, 0);
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.0, 5), pbrMat(0x78350f, 'stone', wireframe));
      mtn.position.set(-1.1, 0.1, 0);
      const cloud = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), pbrMat(0xf8fafc, 'enamel', wireframe));
      cloud.position.set(0, 1.5, 0);
      group.add(ocean, mtn, cloud);
      break;
    }

    case 'weather_breeze': {
      const beach = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 3.2), pbrMat(0xf59e0b, 'stone', wireframe));
      beach.position.set(-1.0, -0.9, 0);
      const sea = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 3.2), pbrMat(0x0284c7, 'water', wireframe));
      sea.position.set(1.0, -0.92, 0);
      const windRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 12, 24, Math.PI), pbrMat(0x38bdf8, 'emissive', wireframe));
      windRing.position.set(0, 0.6, 0);
      group.add(beach, sea, windRing);
      break;
    }

    case 'force_magnet': {
      const magRed = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.25, 16, 24, Math.PI / 2), pbrMat(0xef4444, 'metal', wireframe));
      magRed.position.set(0, 0.4, 0);
      const magBlue = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.25, 16, 24, Math.PI / 2), pbrMat(0x2563eb, 'metal', wireframe));
      magBlue.rotation.y = Math.PI;
      magBlue.position.set(0, 0.4, 0);
      const ironBall = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), pbrMat(0xe2e8f0, 'metal', wireframe));
      ironBall.position.set(0, -0.5, 0);
      group.add(magRed, magBlue, ironBall);
      break;
    }

    case 'solar_energy': {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 1.6), pbrMat(0x1e3a8a, 'metal', wireframe));
      panel.rotation.x = 0.55;
      panel.position.set(-0.6, -0.2, 0);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), pbrMat(0xfacc15, 'emissive', wireframe));
      bulb.position.set(1.2, 0.4, 0);
      group.add(panel, bulb);
      break;
    }

    case 'solar_planets': {
      const sun = new THREE.Mesh(new THREE.SphereGeometry(1.2, 24, 24), pbrMat(0xf59e0b, 'emissive', wireframe));
      sun.position.set(-0.9, 0.3, 0);
      const earthP = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20), pbrMat(0x0284c7, 'water', wireframe));
      earthP.position.set(0.95, -0.3, 0.6);
      const saturnP = new THREE.Mesh(new THREE.SphereGeometry(0.65, 20, 20), pbrMat(0xfacc15, 'gold', wireframe));
      saturnP.position.set(1.3, 0.7, -0.8);
      const ringS = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.15, 4, 32), pbrMat(0xd97706, 'gold', wireframe));
      ringS.rotation.x = Math.PI / 2.3;
      ringS.position.set(1.3, 0.7, -0.8);
      group.add(sun, earthP, saturnP, ringS);
      break;
    }

    case 'grammar_stage': {
      const bNoun = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), pbrMat(0xef4444, 'enamel', wireframe));
      bNoun.position.set(-1.15, -0.3, 0);
      const bVerb = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), pbrMat(0x3b82f6, 'enamel', wireframe));
      bVerb.position.set(0, -0.3, 0);
      const bAdj = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), pbrMat(0x10b981, 'enamel', wireframe));
      bAdj.position.set(1.15, -0.3, 0);
      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.15, 12, 32, Math.PI), pbrMat(0xfacc15, 'gold', wireframe));
      arch.position.set(0, 0.35, 0);
      group.add(bNoun, bVerb, bAdj, arch);
      break;
    }

    case 'literature_book': {
      const bookL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.16, 2.0), pbrMat(0xfef9c3, 'wood', wireframe));
      bookL.position.set(-0.72, -0.6, 0);
      bookL.rotation.z = -0.15;
      const bookR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.16, 2.0), pbrMat(0xfef08a, 'wood', wireframe));
      bookR.position.set(0.72, -0.6, 0);
      bookR.rotation.z = 0.15;
      const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.42, 1.3, 16), pbrMat(0xfacc15, 'gold', wireframe));
      lampStem.position.set(1.3, -0.1, 0.7);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.45, 12), pbrMat(0xf97316, 'emissive', wireframe));
      flame.position.set(1.3, 0.65, 0.7);
      group.add(bookL, bookR, lampStem, flame);
      break;
    }

    case 'phonics_abc': {
      const blockA = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), pbrMat(0xef4444, 'wood', wireframe));
      blockA.position.set(-1.1, -0.4, 0);
      const blockB = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), pbrMat(0x3b82f6, 'wood', wireframe));
      blockB.position.set(0.2, -0.4, -0.4);
      const blockC = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), pbrMat(0xfacc15, 'wood', wireframe));
      blockC.position.set(1.3, -0.45, 0.3);
      const toyApple = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), pbrMat(0xdc2626, 'enamel', wireframe));
      toyApple.position.set(-1.1, 0.48, 0);
      group.add(blockA, blockB, blockC, toyApple);
      break;
    }

    case 'abacus_count':
    case 'abacus': {
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 1.2), pbrMat(0x92400e, 'wood', wireframe));
      base.position.y = -1.1;
      group.add(base);
      const rodColors = [0xef4444, 0xf59e0b, 0x10b981, 0x3b82f6];
      rodColors.forEach((col, rIdx) => {
        const rx = -1.2 + rIdx * 0.8;
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12), pbrMat(0xe2e8f0, 'metal', wireframe));
        rod.position.set(rx, 0, 0);
        group.add(rod);
        for (let b = 0; b <= rIdx + 1; b++) {
          const bead = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.12, 12, 24), pbrMat(col, 'enamel', wireframe));
          bead.rotation.x = Math.PI / 2;
          bead.position.set(rx, -0.75 + b * 0.35, 0);
          group.add(bead);
        }
      });
      break;
    }

    case 'ukg_senses': {
      const faceDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.25, 32), pbrMat(0xfef08a, 'enamel', wireframe));
      faceDisc.rotation.x = Math.PI / 2;
      faceDisc.position.set(0, 0.2, 0);
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), pbrMat(0x0284c7, 'enamel', wireframe));
      eyeL.position.set(-0.55, 0.5, 0.25);
      const eyeR = eyeL.clone();
      eyeR.position.x = 0.55;
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.2), pbrMat(0xf472b6, 'enamel', wireframe));
      hand.position.set(1.4, 0.8, 0.2);
      group.add(faceDisc, eyeL, eyeR, hand);
      break;
    }

    case 'train_transport': {
      const track = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.15, 1.4), pbrMat(0x475569, 'metal', wireframe));
      track.position.y = -1.0;
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 1.1), pbrMat(0x2563eb, 'metal', wireframe));
      body.position.set(0, -0.2, 0);
      const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 1.2, 20), pbrMat(0xef4444, 'metal', wireframe));
      nose.rotation.z = Math.PI / 2;
      nose.position.set(1.1, -0.2, 0);
      group.add(track, body, nose);
      break;
    }

    case 'satellite': {
      const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.5, 20), pbrMat(0xfacc15, 'gold', wireframe));
      bus.rotation.z = Math.PI / 4;
      const wingLeft = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.9), pbrMat(0x2563eb, 'metal', wireframe));
      wingLeft.position.set(-1.6, 0, 0);
      const wingRight = wingLeft.clone();
      wingRight.position.x = 1.6;
      group.add(bus, wingLeft, wingRight);
      break;
    }

    case 'recycle_bin': {
      const greenBin = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.52, 1.5, 20), pbrMat(0x16a34a, 'enamel', wireframe));
      greenBin.position.set(-0.95, -0.3, 0);
      const blueBin = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.52, 1.5, 20), pbrMat(0x2563eb, 'enamel', wireframe));
      blueBin.position.set(0.95, -0.3, 0);
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 2.6, 16), pbrMat(0xf8fafc, 'metal', wireframe));
      tower.position.set(0, 0.3, -0.9);
      group.add(greenBin, blueBin, tower);
      break;
    }

    case 'fraction_pie': {
      const sliceColors = [0xef4444, 0xfacc15, 0x10b981, 0x3b82f6];
      sliceColors.forEach((col, i) => {
        const slice = new THREE.Mesh(
          new THREE.CylinderGeometry(1.6, 1.6, 0.38, 24, 1, false, (i * Math.PI) / 2, Math.PI / 2 - 0.08),
          pbrMat(col, 'enamel', wireframe)
        );
        const offset = i === 0 ? 0.25 : 0;
        slice.position.set(offset, 0, offset);
        slice.rotation.x = 0.45;
        group.add(slice);
      });
      break;
    }

    case 'clock': {
      const face = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.25, 36), pbrMat(0xf8fafc, 'enamel', wireframe));
      face.rotation.x = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.16, 16, 48), pbrMat(0xfacc15, 'gold', wireframe));
      const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.1), pbrMat(0xef4444, 'metal', wireframe));
      hourHand.position.set(0.3, 0.2, 0.18);
      hourHand.rotation.z = -0.8;
      const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.35, 0.1), pbrMat(0x0f172a, 'metal', wireframe));
      minHand.position.set(0, 0.55, 0.2);
      group.add(face, rim, hourHand, minHand);
      break;
    }

    case 'lever_machine': {
      const fulcrum = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.1, 4), pbrMat(0xf59e0b, 'gold', wireframe));
      fulcrum.position.y = -0.6;
      const plank = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 0.9), pbrMat(0x38bdf8, 'metal', wireframe));
      plank.rotation.z = 0.18;
      const loadBox = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.85), pbrMat(0xef4444, 'metal', wireframe));
      loadBox.position.set(-1.3, 0.25, 0);
      const effortSphere = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20), pbrMat(0x10b981, 'metal', wireframe));
      effortSphere.position.set(1.3, 0.72, 0);
      group.add(fulcrum, plank, loadBox, effortSphere);
      break;
    }

    default: {
      const leftPage = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 2.2), pbrMat(0xfef9c3, 'wood', wireframe));
      leftPage.position.set(-0.78, -0.3, 0);
      leftPage.rotation.z = -0.15;
      const rightPage = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 2.2), pbrMat(0xfef08a, 'wood', wireframe));
      rightPage.position.set(0.78, -0.3, 0);
      rightPage.rotation.z = 0.15;
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0), pbrMat(0xf59e0b, 'gold', wireframe));
      star.position.y = 0.65;
      group.add(leftPage, rightPage, star);
      break;
    }
  }

  // Enable shadow casting & receiving on all meshes
  group.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return group;
}

