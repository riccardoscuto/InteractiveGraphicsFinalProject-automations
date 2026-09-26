import { useLoader } from '@react-three/fiber';
import React, { useMemo } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import {MeshToonMaterial } from 'three';
import cubeScene from '../assets/3d/cube.obj';

const Cube = (props) => {
    const originalCube = useLoader(OBJLoader, cubeScene);
    const cube = useMemo(() => {
        const clonedCube = originalCube.clone();
        clonedCube.traverse((child) => {
            if (child.isMesh) {
                child.material = new MeshToonMaterial({
                    wireframe: props.wireframeMode,
                    color: props.color,
                    emissive: props.darkMode ? props.color : undefined,
                    emissiveIntensity: props.darkMode ? 1.5 : 0
                })
            }
        }
        );
        return clonedCube;
    }, [originalCube, props.color, props.darkMode, props.wireframeMode]);

    if (!props.isRendering) {
        return <></>;
    }

    return (
        <mesh position={props.position}>
            <primitive object={cube} />
            
        </mesh>
    );
};

export default Cube;