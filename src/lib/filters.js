export function filterSchedule(data, filters) {
  if (!data || data.length === 0) return [];

  return data.filter(item => {
    // Filter by instrument
    if (filters.instruments && filters.instruments.length > 0) {
      if (!filters.instruments.includes(item.instrument)) return false;
    }

    // Filter by mode
    if (filters.mode && filters.mode !== '') {
      if (item.mode !== filters.mode) return false;
    }

    // Filter by student name (case-insensitive partial match)
    if (filters.studentName && filters.studentName.trim() !== '') {
      const search = filters.studentName.toLowerCase().trim();
      if (!item.studentName?.toLowerCase().includes(search)) return false;
    }

    // Filter by teacher name (case-insensitive partial match)
    if (filters.teacherName && filters.teacherName.trim() !== '') {
      const search = filters.teacherName.toLowerCase().trim();
      if (!item.teacherName?.toLowerCase().includes(search)) return false;
    }

    return true;
  });
}

export function getUniqueStudents(data) {
  if (!data) return [];
  const names = [...new Set(data.map(item => item.studentName).filter(Boolean))];
  return names.sort();
}

export function getUniqueTeachers(data) {
  if (!data) return [];
  const names = [...new Set(data.map(item => item.teacherName).filter(Boolean))];
  return names.sort();
}

export function getActiveFilterCount(filters) {
  let count = 0;
  if (filters.instruments && filters.instruments.length > 0) count++;
  if (filters.mode && filters.mode !== '') count++;
  if (filters.studentName && filters.studentName.trim() !== '') count++;
  if (filters.teacherName && filters.teacherName.trim() !== '') count++;
  return count;
}

export const EMPTY_FILTERS = {
  instruments: [],
  mode: '',
  studentName: '',
  teacherName: '',
};
