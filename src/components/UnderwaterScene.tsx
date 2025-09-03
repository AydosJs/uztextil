import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Shark component with realistic 3D model
function Shark({ position, speed = 0.5, scale = 1.5 }: {
    position: [number, number, number],
    speed?: number,
    scale?: number
}) {
    const sharkRef = useRef<THREE.Group>(null!)
    const direction = useRef(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5))
    const time = useRef(Math.random() * Math.PI * 2)

    useFrame((_state: RootState, delta: number) => {
        if (!sharkRef.current) return

        time.current += delta * speed

        // Smooth, predatory swimming pattern
        const newDirection = new THREE.Vector3(
            Math.sin(time.current * 0.3) * 0.4,
            Math.cos(time.current * 0.2) * 0.15,
            Math.sin(time.current * 0.25) * 0.2
        )

        direction.current.lerp(newDirection, 0.015)
        sharkRef.current.position.add(direction.current.clone().multiplyScalar(delta * 0.8))

        // Keep shark within bounds
        if (sharkRef.current.position.x > 2.5) sharkRef.current.position.x = -2.5
        if (sharkRef.current.position.x < -2.5) sharkRef.current.position.x = 2.5
        if (sharkRef.current.position.y > 0.8) sharkRef.current.position.y = -0.8
        if (sharkRef.current.position.y < -0.8) sharkRef.current.position.y = 0.8

        // Shark rotation to face movement direction
        sharkRef.current.lookAt(
            sharkRef.current.position.x + direction.current.x,
            sharkRef.current.position.y + direction.current.y,
            sharkRef.current.position.z + direction.current.z
        )

        // Tail fin animation - slower for shark
        const tail = sharkRef.current.children[1] as THREE.Mesh
        if (tail) {
            tail.rotation.y = Math.sin(time.current * 4) * 0.2
        }
    })

    return (
        <group ref={sharkRef} position={position} scale={scale}>
            {/* Shark body - elongated and streamlined */}
            <mesh>
                <capsuleGeometry args={[0.04, 0.25, 4, 8]} />
                <meshPhongMaterial color="#4A5568" />
            </mesh>

            {/* Shark tail - larger and more powerful */}
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.06, 0.12, 6]} />
                <meshPhongMaterial color="#2D3748" transparent opacity={0.9} />
            </mesh>

            {/* Dorsal fin - iconic shark fin */}
            <mesh position={[0.05, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.03, 0.08, 4]} />
                <meshPhongMaterial color="#2D3748" transparent opacity={0.8} />
            </mesh>

            {/* Pectoral fins - wider */}
            <mesh position={[0.03, 0, 0.06]} rotation={[0, 0, Math.PI / 3]}>
                <coneGeometry args={[0.025, 0.05, 4]} />
                <meshPhongMaterial color="#4A5568" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.03, 0, -0.06]} rotation={[0, 0, -Math.PI / 3]}>
                <coneGeometry args={[0.025, 0.05, 4]} />
                <meshPhongMaterial color="#4A5568" transparent opacity={0.7} />
            </mesh>

            {/* Shark eyes - smaller and more menacing */}
            <mesh position={[0.08, 0.015, 0.02]}>
                <sphereGeometry args={[0.006]} />
                <meshPhongMaterial color="black" />
            </mesh>
            <mesh position={[0.08, 0.015, -0.02]}>
                <sphereGeometry args={[0.006]} />
                <meshPhongMaterial color="black" />
            </mesh>

            {/* Shark snout - pointed */}
            <mesh position={[0.12, 0, 0]}>
                <coneGeometry args={[0.02, 0.04, 6]} />
                <meshPhongMaterial color="#4A5568" />
            </mesh>
        </group>
    )
}

// Fish component with realistic 3D model
function Fish({ position, color, speed = 1, scale = 1 }: {
    position: [number, number, number],
    color: string,
    speed?: number,
    scale?: number
}) {
    const fishRef = useRef<THREE.Group>(null!)
    const direction = useRef(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5))
    const time = useRef(Math.random() * Math.PI * 2)

    useFrame((_state: RootState, delta: number) => {
        if (!fishRef.current) return

        time.current += delta * speed

        // Random swimming pattern
        const newDirection = new THREE.Vector3(
            Math.sin(time.current * 0.5) * 0.3,
            Math.cos(time.current * 0.7) * 0.2,
            Math.sin(time.current * 0.3) * 0.1
        )

        direction.current.lerp(newDirection, 0.02)
        fishRef.current.position.add(direction.current.clone().multiplyScalar(delta * 0.5))

        // Keep fish within bounds
        if (fishRef.current.position.x > 2) fishRef.current.position.x = -2
        if (fishRef.current.position.x < -2) fishRef.current.position.x = 2
        if (fishRef.current.position.y > 1) fishRef.current.position.y = -1
        if (fishRef.current.position.y < -1) fishRef.current.position.y = 1

        // Fish rotation to face movement direction
        fishRef.current.lookAt(
            fishRef.current.position.x + direction.current.x,
            fishRef.current.position.y + direction.current.y,
            fishRef.current.position.z + direction.current.z
        )

        // Tail fin animation
        const tail = fishRef.current.children[1] as THREE.Mesh
        if (tail) {
            tail.rotation.y = Math.sin(time.current * 8) * 0.3
        }
    })

    return (
        <group ref={fishRef} position={position} scale={scale}>
            {/* Fish body */}
            <mesh>
                <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
                <meshPhongMaterial color={color} />
            </mesh>

            {/* Tail fin */}
            <mesh position={[-0.1, 0, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.04, 0.08, 6]} />
                <meshPhongMaterial color={color} transparent opacity={0.8} />
            </mesh>

            {/* Top fin */}
            <mesh position={[0.02, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.02, 0.04, 4]} />
                <meshPhongMaterial color={color} transparent opacity={0.7} />
            </mesh>

            {/* Side fins */}
            <mesh position={[0.02, 0, 0.04]} rotation={[0, 0, Math.PI / 4]}>
                <coneGeometry args={[0.015, 0.03, 4]} />
                <meshPhongMaterial color={color} transparent opacity={0.6} />
            </mesh>
            <mesh position={[0.02, 0, -0.04]} rotation={[0, 0, -Math.PI / 4]}>
                <coneGeometry args={[0.015, 0.03, 4]} />
                <meshPhongMaterial color={color} transparent opacity={0.6} />
            </mesh>

            {/* Eyes */}
            <mesh position={[0.06, 0.02, 0.02]}>
                <sphereGeometry args={[0.008]} />
                <meshPhongMaterial color="black" />
            </mesh>
            <mesh position={[0.06, 0.02, -0.02]}>
                <sphereGeometry args={[0.008]} />
                <meshPhongMaterial color="black" />
            </mesh>
        </group>
    )
}

// Bubble particles system
function Bubbles() {
    const pointsRef = useRef<THREE.Points>(null!)
    const particleCount = 20

    const positions = useMemo(() => {
        const positions = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 4 // x
            positions[i * 3 + 1] = Math.random() * -2 - 1 // y (start from bottom)
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2 // z
        }
        return positions
    }, [])

    useFrame((state: RootState, delta: number) => {
        if (!pointsRef.current) return

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < particleCount; i++) {
            const y = positions[i * 3 + 1]

            // Move bubbles up
            positions[i * 3 + 1] += delta * 0.3

            // Add some horizontal drift
            positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * delta * 0.05

            // Reset bubble when it reaches top
            if (y > 2) {
                positions[i * 3] = (Math.random() - 0.5) * 4
                positions[i * 3 + 1] = -2
                positions[i * 3 + 2] = (Math.random() - 0.5) * 2
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#87CEEB"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    )
}

// Water caustics effect
function WaterCaustics() {
    const planeRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        if (!planeRef.current) return

        const material = planeRef.current.material as THREE.MeshPhongMaterial
        material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    })

    return (
        <mesh ref={planeRef} position={[0, 1.5, -1]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[6, 4]} />
            <meshPhongMaterial
                color="#4FC3F7"
                transparent
                opacity={0.1}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}

// Main underwater scene
export function UnderwaterScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 2], fov: 45 }}
                style={{ background: 'linear-gradient(to bottom, #1e3a8a20, #0f172a40)' }}
                performance={{ min: 0.5 }}
                dpr={[1, 2]}
                frameloop="always"
            >
                {/* Lighting setup */}
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={0.4} color="#87CEEB" />
                <pointLight position={[0, 2, 1]} intensity={0.3} color="#4FC3F7" />

                {/* Water caustics */}
                <WaterCaustics />

                {/* Bubble particles */}
                <Bubbles />

                {/* Predator shark */}
                <Shark
                    position={[0, 0, -0.8]}
                    speed={0.6}
                    scale={1.8}
                />

                {/* Swimming fish */}
                <Fish
                    position={[-1.5, -0.5, 0]}
                    color="#FF6B35"
                    speed={0.8}
                    scale={1.2}
                />
                <Fish
                    position={[1, 0.2, -0.5]}
                    color="#4ECDC4"
                    speed={1.2}
                    scale={0.9}
                />
                <Fish
                    position={[0, -0.8, 0.3]}
                    color="#FFE66D"
                    speed={1.0}
                    scale={1.1}
                />
                <Fish
                    position={[1.2, 0.5, 0.2]}
                    color="#A8E6CF"
                    speed={0.9}
                    scale={0.8}
                />
                <Fish
                    position={[-0.8, 0.8, -0.2]}
                    color="#FF8B94"
                    speed={1.1}
                    scale={1.0}
                />
            </Canvas>
        </div>
    )
}
