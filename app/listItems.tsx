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
import ConfirmationBox from "./components/ConfirmationBox";
import { RemoveCircle } from "@mui/icons-material";

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

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export default function ListItem({ rows, onDelete, onUpdate }: ListItemProps) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Item",
      editable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      editable: true,
      headerAlign: "right",
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      editable: true,
      flex: 1,
      type: "singleSelect",
      valueOptions: STATUS,
      minWidth: 150,
    },
    {
      field: "updatedAt",
      headerName: "Updated",
      editable: false,
      type: "dateTime",
      valueFormatter: (v) => new Date(v).toLocaleDateString(),
      flex: 1,
      minWidth: 130,
    },
  ];

  return (
    <Box
      sx={{
        height: 700,
        width: "100%",
        borderRadius: 2,
      }}
    >
      <DataGrid
        rows={rows}
        density="compact"
        columns={columns}
        pagination
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
    apiRef.current?.getSelectedRows().values()
  ) as ItemType[];
  const hasRowSelection = selectedRowValues.length > 0;

  const handleDelete = () => onDelete(selectedRowValues.map((i) => i.id));

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
              }))
            );
          }}
          size="small"
        >
          {STATUS.map((value) => (
            <MenuItem key={value as string} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ConfirmationBox
        title="Confirm"
        description={
          <Box>
            <h2>Confirm removing selected items?</h2>
            {selectedRowValues.map((item) => (
              <Box display="flex" justifyContent="space-between" key={item.id}>
                <div>{item.name}</div>
                <div>&#2352;{item.cost}</div>
              </Box>
            ))}
          </Box>
        }
        onConfirm={handleDelete}
        button={(handleOpen) => (
          <Button
            variant="contained"
            color="error"
            startIcon={<RemoveCircle />}
            onClick={handleOpen}
            disabled={!hasRowSelection}
          >
            Remove Selected ?
          </Button>
        )}
      />
    </Box>
  );
}
