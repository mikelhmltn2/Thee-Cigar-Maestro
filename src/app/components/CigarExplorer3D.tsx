'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, Cylinder, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// Cigar data for 3D visualization
const cigarData = [
  {
    id: 1,
    name: 'Cohiba Behike 56',
    wrapper: 'Maduro',
    origin: 'Cuba',
    strength: 'Full',
    price: 45,
    flavor: 'Rich, earthy with chocolate notes',
    color: new THREE.Color('#4a2c1d'),
    position: [-4, 2, 0],
  },
  {
    id: 2,
    name: 'Arturo Fuente Opus X',
    wrapper: 'Connecticut',
    origin: 'Dominican Republic',
    strength: 'Medium-Full',
    price: 35,
    flavor: 'Spicy, cedar with coffee undertones',
    color: new THREE.Color('#8b4513'),
    position: [0, 0, -2],
  },
  {
    id: 3,
    name: 'Padron 1964 Anniversary',
    wrapper: 'Natural',
    origin: 'Nicaragua',
    strength: 'Medium',
    price: 28,
    flavor: 'Creamy, nutty with vanilla hints',
    color: new THREE.Color('#d2b48c'),
    position: [4, -1, 1],
  },
  {
    id: 4,
    name: 'Liga Privada No. 9',
    wrapper: 'Oscuro',
    origin: 'Nicaragua',
    strength: 'Full',
    price: 18,
    flavor: 'Bold, peppery with dark chocolate',
    color: new THREE.Color('#2f1b14'),
    position: [-2, -2, 2],
  },
  {
    id: 5,
    name: 'Montecristo No. 2',
    wrapper: 'Habano',
    origin: 'Cuba',
    strength: 'Medium',
    price: 25,
    flavor: 'Balanced, woody with leather notes',
    color: new THREE.Color('#8b6914'),
    position: [2, 1, -1],
  },
]

// Individual Cigar Component
function Cigar({ cigar, isSelected, onClick }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      if (hovered || isSelected) {
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.01
      }
    }
  })

  return (
    <group position={cigar.position}>
      {/* Cigar Body */}
      <Cylinder
        ref={meshRef}
        args={[0.15, 0.12, 3, 16]}
        rotation={[0, 0, Math.PI / 2]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={cigar.color}
          roughness={0.8}
          metalness={0.1}
          emissive={hovered || isSelected ? new THREE.Color('#d4af37') : new THREE.Color('#000000')}
          emissiveIntensity={hovered || isSelected ? 0.2 : 0}
        />
      </Cylinder>

      {/* Cigar Band */}
      <Cylinder
        args={[0.16, 0.16, 0.3, 16]}
        position={[-0.8, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.7} />
      </Cylinder>

      {/* Cigar Tip */}
      <Cylinder
        args={[0.05, 0.12, 0.3, 8]}
        position={[1.2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </Cylinder>

      {/* Floating Label */}
      {(hovered || isSelected) && (
        <Html position={[0, 1, 0]} center>
          <div className="bg-background-secondary/90 backdrop-blur-sm rounded-luxury px-3 py-2 border border-luxury-gold/30 min-w-48">
            <h4 className="font-display text-luxury-gold text-sm font-semibold mb-1">
              {cigar.name}
            </h4>
            <p className="text-xs text-text-secondary mb-2">{cigar.flavor}</p>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted">{cigar.origin}</span>
              <span className="text-luxury-gold font-semibold">${cigar.price}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Scene Environment
function Environment() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        color="#f4f1e8"
      />
    </>
  )
}

// Main 3D Explorer Component
const CigarExplorer3D = () => {
  const [selectedCigar, setSelectedCigar] = useState<number | null>(null)
  const [filterBy, setFilterBy] = useState<'all' | 'wrapper' | 'origin' | 'strength'>('all')

  const filteredCigars = useMemo(() => {
    if (filterBy === 'all') return cigarData
    // Add filtering logic here based on filterBy
    return cigarData
  }, [filterBy])

  const selectedCigarData = selectedCigar 
    ? cigarData.find(c => c.id === selectedCigar)
    : null

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [8, 5, 8], fov: 60 }}
        shadows
        className="w-full h-full"
      >
        <Environment />
        
        {/* Cigars */}
        {filteredCigars.map((cigar) => (
          <Cigar
            key={cigar.id}
            cigar={cigar}
            isSelected={selectedCigar === cigar.id}
            onClick={() => setSelectedCigar(
              selectedCigar === cigar.id ? null : cigar.id
            )}
          />
        ))}

        {/* Scene Title */}
        <Text
          position={[0, 5, 0]}
          fontSize={1}
          color="#d4af37"
          anchorX="center"
          anchorY="middle"
          font="/fonts/PlayfairDisplay-Bold.woff"
        >
          Premium Collection
        </Text>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>

      {/* UI Controls */}
      <div className="absolute top-4 left-4 space-y-4 z-10">
        <div className="card-glass p-4">
          <h3 className="font-display text-luxury-gold text-lg mb-3">Explore Collection</h3>
          <div className="space-y-2">
            {['all', 'wrapper', 'origin', 'strength'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterBy(filter as any)}
                className={`w-full text-left px-3 py-2 rounded-luxury text-sm transition-all duration-300 ${
                  filterBy === filter
                    ? 'bg-luxury-gold text-background-primary font-medium'
                    : 'text-text-secondary hover:text-luxury-gold hover:bg-background-accent/50'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="card-glass p-4">
          <div className="flex items-center space-x-2 text-sm text-text-muted">
            <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
            <span>Click cigars to explore</span>
          </div>
        </div>
      </div>

      {/* Selected Cigar Details */}
      {selectedCigarData && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-4 right-4 w-80 z-10"
        >
          <div className="card-luxury">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-display text-luxury-gold text-xl font-semibold">
                {selectedCigarData.name}
              </h3>
              <button
                onClick={() => setSelectedCigar(null)}
                className="text-text-muted hover:text-luxury-gold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-text-accent font-medium mb-2">Flavor Profile</h4>
                <p className="text-text-secondary text-sm">{selectedCigarData.flavor}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-text-muted text-xs uppercase tracking-wide mb-1">Origin</h5>
                  <p className="text-text-primary font-medium">{selectedCigarData.origin}</p>
                </div>
                <div>
                  <h5 className="text-text-muted text-xs uppercase tracking-wide mb-1">Wrapper</h5>
                  <p className="text-text-primary font-medium">{selectedCigarData.wrapper}</p>
                </div>
                <div>
                  <h5 className="text-text-muted text-xs uppercase tracking-wide mb-1">Strength</h5>
                  <p className="text-text-primary font-medium">{selectedCigarData.strength}</p>
                </div>
                <div>
                  <h5 className="text-text-muted text-xs uppercase tracking-wide mb-1">Price</h5>
                  <p className="text-luxury-gold font-bold">${selectedCigarData.price}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="btn-primary flex-1 text-sm py-2">
                  Add to Cart
                </button>
                <button className="btn-secondary flex-1 text-sm py-2">
                  Save to Humidor
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="card-glass px-4 py-2">
          <p className="text-sm text-text-muted text-center">
            Drag to rotate • Scroll to zoom • Click cigars to explore
          </p>
        </div>
      </div>
    </div>
  )
}

export default CigarExplorer3D