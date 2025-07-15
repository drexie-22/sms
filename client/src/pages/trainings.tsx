import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { fetchTrainings } from "@/api/trainings";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddTrainingForm from "@/pages/add-trainings"; // Your form file

export default function TrainingSummary() {
  const [trainings, setTrainings] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTrainings()
      .then((data) => setTrainings(data))
      .catch((err) => console.error("Failed to fetch trainings", err));
  }, []);

  const filtered = trainings.filter((t: any) =>
    t.institution.toLowerCase().includes(search.toLowerCase())
  );

  const totalMale = trainings.reduce((sum, t: any) => sum + t.male, 0);
  const totalFemale = trainings.reduce((sum, t: any) => sum + t.female, 0);
  const total = totalMale + totalFemale;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto px-4 pb-10">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Training Summary Overview</CardTitle>
          <CardDescription>
            Breakdown of STARBOOKS training activities in Region 1
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Trainings</p>
            <p className="text-2xl font-bold">{trainings.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Male Participants</p>
            <p className="text-2xl font-bold">{totalMale}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Female Participants</p>
            <p className="text-2xl font-bold">{totalFemale}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Participants</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
        </CardContent>
      </Card>

      {/* Table and Filters */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Training Records</CardTitle>
            <CardDescription>
              List of all recorded STARBOOKS trainings
            </CardDescription>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <Input
              className="w-full md:w-72"
              placeholder="Search institution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">+ Add Training</Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-3xl h-[90vh] overflow-y-auto rounded-lg">
                <AddTrainingForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="overflow-auto rounded-lg border">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-muted text-foreground text-xs uppercase">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Institution</th>
                <th className="p-3 text-left">Province</th>
                <th className="p-3 text-left">Municipality</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Mode</th>
                <th className="p-3 text-left">Trainer</th>
                <th className="p-3 text-center">Male</th>
                <th className="p-3 text-center">Female</th>
                <th className="p-3 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item: any, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="p-3">{item.institution}</td>
                    <td className="p-3">{item.province}</td>
                    <td className="p-3">{item.municipality}</td>
                    <td className="p-3">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">{item.mode}</td>
                    <td className="p-3">{item.trainer}</td>
                    <td className="p-3 text-center">{item.male}</td>
                    <td className="p-3 text-center">{item.female}</td>
                    <td className="p-3 text-center">
                      {item.male + item.female}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-4 text-center text-muted-foreground italic">
                    No training records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
