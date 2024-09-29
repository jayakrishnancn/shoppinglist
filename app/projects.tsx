import { Box } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import {
  addProject,
  deleteProjects,
  getProjects,
  ProjectType,
  updateProject,
} from "./item-service";
import ListItem from "./listItems";
import { toast } from "react-toastify";
import Link from "next/link";
import FormProject from "./FormProject";

interface ProjectListProps {
  userId: string;
}

const ProjectList: FunctionComponent<ProjectListProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const handleDelete = async (ids: string[]) => {
    console.log(ids);
    setIsLoading(true);
    return deleteProjects(userId, ids)
      .then(setProjects)
      .then(() =>
        toast.success("Deleted items from list.", { theme: "colored" })
      )
      .catch((error) => {
        console.error(error);
        toast.error("Error deleting list to database.", { theme: "colored" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleUpdates = async (newData: any[]) => {
    setIsLoading(true);
    return updateProject(userId, newData)
      .then(setProjects)
      .then(() =>
        toast.success("Updated items of the list.", { theme: "colored" })
      )
      .catch((error) => {
        console.error(error);
        toast.error("Error updating items to database.", { theme: "colored" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleSubmit = async (item: ProjectType) => {
    setIsLoading(true);
    return addProject(userId, item.name)
      .then(() => getProjects(userId))
      .then(setProjects)
      .then(() =>
        toast.success("Added new item to list.", { theme: "colored" })
      )
      .catch((error) => {
        console.error(error);
        toast.error("Error saving item to database.", { theme: "colored" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    setIsLoading(true);
    getProjects(userId)
      .then(setProjects)
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  return isLoading ? (
    "Loading projects"
  ) : (
    <Box display="flex" flexDirection="column" gap={1} mb="100px">
      <ListItem
        buttons={{
          enableStatusChange: false,
        }}
        rows={projects}
        onDelete={handleDelete}
        onUpdate={handleUpdates}
        columns={[
          {
            field: "name",
            headerName: "Project",
            editable: true,
            flex: 1,
            minWidth: 200,
            renderCell(params) {
              const { value, id } = params;
              return (
                <Link
                  style={{ textDecoration: "underline" }}
                  key={value}
                  href={`/${userId}/${id}`}
                >
                  {value}
                </Link>
              );
            },
          },
        ]}
      />
      <Box
        position="fixed"
        bottom={0}
        right={0}
        left={0}
        bgcolor="#cbe5cc"
        zIndex={10}
        p={2}
        display="flex"
        justifyContent="center"
      >
        <FormProject onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default ProjectList;
