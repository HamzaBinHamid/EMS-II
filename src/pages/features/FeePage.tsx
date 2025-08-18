import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchInstitutes } from "@/lib/supabase/queries";
import InstituteCard from "@/components/InstituteCard";
import PageLoader from "@/components/PageLoader";
import InstituteModal from "@/components/InstituteModal";
import type { Institute } from "@/types/institute";

const FeePage: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);

  const handleOpen = (institute: Institute) => {
    setSelectedInstitute(institute);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedInstitute(null);
    setOpen(false);
  };

  const {
    data: institutes,
    isLoading,
    error,
    isError,
    isSuccess,
    refetch,
  } = useQuery<Institute[], Error>({
    queryKey: ["institutes"],
    queryFn: fetchInstitutes,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", padding: { xs: 2, sm: 4 } }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{ mb: 4, textAlign: "left" }}
      >
        Fee Management
      </Typography>

      {isLoading && <PageLoader />}

      {isError && (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="body1" color="error" gutterBottom>
            Failed to load institutes: {error?.message || "An unexpected error occurred"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => refetch()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      )}

      {isSuccess && institutes && institutes.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)", // 2 cards on mobile
              sm: "repeat(4, 1fr)", // 4 cards on small screens
              md: "repeat(5, 1fr)", // 5 cards on medium/large screens
            },
            gap: 2, // Reduced gap for tighter layout
            justifyContent: "center",
          }}
        >
          {institutes.map((institute) => (
            <Box key={institute.institute_name}>
              <InstituteCard
                instituteName={institute.institute_name}
                category={institute.institute_category}
                imageUrl={institute.image_url}
                onClick={() => handleOpen(institute)}
              />
            </Box>
          ))}
        </Box>
      )}

      {isSuccess && institutes?.length === 0 && (
        <Typography variant="body1" align="center" color="textSecondary">
          No institutes found.
        </Typography>
      )}

      <InstituteModal
        open={open}
        onClose={handleClose}
        institute={selectedInstitute}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            router.push("/");
          }}
          startIcon={<ArrowBack />}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default FeePage;