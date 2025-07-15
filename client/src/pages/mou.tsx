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
  MapPin,
  PlusCircle,
  ArchiveRestore,
  Bell,
  Pencil,
  Eye,
} from "lucide-react";

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
  type?: string;
  recipientName: string;
  province: string;
  municipality: string;
  mouFile?: string;
  mouFileSize?: string;
  mouStatus: "Available" | "Missing";
  mouUploadDate?: string;
  unitStatus?: "active" | "inactive";
  archived?: boolean;
  status?: string;
}

export default function MOU() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedUnitStatus, setSelectedUnitStatus] = useState("");
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [viewingInstitution, setViewingInstitution] = useState<Institution | null>(null);
  const [notifyingInstitution, setNotifyingInstitution] = useState<Institution | null>(null);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    fetchInstitutions()
      .then((data) => setInstitutions(data))
      .catch((error) => console.error("❌ Error fetching institutions:", error));
  }, []);

  const filteredDocuments = institutions.filter((doc) => {
    if (doc.archived) return false;
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.province.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince =
      selectedProvince === "" || selectedProvince === "all" || doc.province === selectedProvince;
    const matchesUnitStatus =
      selectedUnitStatus === "" || selectedUnitStatus === "all" || doc.unitStatus === selectedUnitStatus;
    return matchesSearch && matchesProvince && matchesUnitStatus;
  });

  const handleArchive = (institutionCode: string) => {
    if (!confirm("Are you sure you want to archive this institution?")) return;
    setInstitutions((prev) =>
      prev.map((inst) =>
        inst.institutionalCode === institutionCode ? { ...inst, archived: true } : inst
      )
    );
    alert("Institution archived.");
  };

  const handleSendNotification = () => {
    if (!notificationMessage.trim() || !notifyingInstitution) return;
    alert(`Message sent to ${notifyingInstitution.recipientName}:\n${notificationMessage}`);
    setNotificationMessage("");
    setNotifyingInstitution(null);
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
          {/* Search and Filter */}
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

            <Select value={selectedUnitStatus} onValueChange={setSelectedUnitStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Unit Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Unit Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Counts */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Found {filteredDocuments.length} document(s)</span>
            <span>
              {filteredDocuments.filter((doc) => doc.mouStatus === "Available").length} available,{" "}
              {filteredDocuments.filter((doc) => doc.mouStatus === "Missing").length} missing
            </span>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Institution</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>MOU</TableHead>
                  <TableHead>Unit Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                      <TableCell>
                        {doc.mouStatus === "Available" && doc.mouFile ? (
                          <span className="text-green-600 font-medium">Uploaded</span>
                        ) : (
                          <span className="text-red-500 font-medium">Not yet uploaded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.unitStatus === "active" ? "default" : "secondary"}>
                          {doc.unitStatus
                            ? doc.unitStatus.charAt(0).toUpperCase() + doc.unitStatus.slice(1)
                            : "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          <Button variant="ghost" size="sm" onClick={() => setViewingInstitution(doc)} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setNotifyingInstitution(doc)} title="Notify">
                            <Bell className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingInstitution(doc)} title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleArchive(doc.institutionalCode)} title="Archive">
                            <ArchiveRestore className="h-4 w-4" />
                          </Button>
                          {doc.mouStatus === "Missing" && (
                            <Button variant="outline" size="sm" title="Upload MOU">
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

      {/* View Institution */}
      {viewingInstitution && (
        <Dialog open={true} onOpenChange={() => setViewingInstitution(null)}>
          <DialogContent className="w-full max-w-2xl">
            <DialogTitle>Institution Details</DialogTitle>
            <DialogDescription>
              Details for <strong>{viewingInstitution.name}</strong>
            </DialogDescription>
            <div className="space-y-4 mt-4">
              <DetailRow label="Institution Name" value={viewingInstitution.name} />
              <DetailRow label="Institutional Code" value={viewingInstitution.institutionalCode} />
              <DetailRow label="Type" value={viewingInstitution.type || "N/A"} />
              <DetailRow label="Location" value={`${viewingInstitution.municipality}, ${viewingInstitution.province}`} />
              <DetailRow label="Unit Status" value={viewingInstitution.unitStatus ? viewingInstitution.unitStatus.charAt(0).toUpperCase() + viewingInstitution.unitStatus.slice(1) : "Unknown"} />
              <DetailRow label="MOU Status" value={viewingInstitution.mouStatus} />
              {viewingInstitution.mouStatus === "Available" && viewingInstitution.mouFile && (
                <a
                  href={`/uploads/mou/${viewingInstitution.mouFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View MOU Document
                </a>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setViewingInstitution(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Institution */}
      {editingInstitution && (
        <Dialog open={true} onOpenChange={() => setEditingInstitution(null)}>
          <DialogContent className="w-full max-w-2xl">
            <DialogTitle>Edit Institution</DialogTitle>
            <DialogDescription>
              Update details for <strong>{editingInstitution.name}</strong>
            </DialogDescription>

            <div className="space-y-4">
              <InputField label="Institution Name" value={editingInstitution.name} onChange={(value) => setEditingInstitution((prev) => (prev ? { ...prev, name: value } : prev))} />
              <InputField label="Institution Code" value={editingInstitution.institutionalCode} onChange={(value) => setEditingInstitution((prev) => (prev ? { ...prev, institutionalCode: value } : prev))} />
              <InputField label="Province" value={editingInstitution.province} onChange={(value) => setEditingInstitution((prev) => (prev ? { ...prev, province: value } : prev))} />
              <InputField label="Municipality" value={editingInstitution.municipality} onChange={(value) => setEditingInstitution((prev) => (prev ? { ...prev, municipality: value } : prev))} />

              <div>
                <label className="text-sm font-medium">Unit Status</label>
                <Select value={editingInstitution.unitStatus} onValueChange={(value) => setEditingInstitution((prev) => (prev ? { ...prev, unitStatus: value as "active" | "inactive" } : prev))}>
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
                <Select value={editingInstitution.mouStatus} onValueChange={(value) => setEditingInstitution((prev) => (prev ? { ...prev, mouStatus: value as "Available" | "Missing" } : prev))}>
                  <SelectTrigger>
                    <SelectValue placeholder="MOU Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload Field */}
              <div>
                <label className="text-sm font-medium">Upload MOU File</label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && editingInstitution) {
                      const fileName = file.name;
                      const fileSize = `${(file.size / 1024).toFixed(2)} KB`;

                      setEditingInstitution((prev) =>
                        prev
                          ? {
                              ...prev,
                              mouFile: fileName,
                              mouFileSize: fileSize,
                              mouStatus: "Available",
                            }
                          : prev
                      );
                    }
                  }}
                />
                {editingInstitution.mouFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current file: <span className="underline">{editingInstitution.mouFile}</span>{" "}
                    ({editingInstitution.mouFileSize})
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingInstitution(null)}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (!editingInstitution) return;
                setInstitutions((prev) =>
                  prev.map((inst) => (inst.id === editingInstitution.id ? editingInstitution : inst))
                );
                setEditingInstitution(null);
              }}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Notification Dialog */}
      {notifyingInstitution && (
        <Dialog open={true} onOpenChange={() => setNotifyingInstitution(null)}>
          <DialogContent className="w-full max-w-lg">
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              Send a message to <strong>{notifyingInstitution.recipientName}</strong>
            </DialogDescription>

            <textarea
              className="w-full mt-4 p-2 border rounded resize-y"
              rows={5}
              placeholder="Type your message here..."
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setNotifyingInstitution(null)}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification} disabled={!notificationMessage.trim()}>
                Send
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={label} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-1">
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
}