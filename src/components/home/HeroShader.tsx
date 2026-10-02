"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroShader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let animationFrameId: number;

    const container = containerRef.current;
    if (!container) return;

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Fragment shader: Subtle cinematic film grain & chromatic dispersion drift
    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      varying vec2 vUv;

      // Pseudo-random noise generator
      float random(vec2 p) {
        return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        vec2 mouse = uMouse / uResolution.xy;
        float dist = distance(st, mouse);

        // Subtle chromatic dispersion warp near cursor
        float wave = sin(dist * 6.0 - uTime * 0.8) * 0.008 * (1.0 - smoothstep(0.0, 0.6, dist));

        // 35mm grain synthesis
        float grain = random(st * 400.0 + fract(uTime * 20.0)) * 0.045;

        // Subtle orchid vignette glow
        float vig = 1.0 - distance(st, vec2(0.5, 0.5)) * 0.8;
        vec3 color = vec3(0.02, 0.015, 0.018); // Deep warm obsidian
        
        // Touch of red orchid hue in ambient edges
        vec3 orchidTint = vec3(0.88, 0.11, 0.28) * 0.03 * (1.0 - vig) * (1.0 + wave * 5.0);

        gl_FragColor = vec4(color + orchidTint + grain, 0.75);
      }
    `;

    try {
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: new THREE.Vector2(width * 0.5, height * 0.5) },
      };

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let targetMouseX = width * 0.5;
      let targetMouseY = height * 0.5;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        targetMouseX = e.clientX - rect.left;
        targetMouseY = rect.height - (e.clientY - rect.top);
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      const handleResize = () => {
        if (!container || !renderer || !material) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        renderer.setSize(newWidth, newHeight);
        material.uniforms.uResolution.value.set(newWidth, newHeight);
      };

      window.addEventListener("resize", handleResize);

      const clock = new THREE.Clock();

      const animate = () => {
        if (!material || !renderer || !scene || !camera) return;

        material.uniforms.uTime.value = clock.getElapsedTime();

        // Smooth mouse damping
        material.uniforms.uMouse.value.x +=
          (targetMouseX - material.uniforms.uMouse.value.x) * 0.05;
        material.uniforms.uMouse.value.y +=
          (targetMouseY - material.uniforms.uMouse.value.y) * 0.05;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
          renderer.dispose();
        }
        geometry.dispose();
        if (material) material.dispose();
      };
    } catch {
      // Graceful fallback if WebGL is unavailable
    }
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-60 mix-blend-screen"
    />
  );
}
