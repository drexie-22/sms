export interface InstitutionFormData {
  institutionName: string;
  recipientName: string;
  completeAddress: string;
  province: string;
  municipality: string;
  email: string;
  phone: string;
  dateOfDeployment: string;
  yearDistributed: number;
  institutionType: "Public" | "Private" | "NGO";
  institutionalCode: string;
}