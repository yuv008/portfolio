"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";
import { useThemePalette } from "@/lib/hooks/useThemePalette";

// Original organic layout: outer ring + center hub + 2 inner nodes
const NODE_POSITIONS: [number, number, number][] = [
  [-1.8,  0.6,  0.1],
  [-1.1,  1.5, -0.7],
  [ 0.1,  1.8,  0.6],
  [ 1.5,  1.1, -0.3],
  [ 2.0, -0.1,  0.4],
  [ 1.4, -1.3, -0.8],
  [ 0.2, -1.8,  0.5],
  [-1.3, -1.2, -0.4],
  [-2.1, -0.2,  0.8],
  [ 0.0,  0.0,  0.0], // center hub — node 9
  [ 0.8,  0.3, -1.4],
  [-0.9,  0.2,  1.4],
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0], // outer ring
  [9, 0], [9, 2], [9, 4], [9, 6], [9, 8],                                   // hub to ring
  [10, 2], [10, 5],                                                           // inner A
  [11, 1], [11, 7],                                                           // inner B
];

function ParticleField({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  const positions = useMemo<Float32Array>(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <group ref={ref}>
      <Points positions={positions} stride={3}>
        <PointMaterial
          color={color}
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function NeuralGraphScene() {
  const palette = useThemePalette();
  const graphRef = useRef<THREE.Group>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  useFrame((state) => {
    if (!graphRef.current) return;
    graphRef.current.rotation.y = state.clock.elapsedTime * 0.18;
    graphRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
  });

  return (
    <>
      <color attach="background" args={["#080c12"]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 0, 5]}  intensity={25} color={palette.cyan} />
      <pointLight position={[4, -2, 1]} intensity={18} color={palette.violet} />
      <ParticleField color={palette.mist} />
      <group ref={graphRef}>
        {EDGES.map(([from, to], index) => {
          const isActive = activeNode === from || activeNode === to;
          return (
            <Line
              key={`${from}-${to}-${index}`}
              points={[NODE_POSITIONS[from], NODE_POSITIONS[to]]}
              color={isActive ? palette.cyan : palette.violet}
              lineWidth={isActive ? 1.8 : 1.0}
              transparent
              opacity={isActive ? 0.9 : 0.35}
            />
          );
        })}
        {NODE_POSITIONS.map((position, index) => {
          const isCenter    = index === 9;
          const isActive    = activeNode === index;
          const color = isCenter ? palette.amber : isActive ? palette.cyan : palette.violet;
          const radius = isCenter ? 0.18 : 0.13;

          return (
            <Float
              key={index}
              speed={1.6 + index * 0.05}
              rotationIntensity={0.15}
              floatIntensity={0.55}
            >
              <mesh
                position={position}
                scale={isActive ? 1.6 : isCenter ? 1.4 : 1}
                onPointerOver={() => setActiveNode(index)}
                onPointerOut={() => setActiveNode(null)}
              >
                <sphereGeometry args={[radius, 28, 28]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={isActive ? 0.9 : isCenter ? 0.55 : 0.35}
                  roughness={0.25}
                  toneMapped={false}
                />
              </mesh>
            </Float>
          );
        })}
      </group>
      <EffectComposer>
        <Bloom intensity={1.4} luminanceThreshold={0.2} luminanceSmoothing={0.85} />
      </EffectComposer>
    </>
  );
}

export function HeroNeuralGraph() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <NeuralGraphScene />
      </Suspense>
    </Canvas>
  );
}
