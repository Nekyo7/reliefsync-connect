import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import type { ReliefTask } from "@/types";

const PriorityFeed = () => {
  const filteredTasks = useTaskStore((state) => state.filteredTasks);
  const filters = useTaskStore((state) => state.filters);
  const isLoading = useTaskStore((state) => state.isLoading);
  const setFilter = useTaskStore((state) => state.setFilter);
  const setSearch = useTaskStore((state) => state.setSearch);
  const initializeMockData = useTaskStore((state) => state.initializeMockData);
  const [selectedTask, setSelectedTask] = useState<ReliefTask | null>(null);

  useEffect(() => { initializeMockData(); }, [initializeMockData]);

  const urgencyOptions = [null, 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
  const statusOptions = [null, 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">Priority Feed</h1>
          <p className="text-muted-foreground mt-1">Real-time relief tasks sorted by priority score</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {urgencyOptions.map((u) => (
              <Button
                key={u ?? 'all'}
                variant={filters.urgency === u ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('urgency', u)}
              >
                {u ?? 'All Urgency'}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {statusOptions.map((s) => (
            <Button
              key={s ?? 'all-status'}
              variant={filters.status === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('status', s)}
            >
              {s?.replace('_', ' ') ?? 'All Status'}
            </Button>
          ))}
          <div className="ml-auto flex gap-2">
            <Button
              variant={filters.verification === 'VERIFIED' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('verification', filters.verification === 'VERIFIED' ? null : 'VERIFIED')}
            >
              Verified Only
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {isLoading ? "Refreshing live tasks from Google Sheets..." : `${filteredTasks.length} tasks found`}
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onViewDetails={setSelectedTask} />
          ))}
        </div>

        {!isLoading && filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No tasks match your filters</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setSelectedTask(null)}>
          <div className="bg-card rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold mb-2">{selectedTask.title}</h2>
            <p className="text-muted-foreground mb-4">{selectedTask.description}</p>
            <div className="space-y-2 text-sm">
              <p><strong>Location:</strong> {selectedTask.location}</p>
              <p><strong>Category:</strong> {selectedTask.category}</p>
              <p><strong>Skills:</strong> {selectedTask.required_skills.length ? selectedTask.required_skills.join(', ') : 'General support'}</p>
              <p><strong>Priority Score:</strong> {selectedTask.priority_score.toFixed(2)}</p>
              <p><strong>Status:</strong> {selectedTask.status.replace('_', ' ')}</p>
              <p><strong>Urgency:</strong> {selectedTask.urgency_level}</p>
              <p><strong>Verification:</strong> {selectedTask.verification_status}</p>
              <p><strong>Source:</strong> {selectedTask.source_type}</p>
              <p><strong>Submitted:</strong> {new Date(selectedTask.timestamp).toLocaleString()}</p>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="default" className="flex-1">Accept Task</Button>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriorityFeed;
