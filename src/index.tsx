import React from 'react';
import { createRoot } from "react-dom/client";
import { App } from './App';
import { ColorModeScript } from '@chakra-ui/react';

const appRoot = document.getElementById('app-root') as HTMLElement;
createRoot(appRoot).render(
  <>
    <ColorModeScript initialColorMode='dark' />
    <App />
  </>
);
