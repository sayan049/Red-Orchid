"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Play } from "lucide-react";
import { VideoModal } from "@/components/ui/VideoModal";
import { sound } from "@/lib/sound";

interface SlideData {
  title: string;
  category: string;
  description: string;
  media: string;
}

const RED_ORCHID_SLIDES: SlideData[] = [
  {
    category: "// 01 • ETHEREAL GLOW",
    title: "Ethereal Glow",
    description: "A soft, radiant light that illuminates the soul.",
    media: "https://assets.codepen.io/7558/orange-portrait-001.jpg",
  },
  {
    category: "// 02 • ROSE MIRAGE",
    title: "Rose Mirage",
    description: "Lost in a desert of blooming dreams and endless horizons.",
    media: "https://assets.codepen.io/7558/orange-portrait-002.jpg",
  },
  {
    category: "// 03 • VELVET MYSTIQUE",
    title: "Velvet Mystique",
    description: "Wrapped in the deep, luxurious embrace of the night.",
    media: "https://assets.codepen.io/7558/orange-portrait-003.jpg",
  },
  {
    category: "// 04 • GOLDEN HOUR",
    title: "Golden Hour",
    description: "That fleeting moment when the world is dipped in gold.",
    media: "https://assets.codepen.io/7558/orange-portrait-004.jpg",
  },
  {
    category: "// 05 • MIDNIGHT DREAMS",
    title: "Midnight Dreams",
    description: "Where reality fades and imagination takes flight.",
    media: "https://assets.codepen.io/7558/orange-portrait-005.jpg",
  },
  {
    category: "// 06 • SILVER LIGHT",
    title: "Silver Light",
    description: "A cool, metallic shimmer reflecting the urban pulse.",
    media: "https://assets.codepen.io/7558/orange-portrait-006.jpg",
  },
];

// GLSL Shaders for Cinematic Glass Refraction & Chromatic Aberration
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture1, uTexture2;
  uniform float uProgress;
  uniform vec2 uResolution, uTexture1Size, uTexture2Size;
  uniform int uEffectType;
  uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength, uColorEnhancement;
  uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    return (uv * uResolution - offset) / scaledSize;
  }

  vec4 glassEffect(vec2 uv, float progress) {
    float time = progress * 5.0 * uSpeedMultiplier;
    vec2 uv1 = getCoverUV(uv, uTexture1Size);
    vec2 uv2 = getCoverUV(uv, uTexture2Size);
    float maxR = length(uResolution) * 0.85;
    float br = progress * maxR;
    vec2 p = uv * uResolution;
    vec2 c = uResolution * 0.5;
    float d = length(p - c);
    float nd = d / max(br, 0.001);
    float param = smoothstep(br + 3.0, br - 3.0, d);

    vec4 img;
    if (param > 0.0) {
      float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
      vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
      vec2 distUV = uv2 - dir * ro;
      distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
      float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
      img = vec4(
        texture2D(uTexture2, distUV + dir * ca * 1.2).r,
        texture2D(uTexture2, distUV + dir * ca * 0.2).g,
        texture2D(uTexture2, distUV - dir * ca * 0.8).b,
        1.0
      );
      if (uGlassEdgeGlow > 0.0) {
        float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
        img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
      }
    } else {
      img = texture2D(uTexture2, uv2);
    }
    vec4 oldImg = texture2D(uTexture1, uv1);
    if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
    return mix(oldImg, img, param);
  }

  void main() {
    gl_FragColor = glassEffect(vUv, uProgress);
  }
`;

export function LuminaInteractiveList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    let shaderMaterial: THREE.ShaderMaterial | null = null;
    let animationFrameId: number;
    let autoSlideInterval: NodeJS.Timeout | null = null;
    let progressInterval: NodeJS.Timeout | null = null;
    let isTransitioning = false;
    let currentIndex = 0;
    const textures: THREE.Texture[] = [];

    const AUTO_SLIDE_SPEED = 6000;
    const PROGRESS_INTERVAL = 50;
    const TRANSITION_DURATION = 2.2;

    const splitText = (text: string) => {
      return text
        .split("")
        .map(
          (char) =>
            `<span style="display: inline-block; opacity: 0;">${char === " " ? "&nbsp;" : char}</span>`
        )
        .join("");
    };

    const updateContent = (idx: number) => {
      const titleEl = document.getElementById("mainTitle");
      const descEl = document.getElementById("mainDesc");
      const catEl = document.getElementById("mainCategory");

      if (catEl) {
        catEl.textContent = RED_ORCHID_SLIDES[idx].category;
      }

      if (titleEl && descEl) {
        gsap.to(titleEl.children, {
          y: -20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.02,
          ease: "power2.in",
        });
        gsap.to(descEl, { y: -10, opacity: 0, duration: 0.35, ease: "power2.in" });

        setTimeout(() => {
          titleEl.innerHTML = splitText(RED_ORCHID_SLIDES[idx].title);
          descEl.textContent = RED_ORCHID_SLIDES[idx].description;

          gsap.set(titleEl.children, { opacity: 0, y: 24 });
          gsap.set(descEl, { y: 16, opacity: 0 });

          gsap.to(titleEl.children, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.025,
            ease: "power3.out",
          });
          gsap.to(descEl, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.15,
            ease: "power3.out",
          });
        }, 400);
      }
    };

    const updateNavProgress = (idx: number, progress: number) => {
      const items = document.querySelectorAll(".slide-nav-item");
      items.forEach((item, i) => {
        const fill = item.querySelector(".slide-progress-fill") as HTMLElement | null;
        if (!fill) return;
        if (i === idx) {
          fill.style.width = `${progress}%`;
          fill.style.opacity = "1";
        } else if (i < idx) {
          fill.style.width = "100%";
          fill.style.opacity = "0.4";
        } else {
          fill.style.width = "0%";
          fill.style.opacity = "0.2";
        }
        item.classList.toggle("active", i === idx);
      });
    };

    const stopTimers = () => {
      if (progressInterval) clearInterval(progressInterval);
      if (autoSlideInterval) clearTimeout(autoSlideInterval);
      progressInterval = null;
      autoSlideInterval = null;
    };

    const startTimer = () => {
      stopTimers();
      let progress = 0;
      const step = (100 / AUTO_SLIDE_SPEED) * PROGRESS_INTERVAL;

      progressInterval = setInterval(() => {
        progress += step;
        updateNavProgress(currentIndex, progress);
        if (progress >= 100) {
          stopTimers();
          if (!isTransitioning) {
            goToSlide((currentIndex + 1) % RED_ORCHID_SLIDES.length);
          }
        }
      }, PROGRESS_INTERVAL);
    };

    const goToSlide = (targetIndex: number) => {
      if (isTransitioning || targetIndex === currentIndex || textures.length < 2 || !shaderMaterial) return;
      isTransitioning = true;
      stopTimers();

      const currentTex = textures[currentIndex];
      const targetTex = textures[targetIndex];

      shaderMaterial.uniforms.uTexture1.value = currentTex;
      shaderMaterial.uniforms.uTexture2.value = targetTex;
      shaderMaterial.uniforms.uTexture1Size.value = currentTex.userData.size;
      shaderMaterial.uniforms.uTexture2Size.value = targetTex.userData.size;

      updateContent(targetIndex);
      currentIndex = targetIndex;
      setCurrentSlideIndex(targetIndex);

      const sn = document.getElementById("slideNumber");
      if (sn) sn.textContent = String(targetIndex + 1).padStart(2, "0");

      gsap.fromTo(
        shaderMaterial.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: TRANSITION_DURATION,
          ease: "power2.inOut",
          onComplete: () => {
            if (shaderMaterial) {
              shaderMaterial.uniforms.uProgress.value = 0;
              shaderMaterial.uniforms.uTexture1.value = targetTex;
              shaderMaterial.uniforms.uTexture1Size.value = targetTex.userData.size;
            }
            isTransitioning = false;
            startTimer();
          },
        }
      );
    };

    // Initialize WebGL
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture1: { value: null },
        uTexture2: { value: null },
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uTexture1Size: { value: new THREE.Vector2(1, 1) },
        uTexture2Size: { value: new THREE.Vector2(1, 1) },
        uEffectType: { value: 0 },
        uGlobalIntensity: { value: 1.0 },
        uSpeedMultiplier: { value: 1.0 },
        uDistortionStrength: { value: 1.0 },
        uColorEnhancement: { value: 1.0 },
        uGlassRefractionStrength: { value: 1.0 },
        uGlassChromaticAberration: { value: 1.0 },
        uGlassBubbleClarity: { value: 1.0 },
        uGlassEdgeGlow: { value: 1.0 },
        uGlassLiquidFlow: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
    scene.add(mesh);

    // Texture Loader with fallback solid color generator
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const loadTexture = (url: string): Promise<THREE.Texture> => {
      return new Promise((resolve) => {
        loader.load(
          url,
          (tex) => {
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.userData = { size: new THREE.Vector2(tex.image.width || 1920, tex.image.height || 1080) };
            resolve(tex);
          },
          undefined,
          () => {
            // High quality dark fallback canvas if network fails
            const c = document.createElement("canvas");
            c.width = 1920;
            c.height = 1080;
            const ctx = c.getContext("2d");
            if (ctx) {
              const grad = ctx.createLinearGradient(0, 0, 1920, 1080);
              grad.addColorStop(0, "#0c0a09");
              grad.addColorStop(0.5, "#1f0d14");
              grad.addColorStop(1, "#050505");
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, 1920, 1080);
            }
            const fallbackTex = new THREE.CanvasTexture(c);
            fallbackTex.userData = { size: new THREE.Vector2(1920, 1080) };
            resolve(fallbackTex);
          }
        );
      });
    };

    let isMounted = true;

    Promise.all(RED_ORCHID_SLIDES.map((s) => loadTexture(s.media))).then((loaded) => {
      if (!isMounted || !shaderMaterial) return;
      textures.push(...loaded);
      if (textures.length >= 2) {
        shaderMaterial.uniforms.uTexture1.value = textures[0];
        shaderMaterial.uniforms.uTexture2.value = textures[1];
        shaderMaterial.uniforms.uTexture1Size.value = textures[0].userData.size;
        shaderMaterial.uniforms.uTexture2Size.value = textures[1].userData.size;

        const tEl = document.getElementById("mainTitle");
        const dEl = document.getElementById("mainDesc");
        const cEl = document.getElementById("mainCategory");
        if (cEl) cEl.textContent = RED_ORCHID_SLIDES[0].category;
        if (tEl && dEl) {
          tEl.innerHTML = splitText(RED_ORCHID_SLIDES[0].title);
          dEl.textContent = RED_ORCHID_SLIDES[0].description;
          gsap.to(tEl.children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.025, ease: "power3.out" });
          gsap.to(dEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
        }

        startTimer();
      }
    });

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    animate();

    const handleResize = () => {
      if (!renderer || !shaderMaterial) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      shaderMaterial.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Make goToSlide available on items
    const navItems = document.querySelectorAll(".slide-nav-item");
    navItems.forEach((item, idx) => {
      item.addEventListener("click", () => {
        try {
          sound.playClick();
        } catch {}
        goToSlide(idx);
      });
    });

    return () => {
      isMounted = false;
      stopTimers();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();
      if (shaderMaterial) shaderMaterial.dispose();
      mesh.geometry.dispose();
      textures.forEach((t) => t.dispose());
    };
  }, []);

  return (
    <>
      <main className="slider-wrapper" ref={containerRef}>
        {/* Full-bleed WebGL Canvas */}
        <canvas ref={canvasRef} className="webgl-canvas" />

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#070707] via-black/35 to-black/75" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070707]/50 to-[#070707]" />

        {/* Top Indicators */}
        <div className="absolute top-24 sm:top-28 left-4 sm:left-8 md:left-12 lg:left-16 z-20 flex items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
            <span id="mainCategory" className="font-mono-code text-[10px] sm:text-[11px] font-medium tracking-wider text-white/80 uppercase">
              // 01 • ETHEREAL GLOW
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono-code text-xs text-white/40">
            <span id="slideNumber" className="text-orchid font-semibold">01</span>
            <span>/</span>
            <span id="slideTotal">06</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="slide-content">
          <h1 id="mainTitle" className="slide-title"></h1>
          <p id="mainDesc" className="slide-description"></p>

          {/* Interactive Atelier Showreel button */}
          <div className="mt-6 sm:mt-8 flex items-center gap-4 pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsVideoModalOpen(true);
              }}
              data-cursor="PLAY"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 sm:py-3.5 backdrop-blur-md transition-all duration-300 hover:border-orchid hover:bg-orchid hover:text-white touch-manipulation cursor-pointer active:scale-95 select-none"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110 group-hover:bg-black group-hover:text-white pointer-events-none">
                <Play className="h-3.5 w-3.5 fill-current ml-0.5 pointer-events-none" />
              </div>
              <span className="font-mono-code text-xs font-semibold tracking-widest uppercase pointer-events-none">
                PLAY ATELIER REEL (02:15)
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Slide Navigation Track with Live Filling Progress Bars */}
        <nav className="slides-navigation" id="slidesNav">
          {RED_ORCHID_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`slide-nav-item ${idx === 0 ? "active" : ""}`}
              data-slide-index={idx}
            >
              <div className="slide-progress-line">
                <div className="slide-progress-fill" />
              </div>
              <div className="slide-nav-title">{slide.title}</div>
            </div>
          ))}
        </nav>
      </main>

      {/* Accessible Cinema Video Player Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="/videos/hero-reel.mp4"
        title="Red Orchid Films — Annual Showreel 2024"
        aspectRatio="2.39:1"
      />
    </>
  );
}

export default LuminaInteractiveList;
