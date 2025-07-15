import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, School, Users, Building, Star } from "lucide-react";
import { fetchInstitutions } from "@/api/institutions";

const REGION_1_PROVINCES = ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"];

interface Institution {
  id: number;
  name: string;
  province: string;
  municipality: string;
  institutionType: string;
  deployed?: number;
  deploymentDate?: string;
  institutionalCode?: string;
}

interface GroupedData {
  province: string;
  data: Institution[];
  countByType: Record<string, number>;
  total: number;
}

export default function Reports() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("Ilocos Norte");

  useEffect(() => {
    fetchInstitutions()
      .then((data) => {
        console.log("Fetched institutions:", data);
        const filtered: Institution[] = data.filter(
          (item: Institution) =>
            REGION_1_PROVINCES.map(p => p.toLowerCase()).includes(item.province.toLowerCase())
        );
        console.log("Filtered:", filtered);
        setInstitutions(filtered);
      })
      .catch(console.error);
  }, []);

  const provinces = useMemo(() => {
    const set = new Set(institutions.map((i) => i.province));
    return Array.from(set).sort();
  }, [institutions]);

  const institutionTypes = useMemo(() => {
  const typeSet = new Set<string>();
  institutions.forEach((i) => {
    if (i.institutionType) typeSet.add(i.institutionType);
  });
  return Array.from(typeSet).sort();
}, [institutions]);

const groupedByProvince: GroupedData[] = useMemo(() => {
  return provinces.map((province) => {
    const data = institutions.filter((i) => i.province === province);
    const countByType: Record<string, number> = {};

    data.forEach((item: Institution) => {
      const t = item.institutionType || "Unknown";
      const deployed = item.deployed || 1;
      countByType[t] = (countByType[t] || 0) + deployed;
    });

    const total = Object.values(countByType).reduce((a, b) => a + b, 0);
    return { province, data, countByType, total };
  });
}, [institutions, provinces]);


  const activeProvince = groupedByProvince.find((p) => p.province === selectedProvince);

  const convertToCSV = (data: Institution[]) => {
    const headers = [
      "No",
      "Institution Name",
      "Institution Type",
      "Province",
      "Municipality",
      "Institution Code",
      "Deployment Date",
      "No. of STARBOOKS",
    ];

    const rows = data.map((item, index) => [
      index + 1,
      item.name,
      item.institutionType,
      item.province,
      item.municipality,
      item.institutionalCode || "",
      item.deploymentDate ? new Date(item.deploymentDate).toLocaleDateString("en-US") : "",
      item.deployed || 1,
    ]);

    const csvContent =
      headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n");

    return csvContent;
  };

  const downloadCSV = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportReport = () => {
    if (!activeProvince || !activeProvince.data.length) {
      alert("No data available to export.");
      return;
    }

    const csv = convertToCSV(activeProvince.data);
    const filename = `${selectedProvince.replace(/\s/g, "_")}_Deployment_Report.csv`;
    downloadCSV(filename, csv);
  };

  const activeInactiveStats = useMemo(() => {
    let active = 0;
    let inactive = 0;
    institutions.forEach((i: any) => {
      const status = String(i.status || "").toUpperCase();
      if (status === "ACTIVE") active++;
      else if (status === "INACTIVE") inactive++;
    });
    return { active, inactive };
  }, [institutions]);

  const professionalSummary = [
    {
      title: "Total Sites in Region 1",
      value: institutions.length.toString(),
      icon: School,
      description: `as of ${new Date().getFullYear()}`,
    },
    {
      title: "Institutions Deployed",
      value: institutions.length.toString(),
      icon: Users,
      description: "including SUCs, LGUs, and schools",
    },
    {
      title: "Active / Inactive Units",
      value: `${activeInactiveStats.active} / ${activeInactiveStats.inactive}`,
      icon: Star,
      description: "Status of all STARBOOKS units",
    },
    {
      title: "GAD-Focused Deployments",
      value: "– / –",
      icon: Building,
      description: "Deployments to institutions with gender-focused programs",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Deployment Reports</h1>
        <p className="text-muted-foreground text-sm">
          STARBOOKS institutional deployment report with province-level drilldowns and summary.
        </p>
      </div>

      <Card className="relative">
        <Button onClick={exportReport} className="absolute top-4 right-4 z-10" size="sm">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
        <CardHeader>
          <CardTitle>Summary Overview</CardTitle>
          <CardDescription>Key figures based on overall Region 1 deployment</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {professionalSummary.map((item, index) => (
            <div key={index} className="p-4 rounded-lg border bg-background shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {groupedByProvince.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Deployment Report</CardTitle>
              <CardDescription>Click a province row below to see full deployment records</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-md">
                <thead>
                  <tr className="bg-muted text-foreground font-semibold">
                    <th className="p-3 text-left">Province</th>
                    <th className="p-3 text-center">Elementary School</th>
                    <th className="p-3 text-center">High School</th>
                    <th className="p-3 text-center">College/University</th>
                    <th className="p-3 text-center">Gov't Office</th>
                    <th className="p-3 text-center">LGU</th>
                    <th className="p-3 text-center">DOST</th>
                    <th className="p-3 text-center">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedByProvince.map((prov) => (
                    <tr
                      key={prov.province}
                      className={`border-b hover:bg-muted/50 cursor-pointer ${prov.province === selectedProvince ? "bg-muted" : ""}`}
                      onClick={() => setSelectedProvince(prov.province)}
                    >
                      <td className="p-3 font-medium">{prov.province}</td>
                      <td className="p-3 text-center">{prov.countByType["Elementary School"]}</td>
                      <td className="p-3 text-center">{prov.countByType["High School"]}</td>
                      <td className="p-3 text-center">{prov.countByType["College/University"]}</td>
                      <td className="p-3 text-center">{prov.countByType["Government Office/Agency"]}</td>
                      <td className="p-3 text-center">{prov.countByType["LGU"]}</td>
                      <td className="p-3 text-center">{prov.countByType["DOST"] || prov.countByType["DOST Agency"] || prov.countByType["DOST AGENCY"] || 0}</td>

                      <td className="p-3 text-center font-semibold">{prov.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{selectedProvince} Deployment Details</CardTitle>
              <CardDescription>Institution-level deployment information</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] overflow-y-auto space-y-2">
              <table className="min-w-full text-sm border">
                <thead className="bg-muted text-foreground">
                  <tr>
                    <th className="p-2 text-left">No</th>
                    <th className="p-2 text-left">Institution Name</th>
                    <th className="p-2 text-left">Institution Type</th>
                    <th className="p-2 text-left">Exact Place</th>
                    <th className="p-2 text-left">Institution Code</th>
                    <th className="p-2 text-left">Deployment Date</th>
                    <th className="p-2 text-center"># of STARBOOKS</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProvince?.data.length ? (
                    activeProvince.data.map((item: Institution, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.institutionType}</td>
                        <td className="p-2">{item.municipality}</td>
                        <td className="p-2">{item.institutionalCode}</td>
                        <td className="p-2">
                          {item.deploymentDate ? new Date(item.deploymentDate).toLocaleDateString("en-US") : "–"}
                        </td>
                        <td className="p-2 text-center">{item.deployed || 1}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center italic text-muted-foreground">
                        No deployment data found for this province.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent>
            <p className="text-center text-muted-foreground italic">No Region 1 data available. Check your connection or filters.</p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground italic text-center">
        Data shown is subject to change based on new STARBOOKS deployment submissions.
      </p>
    </div>
  );
}
