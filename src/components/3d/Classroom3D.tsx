'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  GraduationCap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Eye,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TextbookChapter, Subject } from '@/lib/db/types';
import { soundEffects } from '@/lib/audio/soundEffects';

interface Classroom3DProps {
  chapter?: TextbookChapter | null;
  subject?: Subject | null;
  subjects?: Subject[];
  chapters?: TextbookChapter[];
  onSelectSubject?: (subId: string) => void;
  onSelectChapter?: (chapId: string) => void;
}

// Generate an ultra-crisp 2K (2048 x 1152) interactive Canvas texture for the Smart Board
function createSmartBoardTexture(
  chapter: TextbookChapter | undefined | null,
  subject: Subject | undefined | null,
  slideIndex: number,
  studentName: string,
  language: 'en' | 'ml'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1152; // 16:9 widescreen 2K smart digital whiteboard
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Digital Whiteboard / Dark Slate Background with subtle high-tech grid
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0f172a'); // Slate 900
    grad.addColorStop(1, '#020617'); // Slate 950
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Grid pattern
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Outer Glowing Border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // 2. Top Header Bar
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.fillRect(30, 30, canvas.width - 60, 130);

    // Subject & Grade Badge
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(50, 50, 520, 90, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 40px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const subTitle = subject?.name ? `${subject.icon || '📚'} ${subject.name.slice(0, 22)}` : 'Interactive Classroom';
    ctx.fillText(subTitle, 75, 95);

    // Student Badge (Top Right)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(canvas.width - 560, 50, 500, 90, 20);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎓 ${studentName || 'Student'}`, canvas.width - 310, 95);

    // 3. Lesson Title
    ctx.fillStyle = '#facc15';
    ctx.font = '900 60px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const chapTitle = chapter
      ? `Ch ${chapter.chapterNumber}: ${chapter.title}`
      : 'Welcome to 3D Virtual Classroom!';

    // Title truncation or smart fit
    const displayTitle = chapTitle.length > 46 ? chapTitle.slice(0, 44) + '...' : chapTitle;
    ctx.fillText(displayTitle, 60, 235);

    // Slide indicator pill
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(canvas.width - 360, 185, 300, 64, 32);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Slide ${slideIndex + 1} of 3`, canvas.width - 210, 228);

    // Separator line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 270);
    ctx.lineTo(canvas.width - 60, 270);
    ctx.stroke();

    // 4. Slide Content Rendering
    const rawTopics = chapter?.topics || [
      'Interactive 3D Curriculum Explorer',
      'Touch, rotate and explore real concepts',
      'Listen to Chikoo explain the lesson aloud',
    ];

    if (slideIndex === 0) {
      // Slide 1: Core Key Concepts / Topics
      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 44px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        language === 'ml' ? '📌 പ്രധാന ആശയങ്ങൾ (Key Concepts):' : '📌 Lesson Topics & Key Concepts:',
        60,
        340
      );

      rawTopics.slice(0, 4).forEach((topic, idx) => {
        const y = 435 + idx * 115;

        // Container card for each topic for ultra clear readability
        ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(60, y - 50, canvas.width - 120, 95, 18);
        ctx.fill();
        ctx.stroke();

        // Number disc badge
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(115, y - 2, 32, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${idx + 1}`, 115, y - 2);

        // Topic text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const tText = topic.length > 56 ? topic.slice(0, 54) + '...' : topic;
        ctx.fillText(tText, 175, y - 2);
      });
    } else if (slideIndex === 1) {
      // Slide 2: Syllabus Summary & Key Terms
      ctx.fillStyle = '#f472b6';
      ctx.font = '900 44px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(
        language === 'ml' ? '📖 പാഠസംഗ്രഹം (Chapter Summary):' : '📖 Chapter Summary & Objectives:',
        60,
        340
      );

      // Summary Box
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(60, 380, canvas.width - 120, 360, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 40px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      const summaryText =
        chapter?.summary ||
        'Explore this comprehensive chapter with interactive 3D models and voice guidance!';
      const words = summaryText.split(' ');
      let line = '';
      let lineY = 460;
      for (const w of words) {
        if ((line + w).length > 52) {
          ctx.fillText(line, 105, lineY);
          line = w + ' ';
          lineY += 65;
          if (lineY > 670) break;
        } else {
          line += w + ' ';
        }
      }
      if (line && lineY <= 670) ctx.fillText(line, 105, lineY);

      // Key Terms pills
      if (chapter?.keyTerms && chapter.keyTerms.length > 0) {
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('🔑 Key Vocabulary:  ' + chapter.keyTerms.slice(0, 4).join('   •   '), 60, 840);
      }
    } else {
      // Slide 3: Chikoo AI Teacher Quiz Challenge
      ctx.fillStyle = '#c084fc';
      ctx.font = '900 44px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(
        language === 'ml'
          ? '🎯 ചിക്കുവിന്റെ ചോദ്യം (Chikoo Quiz Challenge):'
          : '🎯 Chikoo’s Classroom Question:',
        60,
        340
      );

      ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(60, 380, canvas.width - 120, 440, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px sans-serif';
      const questionTopic = rawTopics[0]?.slice(0, 40) || 'this topic';
      ctx.fillText(`"Can you explain ${questionTopic} in your own words?"`, 110, 490);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 36px sans-serif';
      ctx.fillText(
        language === 'ml'
          ? 'മൈക്കിൽ തൊട്ട് ഉത്തരം പറയൂ, അല്ലെങ്കിൽ താഴെയുള്ള ബട്ടൺ അമർത്തി ചിക്കുവിന്റെ ശബ്ദം കേൾക്കൂ! 🐶🐾'
          : 'Tap the button below to hear Chikoo teach, or visit AI Buddy to chat! 🐶🐾',
        110,
        590
      );

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('⭐ Earn 10 Learning Stars & unlock new 3D world badges!', 110, 710);
    }

    // 5. Blackboard Footer Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(30, canvas.height - 95, canvas.width - 60, 70);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 30px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐾 Little Genius AI Modern Smart Classroom • Interactive 3D', 65, canvas.height - 60);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Use Zoom Controls or Drag to Zoom in and read 🔍', canvas.width - 65, canvas.height - 60);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

export default function Classroom3D({
  chapter,
  subject,
  subjects = [],
  chapters = [],
  onSelectSubject,
  onSelectChapter,
}: Classroom3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { language, activeChild, speak, stopSpeaking, isSpeaking } = useApp();

  const [slideIndex, setSlideIndex] = useState(0);
  const [isClassSpeaking, setIsClassSpeaking] = useState(false);
  const [isBoardFocused, setIsBoardFocused] = useState(false);

  // References to communicate with Three.js animation loop & resize
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.2, 7.6));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.4, -4.0));

  const chapterRef = useRef(chapter);
  const subjectRef = useRef(subject);
  const slideIndexRef = useRef(slideIndex);

  useEffect(() => {
    chapterRef.current = chapter;
    setSlideIndex(0);
  }, [chapter?.id]);

  useEffect(() => {
    subjectRef.current = subject;
  }, [subject?.id]);

  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  // Zoom control handlers
  const handleToggleBoardFocus = useCallback(() => {
    soundEffects.playPop();
    setIsBoardFocused((prev) => {
      const next = !prev;
      if (next) {
        // Zoom in directly to the smart board
        targetCameraPos.current.set(0, 3.8, 3.2);
        targetLookAt.current.set(0, 3.8, -4.0);
      } else {
        // Reset to full classroom view
        targetCameraPos.current.set(0, 3.2, 7.6);
        targetLookAt.current.set(0, 3.4, -4.0);
      }
      return next;
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    soundEffects.playPop();
    if (cameraRef.current) {
      targetCameraPos.current.z = Math.max(2.5, targetCameraPos.current.z - 1.2);
      targetCameraPos.current.y = 3.6;
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    soundEffects.playPop();
    if (cameraRef.current) {
      targetCameraPos.current.z = Math.min(11.0, targetCameraPos.current.z + 1.2);
    }
  }, []);

  const handleResetView = useCallback(() => {
    soundEffects.playPop();
    setIsBoardFocused(false);
    targetCameraPos.current.set(0, 3.2, 7.6);
    targetLookAt.current.set(0, 3.4, -4.0);
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe); // Warm daylight classroom sky

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.copy(targetCameraPos.current);
    camera.lookAt(targetLookAt.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // --- Modern Classroom Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.9);
    sunLight.position.set(-12, 14, 6);
    scene.add(sunLight);

    const ceilingFill = new THREE.PointLight(0xffffff, 1.2, 40);
    ceilingFill.position.set(0, 7, 2);
    scene.add(ceilingFill);

    // 1. Polished Hardwood Parquet Floor
    const floorGeo = new THREE.PlaneGeometry(24, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.35,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    scene.add(floor);

    // 2. Classroom Back Wall
    const wallGeo = new THREE.BoxGeometry(24, 12, 0.3);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 5.8, -4.2);
    scene.add(backWall);

    // Baseboard Wood Molding
    const baseboard = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.45, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 })
    );
    baseboard.position.set(0, 0.2, -4.0);
    scene.add(baseboard);

    // 3. Left Wall with Sunlight Windows
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 12, 18),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 })
    );
    leftWall.position.set(-11.9, 5.8, 4);
    scene.add(leftWall);

    // Window Frames
    for (let w = -1; w <= 1; w++) {
      const winFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 4.2, 3.2),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      winFrame.position.set(-11.7, 5.2, 4 + w * 4.5);
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 3.8, 2.8),
        new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.45, roughness: 0.1 })
      );
      glass.position.set(-11.7, 5.2, 4 + w * 4.5);
      scene.add(winFrame, glass);
    }

    // 4. Large Interactive Smart Digital Whiteboard on Back Wall
    const boardWidth = 10.4;
    const boardHeight = 5.85;
    const boardGeo = new THREE.PlaneGeometry(boardWidth, boardHeight);

    const boardTexture = createSmartBoardTexture(
      chapterRef.current,
      subjectRef.current,
      slideIndexRef.current,
      activeChild?.name || 'Student',
      language
    );

    const boardMat = new THREE.MeshStandardMaterial({
      map: boardTexture,
      roughness: 0.15,
      metalness: 0.05,
    });
    const smartBoard = new THREE.Mesh(boardGeo, boardMat);
    smartBoard.position.set(0, 3.8, -4.0);
    scene.add(smartBoard);

    // Brushed Aluminum Smart Board Bezel
    const frameGeo = new THREE.BoxGeometry(10.8, 6.2, 0.15);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.25 });
    const boardFrame = new THREE.Mesh(frameGeo, frameMat);
    boardFrame.position.set(0, 3.8, -4.08);
    scene.add(boardFrame);

    // 5. Sleek Teacher's Smart Podium & Desk
    const deskGroup = new THREE.Group();
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.18, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.35 })
    );
    tableTop.position.set(0, 1.35, -1.2);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.35, 12);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const legOffsets = [
      [-2.3, -1.2 + 0.85],
      [2.3, -1.2 + 0.85],
      [-2.3, -1.2 - 0.85],
      [2.3, -1.2 - 0.85],
    ];
    legOffsets.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.67, lz);
      deskGroup.add(leg);
    });
    deskGroup.add(tableTop);
    scene.add(deskGroup);

    // 6. Dynamic 3D Subject Props on the Desk
    const propsGroup = new THREE.Group();
    propsGroup.position.set(0, 1.45, -1.2);
    scene.add(propsGroup);

    const subId = subject?.id || '';
    if (subId.includes('sci')) {
      // Microscope + Chemical Flask
      const scopeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      const scopePillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 12), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 }));
      scopePillar.position.set(0, 0.45, 0);
      const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      scopeTube.rotation.z = -0.35;
      scopeTube.position.set(-0.15, 0.7, 0);
      const scopeGroup = new THREE.Group();
      scopeGroup.position.set(-1.4, 0, 0.2);
      scopeGroup.add(scopeBase, scopePillar, scopeTube);

      const flask = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.65, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 }));
      flask.position.set(1.3, 0.32, 0.2);
      propsGroup.add(scopeGroup, flask);
    } else if (subId.includes('soc')) {
      // 3D Desktop Globe + Compass
      const globeSphere = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 }));
      globeSphere.position.set(-1.3, 0.65, 0.2);
      const globeStand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 12), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 }));
      globeStand.position.set(-1.3, 0.32, 0.2);
      const compassBox = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7 }));
      compassBox.position.set(1.2, 0.08, 0.2);
      propsGroup.add(globeSphere, globeStand, compassBox);
    } else if (subId.includes('math')) {
      // Abacus + Geometric Blocks
      const abacusP = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.75, 0.25), new THREE.MeshStandardMaterial({ color: 0x92400e }));
      abacusP.position.set(-1.3, 0.4, 0.2);
      const block1 = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.55, 4), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      block1.position.set(1.1, 0.28, 0.2);
      const block2 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
      block2.position.set(1.6, 0.24, 0.3);
      propsGroup.add(abacusP, block1, block2);
    } else {
      // Books & Open Textbook
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 1.2), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      b1.position.set(-1.3, 0.07, 0.2);
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 1.15), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
      b2.position.set(-1.3, 0.21, 0.2);
      b2.rotation.y = 0.2;
      const openBookL = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.9), new THREE.MeshStandardMaterial({ color: 0xfef9c3 }));
      openBookL.position.set(1.1, 0.05, 0.2);
      openBookL.rotation.z = -0.15;
      const openBookR = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.9), new THREE.MeshStandardMaterial({ color: 0xfef9c3 }));
      openBookR.position.set(1.7, 0.05, 0.2);
      openBookR.rotation.z = 0.15;
      propsGroup.add(b1, b2, openBookL, openBookR);
    }

    // 7. Student Desks in Front Row (Spread out wider so board is completely unobscured)
    const makeStudentDesk = (dx: number, dz: number) => {
      const g = new THREE.Group();
      g.position.set(dx, 0, dz);
      const sTop = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.12, 1.4),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 })
      );
      sTop.position.y = 1.05;
      const sLegL = new THREE.Mesh(legGeo, legMat);
      sLegL.position.set(-1.0, 0.52, 0);
      const sLegR = new THREE.Mesh(legGeo, legMat);
      sLegR.position.set(1.0, 0.52, 0);
      const nb = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.05, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
      );
      nb.position.set(-0.3, 1.12, 0.1);
      g.add(sTop, sLegL, sLegR, nb);
      return g;
    };
    scene.add(makeStudentDesk(-4.6, 3.4));
    scene.add(makeStudentDesk(4.6, 3.4));

    // 8. 3D Chikoo AI Avatar - Positioned safely to the right of the board
    const chikooGroup = new THREE.Group();
    chikooGroup.position.set(5.8, 1.35, -3.3);
    chikooGroup.rotation.y = -0.35; // Face inwards towards the classroom & board

    // Body
    const cBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 })
    );
    cBody.position.y = 1.0;
    chikooGroup.add(cBody);

    // Head
    const cHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.56, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })
    );
    cHead.position.set(0, 1.9, 0.15);
    chikooGroup.add(cHead);

    // Floppy Dog Ears
    const earL = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.65, 16),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 })
    );
    earL.position.set(-0.48, 2.35, 0.1);
    earL.rotation.z = Math.PI / 4;
    const earR = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.65, 16),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 })
    );
    earR.position.set(0.48, 2.35, 0.1);
    earR.rotation.z = -Math.PI / 4;
    chikooGroup.add(earL, earR);

    // Twinkling Eyes
    const eyeWhiteGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeL.position.set(-0.2, 1.98, 0.62);
    const eyeR = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeR.position.set(0.2, 1.98, 0.62);

    const pupilGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const pL = new THREE.Mesh(pupilGeo, pupilMat);
    pL.position.set(-0.2, 1.98, 0.74);
    const pR = new THREE.Mesh(pupilGeo, pupilMat);
    pR.position.set(0.2, 1.98, 0.74);
    chikooGroup.add(eyeL, eyeR, pL, pR);

    // Puppy Nose
    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 })
    );
    nose.position.set(0, 1.82, 0.72);
    chikooGroup.add(nose);

    // Glowing Tech Collar with LED Bead
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.52, 0.09, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.2 })
    );
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 1.45, 0.1);
    const ledTag = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    ledTag.position.set(0, 1.4, 0.68);
    chikooGroup.add(collar, ledTag);

    // Tech Headset with Mic
    const headset = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.05, 16, 32, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x0369a1, metalness: 0.8, roughness: 0.2 })
    );
    headset.position.set(0, 2.05, 0.1);
    headset.rotation.z = Math.PI;
    const micArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
    );
    micArm.position.set(-0.48, 1.85, 0.45);
    micArm.rotation.z = -Math.PI / 3;
    chikooGroup.add(headset, micArm);

    // Wooden Teacher Pointer Stick
    const pointer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.04, 2.4, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 })
    );
    pointer.rotation.z = 1.05;
    pointer.rotation.y = 0.2;
    pointer.position.set(-0.9, 1.9, 0.2);
    chikooGroup.add(pointer);

    scene.add(chikooGroup);

    // --- Interactive Mouse & Touch Dragging, Panning & Zooming ---
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let initialPinchDist = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length === 2) {
        // Pinch start
        isDragging = false;
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        return;
      }
      isDragging = true;
      prevX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      prevY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length === 2) {
        // Pinch zoom
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = initialPinchDist - currentDist;
        targetCameraPos.current.z = Math.max(2.4, Math.min(11.5, targetCameraPos.current.z + diff * 0.015));
        initialPinchDist = currentDist;
        return;
      }

      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      targetCameraPos.current.x = Math.max(-4.5, Math.min(4.5, targetCameraPos.current.x - deltaX * 0.012));
      targetCameraPos.current.y = Math.max(1.8, Math.min(5.2, targetCameraPos.current.y + deltaY * 0.012));

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      initialPinchDist = 0;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCameraPos.current.z = Math.max(2.4, Math.min(11.5, targetCameraPos.current.z + e.deltaY * 0.008));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(currentMount);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation towards target pos
      camera.position.lerp(targetCameraPos.current, 0.08);
      camera.lookAt(targetLookAt.current);

      // Gentle Chikoo idle breathing & nodding
      chikooGroup.position.y = 1.35 + Math.sin(elapsed * 2.5) * 0.04;
      cHead.rotation.y = Math.sin(elapsed * 1.2) * 0.12;
      pointer.rotation.z = 1.05 + Math.sin(elapsed * 1.8) * 0.05;

      // LED collar pulse
      ledTag.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.2);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [chapter?.id, subject?.id, slideIndex, language, activeChild?.name]);

  const handleTeachSlide = () => {
    soundEffects.playPop();
    if (isSpeaking) {
      stopSpeaking();
      setIsClassSpeaking(false);
      return;
    }

    setIsClassSpeaking(true);
    const topics = chapter?.topics || ['Core concepts'];
    let textToSpeak = '';
    if (slideIndex === 0) {
      textToSpeak =
        language === 'ml'
          ? `ക്ലാസ്സ്‌റൂമിലേക്ക് സ്വാഗതം! ഇന്ന് നമ്മൾ പഠിക്കുന്നത് ${chapter?.title} ആണ്. ഇതിലെ പ്രധാന ആശയങ്ങൾ: ${topics.slice(0, 4).join(', ')}.`
          : `Welcome to the Virtual Classroom! Today we are studying ${chapter?.title}. The main key concepts are: ${topics.slice(0, 4).join(', ')}.`;
    } else if (slideIndex === 1) {
      textToSpeak =
        language === 'ml'
          ? `പാഠസംഗ്രഹം: ${chapter?.summary || ''}. പുതിയ വാക്കുകൾ ശ്രദ്ധിക്കൂ!`
          : `Chapter Summary: ${chapter?.summary || ''}. Focus on understanding these core building blocks!`;
    } else {
      textToSpeak =
        language === 'ml'
          ? `ചിക്കുവിന്റെ ക്ലാസ്സ്‌റൂം ചലഞ്ച്! ${topics[0]} എന്താണെന്ന് സ്വന്തം വാക്കുകളിൽ പറഞ്ഞു നോക്കൂ!`
          : `Chikoo's Classroom Challenge! Can you explain ${topics[0]} in your own words? You are doing fantastic!`;
    }

    speak(textToSpeak);
  };

  return (
    <div className="space-y-4">
      {/* Subject & Lesson Fast-Selector Toolbar inside Classroom */}
      {subjects.length > 0 && (
        <div className="bg-white rounded-3xl p-3.5 sm:p-4 border-2 border-indigo-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>{language === 'ml' ? 'ക്ലാസ്സ്‌റൂം വിഷയം മാറ്റുക:' : 'Select Subject for Virtual Classroom:'}</span>
            </span>

            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {activeChild?.name} • {activeChild?.classGrade}
            </span>
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {subjects.map((sub) => {
              const isSelected = sub.id === subject?.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    soundEffects.playPop();
                    onSelectSubject?.(sub.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'
                  }`}
                >
                  <span>{sub.icon}</span>
                  <span>{language === 'ml' && sub.malayalamName ? sub.malayalamName : sub.name}</span>
                </button>
              );
            })}
          </div>

          {/* Chapter Selector Dropdown */}
          {chapters.length > 0 && (
            <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                {language === 'ml' ? 'പാഠഭാഗം:' : 'Lesson:'}
              </span>
              <select
                value={chapter?.id || ''}
                onChange={(e) => {
                  soundEffects.playPop();
                  onSelectChapter?.(e.target.value);
                }}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    Ch {c.chapterNumber}: {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* 3D Classroom Canvas Frame with Higher Viewport for Mobile, Tablet & Desktop */}
      <div className="relative w-full rounded-4xl overflow-hidden bg-slate-950 border-4 border-indigo-500 shadow-2xl">
        <div
          ref={mountRef}
          className="w-full h-[520px] sm:h-[580px] md:h-[640px] cursor-grab active:cursor-grabbing"
        />

        {/* Top Floating Badge & Controls Overlay */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-indigo-400/40 shadow-xl flex items-center space-x-2 max-w-[65%]">
            <span className="text-lg sm:text-xl">🦉</span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-indigo-300 truncate">
                {language === 'ml' ? 'ആധുനിക 3D സ്മാർട്ട് ക്ലാസ്സ്‌റൂം' : 'Modern 3D Interactive Smart Classroom'}
              </p>
              <h4 className="text-xs sm:text-sm font-black text-amber-300 truncate">
                {chapter ? `Ch ${chapter.chapterNumber}: ${chapter.title}` : 'Smart Classroom'}
              </h4>
            </div>
          </div>

          {/* Interactive Zoom Toolbar */}
          <div className="flex items-center space-x-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-indigo-400/40 shadow-xl">
            {/* Quick Board Focus Toggle */}
            <button
              onClick={handleToggleBoardFocus}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center space-x-1.5 shadow ${
                isBoardFocused
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
              title={isBoardFocused ? 'Show Full Classroom View' : 'Zoom into Smart Board'}
            >
              {isBoardFocused ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline sm:inline">
                {isBoardFocused
                  ? language === 'ml'
                    ? 'ക്ലാസ്സ് മൊത്തം കാണുക'
                    : 'Full View'
                  : language === 'ml'
                  ? 'ബോർഡ് വലുതാക്കുക'
                  : 'Focus Board 🔍'}
              </span>
            </button>

            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition font-bold"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition font-bold"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Reset View */}
            <button
              onClick={handleResetView}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition font-bold"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Interactive Classroom Controls Bar */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-slate-900/95 backdrop-blur-md p-3 sm:p-3.5 rounded-3xl border-2 border-indigo-400/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Slide Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                soundEffects.playPop();
                setSlideIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={slideIndex === 0}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition font-black text-xs flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'ml' ? 'മുൻപത്തെ സ്ലൈഡ്' : 'Prev Slide'}</span>
            </button>

            <span className="px-3 py-1 rounded-xl bg-indigo-600/70 text-white font-black text-xs">
              Slide {slideIndex + 1} / 3
            </span>

            <button
              onClick={() => {
                soundEffects.playPop();
                setSlideIndex((prev) => Math.min(2, prev + 1));
              }}
              disabled={slideIndex === 2}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition font-black text-xs flex items-center space-x-1"
            >
              <span>{language === 'ml' ? 'അടുത്ത സ്ലൈഡ്' : 'Next Slide'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Chikoo Teach Button */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleTeachSlide}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition ${
                isSpeaking
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>
                {isSpeaking
                  ? language === 'ml'
                    ? 'ശബ്ദം നിർത്തൂ'
                    : 'Stop Lesson Voice'
                  : language === 'ml'
                  ? 'ചിക്കു പാഠം പറഞ്ഞുതരും 🐶'
                  : 'Chikoo: Teach Slide Aloud 🐶'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
