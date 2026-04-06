const normalizeCell = (value: string) => value.replace(/^\uFEFF/, "").trim();

const isRowEmpty = (row: string[]) => row.every((cell) => normalizeCell(cell) === "");

// Robust CSV parser: handles quoted commas, escaped quotes, and quoted newlines.
export const parseCSV = (rawText: string): string[][] => {
  const text = rawText.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(normalizeCell(currentCell));
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      currentRow.push(normalizeCell(currentCell));
      if (!isRowEmpty(currentRow)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(normalizeCell(currentCell));
    if (!isRowEmpty(currentRow)) {
      rows.push(currentRow);
    }
  }

  return rows;
};

export const rowsToObjects = (rows: string[][]): Record<string, string>[] => {
  if (rows.length === 0) return [];

  const headers = rows[0].map((header) => normalizeCell(header).toLowerCase());
  return rows
    .slice(1)
    .map((row) => headers.map((_, index) => normalizeCell(row[index] ?? "")))
    .filter((row) => !isRowEmpty(row))
    .map((row) =>
      headers.reduce<Record<string, string>>((accumulator, header, index) => {
        accumulator[header || `column_${index}`] = row[index] ?? "";
        return accumulator;
      }, {})
    );
};

export async function fetchCSV(url: string, label: string) {
  const finalUrl = new URL(url);
  finalUrl.searchParams.set("_ts", Date.now().toString());

  const response = await fetch(finalUrl.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${label} CSV request failed with ${response.status}`);
  }

  const text = await response.text();
  const rows = parseCSV(text);
  return { text, rows };
}

