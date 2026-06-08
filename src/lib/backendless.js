import Backendless from 'backendless';

const APP_ID = process.env.NEXT_PUBLIC_BACKENDLESS_APP_ID;
const API_KEY = process.env.NEXT_PUBLIC_BACKENDLESS_API_KEY;

if (APP_ID && API_KEY) {
  Backendless.initApp(APP_ID, API_KEY);
}

const TABLE_NAME = 'Schedule';

export async function fetchSchedule(room) {
  try {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    if (room && room !== 0) {
      queryBuilder.setWhereClause(`room = ${room}`);
    }
    queryBuilder.setPageSize(100);
    queryBuilder.setSortBy(['day', 'timeSlot']);
    
    const allData = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      queryBuilder.setOffset(offset);
      const data = await Backendless.Data.of(TABLE_NAME).find(queryBuilder);
      allData.push(...data);
      if (data.length < 100) {
        hasMore = false;
      } else {
        offset += 100;
      }
    }

    return allData;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

export async function saveScheduleItem(item) {
  try {
    const saved = await Backendless.Data.of(TABLE_NAME).save(item);
    return saved;
  } catch (error) {
    console.error('Error saving schedule item:', error);
    throw error;
  }
}

export async function deleteScheduleItem(objectId) {
  try {
    await Backendless.Data.of(TABLE_NAME).remove({ objectId });
    return true;
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    throw error;
  }
}

export async function verifyVisitor(name) {
  try {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    // Cari di nama murid ATAU nama guru
    queryBuilder.setWhereClause(`studentName LIKE '%${name.trim()}%' OR teacherName LIKE '%${name.trim()}%'`);
    queryBuilder.setPageSize(100);
    const result = await Backendless.Data.of(TABLE_NAME).find(queryBuilder);
    
    if (result.length === 0) return { exists: false, isTeacher: false };
    
    // Periksa apakah nama yang dicari cocok dengan nama guru
    const isTeacher = result.some(item => 
      item.teacherName && item.teacherName.toLowerCase().includes(name.trim().toLowerCase())
    );

    return { exists: true, isTeacher };
  } catch (error) {
    console.error('Error verifying visitor:', error);
    return { exists: false, isTeacher: false };
  }
}

export default Backendless;
