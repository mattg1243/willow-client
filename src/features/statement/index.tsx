import { Button } from "@/components/ui/button";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { toaster } from "@/components/ui/toaster";
import { getUserContactInfo } from "@/lib/api/user";
import { useUser } from "@/lib/auth";
import { system } from "@/theme";
import { Client, Event, UserContactInfo } from "@/types/api";
import { HStack, Input, SimpleGrid, Textarea } from "@chakra-ui/react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { DollarSign } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { chunkEvents } from "./templates";
import { BasicTemplateCover, BasicTemplatePage } from "./templates/Basic/Basic";
import { StatementData } from "./types";

const statementTemplates: Array<{
  label: string;
  description: string;
  templateCover: (data: StatementData) => ReactNode;
  templatePage: (data: { events: Event[] }) => ReactNode;
}> = [
  {
    label: "Basic",
    description: "No frills statement",
    templateCover: BasicTemplateCover,
    templatePage: BasicTemplatePage,
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
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [notes, setNotes] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getUserContactInfo()
      .then((res) => setContactInfo(res))
      .catch((err) => console.error(err));
  }, []);

  const { user } = useUser();

  const contentRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<HTMLDivElement[]>([]);

  // const SelectedTemplate =
  //   selectedStatement !== undefined
  //     ? statementTemplates[selectedStatement].template
  //     : null;
  const SelectedTemplateCover = BasicTemplateCover;
  const SelectedTemplatePage = BasicTemplatePage;

  const resolvedEvents: Event[] = events.filter((e) => {
    const eventDate = new Date(e.date);
    if (startDate && endDate) {
      return eventDate >= startDate && endDate >= eventDate;
    } else if (startDate && !endDate) {
      return eventDate >= startDate;
    } else if (endDate && !startDate) {
      return endDate >= eventDate;
    } else {
      return true;
    }
  });

  const eventChunks = chunkEvents(resolvedEvents);

  const retainerBalance = events[events.length - 1]
    ? events[events.length - 1].running_balance
    : 0;

  const validateDateRange = () => {
    if (startDate && endDate) {
      return startDate <= endDate;
    } else if (startDate && startDate > new Date()) {
      return false;
    } else {
      return true;
    }
  };

  const handleCreatePdf = async () => {
    if (!pageRefs.current.length) return;

    setLoading(true);

    const pdf = new jsPDF({
      unit: "in",
      format: [8.5, 11],
    });

    try {
      for (let i = 0; i < pageRefs.current.length; i++) {
        const el = pageRefs.current[i];
        if (!el) continue;

        // Temporarily make element visible
        el.style.display = "block";

        const canvas = await html2canvas(el, {
          useCORS: true,
          allowTaint: true,
          scale: 2,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        // const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = 8.5;
        const pdfHeight = 11;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        el.style.display = "none";
      }

      pdf.save(`${client.fname}${client.lname}.pdf`);
    } catch (err: any) {
      toaster.create({
        type: "error",
        title:
          "An error occurred generating your statement: " +
          (err?.message || ""),
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  if (!user || !contactInfo) {
    return <>No user or contact info provided.</>;
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
            <Field
              label="Date range"
              helperText="Leave blank if you want to include all dates."
              invalid={validateDateRange()}>
              <HStack width="100%">
                <Input
                  type="date"
                  onChange={(e) =>
                    setStartDate(
                      e.target.value ? new Date(e.target.value) : undefined
                    )
                  }
                />{" "}
                -
                <Input
                  type="date"
                  onChange={(e) =>
                    setEndDate(
                      e.target.value ? new Date(e.target.value) : undefined
                    )
                  }
                />
              </HStack>
            </Field>
            <Field label="Notes" helperText="Max 150 characters">
              <Textarea
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
                maxLength={150}
              />
            </Field>
            <Field label="Amount">
              <InputGroup startElement={<DollarSign size={16} />}>
                <Input
                  type="number"
                  onChange={(e) => setAmount(parseInt(e.target.value) * 100)}
                  value={amount ? amount / 100 : undefined}
                />
              </InputGroup>
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
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
      {user && contactInfo ? (
        // <SelectedTemplate
        //   events={reslovedEvents}
        //   client={client}
        //   user={user}
        //   userContactInfo={contactInfo}
        //   amount={amount}
        //   notes={notes}
        // />
        <>
          {eventChunks.map((chunk, i) => (
            <div
              ref={(el) => (pageRefs.current[i] = el!)}
              style={{
                display: "none",
                position: "absolute",
                top: "-9999px",
                left: "-9999px",
              }}
              id="hidden-statement">
              {i === 0 ? (
                <SelectedTemplateCover
                  events={chunk}
                  client={client}
                  user={user}
                  userContactInfo={contactInfo}
                  currentBalance={
                    eventChunks.length === 1 ? retainerBalance : undefined
                  }
                  amountDue={amount || 0}
                  notes={notes}
                />
              ) : (
                <SelectedTemplatePage events={chunk} />
              )}
            </div>
          ))}
        </>
      ) : null}
    </>
  );
}
