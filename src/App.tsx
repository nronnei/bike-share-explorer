import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import { InjectionProvider } from './context/injection';
import { Layout } from './Layout';
import { BrowserRouter } from 'react-router-dom';

export const App = () => (
  <ChakraProvider>
    <RecoilRoot>
      <BrowserRouter>
        <InjectionProvider>
          <Layout />
        </InjectionProvider>
      </BrowserRouter>
    </RecoilRoot>
  </ChakraProvider>
);
