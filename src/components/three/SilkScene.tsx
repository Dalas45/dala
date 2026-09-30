"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * 3D-achtergrond voor de donkere hero: zijde die in het donker beweegt en
 * alleen daar oplicht waar het strijklicht hem raakt.
 *
 * Bewuste keuzes:
 * - Twee planes op verschillende diepte geven parallax zonder extra geometrie.
 * - Eén custom shader; geen modellen, texturen of post-processing, dus de
 *   bundel blijft klein en het draait ook op bescheiden hardware.
 * - dpr geplafonneerd op 1.5; de frameloop stopt zodra de hero uit beeld is.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAmplitude;
  varying vec2 vUv;
  varying vec3 vNormalW;

  // Drie gekruiste golven geven een doekachtige, niet-repetitieve beweging.
  float silk(vec2 p, float t) {
    float w1 = sin(p.x * 1.9 + t * 0.38) * 0.36;
    float w2 = sin(p.y * 1.4 - t * 0.27 + p.x * 0.8) * 0.28;
    float w3 = sin((p.x + p.y) * 1.05 + t * 0.21) * 0.2;
    return w1 + w2 + w3;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // De muis duwt het doek subtiel op.
    float pointer = exp(-distance(uv, uPointer * 0.5 + 0.5) * 2.8) * 0.4;
    float wave = silk(pos.xy, uTime) + pointer;

    float edge = smoothstep(0.0, 0.32, uv.y) * smoothstep(1.0, 0.7, uv.y);
    pos.z += wave * (0.5 + edge * 0.9) * uAmplitude;

    // Normaal benaderen met twee offset-samples: genoeg voor de glans en veel
    // goedkoper dan echte normalen berekenen.
    float eps = 0.12;
    float dx = silk(pos.xy + vec2(eps, 0.0), uTime) - silk(pos.xy - vec2(eps, 0.0), uTime);
    float dy = silk(pos.xy + vec2(0.0, eps), uTime) - silk(pos.xy - vec2(0.0, eps), uTime);
    vNormalW = normalize(vec3(-dx, -dy, eps * 2.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uColorDeep;
  uniform vec3 uColorSheen;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vNormalW;

  void main() {
    vec3 lightDir = normalize(vec3(0.3, 0.7, 0.62));
    float diffuse = clamp(dot(vNormalW, lightDir) * 0.5 + 0.5, 0.0, 1.0);

    // Smalle specular band: het strijklicht over de zijde.
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float sheen = pow(clamp(dot(vNormalW, halfDir), 0.0, 1.0), 26.0);

    // In het donker blijft de basis vrijwel zwart; alleen de glans draagt kleur.
    // De waarden zijn bewust laag: de zijde is een accent achter de typografie,
    // geen achtergrondkleur. Op een smal scherm vult de scene het hele beeld,
    // en dan valt elke overmaat meteen op.
    vec3 color = uColorDeep * (0.22 + diffuse * 0.3);
    color += uColorSheen * smoothstep(0.35, 0.95, sheen) * 0.55;

    // Onderin dieper, bovenin iets opener.
    color *= 0.45 + vUv.y * 0.4;

    // Fijne korrel voorkomt banding in de donkere verlopen.
    float grain = fract(sin(dot(vUv * 640.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    color += grain * 0.016;

    float alpha = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
    gl_FragColor = vec4(color, alpha * uOpacity);
  }
`;

interface PlaneProps {
  /** Schaalfactor ten opzichte van de viewport. */
  spread: number;
  rotation: number;
  amplitude: number;
  opacity: number;
  /** Snelheid van de tijdas; verschillende waarden voorkomen dat lagen synchroon lopen. */
  speed: number;
  colorSheen: string;
  positionZ: number;
  /** Vaste startpositie op de tijdas, zodat de lagen niet in fase beginnen. */
  timeOffset: number;
}

function SilkPlane({ spread, rotation, amplitude, opacity, speed, colorSheen, positionZ, timeOffset }: PlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));
  const viewport = useThree((state) => state.viewport);

  const uniforms = useMemo(
    () => ({
      uTime: { value: timeOffset },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uAmplitude: { value: amplitude },
      uOpacity: { value: opacity },
      uColorDeep: { value: new THREE.Color("#1a1512") },
      uColorSheen: { value: new THREE.Color(colorSheen) },
    }),
    [amplitude, opacity, colorSheen, timeOffset],
  );

  // Pointer-interactie alleen op apparaten met een echte muis.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      target.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;
    // Delta plafonneren voorkomt een sprong na het terugkeren naar de tab.
    material.uniforms.uTime!.value += Math.min(delta, 0.05) * speed;
    pointer.current.lerp(target.current, 0.035);
    (material.uniforms.uPointer!.value as THREE.Vector2).copy(pointer.current);
  });

  const scale = Math.max(viewport.width, viewport.height) * spread;

  return (
    <mesh scale={[scale, scale, 1]} position={[0, 0, positionZ]} rotation={[0, 0, rotation]} frustumCulled={false}>
      <planeGeometry args={[1, 1, 84, 84]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function SilkScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Pauzeer het renderen zodra de hero buiten beeld is; dat scheelt GPU-werk tijdens het scrollen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setActive(Boolean(entry?.isIntersecting)), { threshold: 0.01 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        style={{ pointerEvents: "none" }}
      >
        {/* Achterste laag: traag, breed, champagne-glans */}
        <SilkPlane
          spread={1.6}
          rotation={-0.24}
          amplitude={1.15}
          opacity={0.5}
          speed={0.75}
          colorSheen="#a98c58"
          positionZ={-0.6}
          timeOffset={0}
        />
        {/* Voorste laag: sneller en smaller, warmer licht. De tijdverschuiving
            zorgt dat beide lagen niet in fase lopen. */}
        <SilkPlane
          spread={1.2}
          rotation={0.16}
          amplitude={0.8}
          opacity={0.32}
          speed={1.15}
          colorSheen="#d8bd8a"
          positionZ={0.2}
          timeOffset={17.3}
        />
      </Canvas>
    </div>
  );
}
