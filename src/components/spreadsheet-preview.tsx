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
      className={`overflow-hidden rounded-md border border-line bg-white ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-line bg-[#F8FAFC] px-3 py-2">
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
        </div>
        <span className="ml-1 text-xs font-medium text-muted">{title}</span>
      </div>
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full text-left text-xs leading-tight sm:text-[11px]">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="w-8 border-b border-r border-line px-1.5 py-1.5 text-center text-[10px] font-medium text-[#94A3B8]">
                #
              </th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="border-b border-r border-line px-1.5 py-1.5 font-semibold text-[#1F2933] sm:px-2"
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
                className={rowIndex % 2 === 1 ? "bg-[#F8FAFC]" : ""}
              >
                <td className="border-b border-r border-line px-1.5 py-1 text-center text-[10px] text-[#94A3B8]">
                  {rowIndex + 2}
                </td>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-b border-r border-line px-1.5 py-1 text-[#334155] sm:px-2"
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
