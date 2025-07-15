import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

import { addTraining } from "@/api/trainings";

export default function TrainingForm() {
  const [formData, setFormData] = useState({
    institution: "",
    date: "",
    province: "",
    municipality: "",
    trainer: "",
    trainingType: "",
    trainingMode: "",
    gadRemarks: "",
  });

  const [participants, setParticipants] = useState({ male: 0, female: 0 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(Number(participants.male) + Number(participants.female));
  }, [participants]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParticipants((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async () => {
    try {
      const trainingData = {
        ...formData,
        type: formData.trainingType,
        mode: formData.trainingMode,
        participants,
        totalParticipants: total,
        gadRemarks: formData.gadRemarks,
      };

      const result = await addTraining(trainingData);
      console.log("✅ Training saved:", result);
      alert("Training saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save training", err);
      alert("Failed to save training");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>STARBOOKS Training Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Institution Name</Label>
            <Input name="institution" value={formData.institution} onChange={handleInputChange} />
          </div>
          <div>
            <Label>Training Date</Label>
            <Input type="date" name="date" value={formData.date} onChange={handleInputChange} />
          </div>
          <div>
            <Label>Province</Label>
            <Input name="province" value={formData.province} onChange={handleInputChange} />
          </div>
          <div>
            <Label>Municipality</Label>
            <Input name="municipality" value={formData.municipality} onChange={handleInputChange} />
          </div>
          <div>
            <Label>Trainer(s)</Label>
            <Input name="trainer" value={formData.trainer} onChange={handleInputChange} />
          </div>
          <div>
            <Label>Training Type</Label>
            <Select onValueChange={(value: string) =>
              setFormData((prev) => ({ ...prev, trainingType: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orientation">Orientation</SelectItem>
                <SelectItem value="refresher">Refresher</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Training Mode</Label>
            <Select onValueChange={(value: string) =>
              setFormData((prev) => ({ ...prev, trainingMode: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-site">On-site</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Male Participants</Label>
            <Input
              type="number"
              name="male"
              value={participants.male}
              onChange={handleParticipantChange}
            />
          </div>
          <div>
            <Label>Female Participants</Label>
            <Input
              type="number"
              name="female"
              value={participants.female}
              onChange={handleParticipantChange}
            />
          </div>
        </div>

        <div>
          <Label>Total Participants</Label>
          <Input value={total} disabled />
        </div>

        <div>
          <Label>GAD Notes / Remarks</Label>
          <Textarea name="gadRemarks" value={formData.gadRemarks} onChange={handleInputChange} />
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={handleSubmit}>Save Training</Button>
        </div>
      </CardContent>
    </Card>
  );
}
