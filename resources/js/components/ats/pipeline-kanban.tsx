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
import { ChevronDown } from 'lucide-react';
import { MoveApplicationModal } from './move-application-modal';
import { ApplicationQuickViewModal } from './application-quick-view-modal';
import { AddApplicationModal, type ApplicationFormData } from './add-application-modal';
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

const statusColors: Record<ApplicationStatus, { bg: string; header: string; border: string; text: string }> = {
  submitted: { bg: 'bg-blue-50', header: 'bg-blue-500', border: 'border-l-4 border-l-blue-500', text: 'text-blue-600' },
  shortlisted: { bg: 'bg-purple-50', header: 'bg-purple-500', border: 'border-l-4 border-l-purple-500', text: 'text-purple-600' },
  interviewed: { bg: 'bg-yellow-50', header: 'bg-yellow-500', border: 'border-l-4 border-l-yellow-500', text: 'text-yellow-600' },
  offered: { bg: 'bg-green-50', header: 'bg-green-500', border: 'border-l-4 border-l-green-500', text: 'text-green-600' },
  hired: { bg: 'bg-emerald-50', header: 'bg-emerald-500', border: 'border-l-4 border-l-emerald-500', text: 'text-emerald-600' },
  rejected: { bg: 'bg-red-50', header: 'bg-red-500', border: 'border-l-4 border-l-red-500', text: 'text-red-600' },
  withdrawn: { bg: 'bg-gray-50', header: 'bg-gray-500', border: 'border-l-4 border-l-gray-500', text: 'text-gray-600' },
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
  const [addApplicationModalOpen, setAddApplicationModalOpen] = useState(false);
  const [selectedStatusForAdd, setSelectedStatusForAdd] = useState<ApplicationStatus | null>(null);

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

  const handleCloseAddApplicationModal = () => {
    setAddApplicationModalOpen(false);
    setSelectedStatusForAdd(null);
  };

  const handleAddApplication = async (applicationData: ApplicationFormData) => {
    // This will be called when the form is submitted
    // For now, just close the modal
    // Backend integration will happen when API is ready
    console.log('Adding application with status:', selectedStatusForAdd, applicationData);
    handleCloseAddApplicationModal();
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
      <AddApplicationModal
        isOpen={addApplicationModalOpen}
        initialStatus={selectedStatusForAdd || 'submitted'}
        onClose={handleCloseAddApplicationModal}
        onSubmit={handleAddApplication}
      />
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 auto-rows-max">
      {pipeline.map((column) => {
        const colors = statusColors[column.status];
        return (
          <div key={column.status} className="flex flex-col h-full">
            <div className={`${colors.header} rounded-t-lg px-3 py-2 text-white`}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-xs truncate">{column.label}</h3>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/30 font-bold text-xs text-white">
                  {column.count}
                </span>
              </div>
            </div>

            <div
              className="flex-1 rounded-b-lg border border-t-0 px-2 py-2 space-y-2 bg-gray-50 min-h-[300px] overflow-y-auto"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              {column.applications.length > 0 ? (
                column.applications.map((app) => {
                  const isBeingDragged = draggedCard?.id === app.id;
                  const appStatusColors = statusColors[app.status as ApplicationStatus];
                  return (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      onDragEnd={() => setDraggedCard(null)}
                      onClick={() => handleOpenQuickView(app)}
                      className={`p-2 bg-white border rounded cursor-grab active:cursor-grabbing transition-all group ${
                        appStatusColors.border
                      } ${isBeingDragged ? 'opacity-50 shadow-lg' : 'hover:shadow-md'}`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs truncate">{app.candidate_name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground truncate line-clamp-1">{app.job_title || 'Position'}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 flex-shrink-0">
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                              Move to Status
                            </div>
                            <DropdownMenuSeparator />
                            {(['submitted', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn'] as ApplicationStatus[]).map(
                              (status) => (
                                status !== app.status && (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() => {
                                      setSelectedApplication(app);
                                      setTargetStatus(status);
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

                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <span>📅</span>
                        <span className="truncate">{formatDate(app.applied_at)}</span>
                      </div>

                      {app.candidate_email && (
                        <div className="truncate text-xs text-muted-foreground mt-1 hover:text-foreground">
                          <span className="mr-1">✉️</span>
                          <span className="truncate">{app.candidate_email}</span>
                        </div>
                      )}

                      {app.score && (
                        <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-yellow-600">
                          ⭐ {app.score}/10
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-16 text-muted-foreground text-xs">
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
