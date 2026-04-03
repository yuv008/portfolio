"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Text } from "@react-three/drei";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force-3d";
import { Group } from "three";
import { skillClusters } from "@/lib/constants";
import { useThemePalette } from "@/lib/hooks/useThemePalette";

type GraphNode = {
  id: string;
  label: string;
  group: string;
  x?: number;
  y?: number;
  z?: number;
};

type GraphLink = {
  source: string;
  target: string;
};

type ResolvedLink = {
  source: [number, number, number];
  target: [number, number, number];
};

function ForceGraphScene() {
  const palette = useThemePalette();
  const groupRef = useRef<Group>(null);

  const { nodes, links } = useMemo(() => {
    const graphNodes: GraphNode[] = [];
    const graphLinks: GraphLink[] = [];

    skillClusters.forEach((cluster) => {
      const hubId = `${cluster.label}-hub`;
      graphNodes.push({ id: hubId, label: cluster.label, group: cluster.label });
      cluster.skills.forEach((skill) => {
        graphNodes.push({ id: skill, label: skill, group: cluster.label });
        graphLinks.push({ source: hubId, target: skill });
      });
    });

    const sim = forceSimulation(graphNodes as never)
      .numDimensions(3)
      .force("charge", forceManyBody().strength(-28))
      .force(
        "link",
        forceLink(graphLinks)
          .id((node) => (node as GraphNode).id)
          .distance(1.6),
      )
      .force("center", forceCenter(0, 0, 0))
      .force("collision", forceCollide(0.46))
      .stop();

    for (let i = 0; i < 260; i++) sim.tick();

    const scale = 0.38;
    const resolvedNodes = graphNodes.map((n, i) => ({
      ...n,
      position: [
        (n.x ?? 0) * scale + Math.sin(i * 0.9) * 0.04,
        (n.y ?? 0) * scale,
        (n.z ?? 0) * scale,
      ] as [number, number, number],
    }));

    const posMap = new Map(resolvedNodes.map((n) => [n.id, n.position]));

    const resolvedLinks: ResolvedLink[] = graphLinks
      .map((link) => {
        const src = posMap.get(link.source as string);
        const tgt = posMap.get(link.target as string);
        if (!src || !tgt) return null;
        return { source: src, target: tgt };
      })
      .filter((l): l is ResolvedLink => l !== null);

    return { nodes: resolvedNodes, links: resolvedLinks };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.07;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
  });

  const groupColors: Record<string, string> = {
    "AI / ML": palette.cyan,
    Infra: palette.amber,
    Frontend: palette.violet,
  };

  return (
    <>
      <color attach="background" args={["#080c12"]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 4, 4]} intensity={24} color={palette.cyan} />
      <pointLight position={[-4, -2, 2]} intensity={16} color={palette.violet} />
      <group ref={groupRef}>
        {links.map((link, i) => (
          <Line
            key={i}
            points={[link.source, link.target]}
            color={palette.mist}
            lineWidth={0.8}
            transparent
            opacity={0.28}
          />
        ))}
        {nodes.map((node) => {
          const color = groupColors[node.group] ?? palette.mist;
          const isHub = node.id.endsWith("-hub");

          return (
            <group key={node.id} position={node.position}>
              <mesh>
                <sphereGeometry args={[isHub ? 0.22 : 0.11, 28, 28]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={isHub ? 0.55 : 0.25}
                  roughness={0.3}
                  toneMapped={false}
                />
              </mesh>
              <Text
                position={[0, isHub ? 0.4 : 0.24, 0]}
                fontSize={isHub ? 0.17 : 0.1}
                color={isHub ? color : palette.mist}
                anchorX="center"
                anchorY="middle"
                renderOrder={1}
              >
                {node.label}
              </Text>
            </group>
          );
        })}
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        makeDefault
      />
    </>
  );
}

export function SkillsForceGraph() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 46 }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ForceGraphScene />
      </Suspense>
    </Canvas>
  );
}
