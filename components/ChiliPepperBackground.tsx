"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Trail,
  Billboard,
  SpotLight,
  Sparkles,
  PointMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

// Types for our components
type ChiliPepperProps = {
  heatLevel: number;
  modelPath: string;
};

type FlameParticleProps = {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
  turbulence?: number;
};

type FlamesProps = {
  count: number;
  intensity: number;
  sideFlames?: boolean;
};

type SmokeParticleProps = {
  position: [number, number, number];
  scale: number;
  speed: number;
  opacity: number;
};

type SmokeProps = {
  count: number;
  intensity: number;
};

// Types for screen-wide effects
type ScreenSmokeProps = {
  intensity: number;
};

type BottomFlameProps = {
  position: [number, number, number];
  scale: number;
  color: string;
};

// Tiny flame at the bottom of the screen
const BottomFlame: React.FC<BottomFlameProps> = ({
  position,
  scale,
  color,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create a small flame shape
  const flameGeometry = useMemo(() => {
    return new THREE.ConeGeometry(scale, scale * 2, 4, 1, true);
  }, [scale]);

  // Material with glow effect
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        blending: THREE.AdditiveBlending,
      }),
    [color]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();

    // Subtle flickering effect
    const flicker = Math.sin(time * (3 + position[0] * 2)) * 0.2;
    meshRef.current.scale.set(
      1 + flicker * 0.3,
      1 + Math.abs(flicker) * 0.5,
      1 + flicker * 0.3
    );

    // Subtle position change
    meshRef.current.position.y =
      position[1] + Math.sin(time * 2 + position[0]) * 0.03;

    // Opacity flicker
    material.opacity = 0.7 + Math.sin(time * 3 + position[0] * 3) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[Math.PI, 0, 0]}>
      <primitive object={flameGeometry} />
      <primitive object={material} />

      {/* Tiny point light for each flame */}
      <pointLight color={color} intensity={0.3} distance={1} decay={2} />
    </mesh>
  );
};

// Create defined types for our particles to ensure type safety
type SmokeParticleData = {
  position: [number, number, number];
  scale: number;
  speed: number;
  opacity: number;
  id: string;
};

type FlameParticleData = {
  isFlame: true;
  position: [number, number, number];
  scale: number;
  color: string;
  id: string;
};

// Type for particles returned from useMemo
type ParticleData = SmokeParticleData | FlameParticleData;

// Screen-wide smoke effect component
const ScreenSmoke: React.FC<ScreenSmokeProps> = ({ intensity }) => {
  const { viewport } = useThree();

  // Create smoke particles distributed across the bottom
  const smokeParticles = useMemo<ParticleData[]>(() => {
    const particles: ParticleData[] = [];
    const count = 15; // Number of smoke emitters across screen width

    for (let i = 0; i < count; i++) {
      // Position smoke across the viewport width
      const xPos = (i / (count - 1)) * viewport.width - viewport.width / 2;

      // Calculate intensity based on position (more visible at edges)
      // This creates a parabolic distribution with lowest opacity in the center
      const distanceFromCenter = Math.abs(xPos) / (viewport.width / 2);
      const particleIntensity = 0.2 + distanceFromCenter * 0.8;

      // Create multiple particles per position with varying heights
      for (let j = 0; j < 3; j++) {
        particles.push({
          position: [
            xPos + (Math.random() * 0.5 - 0.25), // Add some randomness
            -viewport.height / 2 + 0.2 + j * 0.3, // Stack vertically from bottom
            Math.random() * 1 - 0.5, // Some depth variation
          ] as [number, number, number],
          scale: 0.2 + Math.random() * 0.3,
          speed: 0.2 + Math.random() * 0.3,
          opacity: particleIntensity * intensity * (0.1 + Math.random() * 0.1),
          id: `${i}-${j}`,
        });
      }

      // Add tiny flames at random positions
      if (Math.random() > 0.5) {
        particles.push({
          isFlame: true,
          position: [
            xPos + (Math.random() * 0.5 - 0.25),
            -viewport.height / 2 + 0.1,
            Math.random() * 0.5,
          ] as [number, number, number],
          scale: 0.03 + Math.random() * 0.04,
          color: Math.random() > 0.5 ? "#ff4500" : "#ffdd00",
          id: `flame-${i}`,
        });
      }
    }

    return particles;
  }, [viewport, intensity]);

  return (
    <group>
      {/* Render smoke particles */}
      {smokeParticles.map((particle) =>
        "isFlame" in particle ? (
          <BottomFlame
            key={particle.id}
            position={particle.position}
            scale={particle.scale}
            color={particle.color}
          />
        ) : (
          <SmokeParticle
            key={particle.id}
            position={particle.position}
            scale={particle.scale}
            speed={particle.speed}
            opacity={particle.opacity}
          />
        )
      )}
    </group>
  );
};

// Enhanced flame particle effect
const FlameParticle: React.FC<FlameParticleProps> = ({
  position,
  scale,
  speed,
  color,
  turbulence = 0.5,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create a more complex shape for flames
  const flameGeometry = useMemo(() => {
    // Use a cone for flame shape instead of sphere
    return new THREE.ConeGeometry(scale, scale * 2, 8, 1, true);
  }, [scale]);

  // Optimize with memoized material
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();

    // More complex animation for realistic flames
    meshRef.current.position.y += 0.02 * speed;
    meshRef.current.position.x +=
      Math.sin(time * speed * 2) * 0.004 * turbulence;
    meshRef.current.position.z +=
      Math.cos(time * speed * 2) * 0.004 * turbulence;

    // Rotate for dynamic look
    meshRef.current.rotation.x = Math.sin(time * speed) * 0.1;
    meshRef.current.rotation.z = Math.cos(time * speed) * 0.1;

    // Scale change for flickering effect
    const scaleFlicker = 1 + Math.sin(time * speed * 5) * 0.1;
    meshRef.current.scale.set(scaleFlicker, 1, scaleFlicker);

    // Adjust opacity for flame lifecycle - fade out as it rises
    material.opacity = Math.max(0, 1 - meshRef.current.position.y * 0.5);

    // Reset the flame when it gets too high
    if (meshRef.current.position.y > 2 || material.opacity <= 0.05) {
      meshRef.current.position.set(position[0], position[1], position[2]);
      material.opacity = 1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[Math.PI, 0, 0]}>
      <primitive object={flameGeometry} />
      <primitive object={material} />
    </mesh>
  );
};

// Smoke particle effect
const SmokeParticle: React.FC<SmokeParticleProps> = ({
  position,
  scale,
  speed,
  opacity,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#555555",
        transparent: true,
        opacity,
        blending: THREE.NormalBlending,
      }),
    [opacity]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();

    // Slow upward drift
    meshRef.current.position.y += 0.01 * speed;

    // Gentle swaying motion
    meshRef.current.position.x += Math.sin(time * speed * 0.5) * 0.003;
    meshRef.current.position.z += Math.cos(time * speed * 0.5) * 0.003;

    // Slowly rotate for realistic smoke
    meshRef.current.rotation.y += 0.003 * speed;

    // Expand as it rises
    const expansion = 1 + meshRef.current.position.y * 0.1;
    meshRef.current.scale.set(expansion, expansion, expansion);

    // Fade out
    material.opacity = Math.max(0, opacity - meshRef.current.position.y * 0.2);

    // Reset when it dissipates
    if (meshRef.current.position.y > 3 || material.opacity <= 0.02) {
      meshRef.current.position.set(position[0], position[1], position[2]);
      meshRef.current.scale.set(1, 1, 1);
      material.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[scale, 8, 8]} />
      <primitive object={material} />
    </mesh>
  );
};

// Smoke collection
const Smoke: React.FC<SmokeProps> = ({ count, intensity }) => {
  // Memoize smoke particles
  const smokeParticles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Create smoke particles in a ring around the top of the pepper
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.2;

      return {
        position: [
          Math.sin(angle) * radius,
          0.1 + Math.random() * 0.3, // Start slightly above flames
          Math.cos(angle) * radius,
        ] as [number, number, number],
        scale: 0.1 + Math.random() * 0.1,
        speed: 0.5 + Math.random(),
        opacity: 0.2 + Math.random() * 0.3 * intensity,
      };
    });
  }, [count, intensity]);

  return (
    <group>
      {smokeParticles.map((props, i) => (
        <SmokeParticle key={i} {...props} />
      ))}

      {/* Add volumetric smoke effect with Sparkles */}
      <Sparkles
        count={50}
        scale={[1, 2, 1]}
        size={6}
        speed={0.3}
        color="#444444"
        opacity={0.3 * intensity}
        position={[0, 0.5, 0]}
      />
    </group>
  );
};

// Collection of enhanced flame particles
const Flames: React.FC<FlamesProps> = ({
  count,
  intensity,
  sideFlames = false,
}) => {
  // Optimize by memoizing flame positions and properties
  const flames = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Create different flame patterns based on whether these are side flames
      let position: [number, number, number];
      let scale: number;
      let color: string;

      if (sideFlames) {
        // Side flames - create in specific locations on sides
        const side = i % 2 === 0 ? -1 : 1; // Alternate left/right
        const yPos = -0.5 + (Math.floor(i / 2) % 3) * 0.3; // Distribute vertically

        position = [
          side * (0.4 + Math.random() * 0.1),
          yPos,
          0.1 - Math.random() * 0.2,
        ];

        scale = 0.08 + Math.random() * 0.12;

        // Hotter colors for side flames
        const colors = ["#ffdd00", "#ff9500", "#ff5000", "#ff2200"];
        color = colors[Math.floor(Math.random() * colors.length)];
      } else {
        // Bottom flames - create in a ring under the pepper
        const angle = (i / count) * Math.PI * 2;
        const radius = 0.25 + Math.random() * 0.15;

        position = [
          Math.sin(angle) * radius,
          -0.9 + Math.random() * 0.2,
          Math.cos(angle) * radius,
        ];

        scale = 0.1 + Math.random() * 0.15;

        // Base flame colors
        color = i % 3 === 0 ? "#ff4500" : i % 3 === 1 ? "#ffdd00" : "#ff7700";
      }

      return {
        position,
        scale,
        speed: 1 + Math.random() * 2,
        color,
        turbulence: sideFlames ? 0.8 : 0.4,
      };
    });
  }, [count, sideFlames]);

  return (
    <group>
      {flames.map((props, i) => (
        <FlameParticle key={i} {...props} />
      ))}

      {/* Add glow effects */}
      {sideFlames ? (
        // Side glows
        <>
          <pointLight
            position={[0.5, -0.5, 0]}
            color="#ff6000"
            intensity={intensity}
            distance={3}
            decay={2}
          />
          <pointLight
            position={[-0.5, -0.5, 0]}
            color="#ff6000"
            intensity={intensity}
            distance={3}
            decay={2}
          />
        </>
      ) : (
        // Bottom glow
        <pointLight
          position={[0, -0.9, 0]}
          color="#ff6000"
          intensity={intensity * 2}
          distance={5}
          decay={2}
        />
      )}
    </group>
  );
};

// Main chili pepper component
const ChiliPepper: React.FC<ChiliPepperProps> = ({ heatLevel, modelPath }) => {
  const pepperRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);

  // Clone the model to avoid mutating the original
  const model = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    // Apply materials and setup for the imported model
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Enhance the material of the chili model
        if (child.material) {
          // We'll assume the main body is reddish - add emissive properties
          if (child.material.color?.r > 0.5) {
            child.material.emissive = new THREE.Color("#410000");
            child.material.emissiveIntensity = 0.3;
          }
        }
      }
    });
    model.scale.set(0.3, 0.3, 0.3);
    model.rotation.y = Math.PI / 2;
  }, [model]);

  useFrame(({ clock }) => {
    if (!pepperRef.current) return;

    const time = clock.getElapsedTime();

    // Gentle floating motion - reduced amplitude for smaller model
    pepperRef.current.position.y = Math.sin(time * 0.8) * 0.05;

    // Subtle rotation - now mostly around z-axis for sideways pepper
    // This creates a gentle rocking motion for the sideways pepper
    pepperRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;

    // Update emissive properties based on heat level
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if ("emissiveIntensity" in child.material) {
          child.material.emissiveIntensity =
            0.3 + Math.sin(time * 2) * 0.1 * heatLevel;
        }
      }
    });
  });

  return (
    <group ref={pepperRef}>
      {/* Imported chili model */}
      <primitive object={model} />

      {/* Trail for the pepper when moving - adjusted for sideways orientation */}
      <Trail
        width={0.6} // Reduced for smaller model
        length={6}
        color="#ff4500"
        attenuation={(width) => width}
      >
        <mesh visible={false} position={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </Trail>

      {/* Bottom flame effects - repositioned for sideways model */}
      <Flames
        count={6 + Math.floor(heatLevel * 4)}
        intensity={0.7 + heatLevel * 0.3}
      />

      {/* Side flame effects - repositioned for sideways model */}
      <Flames
        count={10 + Math.floor(heatLevel * 4)}
        intensity={0.9 + heatLevel * 0.4}
        sideFlames={true}
      />

      {/* Smoke effects - adjusted for sideways model */}
      <Smoke
        count={8 + Math.floor(heatLevel * 4)}
        intensity={0.6 + heatLevel * 0.4}
      />
    </group>
  );
};

// Mouse parallax effect - reused from original
const MouseParallaxEffect: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ mouse }) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      (mouse.x * Math.PI) / 20,
      0.02
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      (mouse.y * Math.PI) / 20,
      0.02
    );
  });

  return <group ref={groupRef}>{children}</group>;
};

const SceneContainer: React.FC = () => {
  const { theme } = useTheme();
  const isHotMode = theme === "dark";
  const heatLevel = isHotMode ? 1.0 : 0.6;

  const modelPath = "/red_pepper/result.gltf";

  return (
    <MouseParallaxEffect>
      {/* Ambient lighting */}
      <ambientLight intensity={isHotMode ? 0.3 : 0.5} />

      {/* Main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={isHotMode ? 0.8 : 1.2}
        color={isHotMode ? "#ff9500" : "#ffffff"}
      />

      {/* Add dramatic spot light for enhanced visuals */}
      <SpotLight
        position={[5, 10, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={isHotMode ? 1.5 : 1.0}
        color="#ff6000"
        castShadow
        distance={15}
      />

      {/* Background environment */}
      <color attach="background" args={[isHotMode ? "#120000" : "#1a0f05"]} />

      {/* Screen-wide smoke effects */}
      <ScreenSmoke intensity={isHotMode ? 1.0 : 0.7} />

      {/* Pepper with heat level based on theme */}
      <ChiliPepper modelPath={modelPath} heatLevel={heatLevel} />

      {/* Background sparkle effects */}
      <Sparkles
        count={100}
        scale={8}
        size={0.6}
        speed={0.3}
        color={isHotMode ? "#ff6000" : "#ff9500"}
        opacity={0.2}
      />
    </MouseParallaxEffect>
  );
};

// Main component with proper export name
const ChiliPepperBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        shadows
      >
        <SceneContainer />
      </Canvas>
    </div>
  );
};

export default ChiliPepperBackground;
