'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, Sparkles, RotateCcw, Eye } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TextbookChapter, Subject } from '@/lib/db/types';
import { soundEffects } from '@/lib/audio/soundEffects';
import { getTopicDetail, TopicDetail } from './chapter3dData';

interface ChapterConcept3DProps {
  chapter?: TextbookChapter | null;
  subject?: Subject | null;
}

const NODE_COLORS = [
  0x10b981, // Emerald
  0x3b82f6, // Blue
  0xf59e0b, // Amber
  0xec4899, // Pink
  0x8b5cf6, // Purple
  0x06b6d4, // Cyan
];

// Create a crisp 3D Sprite text badge using an HTML5 2D Canvas
function createTextSprite(text: string, isSelected: boolean, borderColorHex: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rounded pill background
    ctx.fillStyle = isSelected ? 'rgba(250, 204, 21, 0.96)' : 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = isSelected ? '#ffffff' : borderColorHex;
    ctx.lineWidth = isSelected ? 8 : 5;

    const r = 36;
    const x = 16;
    const y = 20;
    const w = canvas.width - 32;
    const h = canvas.height - 40;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Label text
    ctx.font = '900 30px sans-serif';
    ctx.fillStyle = isSelected ? '#0f172a' : '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 26), canvas.width / 2, canvas.height / 2 + 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3.2, 0.8, 1);
  return sprite;
}

// Build a recognizable, multi-part 3D model for the active topic right in the center stage!
function buildCenterpiece3DModel(modelType: TopicDetail['modelType']): THREE.Group {
  const group = new THREE.Group();

  const stdMat = (color: number, roughness = 0.35, metalness = 0.2) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });

  switch (modelType) {
    case 'monument': {
      // 3D Ancient Heritage Temple / Stupa & Ashoka Pillars on Stepped Sandstone Base
      const base1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 3.6), stdMat(0xd97706, 0.6));
      base1.position.y = -1.2;
      const base2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.35, 2.8), stdMat(0xf59e0b, 0.5));
      base2.position.y = -0.85;
      group.add(base1, base2);

      // 4 Carved Corner Pillars
      const pillarPositions = [
        [-1.0, -1.0],
        [1.0, -1.0],
        [-1.0, 1.0],
        [1.0, 1.0],
      ];
      pillarPositions.forEach(([px, pz]) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.8, 16), stdMat(0xfde68a, 0.4));
        pillar.position.set(px, 0.2, pz);
        group.add(pillar);
      });

      // Central Stupa Dome & Golden Finial
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        stdMat(0xfbbf24, 0.3, 0.4)
      );
      dome.position.y = -0.65;
      const roof = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.22, 2.5), stdMat(0xb45309, 0.5));
      roof.position.y = 1.1;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 16), stdMat(0xfacc15, 0.2, 0.7));
      spire.position.y = 1.65;
      group.add(dome, roof, spire);
      break;
    }

    case 'coins': {
      // 3D Ancient Gold, Silver & Copper Coins + Carved Inscription Stone + Clay Artifact Pot
      const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.3, 32), stdMat(0x78350f, 0.7));
      platform.position.y = -1.2;
      group.add(platform);

      // Gold Coin standing upright
      const goldCoin = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.22, 32), stdMat(0xfacc15, 0.2, 0.85));
      goldCoin.rotation.x = Math.PI / 2;
      goldCoin.position.set(-0.9, 0.1, 0.3);
      const coinInner = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.26, 8), stdMat(0xd97706, 0.3, 0.7));
      coinInner.rotation.x = Math.PI / 2;
      coinInner.position.set(-0.9, 0.1, 0.3);
      group.add(goldCoin, coinInner);

      // Stone Inscription Pillar/Tablet
      const tablet = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.1, 0.35), stdMat(0x94a3b8, 0.7));
      tablet.position.set(0.2, -0.05, -0.4);
      group.add(tablet);

      // Terracotta Clay Artifact Pot
      const potBody = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 24), stdMat(0xea580c, 0.5));
      potBody.position.set(1.1, -0.45, 0.5);
      const potNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.45, 20), stdMat(0xc2410c, 0.5));
      potNeck.position.set(1.1, 0.15, 0.5);
      group.add(potBody, potNeck);
      break;
    }

    case 'scroll': {
      // 3D Palm-Leaf Manuscript Scroll (താളിയോല ഗ്രന്ഥം) & Stylus (എഴുത്താണി)
      const parchment = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 1.6), stdMat(0xfef08a, 0.5));
      parchment.rotation.x = 0.35;
      group.add(parchment);

      // Wooden scroll rollers on left & right
      const rollerGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.9, 20);
      const rollerLeft = new THREE.Mesh(rollerGeo, stdMat(0x92400e, 0.5));
      rollerLeft.rotation.x = Math.PI / 2 + 0.35;
      rollerLeft.position.set(-1.45, 0, 0);

      const rollerRight = new THREE.Mesh(rollerGeo, stdMat(0x92400e, 0.5));
      rollerRight.rotation.x = Math.PI / 2 + 0.35;
      rollerRight.position.set(1.45, 0, 0);
      group.add(rollerLeft, rollerRight);

      // Inscribed lines on palm leaf
      for (let i = -1; i <= 1; i++) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.04, 0.08), stdMat(0x78350f));
        line.position.set(0, 0.09 - i * 0.14, i * 0.38);
        line.rotation.x = 0.35;
        group.add(line);
      }

      // Golden Stylus pen floating above
      const stylus = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.8, 16), stdMat(0xf59e0b, 0.2, 0.8));
      stylus.rotation.z = -0.6;
      stylus.position.set(0.4, 0.95, 0.2);
      group.add(stylus);
      break;
    }

    case 'hourglass': {
      // 3D Time Hourglass + 3 Historical Period Pillars (Ancient, Medieval, Modern / BCE-CE)
      const topFrame = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.2, 24), stdMat(0xfbbf24, 0.2, 0.7));
      topFrame.position.y = 1.35;
      const botFrame = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.2, 24), stdMat(0xfbbf24, 0.2, 0.7));
      botFrame.position.y = -1.35;

      const topBulb = new THREE.Mesh(
        new THREE.ConeGeometry(0.95, 1.25, 24),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, roughness: 0.1 })
      );
      topBulb.rotation.x = Math.PI;
      topBulb.position.y = 0.65;

      const botBulb = new THREE.Mesh(
        new THREE.ConeGeometry(0.95, 1.25, 24),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, transparent: true, opacity: 0.85, roughness: 0.2 })
      );
      botBulb.position.y = -0.65;

      group.add(topFrame, botFrame, topBulb, botBulb);

      // 3 Era Columns beside hourglass
      const colors = [0x10b981, 0x3b82f6, 0xec4899];
      colors.forEach((col, i) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.7 + i * 0.55, 0.45), stdMat(col));
        bar.position.set(-1.8 + i * 1.8, -1.0 + i * 0.25, -1.2);
        group.add(bar);
      });
      break;
    }

    case 'magnifier': {
      // 3D Archaeologist Magnifying Glass + Excavated Relic
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.16, 20, 48), stdMat(0xfbbf24, 0.2, 0.8));
      ring.position.set(-0.3, 0.4, 0);

      const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 1.05, 0.08, 32),
        new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.45, roughness: 0.1 })
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(-0.3, 0.4, 0);

      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.7, 16), stdMat(0x92400e, 0.5));
      handle.rotation.z = -0.75;
      handle.position.set(0.85, -0.75, 0);

      const relic = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), stdMat(0x10b981, 0.2, 0.5));
      relic.position.set(-0.3, 0.4, -0.5);

      group.add(ring, lens, handle, relic);
      break;
    }

    case 'flag_parliament': {
      // 3D Civic Parliament Rotunda + Indian Tricolour Flag
      const rotunda = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.9, 32), stdMat(0xf8fafc, 0.4));
      rotunda.position.y = -0.9;
      group.add(rotunda);

      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), stdMat(0xe2e8f0));
        col.position.set(Math.cos(a) * 1.85, -0.4, Math.sin(a) * 1.85);
        group.add(col);
      }

      // Flagpole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.6, 12), stdMat(0xfacc15, 0.2, 0.8));
      pole.position.set(0, 0.7, 0);
      group.add(pole);

      // Tricolour bands (Saffron, White, Green)
      const saffron = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 0.08), stdMat(0xf97316));
      saffron.position.set(0.75, 1.75, 0);
      const white = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 0.08), stdMat(0xffffff));
      white.position.set(0.75, 1.45, 0);
      const chakra = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16), stdMat(0x1d4ed8));
      chakra.rotation.x = Math.PI / 2;
      chakra.position.set(0.75, 1.45, 0);
      const green = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 0.08), stdMat(0x16a34a));
      green.position.set(0.75, 1.15, 0);
      group.add(saffron, white, chakra, green);
      break;
    }

    case 'globe': {
      // 3D Tilted Earth Globe with Continents & Equatorial Orbit Ring
      const earth = new THREE.Mesh(new THREE.SphereGeometry(1.45, 32, 32), stdMat(0x0284c7, 0.4, 0.1));
      group.add(earth);

      // Green Continent Patches
      const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), stdMat(0x16a34a, 0.6));
      c1.position.set(0.95, 0.45, 0.65);
      const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), stdMat(0x15803d, 0.6));
      c2.position.set(-0.85, -0.3, 0.85);
      const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), stdMat(0x22c55e, 0.6));
      c3.position.set(0.2, 0.85, -0.95);
      group.add(c1, c2, c3);

      // Axis Rod & Equatorial Ring
      const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.8, 12), stdMat(0xfacc15, 0.2, 0.8));
      axis.rotation.z = 0.41; // 23.5 deg tilt
      const eqRing = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.05, 16, 64), stdMat(0xfbbf24));
      eqRing.rotation.x = Math.PI / 2;
      eqRing.rotation.y = 0.41;
      group.add(axis, eqRing);
      break;
    }

    case 'compass': {
      // 3D 8-Point Golden Compass Rose & Map Base
      const mapBase = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.2, 0.25, 32), stdMat(0x1e293b, 0.4));
      mapBase.position.y = -0.5;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.12, 16, 48), stdMat(0xfacc15, 0.2, 0.8));
      rim.rotation.x = Math.PI / 2;
      rim.position.y = -0.38;

      // North Needle (Red) & South Needle (Silver)
      const northNeedle = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 8), stdMat(0xef4444, 0.3, 0.4));
      northNeedle.rotation.x = -Math.PI / 2;
      northNeedle.position.set(0, 0, -0.9);

      const southNeedle = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 8), stdMat(0xe2e8f0, 0.3, 0.5));
      southNeedle.rotation.x = Math.PI / 2;
      southNeedle.position.set(0, 0, 0.9);

      const eastWest = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 0.35), stdMat(0xfbbf24, 0.2, 0.7));
      group.add(mapBase, rim, northNeedle, southNeedle, eastWest);
      break;
    }

    case 'mountain': {
      // 3D Snow-Capped Himalayan Mountains, Deccan Plateau, Green Plains & River
      const terrain = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 3.2), stdMat(0x22c55e, 0.7));
      terrain.position.y = -1.1;
      group.add(terrain);

      // Peak 1 (Mount Everest / Himadri)
      const m1 = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.4, 7), stdMat(0x64748b, 0.7));
      m1.position.set(-0.9, 0.2, -0.4);
      const snow1 = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.95, 7), stdMat(0xffffff, 0.3));
      snow1.position.set(-0.9, 0.95, -0.4);

      // Peak 2
      const m2 = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.9, 7), stdMat(0x475569, 0.7));
      m2.position.set(0.4, -0.05, -0.6);
      const snow2 = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.75, 7), stdMat(0xf8fafc, 0.3));
      snow2.position.set(0.4, 0.55, -0.6);

      // Flat-topped Plateau & Blue River
      const plateau = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 0.8, 6), stdMat(0xd97706, 0.6));
      plateau.position.set(1.2, -0.55, 0.55);

      const river = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 3.1), stdMat(0x0ea5e9, 0.2));
      river.position.set(-0.1, -0.92, 0);
      group.add(m1, snow1, m2, snow2, plateau, river);
      break;
    }

    case 'river_dam': {
      // 3D Hydroelectric Dam Wall, Blue Reservoir, Monsoon Clouds & Sun
      const damWall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 0.5), stdMat(0x94a3b8, 0.5));
      damWall.position.set(0, -0.4, 0);
      const water = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 1.6), stdMat(0x0284c7, 0.2));
      water.position.set(0, -0.6, -1.0);

      // Fluffy White Cloud & Golden Sun above
      const cloud1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), stdMat(0xf8fafc));
      cloud1.position.set(-0.8, 1.35, 0);
      const cloud2 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), stdMat(0xe2e8f0));
      cloud2.position.set(-0.2, 1.3, 0.1);
      const sun = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), stdMat(0xfacc15, 0.1));
      sun.position.set(1.2, 1.45, -0.3);
      group.add(damWall, water, cloud1, cloud2, sun);
      break;
    }

    case 'tree_leaf': {
      // 3D Living Tree, Soil Layer Base & Golden Sun
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.2, 0.5, 24), stdMat(0x78350f, 0.8));
      soil.position.y = -1.15;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 1.8, 16), stdMat(0x92400e, 0.7));
      trunk.position.y = -0.2;

      const foliage1 = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 24), stdMat(0x16a34a, 0.5));
      foliage1.position.set(0, 1.0, 0);
      const foliage2 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 20), stdMat(0x22c55e, 0.5));
      foliage2.position.set(-0.7, 0.7, 0.4);
      const foliage3 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 20), stdMat(0x15803d, 0.5));
      foliage3.position.set(0.7, 0.7, -0.3);

      const sun = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20), stdMat(0xfacc15));
      sun.position.set(1.6, 1.6, 0);
      group.add(soil, trunk, foliage1, foliage2, foliage3, sun);
      break;
    }

    case 'tooth': {
      // 3D White Molar Tooth Model with Crown Cusps & Roots
      const crown = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.3, 1.7), stdMat(0xffffff, 0.15, 0.1));
      crown.position.y = 0.45;
      const cuspPositions = [
        [-0.45, 1.1, -0.45],
        [0.45, 1.1, -0.45],
        [-0.45, 1.1, 0.45],
        [0.45, 1.1, 0.45],
      ];
      cuspPositions.forEach(([cx, cy, cz]) => {
        const cusp = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), stdMat(0xf8fafc, 0.15));
        cusp.position.set(cx, cy, cz);
        group.add(cusp);
      });
      // Roots & Pink Gum Base
      const root1 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.4, 16), stdMat(0xfef08a, 0.3));
      root1.rotation.x = Math.PI;
      root1.position.set(-0.42, -0.75, 0);
      const root2 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.4, 16), stdMat(0xfef08a, 0.3));
      root2.rotation.x = Math.PI;
      root2.position.set(0.42, -0.75, 0);
      const gum = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.7, 0.45, 24), stdMat(0xf472b6, 0.4));
      gum.position.y = -0.35;
      group.add(crown, root1, root2, gum);
      break;
    }

    case 'food_plate': {
      // 3D Balanced Diet Plate with 5 Nutrient Groups
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 1.8, 0.22, 32), stdMat(0xf8fafc, 0.2));
      plate.position.y = -0.5;
      const rice = new THREE.Mesh(new THREE.SphereGeometry(0.65, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), stdMat(0xfef9c3));
      rice.position.set(-0.7, -0.4, -0.5);
      const veggies = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 1), stdMat(0x16a34a));
      veggies.position.set(0.75, -0.1, -0.5);
      const apple = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20), stdMat(0xef4444));
      apple.position.set(-0.6, -0.05, 0.65);
      const protein = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.45, 0.65), stdMat(0xd97706));
      protein.position.set(0.65, -0.15, 0.65);
      group.add(plate, rice, veggies, apple, protein);
      break;
    }

    case 'train_transport': {
      // 3D Express Train Engine on Tracks
      const track = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.15, 1.4), stdMat(0x475569));
      track.position.y = -1.0;
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 1.1), stdMat(0x2563eb, 0.3));
      body.position.set(0, -0.2, 0);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 1.05), stdMat(0xfacc15, 0.3));
      cab.position.set(-0.8, 0.6, 0);
      const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 1.2, 20), stdMat(0xef4444, 0.3));
      nose.rotation.z = Math.PI / 2;
      nose.position.set(1.1, -0.2, 0);
      group.add(track, body, cab, nose);
      break;
    }

    case 'satellite': {
      // 3D Space Communication Satellite with Solar Wings
      const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.5, 20), stdMat(0xfacc15, 0.2, 0.8));
      bus.rotation.z = Math.PI / 4;
      const wingLeft = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.9), stdMat(0x2563eb, 0.2, 0.6));
      wingLeft.position.set(-1.6, 0, 0);
      const wingRight = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.9), stdMat(0x2563eb, 0.2, 0.6));
      wingRight.position.set(1.6, 0, 0);
      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.4, 24), stdMat(0xf8fafc, 0.3));
      dish.position.set(0, 0.95, 0);
      group.add(bus, wingLeft, wingRight, dish);
      break;
    }

    case 'recycle_bin': {
      // 3D Green & Blue Recycling Bins + Clean Energy Wind Turbine
      const greenBin = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.52, 1.5, 20), stdMat(0x16a34a, 0.4));
      greenBin.position.set(-0.95, -0.3, 0);
      const blueBin = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.52, 1.5, 20), stdMat(0x2563eb, 0.4));
      blueBin.position.set(0.95, -0.3, 0);
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 2.6, 16), stdMat(0xf8fafc));
      tower.position.set(0, 0.3, -0.9);
      group.add(greenBin, blueBin, tower);
      break;
    }

    case 'abacus': {
      // 3D Multi-Rod Place Value Abacus
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 1.2), stdMat(0x92400e));
      base.position.y = -1.1;
      group.add(base);
      const rodColors = [0xef4444, 0xf59e0b, 0x10b981, 0x3b82f6];
      rodColors.forEach((col, rIdx) => {
        const rx = -1.2 + rIdx * 0.8;
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12), stdMat(0xe2e8f0));
        rod.position.set(rx, 0, 0);
        group.add(rod);
        for (let b = 0; b <= rIdx; b++) {
          const bead = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.12, 12, 24), stdMat(col, 0.25));
          bead.rotation.x = Math.PI / 2;
          bead.position.set(rx, -0.75 + b * 0.35, 0);
          group.add(bead);
        }
      });
      break;
    }

    case 'fraction_pie': {
      // 3D Sliced Fraction Wheel
      const sliceColors = [0xef4444, 0xfacc15, 0x10b981, 0x3b82f6];
      sliceColors.forEach((col, i) => {
        const slice = new THREE.Mesh(
          new THREE.CylinderGeometry(1.6, 1.6, 0.38, 24, 1, false, (i * Math.PI) / 2, Math.PI / 2 - 0.08),
          stdMat(col, 0.3)
        );
        const offset = i === 0 ? 0.25 : 0;
        slice.position.set(offset, 0, offset);
        slice.rotation.x = 0.45;
        group.add(slice);
      });
      break;
    }

    case 'clock': {
      // 3D Analog Clock Face with Hour & Minute Hands
      const face = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.25, 36), stdMat(0xf8fafc, 0.2));
      face.rotation.x = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.16, 16, 48), stdMat(0x3b82f6, 0.3));
      const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.1), stdMat(0xef4444));
      hourHand.position.set(0.3, 0.2, 0.18);
      hourHand.rotation.z = -0.8;
      const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.35, 0.1), stdMat(0x0f172a));
      minHand.position.set(0, 0.55, 0.2);
      group.add(face, rim, hourHand, minHand);
      break;
    }

    case 'lever_machine': {
      // 3D Simple Machine: Lever Plank, Triangular Fulcrum, Heavy Load & Effort Weight
      const fulcrum = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.1, 4), stdMat(0xf59e0b, 0.3));
      fulcrum.position.y = -0.6;
      const plank = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 0.9), stdMat(0x38bdf8, 0.3));
      plank.rotation.z = 0.18;
      plank.position.y = 0;
      const loadBox = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.85), stdMat(0xef4444, 0.3));
      loadBox.position.set(-1.3, 0.25, 0);
      loadBox.rotation.z = 0.18;
      const effortSphere = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20), stdMat(0x10b981, 0.3));
      effortSphere.position.set(1.3, 0.72, 0);
      group.add(fulcrum, plank, loadBox, effortSphere);
      break;
    }

    default: {
      // 3D Open Storybook Stage
      const leftPage = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 2.2), stdMat(0xfef9c3));
      leftPage.position.set(-0.78, -0.3, 0);
      leftPage.rotation.z = -0.15;
      const rightPage = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 2.2), stdMat(0xfef08a));
      rightPage.position.set(0.78, -0.3, 0);
      rightPage.rotation.z = 0.15;
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0), stdMat(0xf59e0b, 0.2, 0.6));
      star.position.y = 0.65;
      group.add(leftPage, rightPage, star);
      break;
    }
  }

  return group;
}

export default function ChapterConcept3D({ chapter, subject }: ChapterConcept3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { language, speak } = useApp();

  const topics =
    chapter?.topics && chapter.topics.length > 0 ? chapter.topics : [chapter?.title || 'Interactive 3D Concept'];
  const keyTerms = chapter?.keyTerms || [];
  const chapterId = chapter?.id || 'loading';

  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const selectedIndexRef = useRef(0);

  useEffect(() => {
    setSelectedTopicIndex(0);
    selectedIndexRef.current = 0;
  }, [chapterId]);

  useEffect(() => {
    selectedIndexRef.current = selectedTopicIndex;
  }, [selectedTopicIndex]);

  const topicDetails: TopicDetail[] = chapter
    ? topics.map((t, idx) => getTopicDetail(chapter, t, idx))
    : [];

  const activeDetail = topicDetails[selectedTopicIndex] || topicDetails[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !chapter) return;

    const width = container.clientWidth || 700;
    const height = 410;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1120);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(0, 3.8, 11.2);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Rich Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
    dirLight.position.set(8, 14, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1.4, 30);
    pointLight.position.set(-4, 4, 6);
    scene.add(pointLight);

    // Subtle Starfield Background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 180;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 42;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.11 });
    scene.add(new THREE.Points(starGeo, starMat));

    // 1. Center Stage 3D Model for the Active Topic
    const centerStageGroup = new THREE.Group();
    centerStageGroup.position.set(0, 0.35, 0);
    scene.add(centerStageGroup);

    const currentDetail = getTopicDetail(chapter, topics[selectedTopicIndex] || topics[0], selectedTopicIndex);
    const centerpieceModel = buildCenterpiece3DModel(currentDetail.modelType);
    centerStageGroup.add(centerpieceModel);

    // Center Stage Floating Title Sprite above the 3D Model
    const centerLabelSprite = createTextSprite(
      `${currentDetail.emoji} ${currentDetail.shortLabel}`,
      true,
      '#facc15'
    );
    centerLabelSprite.position.set(0, 2.55, 0);
    scene.add(centerLabelSprite);

    // Glowing Stage Ring under Centerpiece
    const stageRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.05, 16, 64),
      new THREE.MeshBasicMaterial({ color: NODE_COLORS[selectedTopicIndex % NODE_COLORS.length] })
    );
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = -1.25;
    scene.add(stageRing);

    // 2. Orbiting Topic Pedestal Nodes with Labeled 3D Sprites
    const topicMeshes: THREE.Mesh[] = [];
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const count = Math.max(1, topics.length);
    const radius = 4.9;

    topics.forEach((t, idx) => {
      const detail = getTopicDetail(chapter, t, idx);
      const angle = (idx / count) * Math.PI * 2 + 0.4;
      const color = NODE_COLORS[idx % NODE_COLORS.length];
      const isSelected = idx === selectedTopicIndex;

      const nodeGeo = isSelected
        ? new THREE.OctahedronGeometry(0.62, 0)
        : new THREE.CylinderGeometry(0.48, 0.56, 0.55, 20);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xfacc15 : color,
        roughness: 0.25,
        metalness: 0.35,
        emissive: isSelected ? 0xd97706 : 0x000000,
        emissiveIntensity: isSelected ? 0.4 : 0,
      });

      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const nx = Math.cos(angle) * radius;
      const nz = Math.sin(angle) * radius;
      mesh.position.set(nx, -0.55, nz);
      mesh.userData = { index: idx };
      orbitGroup.add(mesh);
      topicMeshes.push(mesh);

      // Floating 3D Label Sprite directly above each orbiting node
      const badgeText = `${idx + 1}. ${detail.emoji} ${detail.shortLabel}`;
      const labelSprite = createTextSprite(
        badgeText,
        isSelected,
        `#${color.toString(16).padStart(6, '0')}`
      );
      labelSprite.scale.set(2.5, 0.62, 1);
      labelSprite.position.set(nx, 0.35, nz);
      orbitGroup.add(labelSprite);
    });

    // Mouse / Touch Drag Rotation & Raycaster Click
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = clientX;
      prevY = clientY;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(topicMeshes);
      if (intersects.length > 0) {
        const hitIndex = intersects[0].object.userData.index;
        if (typeof hitIndex === 'number') {
          soundEffects.playPop();
          setSelectedTopicIndex(hitIndex);
        }
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;
      orbitGroup.rotation.y += deltaX * 0.007;
      centerStageGroup.rotation.y += deltaX * 0.01;
      centerStageGroup.rotation.x = Math.max(-0.4, Math.min(0.4, centerStageGroup.rotation.x + deltaY * 0.005));
      prevX = clientX;
      prevY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domElem.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        centerStageGroup.rotation.y += 0.007;
        orbitGroup.rotation.y += 0.0018;
      }

      centerStageGroup.position.y = 0.35 + Math.sin(elapsed * 2.2) * 0.08;

      topicMeshes.forEach((m, idx) => {
        m.rotation.y += 0.015;
        if (idx === selectedTopicIndex) {
          const pulse = 1.15 + Math.sin(elapsed * 4) * 0.08;
          m.scale.set(pulse, pulse, pulse);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 700;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElem.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [chapterId, selectedTopicIndex, topics.length]);

  if (!chapter || !activeDetail) {
    return (
      <div className="bg-slate-900 rounded-4xl p-12 border-4 border-sky-400 shadow-2xl text-white text-center font-bold">
        Loading 3D Chapter Model...
      </div>
    );
  }

  const handleSelectTopic = (idx: number) => {
    soundEffects.playPop();
    setSelectedTopicIndex(idx);
    const detail = topicDetails[idx];
    if (detail) {
      speak(language === 'ml' ? `${detail.title}. ${detail.explanationMl}` : `${detail.title}. ${detail.explanationEn}`);
    }
  };

  const handleNarrateChapter3D = () => {
    soundEffects.playPop();
    speak(
      language === 'ml'
        ? `${chapter.malayalamTitle}. ${activeDetail.explanationMl}`
        : `${chapter.title} — ${activeDetail.title}. ${activeDetail.explanationEn}`
    );
  };

  return (
    <div className="bg-slate-900 rounded-4xl p-5 sm:p-7 border-4 border-sky-400 shadow-2xl text-white space-y-5">
      {/* Top 3D Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
            {subject?.icon || '🧊'} {language === 'ml' ? subject?.malayalamName : subject?.name} • Chapter{' '}
            {chapter.chapterNumber} in 3D
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
            {language === 'ml' ? chapter.malayalamTitle : chapter.title}
          </h3>
          <p className="text-xs text-amber-300 font-bold mt-0.5">
            {language === 'ml' ? activeDetail.funFactMl : activeDetail.funFactEn}
          </p>
        </div>

        <button
          onClick={handleNarrateChapter3D}
          className="px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg btn-kid-3d self-start sm:self-auto flex-shrink-0"
        >
          <Volume2 className="w-4 h-4" />
          <span>{language === 'ml' ? 'ശബ്ദ വിവരണം കേൾക്കാം 🔊' : 'Narrate 3D Model 🔊'}</span>
        </button>
      </div>

      {/* Interactive 3D WebGL Viewport */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-inner">
        <div ref={mountRef} className="w-full h-[410px] cursor-grab active:cursor-grabbing" />

        {/* Overlay Active Topic Specific Explanation HUD */}
        <div className="bg-slate-900/95 border-t border-sky-400/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase text-amber-400 flex items-center space-x-1 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {activeDetail.emoji} 3D Model {selectedTopicIndex + 1} of {topics.length}: {activeDetail.shortLabel}
                </span>
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">
              {activeDetail.title}
            </h4>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              {language === 'ml' ? activeDetail.explanationMl : activeDetail.explanationEn}
            </p>
          </div>

          <button
            onClick={() => handleSelectTopic((selectedTopicIndex + 1) % topics.length)}
            className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs whitespace-nowrap shadow-md shrink-0"
          >
            {language === 'ml' ? 'അടുത്ത 3D മോഡൽ 👉' : 'Next 3D Model 👉'}
          </button>
        </div>
      </div>

      {/* Topic Selector Buttons for this Chapter */}
      <div className="space-y-2">
        <p className="text-xs font-black uppercase text-sky-300 tracking-wider">
          🎯 {language === 'ml' ? 'ഈ അധ്യായത്തിലെ 3D മോഡലുകൾ (Tap to Switch 3D Model & Listen):' : 'Chapter 3D Models (Tap Any Topic to Switch 3D Model & Listen):'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {topicDetails.map((detail, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTopic(idx)}
              className={`p-3.5 rounded-2xl text-left text-xs sm:text-sm font-black transition flex items-center justify-between border-2 ${
                selectedTopicIndex === idx
                  ? 'bg-sky-500 text-slate-950 border-amber-300 shadow-lg scale-[1.01]'
                  : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-sky-400'
              }`}
            >
              <span className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-black/25 flex items-center justify-center text-base shrink-0">
                  {detail.emoji}
                </span>
                <span>{detail.title}</span>
              </span>
              <Volume2 className="w-4 h-4 flex-shrink-0 ml-2 opacity-80" />
            </button>
          ))}
        </div>
      </div>

      {/* Key Terms Pills */}
      {keyTerms.length > 0 && (
        <div className="pt-2 border-t border-slate-800 flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-black uppercase text-slate-400 mr-1">
            🔑 {language === 'ml' ? 'പ്രധാന പദങ്ങൾ:' : '3D Key Terms (Tap to Hear):'}
          </span>
          {keyTerms.map((term, i) => (
            <button
              key={i}
              onClick={() => {
                soundEffects.playPop();
                speak(`${term}. From ${chapter.title}`);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-sky-200 hover:text-white text-xs font-bold border border-slate-700 transition flex items-center space-x-1"
            >
              <span>{term}</span>
              <Volume2 className="w-3 h-3 opacity-70" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
