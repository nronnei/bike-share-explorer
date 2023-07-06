import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Text, } from '@chakra-ui/react';
import React from 'react';
import { System } from '../../types';

export type SystemCardProps = {
  system: System,
  onSetSystem: (system: System) => void
};

export function SystemCard({ system, onSetSystem: onChangeSystem }: SystemCardProps) {

  const handleClick = async () => {
    onChangeSystem(system);
  }

  return (
    <Card w='100%'>
      <CardHeader>
        <Heading as="h2" size="lg"> {system.name} </Heading>
      </CardHeader>
      <CardBody>
        <Text> {system.location} </Text>
      </CardBody>
      <CardFooter>
        <Button onClick={handleClick}>View Feeds</Button>
      </CardFooter>
    </Card>
  )
}
