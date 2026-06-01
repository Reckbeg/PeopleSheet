type PreviewRow = (string | number)[];

type SpreadsheetPreviewProps = {
  title: string;
  headers: string[];
  rows: PreviewRow[];
  className?: string;
};

export function SpreadsheetPreview({
  title,
  headers,
  rows,
  className = "",
}: SpreadsheetPreviewProps) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-md border border-line bg-white ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-line bg-preview-bg px-3 py-2">
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-preview-dot" />
          <span className="h-2.5 w-2.5 rounded-full bg-preview-dot" />
          <span className="h-2.5 w-2.5 rounded-full bg-preview-dot" />
        </div>
        <span className="ml-1 min-w-0 truncate text-xs font-medium text-muted">{title}</span>
      </div>
      <div className="max-w-full overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-max text-left text-xs leading-tight">
          <thead>
            <tr className="bg-surface-alt">
              <th className="w-8 border-b border-r border-line px-1.5 py-1.5 text-center text-[10px] font-medium text-muted">
                #
              </th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="border-b border-r border-line px-1.5 py-1.5 font-semibold text-preview-heading sm:px-2"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 1 ? "bg-preview-bg" : ""}
              >
                <td className="border-b border-r border-line px-1.5 py-1 text-center text-[10px] text-muted">
                  {rowIndex + 2}
                </td>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-b border-r border-line px-1.5 py-1 text-preview-text sm:px-2"
                  >
                    {typeof cell === "number"
                      ? cell.toLocaleString("id-ID")
                      : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
