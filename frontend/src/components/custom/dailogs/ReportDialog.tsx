import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import Markdown from 'react-markdown'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useRef } from 'react'

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: any
}

export function ReportDialog({
  open,
  onOpenChange,
  report,
}: ReportDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!contentRef.current) return

    const canvas = await html2canvas(contentRef.current, {
      scale: 2, // improve quality
    })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pageWidth
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    let position = 0
    let heightLeft = pdfHeight

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pageHeight
    }

    pdf.save('project-report.pdf')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Project Report</DialogTitle>
          <DialogDescription>
            Below are the details for this project:
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          ref={contentRef}
          className="flex-1 min-h-0 rounded-md border p-4 overflow-auto bg-white"
        >
          {report && (
            <div className="prose prose-sm max-w-none">
              <Markdown>{report.report}</Markdown>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button
            onClick={handleDownload}
            className="rounded-none cursor-pointer"
          >
            Download PDF
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-none cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
