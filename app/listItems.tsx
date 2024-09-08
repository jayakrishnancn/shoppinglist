import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef, useGridApiContext } from "@mui/x-data-grid";
import { ItemType } from "./item-service";

type ListItemProps = {
  rows: ItemType[];
  onDelete: (ids: string[]) => void;
  onUpdate: (newValue: ItemType[]) => void;
};

export default function ListItem({ rows, onDelete, onUpdate }: ListItemProps) {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Item", editable: true },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      editable: true,
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
        editMode="row"
        checkboxSelection
        processRowUpdate={(newItem) => {
          onUpdate(newItem);
          return newItem;
        }}
        sx={{ border: 0 }}
        slots={{
          toolbar: () => <CustomToolbar onDelete={onDelete} />,
        }}
      />
    </Box>
  );
}

function CustomToolbar({ onDelete }: Pick<ListItemProps, "onDelete">) {
  const apiRef = useGridApiContext();
  const selectedRows = Array.from(
    apiRef.current?.getSelectedRows().keys() || [],
  );
  const hasRowSelection = selectedRows.length > 0;

  return (
    <Box mb={1} display="flex" justifyContent="end">
      <Button
        onClick={() => onDelete(selectedRows.map((i) => i.toString()))}
        color="error"
        variant="outlined"
        disabled={!hasRowSelection}
      >
        Delete Selected
      </Button>
    </Box>
  );
}
