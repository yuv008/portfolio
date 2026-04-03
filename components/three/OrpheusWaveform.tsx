"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Mesh, PlaneGeometry } from "three";
import { useThemePalette } from "@/lib/hooks/useThemePalette";

function WavePlane() {
  const palette = useThemePalette();
  const meshRef = useRef<Mesh<PlaneGeometry>>(null);
  const geometry = useMemo(() => new PlaneGeometry(5.6, 1.8, 92, 18), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const positions = geometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = Math.sin(x * 2.2 + state.clock.elapsedTime * 2.4) * 0.18;
      const ripple = Math.cos(x * 1.3 - state.clock.elapsedTime * 1.9) * 0.08;
      positions.setZ(index, y + ripple);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    meshRef.current.rotation.x = -0.78;
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 2, 3]} intensity={28} color={palette.cyan} />
      <mesh ref={meshRef} geometry={geometry} position={[0, -0.25, 0]}>
        <meshStandardMaterial
          color={palette.violet}
          emissive={palette.cyan}
          emissiveIntensity={0.24}
          wireframe
        />
      </mesh>
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.1} luminanceSmoothing={0.6} />
      </EffectComposer>
    </>
  );
}

export function OrpheusWaveform() {
  return (
    <Canvas camera={{ position: [0, 1.1, 4.8], fov: 42 }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <WavePlane />
      </Suspense>
    </Canvas>
  );
}
