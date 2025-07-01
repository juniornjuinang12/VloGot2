import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Privacy = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Politique de confidentialité
          </Typography>
          <Typography variant="body2" component="p">
            Ici, vous pouvez ajouter votre politique de confidentialité générale pour votre réseau social.
            Assurez-vous de couvrir tous les aspects importants tels que la collecte de données,
            l'utilisation des données, le partage des données, etc.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
