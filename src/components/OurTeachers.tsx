import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const feeData = [
  { course: "Web Development", duration: "6 Months", fee: "₹15,000" },
  { course: "Data Science", duration: "8 Months", fee: "₹25,000" },
  { course: "Graphic Design", duration: "4 Months", fee: "₹12,000" },
  { course: "Digital Marketing", duration: "3 Months", fee: "₹10,000" },
];

export default function OurTeachers() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fee Structure
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Course</strong></TableCell>
              <TableCell><strong>Duration</strong></TableCell>
              <TableCell><strong>Fee</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feeData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell>{row.fee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
