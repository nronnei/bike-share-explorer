import { ChakraProvider, Flex, Box, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { AppBar } from './components/AppBar';
import { Map } from "./components/Map";
import { Sidebar } from './components/Sidebar';
import { SidebarContent } from './components/SidebarContent';
import { InjectionProvider } from './context/injection';
import { GlobeIcon, MapIcon, MenuIcon, SearchIcon } from './components/icons';

const APP_BAR_WIDTH_DESKTOP = 16

export const App = () => {

  const { getDisclosureProps, getButtonProps, isOpen } = useDisclosure();
  const disclosureProps = getDisclosureProps({ isOpen });

  const buttonConfigs = [
    {
      label: "Open Sidebar",
      icon: <MenuIcon />,
      ...getButtonProps(),
    },
    {
      label: "View Map",
      icon: <MapIcon />,
      ...getButtonProps(),
    },
    {
      label: "Search Stations",
      icon: <SearchIcon />,
      ...getButtonProps(),
    },
    {
      label: "View Global Systems",
      icon: <GlobeIcon />,
      ...getButtonProps(),
    },
  ]

  return (
    <ChakraProvider>
      <RecoilRoot>
        <InjectionProvider>
          <Flex>
            <AppBar buttonConfigs={buttonConfigs} w={APP_BAR_WIDTH_DESKTOP} flexShrink={0} />
            <Sidebar {...disclosureProps}>
              <SidebarContent />
            </Sidebar>
            <Map />
          </Flex>
        </InjectionProvider>
      </RecoilRoot>
    </ChakraProvider>
  )
};
