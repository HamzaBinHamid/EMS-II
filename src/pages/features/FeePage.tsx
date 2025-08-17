import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchInstitutes } from "@/lib/supabase/queries";
import InstituteCard from "@/components/InstituteCard";
import PageLoader from "@/components/PageLoader";
import type { Institute } from "@/types/institute";

const FeePage: React.FC = () => {
  const router = useRouter();

  // Query to fetch institutes with enhanced error handling
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
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    gcTime: 10 * 60 * 1000, // Garbage collect after 10 minutes
    retry: 2, // Retry failed queries twice
    retryDelay: 1000, // 1 second delay between retries
  });

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", padding: { xs: 2, sm: 4 } }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{ mb: 4, textAlign: "center" }} // Removed redundant fontWeight
      >
        Fee Management
      </Typography>

      {/* Loading state with PageLoader */}
      {isLoading && <PageLoader />}

      {/* Error state with retry option */}
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

      {/* Success state: Display institutes */}
      {isSuccess && institutes && institutes.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // 1 column on extra-small screens
              sm: "repeat(2, 1fr)", // 2 columns on small screens
              md: "repeat(3, 1fr)", // 3 columns on medium screens
            },
            gap: 3, // Equivalent to spacing={3} in Grid
            justifyContent: "center",
          }}
        >
          {institutes.map((institute) => (
            <Box key={institute.id}>
              <InstituteCard
                instituteName={institute.institute_name}
                category={institute.institute_category}
                onClick={() => {
                  try {
                    router.push(`/features/fee/${institute.institute_category}`);
                  } catch (err) {
                    console.error("Navigation error:", err);
                  }
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Empty state: No institutes found */}
      {isSuccess && institutes?.length === 0 && (
        <Typography variant="body1" align="center" color="textSecondary">
          No institutes found.
        </Typography>
      )}

      {/* Back to Home button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            try {
              router.push("/");
            } catch (err) {
              console.error("Navigation error:", err);
            }
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default FeePage;