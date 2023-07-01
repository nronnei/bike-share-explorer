import React from 'react';
import { Flex, Box, useDisclosure, useColorMode } from '@chakra-ui/react';
import { AppBar, AppBarButtonConfig } from './components/AppBar';
import { Map } from "./components/Map";
import { Sidebar } from './components/Sidebar';
import { SidebarContent } from './components/SidebarContent';
import { GlobeIcon, MapIcon, MenuIcon, SearchIcon } from './components/icons';

const APP_BAR_WIDTH_DESKTOP = 16;

export const Layout = () => {
  const { getDisclosureProps, getButtonProps, isOpen } = useDisclosure();
  const disclosureProps = getDisclosureProps({ isOpen });
  const { colorMode, toggleColorMode } = useColorMode();
  const modeToToggle = colorMode === 'light' ? 'Dark' : 'Light';


  const buttonConfigs: AppBarButtonConfig[] = [
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
      ...getButtonProps({}),
    },
    {
      label: `Toggle ${modeToToggle} Mode`,
      icon: <GlobeIcon />,
      onClick: toggleColorMode,
    },
  ];

  return (
    <Flex>
      <AppBar
        buttonConfigs={buttonConfigs}
        w={APP_BAR_WIDTH_DESKTOP}
        flexShrink={0}
        py={4}
        bg={colorMode === 'light' ? 'blue.100' : 'background'}
        shadow='md'
      />
      <Sidebar {...disclosureProps}>
        <SidebarContent />
      </Sidebar>
      <Map />
    </Flex>
  );
}
