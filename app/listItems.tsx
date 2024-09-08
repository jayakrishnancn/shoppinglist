import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { ItemType } from "./item-service";

const paginationModel = { page: 0, pageSize: 5 };

export default function ListItem({ rows, onDelete }: any) {
  const columns: GridColDef[] = [
    { field: "name", headerName: "First name", width: 130 },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      width: 90,
    },
    {
      field: "id",
      headerName: "Action",
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          if (!params.value) {
            return;
          }
          onDelete(params.value);
        };
        return (
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 520, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Box>
  );
}
