import React from "react";
import { Box, VStack, Image, IconButton, UseDisclosureReturn, ChakraProps, IconButtonProps } from "@chakra-ui/react";
import { GlobeIcon, MapIcon, MenuIcon, SearchIcon } from "./icons";

export type AppBarButtonConfig = {
  label: string,
  buttonProps: ReturnType<UseDisclosureReturn['getButtonProps']>,
  icon: IconButtonProps['icon']
};

type AppBarProps = {
  buttonConfigs: AppBarButtonConfig[]
} & ChakraProps

export const AppBar = ({ buttonConfigs, ...chakraProps }: AppBarProps) => {
  return (
    <Box {...chakraProps}>
      <VStack spacing={8} justifyContent="center">
        <Image
          src='./vantage_logo.png'
          maxW='100%'
          w='100%'
        />

        {buttonConfigs.map(({ label, ...props }, i) => (
          <IconButton
            key={i}
            aria-label={label}
            title={label}
            {...props}
          />
        ))}
      </VStack>
    </Box>
  )
}
