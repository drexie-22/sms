import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "../components/ui/form";
import { Upload, School } from "lucide-react";
import { addInstitution } from "@/api/institutions";

const institutionFormSchema = z.object({
  institutionName: z.string().min(1, "Institution name is required"),
  dateOfDeployment: z.string().min(1, "Date of deployment is required"),
  completeAddress: z.string().min(1, "Complete address is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  institutionType: z.enum([
    "Elementary School",
    "Junior High School",
    "Senior High School",
    "Integrated School",
    "College",
    "University",
    "Library",
    "LGU",
    "NGO",
    "NGAs",
    "CSOs",
    "Others"
  ], {
    required_error: "Please select an institution type",
  }),
  otherInstitutionType: z.string().optional(),
  province: z.string().min(1, "Province is required"),
  municipality: z.string().min(1, "Municipality is required"),
  yearDistributed: z.number().min(1900).max(new Date().getFullYear()),
  institutionalCode: z
    .string()
    .min(1, "Institutional code is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Institutional code must be alphanumeric"),
  status: z.enum(["Active", "Inactive"], {
    required_error: "Please select status",
  }),
});

type InstitutionFormData = z.infer<typeof institutionFormSchema>;

const philippineProvinces = ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"];

export default function AddInstitution() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const form = useForm<InstitutionFormData>({
    resolver: zodResolver(institutionFormSchema),
    defaultValues: {
      institutionName: "",
      dateOfDeployment: "",
      completeAddress: "",
      email: "",
      phone: "",
      recipientName: "",
      province: "",
      municipality: "",
      yearDistributed: new Date().getFullYear(),
      institutionalCode: "",
      status: "Active",
    },
  });

  const onSubmit = async (formData: InstitutionFormData) => {
  try {
    setIsSubmitting(true);

    // Use otherInstitutionType value if institutionType is "Others"
    const finalInstitutionType =
      formData.institutionType === "Others"
        ? formData.otherInstitutionType?.trim() || "Others"
        : formData.institutionType;

    const result = await addInstitution({
      name: formData.institutionName,
      province: formData.province,
      municipality: formData.municipality,
      deploymentDate: formData.dateOfDeployment,
      recipientName: formData.recipientName,
      completeAddress: formData.completeAddress,
      institutionType: finalInstitutionType,
      institutionalCode: formData.institutionalCode,
      email: formData.email,
      phone: formData.phone,
      yearDistributed: formData.yearDistributed,
      status: formData.status,
    });

    console.log("✅ Institution added:", result);
    alert("✅ Institution added successfully!");

    form.reset();
    setSelectedFile(null);
  } catch (error: any) {
    console.error("❌ Submission error:", error);
    alert(`❌ Failed to add institution: ${error.message || "Unknown error"}`);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New Institution</h1>
        <p className="text-muted-foreground">
          Register a new institution deployment in the STARBOOKS monitoring system
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-900 max-w-5xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <School className="h-5 w-5" />
            <span>Institution Information</span>
          </CardTitle>
          <CardDescription>
            Fill in all required information for the institution deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Institution & Recipient */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter institution name" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter recipient name" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name="completeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complete Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter full address including barangay, municipality, city"
                        {...field}
                        className="bg-background"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location, Type, Code */}
              <div className="grid gap-4 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {philippineProvinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="municipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Municipality</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter municipality" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
  control={form.control}
  name="institutionType"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Institution Type</FormLabel>
      <Select
        onValueChange={(value) => field.onChange(value)}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="max-h-48 overflow-y-auto">
          <SelectItem value="Elementary School">Elementary School</SelectItem>
          <SelectItem value="Junior High School">Junior High School</SelectItem>
          <SelectItem value="Senior High School">Senior High School</SelectItem>
          <SelectItem value="Integrated School">Integrated School</SelectItem>
          <SelectItem value="College">College</SelectItem>
          <SelectItem value="University">University</SelectItem>
          <SelectItem value="Library">Library</SelectItem>
          <SelectItem value="LGU">LGU</SelectItem>
          <SelectItem value="NGO">NGO</SelectItem>
          <SelectItem value="NGAs">NGAs</SelectItem>
          <SelectItem value="CSOs">CSOs</SelectItem>
          <SelectItem value="Others">Others</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

                <FormField
                  control={form.control}
                  name="institutionalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institutional Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter institutional code" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            {form.watch("institutionType") === "Others" && (
              <FormField
                control={form.control}
                name="otherInstitutionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Other Institution Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter custom institution type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}


              {/* Contact */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Deployment & Status */}
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="dateOfDeployment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Deployment</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearDistributed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Distributed</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              {/* File Upload */}
              <div className="space-y-4">
                <Label>MOU Document (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 bg-background">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground">PDF format only, max 10MB</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="mou-upload"
                    />
                    <Label
                      htmlFor="mou-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      Choose File
                    </Label>
                  </div>
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium text-foreground">Selected: {selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setSelectedFile(null);
                  }}
                >
                  Reset Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding Institution..." : "Add Institution"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
