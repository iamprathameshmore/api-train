import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchApis } from "@/store/slices/api-slice";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ApiTable() {
  const dispatch = useAppDispatch();
  const { apis, loading } = useAppSelector((state) => state.apis);

  useEffect(() => {
    dispatch(fetchApis());
  }, [dispatch]);

  const filteredApis = apis; // Add filter logic if needed

  return (
    <Table className=" rounded-none p-2 shadow border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">API Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8">
              Loading...
            </TableCell>
          </TableRow>
        ) : filteredApis.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8">
              No APIs found.
            </TableCell>
          </TableRow>
        ) : (
          filteredApis.map((api) => (
            <TableRow key={api.id}>
              <TableCell className="font-medium">{api.name}</TableCell>
              <TableCell>{api.status}</TableCell>
              <TableCell>{new Date(api.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>

  );
}
