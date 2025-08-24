import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchInstitutes, fetchFeeStructures } from "@/lib/supabase/queries";
import InstituteCard from "@/components/InstituteCard";
import FeeStructureModal from "@/components/FeeStructureModal";
import PageLoader from "@/components/PageLoader";
import type { Institute } from "@/types/institute";
import BackToHomeButton from "@/components/BackToHomeButton";
import type { FeeStructure } from "@/types/feeStructure";

const FeePage: React.FC = () => {
  const [openFeeModal, setOpenFeeModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null);

  const handleOpenFeeModal = (instituteName: string) => {
    setSelectedInstitute(instituteName);
    setOpenFeeModal(true);
  };

  const handleCloseFeeModal = () => {
    setSelectedInstitute(null);
    setOpenFeeModal(false);
  };

  // Query for institutes
  const {
    data: institutes,
    isLoading: isLoadingInstitutes,
    error: institutesError,
    isError: isInstitutesError,
    isSuccess: isInstitutesSuccess,
    refetch: refetchInstitutes,
  } = useQuery<Institute[], Error>({
    queryKey: ["institutes"],
    queryFn: fetchInstitutes,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });

  // Query for fee_structure
  const {
    data: feeStructures,
    isLoading: isLoadingFeeStructures,
    error: feeStructuresError,
    isError: isFeeStructuresError,
    refetch: refetchFeeStructures,
  } = useQuery<FeeStructure[], Error>({
    queryKey: ["fee_structures"],
    queryFn: fetchFeeStructures,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", padding: { xs: 2, sm: 4 } }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, textAlign: "left" }}>
        Fee Management
      </Typography>

      {/* Institutes Section */}
      {isLoadingInstitutes || isLoadingFeeStructures ? (
        <PageLoader />
      ) : isInstitutesError || isFeeStructuresError ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="body1" color="error" gutterBottom>
            Failed to load data:{" "}
            {institutesError?.message ||
              feeStructuresError?.message ||
              "An unexpected error occurred"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (isInstitutesError) refetchInstitutes();
              if (isFeeStructuresError) refetchFeeStructures();
            }}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      ) : isInstitutesSuccess && institutes && institutes.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
              md: "repeat(5, 1fr)",
            },
            gap: 2,
            justifyContent: "center",
          }}
        >
          {institutes.map((institute, index) => (
            <Box key={`${institute.institute_name}-${index}`}>
              <InstituteCard
                instituteName={institute.institute_name}
                imageUrl={institute.image_url}
                onClick={() => handleOpenFeeModal(institute.institute_name)}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" align="center" color="textSecondary">
          No institutes found.
        </Typography>
      )}

      {/* Modal */}
      <FeeStructureModal
        open={openFeeModal}
        onClose={handleCloseFeeModal}
        instituteName={selectedInstitute}
        feeStructures={feeStructures || []}
      />

      <BackToHomeButton />
    </Box>
  );
};

export default FeePage;