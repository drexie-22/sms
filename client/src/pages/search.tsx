import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search as SearchIcon, Filter, Download, Eye, MapPin, Calendar } from "lucide-react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSchoolType, setSelectedSchoolType] = useState("");

  // Mock search results - will be replaced with real data
  const searchResults = [
    {
      id: 1,
      schoolName: "SLC",
      province: "La Union",
      municipality: "San Fernando City",
      schoolType: "Private",
      recipientName: "SLC",
      dateDeployed: "2024-05-15",
      yearDistributed: 2024,
      email: "slc.@deped.gov.ph",
      phone: "+63 912 345 6789",
      mouStatus: "Available"
    },
    {
      id: 2,
      schoolName: "Saint John Bosco College of Northern Luzon",
      province: "La Union",
      municipality: "San Fernando City",
      schoolType: "Private",
      recipientName: "SJBCNL",
      dateDeployed: "2024-05-14",
      yearDistributed: 2024,
      email: "SJBCNL@deped.gov.ph",
      phone: "+63 918 765 4321",
      mouStatus: "Available"
    },
    {
      id: 3,
      schoolName: "DMMMSU-ELUC",
      province: "La Union",
      municipality: "Naguilian",
      schoolType: "State University",
      recipientName: "DMMMSU",
      dateDeployed: "2024-05-13",
      yearDistributed: 2024,
      email: "DMMMSU@deped.gov.ph",
      phone: "+63 917 234 5678",
      mouStatus: "Pending"
    }
  ];

  const filteredResults = searchResults.filter(school => {
    const matchesSearch = searchQuery === "" || 
      school.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.municipality.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProvince = selectedProvince === "" || selectedProvince === "all" || school.province === selectedProvince;
    const matchesYear = selectedYear === "" || selectedYear === "all" || school.yearDistributed.toString() === selectedYear;
    const matchesType = selectedSchoolType === "" || selectedSchoolType === "all" || school.schoolType === selectedSchoolType;

    return matchesSearch && matchesProvince && matchesYear && matchesType;
  });

  const handleExportResults = () => {
    // This will be implemented with real export functionality
    console.log("Exporting search results...");
    alert("Export functionality will be implemented with backend integration");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Search Schools</h1>
        <p className="text-muted-foreground">
          Search and filter schools by name, province, year, or school type
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SearchIcon className="h-5 w-5" />
            <span>Search Criteria</span>
          </CardTitle>
          <CardDescription>
            Use the filters below to find specific school deployments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by school name, province, or municipality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Provinces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                <SelectItem value="La Union">La Union</SelectItem>
                <SelectItem value="Pangasinan">Pangasinan</SelectItem>
                <SelectItem value="Ilocos Norte">Ilocos Norte</SelectItem>
                <SelectItem value="Ilocos Sur">Ilocos Sur</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSchoolType} onValueChange={setSelectedSchoolType}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Elementary">Elementary</SelectItem>
                <SelectItem value="Secondary">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Found {filteredResults.length} schools
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedProvince("");
                  setSelectedYear("");
                  setSelectedSchoolType("");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportResults}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            Click on any row to view detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Date Deployed</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>MOU Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No schools found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResults.map((school) => (
                    <TableRow key={school.id} className="hover:bg-muted/50 cursor-pointer">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{school.schoolName}</p>
                          <p className="text-sm text-muted-foreground">{school.municipality}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{school.province}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {school.schoolType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{school.recipientName}</p>
                          <p className="text-xs text-muted-foreground">{school.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(school.dateDeployed).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{school.yearDistributed}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={school.mouStatus === "Available" ? "default" : "secondary"}
                        >
                          {school.mouStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
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