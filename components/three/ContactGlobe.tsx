"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PointMaterial, Points } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { useThemePalette } from "@/lib/hooks/useThemePalette";

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function GlobeScene() {
  const palette = useThemePalette();
  const globeRef = useRef<Group>(null);
  const marker = useMemo(() => latLonToVector3(18.52, 73.86, 1.24), []);
  const stars = useMemo(() => {
    return Array.from({ length: 800 }, () => [
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 16,
    ]);
  }, []);

  useFrame((state) => {
    if (!globeRef.current) return;
    globeRef.current.rotation.y = state.clock.elapsedTime * 0.18;
    globeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[3, 3, 3]} intensity={28} color={palette.cyan} />
      <Points positions={stars as [number, number, number][]} stride={3}>
        <PointMaterial color={palette.mist} size={0.03} transparent opacity={0.3} depthWrite={false} />
      </Points>
      <group ref={globeRef}>
        <mesh>
          <sphereGeometry args={[1.2, 40, 40]} />
          <meshStandardMaterial
            color={palette.surface}
            emissive={palette.cyan}
            emissiveIntensity={0.05}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[marker.x, marker.y, marker.z]}>
          <sphereGeometry args={[0.05, 24, 24]} />
          <meshBasicMaterial color={palette.green} toneMapped={false} />
        </mesh>
      </group>
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.8} />
    </>
  );
}

export function ContactGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 4.2], fov: 38 }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <GlobeScene />
      </Suspense>
    </Canvas>
  );
}
