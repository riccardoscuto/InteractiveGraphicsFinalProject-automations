import { useEffect, useRef } from "react"
import * as THREE from "three"
import { currentPoint } from "../functions/cellularAutomata3D"
export function Instances({ lato, temp = new THREE.Object3D(), Matrix, darkMode, wireframeMode, color }) {
    const instancedMeshRef = useRef()
    useEffect(() => {
        for (let i = 0; i < lato ** 3; i++) {
            if (currentPoint(Matrix, i, lato)) {
                temp.position.set(...getPosition(i, lato))
                temp.updateMatrix()
                temp.scale.set(1, 1, 1);
            }
            instancedMeshRef.current.setMatrixAt(i, temp.matrix);
        };
        instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }, [lato, Matrix])
    return (
        <instancedMesh ref={instancedMeshRef} args={[null, null, lato ** 3]} >
            <boxGeometry />
            <meshToonMaterial
                wireframe={wireframeMode}
                color={color}
                emissive={darkMode ? color : color}
                emissiveIntensity={darkMode ? 1.5 : 0}
            />
        </instancedMesh>
    )
}

function getPosition(index, lato) {
    index = index + lato ** 3 * 1;
    return [index % lato * 1.5, Math.floor(index / (lato * lato)) * 1.5, Math.floor(index / lato) % lato * 1.5];
    
}