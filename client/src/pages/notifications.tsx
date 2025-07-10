import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Bell, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Users,
  Mail
} from "lucide-react";

export default function Notifications() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [notificationSubject, setNotificationSubject] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const notificationHistory = [
    {
      id: 1,
      type: "General",
      subject: "Reminder to Coordinate Deployment",
      message: "Please coordinate any deployment concerns with the regional office. Thank you.",
      province: "La Union",
      sentDate: "2024-06-15",
      status: "Sent",
    },
    {
      id: 2,
      type: "Acknowledgement",
      subject: "Thank You for Submitting Reports",
      message: "We appreciate your timely submission of deployment reports.",
      province: "Ilocos Sur",
      sentDate: "2024-06-12",
      status: "Sent",
    },
  ];

  const sendNotification = () => {
    if (!selectedProvince || !notificationSubject || !notificationMessage) {
      alert("Please complete all fields");
      return;
    }

    console.log("Sending to province:", selectedProvince);
    alert("Notification has been queued for sending.");
    setSelectedProvince("");
    setNotificationSubject("");
    setNotificationMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Province Notifications</h1>
        <p className="text-muted-foreground">
          Send notifications to province coordinators managing their municipalities
        </p>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card className="bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Compose Notification</span>
              </CardTitle>
              <CardDescription>
                Send a message to a specific province coordinator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Province
                  </label>
                  <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ilocos Norte">Ilocos Norte</SelectItem>
                      <SelectItem value="Ilocos Sur">Ilocos Sur</SelectItem>
                      <SelectItem value="La Union">La Union</SelectItem>
                      <SelectItem value="Pangasinan">Pangasinan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
                <Input
                  placeholder="Enter subject"
                  value={notificationSubject}
                  onChange={(e) => setNotificationSubject(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                <Textarea
                  placeholder="Type your message..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="bg-background"
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-2 border-t pt-4">
                <Button variant="outline" onClick={() => {
                  setSelectedProvince("");
                  setNotificationSubject("");
                  setNotificationMessage("");
                }}>
                  Clear
                </Button>
                <Button onClick={sendNotification}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
              <CardDescription>
                Use quick message templates for coordination and acknowledgment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => {
                    setNotificationSubject("If there are any concerns");
                    setNotificationMessage("If there are any issues or concerns, please notify us through this platform. Thank you.");
                  }}
                >
                  <div className="font-medium">Report Concerns</div>
                  <p className="text-xs text-muted-foreground">Ask provinces to notify issues</p>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => {
                    setNotificationSubject("Thank You for Cooperation");
                    setNotificationMessage("We appreciate your continued support and cooperation in the STARBOOKS implementation.");
                  }}
                >
                  <div className="font-medium">Thank You Note</div>
                  <p className="text-xs text-muted-foreground">Send appreciation message</p>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => {
                    setNotificationSubject("Reminder to Submit Reports");
                    setNotificationMessage("Please ensure all required reports and documents are submitted by the end of the week. Thank you.");
                  }}
                >
                  <div className="font-medium">Submit Reminder</div>
                  <p className="text-xs text-muted-foreground">Follow-up for reports/documents</p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                View sent messages to provinces and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Province</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationHistory.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell>
                          <Badge variant="outline">{note.type}</Badge>
                        </TableCell>
                        <TableCell>{note.subject}</TableCell>
                        <TableCell>{note.province}</TableCell>
                        <TableCell>{new Date(note.sentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {note.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
