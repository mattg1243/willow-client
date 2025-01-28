import { Button } from "@/components/ui/button";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import { getUserContactInfo } from "@/lib/api/user";
import { useUser } from "@/lib/auth";
import { system } from "@/theme";
import { Client, Event, UserContactInfo } from "@/types/api";
import { Input, SimpleGrid } from "@chakra-ui/react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ReactNode, useEffect, useRef, useState } from "react";
import { BasicStatement, StatementData } from "./Basic";

const statementTemplates: Array<{
  label: string;
  description: string;
  template: (data: StatementData) => ReactNode;
}> = [
  {
    label: "Basic",
    description: "No frills statement",
    template: BasicStatement,
  },
  // {
  //   label: "Standard",
  //   description: "Clean and clear lines",
  //   template: BasicStatement,
  // },
  // {
  //   label: "Aesthetic",
  //   description: "Elegant and modern",
  //   template: BasicStatement,
  // },
  // {
  //   label: "Professional",
  //   description: "All bussiness",
  //   template: BasicStatement,
  // },
  // {
  //   label: "Artsy",
  //   description: "A little something extra",
  //   template: BasicStatement,
  // },
];

export function StatementBtn({
  events,
  client,
}: {
  events: Event[];
  client: Client;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStatement, setSelectedStatement] = useState<number>(0);
  const [contactInfo, setContactInfo] = useState<UserContactInfo>();
  const [startDate, setStartDate] = useState<Date>(new Date(0));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getUserContactInfo()
      .then((res) => setContactInfo(res))
      .catch((err) => console.error(err));
  }, []);

  const { user } = useUser();

  const contentRef = useRef<HTMLDivElement>(null);
  const hiddenStatementRef = useRef<HTMLDivElement>(null);

  const SelectedTemplate =
    selectedStatement !== undefined
      ? statementTemplates[selectedStatement].template
      : null;

  const handleCreatePdf = async () => {
    const hiddenStatement = hiddenStatementRef.current;
    console.log(startDate, endDate);
    if (hiddenStatement) {
      setLoading(true);
      try {
        hiddenStatement.style.display = "block";
        const canvas = await html2canvas(hiddenStatement, {
          useCORS: true, // Handle cross-origin issues
          allowTaint: true, // Allow tainted images
          scale: 2, // Improve image resolution
        });
        const pdf = new jsPDF();

        document.body.appendChild(canvas);

        const imgData = canvas.toDataURL("image/png");
        console.log("Generated image data:", imgData);
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${client.fname}${client.lname}.pdf`);
        document.body.removeChild(canvas);
        hiddenStatement.style.display = "none";
      } catch (err: any) {
        toaster.create({
          type: "error",
          title:
            "An error occurred generating your statment: " + err?.message || "",
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user || !contactInfo) {
    return <>its b</>;
  }

  return (
    <>
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button variant="outline">Create statement</Button>
        </DialogTrigger>
        <DialogContent ref={contentRef}>
          <DialogHeader>Create statement</DialogHeader>
          <DialogBody spaceY={8}>
            <SimpleGrid minChildWidth={200} gap={4}>
              {statementTemplates.map((t, i) => {
                return (
                  <CheckboxCard
                    accentColor={system.token("colors.primary.500")}
                    key={t.label}
                    label={t.label}
                    value={t.label}
                    description={t.description}
                    onCheckedChange={() => setSelectedStatement(i)}
                    checked={i === selectedStatement}
                  />
                );
              })}
            </SimpleGrid>
            <Field label="Start date">
              <Input
                type="date"
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </Field>
            <Field label="End date">
              <Input
                type="date"
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button
              bg={system.token("colors.primary.500")}
              disabled={selectedStatement === undefined}
              onClick={handleCreatePdf}
              loading={loading}>
              Create statement
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
      <div
        ref={hiddenStatementRef}
        style={{
          display: "none",
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
        }}
        id="hidden-statement">
        {SelectedTemplate && user && contactInfo ? (
          <SelectedTemplate
            events={events}
            client={client}
            user={user}
            userContactInfo={contactInfo}
          />
        ) : null}
      </div>
    </>
  );
}
