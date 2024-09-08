import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef, useGridApiContext } from "@mui/x-data-grid";

export default function ListItem({
  rows,
  onDelete,
}: {
  rows: any;
  onDelete: (ids: string[]) => void;
}) {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Item", width: 130 },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
    },
  ];

  return (
    <Box sx={{ height: 520, width: "100%", p: 1, border: "1px solid #ccc" }}>
      <DataGrid
        rows={rows}
        density="compact"
        columns={columns}
        pagination
        autoPageSize
        checkboxSelection
        sx={{ border: 0 }}
        slots={{
          toolbar: () => <CustomToolbar onDelete={onDelete} />,
        }}
      />
    </Box>
  );
}

function CustomToolbar({ onDelete }: any) {
  const apiRef = useGridApiContext();
  const selectedRows = Array.from(
    apiRef.current?.getSelectedRows().keys() || [],
  );
  const hasRowSelection = selectedRows.length > 0;

  return (
    <Box mb={1} display="flex" justifyContent="end">
      <Button
        onClick={() => onDelete(selectedRows)}
        color="error"
        variant="outlined"
        disabled={!hasRowSelection}
      >
        Delete Selected
      </Button>
    </Box>
  );
}
