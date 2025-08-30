import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

const FooterContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  zIndex: theme.zIndex.appBar,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const FooterContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
}));

const FooterText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container maxWidth="xl">
        <FooterContent>
          <FooterText>
            <LocationOnIcon fontSize="small" color="inherit" />
            <Link
              href="https://maps.app.goo.gl/JUn4xEG9rziBuqdB8"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              72-A Sukh Chayn Gardens
            </Link>
          </FooterText>
          <FooterText>
            <PhoneIcon fontSize="small" color="inherit" />
            <span>0314-4066376</span>
          </FooterText>
        </FooterContent>
      </Container>
    </FooterContainer>
  );
};

export default Footer;