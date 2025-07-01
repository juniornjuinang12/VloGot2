import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Terms = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Conditions d'utilisation
          </Typography>
          <Typography variant="body2" component="p">
            Ici, vous pouvez ajouter les conditions d'utilisation générales pour votre réseau social.
            Assurez-vous de couvrir tous les aspects importants tels que les droits des utilisateurs,
            les responsabilités, les limitations de responsabilité, etc.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;