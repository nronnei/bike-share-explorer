import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import { InjectionProvider } from './context/injection';
import { Layout } from './Layout';

const APP_BAR_WIDTH_DESKTOP = 16

export const App = () => {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <InjectionProvider>
          <Layout />
        </InjectionProvider>
      </RecoilRoot>
    </ChakraProvider>
  )
};
