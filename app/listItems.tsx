import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { DataGrid, GridColDef, useGridApiContext } from "@mui/x-data-grid";
import { ItemType, StatusType } from "./item-service";
import { STATUS } from "./utils/sortItem";

type ListItemProps = {
  rows: ItemType[];
  onDelete: (ids: string[]) => void;
  onUpdate: (newValue: ItemType[]) => Promise<any>;
};

function shallowEqual(obj1: any, obj2: any) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export default function ListItem({ rows, onDelete, onUpdate }: ListItemProps) {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Item", editable: true, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      editable: true,
      flex: 1,
      type: "singleSelect",
      valueOptions: STATUS,
    },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      editable: true,
      headerAlign: "right",
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
        processRowUpdate={(newItem, prevItem) => {
          if (!shallowEqual(newItem, prevItem)) {
            onUpdate([newItem]);
          }
          return newItem;
        }}
        sx={{ border: 0 }}
        slots={{
          toolbar: () => (
            <CustomToolbar
              onDelete={onDelete}
              onUpdate={onUpdate}
              rows={rows}
            />
          ),
        }}
      />
    </Box>
  );
}

function CustomToolbar({ onDelete, onUpdate }: ListItemProps) {
  const apiRef = useGridApiContext();
  const selectedRowValues = Array.from(
    apiRef.current?.getSelectedRows().values(),
  ) as ItemType[];
  const hasRowSelection = selectedRowValues.length > 0;

  return (
    <Box mb={1} justifyContent="end" display="flex" gap={1} p={1}>
      <FormControl size="small">
        <InputLabel id="demo-simple-select-label">Change Status</InputLabel>
        <Select
          disabled={!hasRowSelection}
          labelId="demo-simple-select-label"
          label="Change Status"
          value={STATUS[0]}
          onChange={(event: SelectChangeEvent) => {
            const newStatus = event.target.value as StatusType;
            if (!hasRowSelection) {
              return;
            }
            onUpdate(
              selectedRowValues.map((value) => ({
                ...value,
                status: newStatus,
              })),
            );
          }}
          size="small"
        >
          {STATUS.map((value) => (
            <MenuItem key={value as string} value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        size="small"
        onClick={() => onDelete(selectedRowValues.map((i) => i.id))}
        color="error"
        variant="outlined"
        disabled={!hasRowSelection}
      >
        Delete Selected
      </Button>
    </Box>
  );
}
