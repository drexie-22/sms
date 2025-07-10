import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Download,
  Eye,
  Calendar,
  MapPin,
  PlusCircle,
  ArchiveRestore,
  Bell,
  Pencil,
  Trash2,
} from "lucide-react";

import AddTraining from "@/pages/add-trainings";
import AddInstitution from "@/pages/add-school";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fetchInstitutions } from "@/api/institutions";

interface Institution {
  id: number;
  name: string;
  institutionalCode: string;
  recipientName: string;
  province: string;
  municipality: string;
  mouFile?: string;
  mouFileSize?: string;
  mouStatus: "Available" | "Missing";
  mouUploadDate?: string;
  status?: "active" | "inactive"; // ✅ Added unit status
}

export default function MOU() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    fetchInstitutions()
      .then((data) => setInstitutions(data))
      .catch((error) => console.error("❌ Error fetching institutions:", error));
  }, []);

  const filteredDocuments = institutions.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.province.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvince =
      selectedProvince === "" || selectedProvince === "all" || doc.province === selectedProvince;

    const matchesStatus =
      selectedStatus === "" || selectedStatus === "all" || doc.mouStatus === selectedStatus;

    return matchesSearch && matchesProvince && matchesStatus;
  });

  const handleViewDocument = (fileName: string) => alert("Viewing: " + fileName);
  const handleDownloadDocument = (fileName: string) => alert("Downloading: " + fileName);
  const handleArchive = (code: string) => alert(`Archiving ${code}`);
  const handleNotify = (recipient: string) => alert(`Notification sent to ${recipient}`);
  const handleDelete = (code: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this institution?");
    if (confirmDelete) {
      alert(`Deleted ${code}`);
      setInstitutions((prev) => prev.filter((i) => i.institutionalCode !== code));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Beneficiaries</h1>
        <p className="text-muted-foreground">
          Track and manage signed MOU documents of Region I institutions.
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-900 shadow-lg border rounded-xl">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Manage MOU Documents</CardTitle>
              <CardDescription>Search, filter, and manage institutional MOU files.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Trainings
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl h-[800px] rounded-lg shadow-xl bg-white dark:bg-gray-900 overflow-auto">
                  <AddTraining />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Institution
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl h-[800px] rounded-lg shadow-xl bg-white dark:bg-gray-900 overflow-auto">
                  <AddInstitution />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 mt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              placeholder="Search by institution name or province..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-2"
            />
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger>
                <SelectValue placeholder="All Provinces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                <SelectItem value="Ilocos Norte">Ilocos Norte</SelectItem>
                <SelectItem value="Ilocos Sur">Ilocos Sur</SelectItem>
                <SelectItem value="La Union">La Union</SelectItem>
                <SelectItem value="Pangasinan">Pangasinan</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Missing">Missing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Found {filteredDocuments.length} document(s)</span>
            <span>
              {filteredDocuments.filter((doc) => doc.mouStatus === "Available").length} available,{" "}
              {filteredDocuments.filter((doc) => doc.mouStatus === "Missing").length} missing
            </span>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Institution</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>MOU Status</TableHead>
                  <TableHead>Unit Status</TableHead> {/* ✅ New Column */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No MOU documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
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
                        {doc.mouFile ? (
                          <div>
                            <p className="text-sm">{doc.mouFile}</p>
                            <p className="text-xs text-muted-foreground">{doc.mouFileSize}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No file</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {doc.mouUploadDate ? (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(doc.mouUploadDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not uploaded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.mouStatus === "Available" ? "default" : "destructive"}>
                          {doc.mouStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "active" ? "default" : "secondary"}>
                          {doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
  <div className="flex gap-1 flex-wrap">
    {doc.mouStatus === "Available" && (
      <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc.mouFile!)}>
        <Eye className="h-4 w-4" />
      </Button>
    )}
    <Button variant="ghost" size="sm" onClick={() => handleNotify(doc.recipientName)}>
      <Bell className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="sm" onClick={() => setEditingInstitution(doc)}>
      <Pencil className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="sm" onClick={() => handleArchive(doc.institutionalCode)}>
      <ArchiveRestore className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.institutionalCode)}>
      <Trash2 className="h-4 w-4" />
    </Button>
    {doc.mouStatus === "Missing" && (
      <Button variant="outline" size="sm">
        <Upload className="h-4 w-4 mr-1" />
        Upload
      </Button>
    )}
  </div>
</TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingInstitution && (
  <Dialog open={true} onOpenChange={() => setEditingInstitution(null)}>
    <DialogContent className="w-full max-w-2xl">
      <DialogTitle>Edit Institution</DialogTitle>
      <DialogDescription>
        Update details for <strong>{editingInstitution.name}</strong>
      </DialogDescription>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Institution Name</label>
          <Input
            value={editingInstitution.name}
            onChange={(e) =>
              setEditingInstitution((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
            placeholder="Institution Name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Institution Code</label>
          <Input
            value={editingInstitution.institutionalCode}
            onChange={(e) =>
              setEditingInstitution((prev) =>
                prev ? { ...prev, institutionalCode: e.target.value } : prev
              )
            }
            placeholder="Institution Code"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Province</label>
          <Input
            value={editingInstitution.province}
            onChange={(e) =>
              setEditingInstitution((prev) =>
                prev ? { ...prev, province: e.target.value } : prev
              )
            }
            placeholder="Province"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Municipality</label>
          <Input
            value={editingInstitution.municipality}
            onChange={(e) =>
              setEditingInstitution((prev) =>
                prev ? { ...prev, municipality: e.target.value } : prev
              )
            }
            placeholder="Municipality"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Recipient Name</label>
          <Input
            value={editingInstitution.recipientName}
            onChange={(e) =>
              setEditingInstitution((prev) =>
                prev ? { ...prev, recipientName: e.target.value } : prev
              )
            }
            placeholder="Recipient Name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Unit Status</label>
          <Select
            value={editingInstitution.status}
            onValueChange={(value) =>
              setEditingInstitution((prev) =>
                prev ? { ...prev, status: value as "active" | "inactive" } : prev
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Unit Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">MOU Status</label>
          <Select
            value={editingInstitution.mouStatus}
            onValueChange={(value) =>
              setEditingInstitution((prev) =>
                prev ? { ...prev, mouStatus: value as "Available" | "Missing" } : prev
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="MOU Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Missing">Missing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setEditingInstitution(null)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (!editingInstitution) return;
            setInstitutions((prev) =>
              prev.map((inst) =>
                inst.id === editingInstitution.id ? editingInstitution : inst
              )
            );
            setEditingInstitution(null);
          }}
        >
          Save
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)}


    </div>
  );
}
