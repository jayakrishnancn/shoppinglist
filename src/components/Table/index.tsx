import { ShoppingListItemType } from "@/app/v1/api/shopping-list/shoppingListService";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FunctionComponent } from "react";

interface TableProps {
  rows: ShoppingListItemType[];
  columns: GridColDef[];
}

const Table: FunctionComponent<TableProps> = ({ rows, columns }) => {
  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </>
  );
};

export default Table;
