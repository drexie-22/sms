import { useEffect, useState } from "react";
import { fetchInstitutions } from "@/api/institutions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { School } from "lucide-react";

export default function ActiveUnits() {
  const [institutions, setInstitutions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchInstitutions()
      .then((data) => {
        const activeOnly = data.filter((i: any) => i.status === "ACTIVE");
        setInstitutions(activeOnly);
      })
      .catch((error) => console.error("❌ Failed to fetch institutions:", error));
  }, []);

  const paginated = institutions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(institutions.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Active Units</h1>
        <p className="text-muted-foreground">
          List of all currently active STARBOOKS units across Region 1.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Active STARBOOKS Institutions</span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Filtered view showing only active institutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginated.map((institution: any) => (
              <div
                key={institution.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-muted rounded-full">
                    <School className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{institution.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {institution.province} • {institution.institutionType} • {institution.municipality}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Code: {institution.institutionalCode} • Contact: {institution.phone}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">
                    {new Date(institution.deploymentDate).toLocaleDateString()}
                  </p>
                  <Badge variant="default" className="mt-1">
                    Active
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
