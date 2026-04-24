import { useState } from 'preact/hooks';

export type FileSummaryEntry = {
  filePath: string;
  displayName: string;
  linesAdded: number;
  linesRemoved: number;
  messageIds: string[];
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
};

type FileChangeSummaryCardProps = {
  files: FileSummaryEntry[];
  totalPending: number;
  bulkBusy: boolean;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onNavigateToFile: (filePath: string) => void;
};

function getStatusClassName(entry: FileSummaryEntry) {
  const activeStates = Number(entry.pendingCount > 0)
    + Number(entry.acceptedCount > 0)
    + Number(entry.rejectedCount > 0);
  if (activeStates > 1) return 'is-mixed';
  if (entry.pendingCount > 0) return 'is-pending';
  if (entry.acceptedCount > 0) return 'is-accepted';
  if (entry.rejectedCount > 0) return 'is-rejected';
  return 'is-mixed';
}

export function FileChangeSummaryCard({
  files,
  totalPending,
  bulkBusy,
  onAcceptAll,
  onRejectAll,
  onNavigateToFile,
}: FileChangeSummaryCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div class="jiaoleaf-file-summary">
      {expanded ? (
        <div class="jiaoleaf-file-summary__list">
          {files.map((file) => (
            <button
              key={file.filePath}
              class="jiaoleaf-file-summary__row"
              type="button"
              onClick={() => onNavigateToFile(file.filePath)}
            >
              <span
                class={`jiaoleaf-file-summary__status-dot ${getStatusClassName(file)}`}
                aria-hidden="true"
              />
              <span class="jiaoleaf-file-summary__added">+{file.linesAdded}</span>
              <span class="jiaoleaf-file-summary__removed">-{file.linesRemoved}</span>
              <span class="jiaoleaf-file-summary__basename">{file.displayName}</span>
              <span class="jiaoleaf-file-summary__path">{file.filePath}</span>
            </button>
          ))}
        </div>
      ) : null}
      <div class="jiaoleaf-file-summary__footer">
        <span class="jiaoleaf-file-summary__count">
          {files.length} file{files.length === 1 ? '' : 's'} with changes
        </span>
        <div class="jiaoleaf-file-summary__actions">
          <button
            class="jiaoleaf-panel__apply is-secondary"
            type="button"
            disabled={bulkBusy || totalPending === 0}
            onClick={onRejectAll}
          >
            Reject all
          </button>
          <button
            class="jiaoleaf-panel__apply"
            type="button"
            disabled={bulkBusy || totalPending === 0}
            onClick={onAcceptAll}
          >
            {bulkBusy ? 'Applying...' : 'Accept all'}
          </button>
          <button
            class={`jiaoleaf-file-summary__chevron ${!expanded ? 'is-collapsed' : ''}`}
            type="button"
            aria-label={expanded ? 'Collapse file list' : 'Expand file list'}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            ▾
          </button>
        </div>
      </div>
    </div>
  );
}
