
import React from 'react';
import { Box } from '@chakra-ui/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Box className="min-h-screen bg-background">
      {children}
    </Box>
  );
};

export default DashboardLayout;
