import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  School, TrendingUp, Users, Building, MapPin, CircleCheck, XCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, LabelList, PieChart, Pie, Cell,
} from "recharts";
import { useState, useEffect, useMemo, useRef } from "react";
import { fetchInstitutions } from "@/api/institutions";
import { getGADCount } from "@/api/trainings";

const GreenCircleIcon = () => (
  <CircleCheck color="rgb(54, 183, 58)" style={{ borderRadius: "50%", padding: "0px", fontSize: "40px" }} />
);

const X = () => (
  <XCircle color="rgb(220, 70, 70)" style={{ borderRadius: "50%", padding: "0px", fontSize: "40px" }} />
);

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57", "#8dd1e1"];

export default function Dashboard() {
  const [institutions, setInstitutions] = useState([]);
  const [gadFocusedCount, setGadFocusedCount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const recentDeploymentsRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchInstitutions()
      .then((data) => setInstitutions(data))
      .catch((error) => console.error("❌ Error fetching institutions:", error));

    getGADCount()
      .then(({ gadCount }) => setGadFocusedCount(gadCount))
      .catch((error) => console.error("❌ Error fetching GAD count:", error));
  }, []);

  const validInstitutions = useMemo(() => {
    return institutions.filter((i: any) => i?.name && i?.province && i?.institutionType);
  }, [institutions]);

  const filteredInstitutions = useMemo(() => {
    return selectedProvince
      ? validInstitutions.filter((i: any) => i.province?.trim() === selectedProvince)
      : validInstitutions;
  }, [validInstitutions, selectedProvince]);

  const paginated = filteredInstitutions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);

  const statusStats = useMemo(() => {
    let active = 0;
    let inactive = 0;
    let unknown = 0;
    validInstitutions.forEach((i: any) => {
      const status = String(i.unitStatus || "").toLowerCase().trim();
      if (status === "active") active++;
      else if (status === "inactive") inactive++;
      else unknown++;
    });
    return { active, inactive, unknown };
  }, [validInstitutions]);

  const stats = [
    {
      title: "Total Sites in Region 1",
      value: validInstitutions.length.toString(),
      icon: School,
      description: `as of ${new Date().getFullYear()}`,
    },
    {
      title: "Institutions Deployed",
      value: validInstitutions.length.toString(),
      icon: Users,
      description: "including SUCs, LGUs, and schools",
    },
    {
      title: "Active Units",
      value: statusStats.active.toString(),
      icon: GreenCircleIcon,
      description: "Units currently active",
    },
    {
      title: "Inactive Units",
      value: statusStats.inactive.toString(),
      icon: X,
      description: "Units not currently active",
    },
    {
      title: "Total Number of Trainings",
      value: gadFocusedCount !== null ? gadFocusedCount.toString() : "–",
      icon: Building,
      description: "Total Trainings",
    },
  ];

  const deploymentTrends = useMemo(() => {
    const yearMap: Record<string, number> = {};
    validInstitutions.forEach((i: any) => {
      const date = new Date(i.deploymentDate);
      const year = !isNaN(date.getTime()) ? date.getFullYear().toString() : "Unknown";
      yearMap[year] = (yearMap[year] || 0) + 1;
    });
    return Object.entries(yearMap)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [validInstitutions]);

  const institutionTypeDistribution = useMemo(() => {
    const typeMap: Record<string, number> = {};
    validInstitutions.forEach((i: any) => {
      const type = i.institutionType || "Unknown";
      typeMap[type] = (typeMap[type] || 0) + 1;
    });
    return Object.entries(typeMap).map(([name, value]) => ({ name, value }));
  }, [validInstitutions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Region 1 Deployment Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview and statistics of STARBOOKS deployment in Region 1
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md cursor-pointer hover:shadow-lg transition h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Deployment Trends (Yearly)</span>
            </CardTitle>
            <CardDescription>Deployments across Region 1 by year</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deploymentTrends}
                margin={{ top: 50, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Institutions" fill="#1E3A8A" barSize={24}>
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Institution Type Distribution
            </CardTitle>
            <CardDescription>Breakdown of all deployed institution types</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={institutionTypeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {institutionTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Province Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Deployments by Province</span>
          </CardTitle>
          <CardDescription>Click a province to view its deployment data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"].map((province) => {
              const count = validInstitutions.filter((i: any) => i.province?.trim() === province).length;
              return (
                <button
                  key={province}
                  className="p-4 border rounded-lg bg-muted w-full text-center hover:bg-muted/80 transition"
                  onClick={() => {
                    setSelectedProvince(province);
                    setCurrentPage(1);
                    setTimeout(() => {
                      recentDeploymentsRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 150);
                  }}
                >
                  <p className="text-sm text-muted-foreground">{province}</p>
                  <p className="text-xl font-bold text-primary">{count}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Deployments */}
      <Card ref={recentDeploymentsRef}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{selectedProvince ? `${selectedProvince}` : "Recent Deployments"}</span>
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
          <CardDescription>
            {selectedProvince
              ? `Deployments filtered by ${selectedProvince}`
              : "Latest deployments within Region 1"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {selectedProvince && (
            <div className="mb-4 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedProvince(null);
                  setCurrentPage(1);
                }}
              >
                ← Back to Recent Deployments
              </Button>
            </div>
          )}

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {paginated.map((deployment: any) => {
              const rawStatus = (deployment.unitStatus || "").trim().toLowerCase();
              const displayStatus =
                rawStatus === "active"
                  ? "Active"
                  : rawStatus === "inactive"
                  ? "Inactive"
                  : "Unknown";

              const badgeVariant =
                displayStatus === "Active"
                  ? "default"
                  : displayStatus === "Inactive"
                  ? "secondary"
                  : "outline";

              return (
                <div
                  key={deployment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-full">
                      <School className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{deployment.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {deployment.municipality} • {deployment.province} • {deployment.institutionType}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Code: {deployment.institutionalCode}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">
                      {deployment.deploymentDate
                        ? new Date(deployment.deploymentDate).toLocaleDateString()
                        : "–"}
                    </p>
                    <Badge variant={badgeVariant} className="mt-1">
                      {displayStatus}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
