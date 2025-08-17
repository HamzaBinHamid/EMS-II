// src/components/InstituteCard.tsx

import { Card, CardContent, Typography, CardActionArea } from "@mui/material";

interface InstituteCardProps {
  instituteName: string;
  category: string;
  onClick: () => void;
}

const InstituteCard: React.FC<InstituteCardProps> = ({ instituteName, onClick }) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {instituteName}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default InstituteCard;
