export function toISODateString(dateStr) {
    const parts = dateStr.split('-'); // Assuming the date format is DD-MM-YYYY
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
  }