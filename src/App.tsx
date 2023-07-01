import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import { InjectionProvider } from './context/injection';
import { Layout } from './Layout';


export const App = () => (
  <ChakraProvider>
    <RecoilRoot>
      <InjectionProvider>
        <Layout />
      </InjectionProvider>
    </RecoilRoot>
  </ChakraProvider>
);
