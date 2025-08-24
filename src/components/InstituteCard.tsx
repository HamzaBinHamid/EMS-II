import { Card, CardContent, Typography, CardActionArea, CardMedia, Box } from "@mui/material";

interface InstituteCardProps {
  instituteName: string;
  imageUrl?: string | null;
  onClick: () => void;
}

const InstituteCard: React.FC<InstituteCardProps> = ({ instituteName, imageUrl, onClick }) => {
  return (
    <Card
      sx={{
        maxWidth: { xs: 140, sm: 150, md: 160 },
        mx: "auto",
      }}
    >
      <CardActionArea onClick={onClick}>
        {imageUrl ? (
          <CardMedia
            component="img"
            sx={{
              height: { xs: 80, sm: 90, md: 100 },
              objectFit: "contain",
              width: "100%",
            }}
            image={imageUrl}
            alt={`${instituteName} image`}
          />
        ) : (
          <Box
            sx={{
              height: { xs: 80, sm: 90, md: 100 },
              width: "100%",
              bgcolor: "grey.200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              No Image
            </Typography>
          </Box>
        )}
        <CardContent sx={{ p: { xs: 0.5, sm: 1 } }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              textAlign: "center",
            }}
          >
            {instituteName}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default InstituteCard;
