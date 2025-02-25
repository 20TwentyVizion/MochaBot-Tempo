import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer, LoopRepeat } from "three";
import LoadingState from "./LoadingState";

interface AvatarSceneProps {
  modelUrl?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  isSpeaking?: boolean;
}

const AvatarScene = ({
  modelUrl = "https://models.readyplayer.me/64c1e8d5ad5a3275d1d9a8c8.glb",
  onLoad = () => {},
  onError = () => {},
  isSpeaking = false,
}: AvatarSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const animationsRef = useRef<{
    idle: THREE.AnimationAction | null;
    talking: THREE.AnimationAction | null;
  }>({ idle: null, talking: null });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 2.5, 4.2);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 5;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Model loading
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        // Scale down the model
        gltf.scene.scale.set(0.7, 0.7, 0.7);
        scene.add(gltf.scene);

        // Set up animations
        if (gltf.animations.length) {
          const mixer = new AnimationMixer(gltf.scene);
          mixerRef.current = mixer;

          // Assuming first animation is idle and second is talking
          const idleAnim = mixer.clipAction(gltf.animations[0]);
          const talkingAnim = mixer.clipAction(gltf.animations[1]);

          animationsRef.current = {
            idle: idleAnim,
            talking: talkingAnim,
          };

          // Start idle animation by default
          idleAnim.play();
          idleAnim.setEffectiveTimeScale(1);
          idleAnim.setEffectiveWeight(1);
          idleAnim.setLoop(THREE.LoopRepeat, Infinity);
        }

        setIsLoading(false);
        onLoad();
      },
      undefined,
      (err) => {
        const errorMessage = "Error loading 3D model: " + err.message;
        setError(errorMessage);
        setIsLoading(false);
        onError(errorMessage);
      },
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Update animations
      if (mixerRef.current) {
        mixerRef.current.update(0.016); // Assuming 60fps
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (
        containerRef.current &&
        renderer.domElement &&
        containerRef.current.contains(renderer.domElement)
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [modelUrl, onLoad, onError]);

  // Handle animation transitions
  useEffect(() => {
    if (!animationsRef.current.idle || !animationsRef.current.talking) return;

    if (isSpeaking) {
      // Crossfade to talking animation
      animationsRef.current.idle.fadeOut(0.5);
      animationsRef.current.talking.reset().fadeIn(0.5).play();
    } else {
      // Crossfade back to idle animation
      animationsRef.current.talking.fadeOut(0.5);
      animationsRef.current.idle.reset().fadeIn(0.5).play();
    }
  }, [isSpeaking]);

  const handleRetry = () => {
    setIsLoading(true);
    setError("");
    // Re-mount component by forcing a re-render
    if (sceneRef.current) {
      sceneRef.current.clear();
    }
  };

  return (
    <div className="relative w-full h-[700px] bg-gradient-to-b from-background to-background/50 rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      {(isLoading || error) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoadingState
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        </div>
      )}
    </div>
  );
};

export default AvatarScene;
