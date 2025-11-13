import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Plus, ChevronDown } from 'lucide-react';
import { MoveApplicationModal } from './move-application-modal';
import { ApplicationQuickViewModal } from './application-quick-view-modal';
import type { Application, ApplicationStatus } from '@/types/ats-pages';

interface PipelineColumn {
  status: ApplicationStatus;
  label: string;
  count: number;
  applications: Application[];
}

interface PipelineKanbanProps {
  pipeline: PipelineColumn[];
}

const statusColors: Record<ApplicationStatus, { bg: string; border: string; text: string }> = {
  submitted: { bg: 'bg-blue-50', border: 'border-t-4 border-t-blue-500', text: 'text-blue-600' },
  shortlisted: { bg: 'bg-purple-50', border: 'border-t-4 border-t-purple-500', text: 'text-purple-600' },
  interviewed: { bg: 'bg-yellow-50', border: 'border-t-4 border-t-yellow-500', text: 'text-yellow-600' },
  offered: { bg: 'bg-green-50', border: 'border-t-4 border-t-green-500', text: 'text-green-600' },
  hired: { bg: 'bg-emerald-50', border: 'border-t-4 border-t-emerald-500', text: 'text-emerald-600' },
  rejected: { bg: 'bg-red-50', border: 'border-t-4 border-t-red-500', text: 'text-red-600' },
  withdrawn: { bg: 'bg-gray-50', border: 'border-t-4 border-t-gray-500', text: 'text-gray-600' },
};

/**
 * Pipeline Kanban Board - Task 8.1 with 8.3 (Status Change Dropdown)
 * Displays applications as draggable cards in status columns
 * Includes dropdown menu for status changes with confirmation modal
 */
export const PipelineKanban = ({ pipeline }: PipelineKanbanProps) => {
  const [draggedCard, setDraggedCard] = useState<Application | null>(null);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewApplication, setQuickViewApplication] = useState<Application | null>(null);

  const handleDragStart = (e: React.DragEvent, app: Application) => {
    setDraggedCard(app);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    if (draggedCard && draggedCard.status !== status) {
      // Open modal for status change confirmation with target status
      setSelectedApplication(draggedCard);
      setTargetStatus(status);
      setMoveModalOpen(true);
    }
    setDraggedCard(null);
  };

  const handleConfirmMove = (newStatus: ApplicationStatus, notes?: string) => {
    if (!selectedApplication) return;

    setIsMoving(true);
    router.put(
      `/hr/ats/pipeline/applications/${selectedApplication.id}/move`,
      {
        status: newStatus,
        notes,
      },
      {
        onSuccess: () => {
          setIsMoving(false);
          setMoveModalOpen(false);
          setSelectedApplication(null);
        },
        onError: (errors) => {
          setIsMoving(false);
          console.error('Failed to move application:', errors);
        },
      }
    );
  };

  const handleCloseModal = () => {
    setMoveModalOpen(false);
    setSelectedApplication(null);
    setTargetStatus(null);
  };

  const handleOpenQuickView = (app: Application) => {
    setQuickViewApplication(app);
    setQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewOpen(false);
    setQuickViewApplication(null);
  };

  const handleMoveStatusFromQuickView = (app: Application) => {
    setSelectedApplication(app);
    setMoveModalOpen(true);
    setQuickViewOpen(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <MoveApplicationModal
        open={moveModalOpen}
        application={selectedApplication}
        currentStatus={selectedApplication?.status || 'submitted'}
        targetStatus={targetStatus}
        onConfirm={handleConfirmMove}
        onCancel={handleCloseModal}
        isLoading={isMoving}
      />
      <ApplicationQuickViewModal
        open={quickViewOpen}
        application={quickViewApplication}
        onClose={handleCloseQuickView}
        onMoveStatus={handleMoveStatusFromQuickView}
      />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
      {pipeline.map((column) => {
        const colors = statusColors[column.status];
        return (
          <div key={column.status} className="flex flex-col h-full">
            <div className={`${colors.bg} ${colors.border} rounded-t-lg p-4 mb-0`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{column.label}</h3>
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-white font-bold text-xs ${colors.text}`}>
                  {column.count}
                </span>
              </div>
              <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs">
                <Plus className="h-3 w-3 mr-2" />
                Add
              </Button>
            </div>

            <div
              className="flex-1 rounded-b-lg border border-t-0 p-3 space-y-3 bg-white/30 min-h-[400px] overflow-y-auto"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {column.applications.length > 0 ? (
                column.applications.map((app) => {
                  const isBeingDragged = draggedCard?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      onDragEnd={() => setDraggedCard(null)}
                      onClick={() => handleOpenQuickView(app)}
                      className={`p-3 bg-white border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing transition-all group ${
                        isBeingDragged ? 'opacity-50 shadow-lg' : 'hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{app.candidate_name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground truncate">{app.job_title || 'Position'}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                              Move to Status
                            </div>
                            <DropdownMenuSeparator />
                            {['submitted', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn'].map(
                              (status) => (
                                status !== app.status && (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() => {
                                      setSelectedApplication(app);
                                      setMoveModalOpen(true);
                                    }}
                                    className="text-xs cursor-pointer"
                                  >
                                    {status === 'submitted' && '📝 Submitted'}
                                    {status === 'shortlisted' && '⭐ Shortlisted'}
                                    {status === 'interviewed' && '👤 Interviewed'}
                                    {status === 'offered' && '💼 Offered'}
                                    {status === 'hired' && '✅ Hired'}
                                    {status === 'rejected' && '❌ Rejected'}
                                    {status === 'withdrawn' && '🚫 Withdrawn'}
                                  </DropdownMenuItem>
                                )
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <span>📅</span>
                        <span>{formatDate(app.applied_at)}</span>
                      </div>

                      <div className="space-y-1 text-xs border-t pt-2">
                        {app.candidate_email && (
                          <div className="truncate text-muted-foreground hover:text-foreground">
                            <span className="mr-1">✉️</span>
                            {app.candidate_email}
                          </div>
                        )}
                        {app.candidate_phone && (
                          <div className="text-muted-foreground">
                            <span className="mr-1">📱</span>
                            {app.candidate_phone}
                          </div>
                        )}
                      </div>

                      {app.score && (
                        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-yellow-600">
                          ⭐ Score: {app.score}/10
                        </div>
                      )}

                      {app.rejection_reason && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                          <p className="font-medium">Rejection Reason:</p>
                          <p>{app.rejection_reason}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                  No applications
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
};
