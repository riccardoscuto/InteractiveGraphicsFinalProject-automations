import React, { useState, useRef } from 'react';
import * as THREE from 'three';
const BoxEdge = ({ size,  offset }) => {
    const meshRef = useRef();
    const [lineSegments, setLineSegments] = useState(null)
    return (
        <mesh position={[offset[0]+size / 1.7, offset[1]+size / 1.8, offset[2]+size /1.8+ 2.5]}>
            <lineSegments>
                <edgesGeometry   attach={"geometry"} args={[new THREE.BoxGeometry(size * 1.35, size * 1.35, size * 1.35)]}/>
                <lineBasicMaterial color={"#708889"}  transparent={true} opacity={1} />
            </lineSegments>
        </mesh>
    );
};

export default BoxEdge;
