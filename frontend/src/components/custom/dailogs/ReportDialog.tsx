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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Project Report</DialogTitle>
          <DialogDescription>
            Below are the details for this project:
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 rounded-md border p-4 overflow-auto">
          {report && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              <Markdown>{report.report}</Markdown>
            </p>
          )}
        </ScrollArea>

        <DialogFooter>
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
