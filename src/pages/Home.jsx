import React, { useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import Loader from '../components/Loader';
import Rules from "../config/rules.json";
import { Perf } from 'r3f-perf'
import { GameOfLife } from '../components/GameOfLife';
import {
  ChakraProvider,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  extendTheme,
} from "@chakra-ui/react";
import ColorPicker from '../components/ColorPicker';
import Menu from '../components/Menu';

const theme = extendTheme({
  styles: {
    global: {
      "option": {
        color: "black",
        backgroundColor: "white",
      },
    },
  },
});
const palette = [
  "#c55347",
  "#a62c37",
  "#819238",
  "#12354e",
  "#34454c"
]
const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [Running, setRunning] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [slideAnim, setSlideAnim] = useState(0);
  const speed = 2000 - (sliderValue * 19);
  const [Color, setColor] = useState(palette[0]);
  const [Rule, setRule] = useState({
    lato: 4,
    matrixType: "random",
    space: "3D",
    birth: 3,
    underpopulated: 2,
    stable: 2,
    overpopulated: 3,
    neigh: "M",
    colorMode: "red",
    spawn: [],
    alwaysAlive:false, 
    cameraPosition: [120, 20, 10]
  })
  const [Grid, setGrid] = useState(true)
  const [stats, setStats] = useState(false)
  

  const changeRule = (nameProp, valueProp) => {
    const aux = Rule;
    aux[nameProp] = valueProp;
    setRule({ ...aux })
  }
  const handleChange = (e) => {
    const { birth, lato, overpopulated, spawn, stable, underpopulated, neigh, space, starting , alwaysAlive, cameraPosition} = Rules[e.target.value];
    setRule({
      birth,
      colorMode: Rule.colorMode,
      lato,
      matrixType: starting,
      neigh,
      overpopulated,
      space,
      spawn,
      stable,
      underpopulated,
      index: e.target.value,
      alwaysAlive,
      cameraPosition
    })
  }


  if (Rule.lato > 0)
    return (
      <ChakraProvider theme={theme}>
        <Menu stats={stats} setStats={setStats} Running={Running} changeRule={changeRule} darkMode={darkMode} wireframeMode={wireframeMode} Rules={Rules} Rule={Rule} Grid={Grid} handleChange={handleChange}
          speed={speed} sliderValue={sliderValue} setSliderValue={setSliderValue} setDarkMode={setDarkMode} setWireframeMode={setWireframeMode} setGrid={setGrid} setRunning={setRunning} />
        <Box position="absolute" top="15" left="5" zIndex={10}>
          <ColorPicker colors={palette} color={Color} setColor={setColor} />
        </Box>
        <Box w="35%" top={5} left={100} align="center" justify=" center" alignItems={"center"} position={"absolute"} zIndex={10}>
          <Slider
            min={1}
            max={100}
            value={slideAnim}
            onChange={(value) => { setSlideAnim(value); setRunning(false) }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Canvas
          camera={{ position:  Rule.cameraPosition, near: 0.1, far: 1000 }}
          style={{ width: "100vw", height: "100vh", zIndex: "1" }}
        >
          <color attach={"background"} args={[darkMode ? "black" : "#bce4e5"]} />
          {stats && <Perf position="bottom-left" />}
          <Suspense fallback={<Loader />}>
            <GameOfLife
              Grid={Grid}
              Rule={Rule}
              darkMode={darkMode}
              wireframeMode={wireframeMode}
              Running={Running}
              speed={speed}
              Color={Color}
              slideAnim={slideAnim}
              setSlideAnim={setSlideAnim} 
            />
          </Suspense>
        </Canvas>
      </ChakraProvider>
    );
};

export default Home;
