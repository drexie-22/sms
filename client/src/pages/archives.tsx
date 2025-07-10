// client/src/pages/archives.tsx

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw } from "lucide-react";
import { fetchInstitutions } from "@/api/institutions";

interface Institution {
  id: number;
  name: string;
  institutionalCode: string;
  recipientName: string;
  province: string;
  municipality: string;
  isArchived?: boolean;
}

export default function Archives() {
  const [archivedInstitutions, setArchivedInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    fetchInstitutions()
      .then((data) => {
        const archived = data.filter((inst: Institution) => inst.isArchived);
        setArchivedInstitutions(archived);
      })
      .catch((error) => console.error("Error fetching archived institutions:", error));
  }, []);

  const handleRestore = async (id: number) => {
    if (confirm("Restore this institution?")) {
      try {
        const res = await fetch(`/api/institutions/${id}/restore`, {
          method: "PATCH",
        });
        if (!res.ok) throw new Error("Failed to restore");
        alert("Restored successfully.");
        setArchivedInstitutions((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        console.error(err);
        alert("Error restoring institution.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Archived Institutions</h1>
        <p className="text-muted-foreground">View and manage archived institutions in Region I.</p>
      </div>

      <Card className="bg-white dark:bg-gray-900 shadow-lg border rounded-xl">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Archives</CardTitle>
          <CardDescription>Restore or view archived institutions.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 mt-4">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Institution</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedInstitutions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No archived institutions.
                    </TableCell>
                  </TableRow>
                ) : (
                  archivedInstitutions.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {doc.municipality}, {doc.province}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{doc.institutionalCode}</TableCell>
                      <TableCell>{doc.recipientName}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleRestore(doc.id)}>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
